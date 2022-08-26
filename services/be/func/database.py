import logging
import sys
import sqlite3
import pandas as pd
import yfinance as yf

logging.basicConfig(level=logging.INFO)

def close_db(sig, frame):
    con = sqlite3.connect('./app.db')
    con.execute("DROP TABLE stocks")
    con.commit()
    con.close()
    logging.info("Connessione chiusa")
    sys.exit(0)


def build_stocks_db():
    """ Questa funzione crea il db iniziale, sul quale poi il BE fa tutti i suoi conti.
        Questo db è usato per la tutta l'applicazione """

    # Prendo i ticker e il nome delle società
    logging.debug("Inizio download societa")

    # symbols = ['ISP.MI', 'RACE.MI']
    # societies = ['Intesa San Paoloo', 'Ferrarii']

    # FTSE MIB
    symbols = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
    societies = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']
    
    symbols = symbols.append(pd.Series(['REY.MI']), ignore_index=True)
    societies = societies.append(pd.Series(['Reply S.p.A']), ignore_index=True)

    logging.info("Download societies OK")

    #  Inserisco i dati nel db
    con = sqlite3.connect('./app.db')
    # cur = con.cursor()
    try:
        logging.debug("Stocks table creation")
        con.execute('''
        CREATE TABLE stocks
        (
            date DATE,
            symbol NVARCHAR(10),
            society NVARCHAR(255),
            market NVARCHAR(10),
            open FLOAT,
            high FLOAT,
            low FLOAT,
            close FLOAT
        )
        ''')
        logging.info("Tabella creata correttamente")

    except Exception as e:
        logging.debug(e)
        logging.info("Tabella gia presente")

    # Itero ftse mib
    for symbol, society in zip(symbols, societies):
        logging.info(f"Scarico: {society}")
        df = yf.download(symbol, interval='1d', start='2010-01-01')
        df['Symbol'] = symbol
        df['Society'] = society
        df['Market'] = 'ftse_mib'
        df.drop(['Adj Close', 'Volume'], axis=1, inplace=True)

        logging.debug("Add in the db...")
        df.to_sql('stocks', con, if_exists='append')

    # Down Jones
    dow = pd.read_html('https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average')[1]
    symbols = dow['Symbol']
    societies = dow['Company']

    # Itero down jones
    for symbol, society in zip(symbols, societies):
        logging.info(f"Scarico: {society}")
        df = yf.download(symbol, interval='1d', start='2010-01-01')
        df['Symbol'] = symbol
        df['Society'] = society
        df['Market'] = 'down_jones'
        df.drop(['Adj Close', 'Volume'], axis=1, inplace=True)

        logging.debug("Add in the db...")
        df.to_sql('stocks', con, if_exists='append')

    logging.debug("Ending phase")
    con.commit()
    logging.info("Tabella correttamente popolata")


def get_stocks_symbols():
    con = sqlite3.connect('./app.db')
    cur = con.cursor()
    res = cur.execute('SELECT DISTINCT symbol from stocks ORDER by society ASC')
    con.commit()
    return res

def get_society_from_symbol(symbol):
    con = sqlite3.connect('./app.db')
    cur = con.cursor()
    res = cur.execute(f"select distinct society from stocks where symbol = '{symbol}'")
    con.commit()
    return res.fetchone()[0] # Perchè è una tupla


def get_stock(symbol) -> pd.DataFrame:
    con = sqlite3.connect('./app.db')
    return pd.read_sql(f'''SELECT * FROM 
        (SELECT * from stocks where symbol = '{symbol}' order by date desc limit 250)
        ORDER BY date asc''', con)
