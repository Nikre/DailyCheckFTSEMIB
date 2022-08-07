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
    # societies = ['Società', 'Società2']

    symbols = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
    societies = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']

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

    # Itero
    for symbol, society in zip(symbols, societies):
        logging.info(f"Scarico: {society}")
        df = yf.download(symbol, interval='1d', start='2010-01-01')
        df['Symbol'] = symbol
        df['Society'] = society
        df.drop(['Adj Close', 'Volume'], axis=1, inplace=True)

        logging.debug("Add in the db...")
        df.to_sql('stocks', con, if_exists='append')

    logging.debug("Ending phase")
    con.commit()
    logging.info("Tabella correttamente popolata")


def get_stocks_symbols():
    con = sqlite3.connect('./app.db')
    cur = con.cursor()
    res = cur.execute('SELECT DISTINCT symbol from stocks')
    con.commit()
    return res

def get_stock_for_dashboard(symbol) -> pd.DataFrame:
    con = sqlite3.connect('./app.db')
    return pd.read_sql(f'''SELECT * FROM 
        (SELECT * from stocks where symbol = '{symbol}' order by date desc limit 220)
        ORDER BY date asc''', con)
