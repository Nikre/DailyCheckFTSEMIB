import pandas as pd
import ta

# Indicators
open_label = 'open'
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
hbb = 'hbb2.5std'
lbb = 'lbb2.5std'
rsi = 'rsi2'
signal = 'signal'


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
    df[signal] = -1  # Column used in backtesting


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


def check_entry_ioInvesto(data):
    if ((data[close].values > data[ema20high].values) &
        (data[close].values > data[ema20low].values) &
            (data[close].values > data[ema144].values)):
        return 'IoInvesto/Medie'
    return None


def check_exit_ioInvesto(symbol, data):
    if (data['Close'].values < data[ema20low].values):
        return symbol
    return None
