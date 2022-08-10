import pandas as pd
from datetime import datetime
import ta

# Indicators
open_label = 'open' # open è una parola chiave
close = 'close' 
high = 'high'
society = 'society'
symbol = 'symbol'
low = 'low'
ema10 = 'ema10'
ema20 = 'ema20'
ema20high = 'ema20high'
ema20low = 'ema20low'
ema50 = 'ema50'
ema144 = 'ema144'
ema200 = 'ema200'
hbb = 'hbb2_5std'
lbb = 'lbb2_5std'
rsi = 'rsi2'
roc20 = 'roc20' 
roc50 = 'roc50' 
roc100 = 'roc100' 
signal = 'signal'
lastSample = 30


def add_indicators(df):
    """ This function add to the df all the indicators, MUST BE NOTED as the reference is used """
    df[ema20high] = ta.trend.EMAIndicator(df[high], window=20).ema_indicator()
    df[ema20low] = ta.trend.EMAIndicator(df[low], window=20).ema_indicator()
    df[ema144] = ta.trend.EMAIndicator(df[close], window=144).ema_indicator()
    df[ema200] = ta.trend.EMAIndicator(df[close], window=200).ema_indicator()
    df[hbb] = ta.volatility.BollingerBands(
        df[close], window_dev=2.5).bollinger_hband()
    df[lbb] = ta.volatility.BollingerBands(
        df[close], window_dev=2.5).bollinger_lband()
    df[rsi] = ta.momentum.RSIIndicator(df[close], window=2).rsi()
    df[roc20] = ta.momentum.ROCIndicator(df[close], window=20).roc()
    df[roc50] = ta.momentum.ROCIndicator(df[close], window=50).roc()
    df[roc100] = ta.momentum.ROCIndicator(df[close], window=100).roc()
    df[signal] = -1  # Column used in backtesting


def get_xData(df):
    ''' Questo metodo permette di costruire un array di stringhe che rappresentano la data. 
    Da db mi arrivano già date, ma voglio essere proprio sicuro di fare la conversione in maniera consona'''
    string_dates = df['date'].tolist()
    date_dates = map(lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M:%S'), string_dates) 
    correct_dates = list(map(lambda x: x.strftime("%d/%m/%Y"), date_dates))
    return correct_dates

def get_yData(df):
    ''' Funzione che calcola restituisce le candele per un grafico a candele '''
    high_data = df[high].values.tolist()
    low_data = df[low].values.tolist()
    open_data = df[open_label].values.tolist()
    close_data = df[close].values.tolist()

    candles = [list(x) for x in zip(close_data, open_data, low_data, high_data)]
    return candles

def get_default_indicators(df):
    ''' Questa è la funzione che calcola gli indicatori da mettere nel grafico di default '''
    ema200_data = df[ema200].values.tolist()
    return [ema200_data]

def rayner_teo_bollinger_indicators(df):
    ''' Questa è la funzione che calcola gli indicatori per il grafico di rayner teo sulle bollinger bands 
    [0] - ema 200
    [1] - hbb
    [2] - lbb
    [3] - rsi s'''
    ema200_data = df[ema200].values.tolist() # [0]
    hbb_data = df[hbb].values.tolist() # [1]
    lbb_data = df[lbb].values.tolist() # [2]
    rsi_data = df[rsi].values.tolist() # [3]
    return [ema200_data, hbb_data, lbb_data, rsi_data]

def io_investo_means_indicators(df):
    ''' Questa è la funzione che calcola gli indicatori per il grafico di io investo sulle medie 
    [0] - ema 20 low
    [1] - ema 20 high
    [2] - ema 144 '''
    ema20Low_data = df[ema20low].values.tolist() # [0]
    ema20high_data = df[ema20high].values.tolist() # [1]
    ema144_data = df[ema144].values.tolist() # [2]
    return [ema20Low_data, ema20high_data, ema144_data]

def io_investo_roc_indicators(df):
    ''' Questa è la funzione che calcola gli inficatori per il grafico di io investo sulle ROC
    [0] - ROC 20
    [1] - ROC 50
    [2] - ROC 100 '''
    roc20_data = df[roc20].values.tolist() # [0]
    roc50_data = df[roc50].values.tolist() # [1]
    roc100_data = df[roc100].values.tolist() # [2]
    return [roc20_data, roc50_data, roc100_data]

def trend_analysis(data):
    if (data[close].values > data[ema200].values):
        return True
    return False

def percentage_calculator(first, last) -> int:
    return ((last - first) / first) * 100 

def check_entry_rayReno_bb(data):
    if (data[close].values < data[lbb].values) & (data[close].values > data[ema200].values):
        return 'RaynerTeo/Bollinger'
    return None

def check_entry_ioInvesto_means(data):
    if ((data[close].values > data[ema20high].values) &
        (data[close].values > data[ema20low].values) &
            (data[close].values > data[ema144].values)):
        return 'IoInvesto/Medie'
    return None

def check_entry_ioInvesto_roc(data):
    previous_data = data.head(1) 
    last_data = data.tail(1)
    if ((last_data[roc50].values >= 0) & (last_data[roc100].values >= 0) & up_cross_value(previous_data[roc20].values, last_data[roc20].values, 0)):
        return 'IoInvesto/ROC'
    return None

def up_cross_value(previous, actual, value):
    ''' Questa funzione calcola se c'è stato un incrocio al rialzo di un determinato valore '''
    if (previous < value & value <= actual):
        return True
    return False

def check_exit_rayReno_bb(symbol, data):
    if (data[rsi].values > 50):
        return symbol
    return None


def backtesting_ioInvesto(data, society, symbol):
    """" Function that backtest a dataset with the ioInvesto strategy """
    df = data.copy()
    df.dropna(axis=0, inplace=True)

    open_order = False

    for index, row in df.iterrows():
        if not open_order:  # Devo valutare la condizione di apertura di una posizione
            # Condizione soddisfatta
            if row[close] > row[ema144] and row[close] > row[ema20high] and row[close] > row[ema20low]:
                df.loc[index, signal] = 1  # Segnale di entry
                open_order = True  # Setto il flag
        else:
            if row[close] < row[ema20low]:  # devo uscire
                df.loc[index, signal] = -1  # Segnale di entry
                open_order = False  # Setto il flag
            else:
                df.loc[index, signal] = 1  # Mantengo la posizione

    df[signal] = df[signal].shift(1)
    # the shift is necessary becouse the order is placed the next day,
    # and with the same logic must be applied to the order closing.
    df.dropna(axis=0, inplace=True)
    # simply, the row can be deleted, no carry on of information.

    # Filling the array
    open_order = False
    orders = []
    temp = {}

    for index, row in df.iterrows():
        if row['Signal'] == 1:
            if not open_order:  # devo salvarmi i dati
                temp = {
                    "Symbol": symbol,
                    "Societa": society,
                    "Strategy": 1,  # ioInvesto è quella che ha il valore di 1
                    "OpenOrderDate": index.strftime("%m/%d/%Y"),
                    "EntryPrice": row[open_label]  # che è il prezzo d'acquisto
                }
                open_order = True
        elif row['Signal'] == -1:
            if open_order:  # posso chiudere l'ordine
                temp['CloseOrderDate'] = index.strftime("%m/%d/%Y")
                # che è il prezzo di vendita
                temp['ExitPrice'] = row[open_label]

                orders.append(temp)
                temp = {}
                open_order = False

    return orders


def check_exit_ioInvesto(symbol, data):
    if (data['Close'].values < data[ema20low].values):
        return symbol
    return None
