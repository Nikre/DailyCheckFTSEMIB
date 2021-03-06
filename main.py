import pandas as pd
import yfinance as yf
# import matplotlib.pyplot as plt
# import ta
import func
import json
import getopt
import sys


def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'eb')
    except getopt.GetoptError as err:
        # print help information and exit:
        print(err)  # will print something like "option -a not recognized"
        sys.exit(2)

    extented = False
    backtest = False

    for o, _ in opts:
        if o == '-e':
            extented = True
        if o == '-b':
            backtest = True

    # Get all the symbols
    symbols = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
    societies = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']

    symbolsToBuy = []
    symbolsToBuyExtended = []
    symbolsAll = []
    backtesting = [] 
    lastSamples = 30

    # Iterate
    for symbol, society in zip(symbols, societies):

        print(f'Analizzo {society}')
        df = yf.download(symbol, interval='1d', start='2010-01-01')
        if (len(df.index) < 200):  # necessario perchè alcuni titoli possono avere pochi dati
            # TODO: aggiungere il simbolo con tutte le cose a null, e poi il FE si occupa di 
            # evitare il click
            continue
        func.add_indicators(df)
        
        entryReyReno_bb = func.check_entry_rayReno_bb(symbol, df.tail(1))
        entryIoInvesto = func.check_entry_ioInvesto(symbol, df.tail(1))
        df = df.round(3) # La round() non è inplace

        if (extented):
            high = df.tail(lastSamples)[func.high].values.tolist()
            low = df.tail(lastSamples)[func.low].values.tolist()
            openData = df.tail(lastSamples)[func.open_label].values.tolist()
            close = df.tail(lastSamples)[func.close].values.tolist()

            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Strategie': {
                    'ReyReno': 1 if (entryReyReno_bb is not None) else 0,
                    'IoInvesto': 1 if (entryIoInvesto is not None) else 0
                },
                # Se il campo diventa troppo lungo, si fa una funzione
                'DaComprare': (entryReyReno_bb is not None) or (entryIoInvesto is not None),
                'Open': df.tail(1)['Open'].values[0],
                'Close': df.tail(1)['Close'].values[0],
                'EMA200': df.tail(1)[func.ema200].values[0],
                'LowerBB': df.tail(1)[func.lbb].values[0],
                'xAxis': list(map(lambda x: x.strftime("%d/%m"), df.tail(lastSamples).index.tolist())),
                'yAxisHigh': high,
                'yAxisLow': low,
                'yAxisOpen': openData,
                'yAxisClose': close,
                'yData': [list(x) for x in zip(close, openData, low, high)],
                'ema200Series': df.tail(lastSamples)[func.ema200].values.tolist(),
                'hbbSeries': df.tail(lastSamples)[func.hbb].values.tolist(),
                'lbbSeries': df.tail(lastSamples)[func.lbb].values.tolist(),
                'rsi': df.tail(lastSamples)[func.rsi].values.tolist(),
                'ema20High': df.tail(lastSamples)[func.ema20high].values.tolist(),
                'ema20Low': df.tail(lastSamples)[func.ema20low].values.tolist(),
                'ema144Series': df.tail(lastSamples)[func.ema144].values.tolist()
            }
            symbolsToBuyExtended.append(data)

        if(backtest):
            backtesting += func.backtesting_ioInvesto(df, society, symbol)
            
            df_temp = df.copy()
            df_temp.dropna(axis=0, inplace=True)

            highAll = df_temp[func.high].values.tolist()
            lowAll = df_temp[func.low].values.tolist()
            openDataAll = df_temp[func.open_label].values.tolist()
            closeAll = df_temp[func.close].values.tolist()


            data = {
                'Simbolo': symbol,
                'Societa': society,
                'xAxis': list(map(lambda x: x.strftime("%d/%m/%Y"), df_temp.index.tolist())),
                'yData': [list(x) for x in zip(closeAll, openDataAll, lowAll, highAll)],
                'ema200Series': df_temp[func.ema200].values.tolist(),
                'hbbSeries': df_temp[func.hbb].values.tolist(),
                'lbbSeries': df_temp[func.lbb].values.tolist(),
                'rsi': df_temp[func.rsi].values.tolist(),
                'ema20High': df_temp[func.ema20high].values.tolist(),
                'ema20Low': df_temp[func.ema20low].values.tolist(),
                'ema144Series': df_temp[func.ema144].values.tolist()
            }
            symbolsAll.append(data)


        if (entryReyReno_bb is not None):
            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Prezzo_ordine': df.tail(1)['Close'].values[0],
                'Strategia': 1  # Ray
            }
            symbolsToBuy.append(data)

        if (entryIoInvesto is not None):
            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Prezzo_ordine': df.tail(1)['Close'].values[0],
                'Strategia': 2  # ioInvesto
            }
            symbolsToBuy.append(data)

    with open('symbolsToBuy.json', 'w') as f:
        json.dump(symbolsToBuy, f)

    if (extented):
        with open('symbolsToBuyExtented.json', 'w') as f:
           json.dump(symbolsToBuyExtended, f)

    if (backtest):
        with open('backtesting.json', 'w') as f:
           json.dump(backtesting, f)
        with open('symbolsAll.json', 'w') as f:
           json.dump(symbolsAll, f)

if __name__ == "__main__":
    main()
