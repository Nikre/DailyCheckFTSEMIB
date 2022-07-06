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
        opts, args = getopt.getopt(sys.argv[1:], 'e')
    except getopt.GetoptError as err:
        # print help information and exit:
        print(err)  # will print something like "option -a not recognized"
        sys.exit(2)

    extented = False

    for o, _ in opts:
        if o == '-e':
            extented = True

    # Get all the symbols
    symbols = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
    societies = pd.read_html(
        'https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']

    symbolsToBuy = []
    symbolsToBuyExtended = []
    # Iterate
    for symbol, society in zip(symbols, societies):

        print(f'Analizzo {society}')
        df = yf.download(symbol, period='1y')
        if (len(df.index) < 200):  # necessario perchè alcuni titoli possono avere pochi dati
            # TODO: aggiungere il simbolo con tutte le cose a null, e poi il FE si occupa di 
            # evitare il click
            continue
        func.add_indicators(df)
        
        entryReyReno_bb = func.check_entry_rayReno_bb(symbol, df.tail(1))
        entryIoInvesto = func.check_entry_ioInvesto(symbol, df.tail(1))

        if (extented):
            high = df.tail(10)['High'].values.tolist()
            low = df.tail(10)['Low'].values.tolist()
            openData = df.tail(10)['Open'].values.tolist()
            close = df.tail(10)['Close'].values.tolist()

            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Strategie': {
                    'ReyReno': 1 if (entryReyReno_bb is not None) else 0,
                    'IoInvesto': 1 if (entryIoInvesto is not None) else 0
                },
                # Se il campo diventa troppo lungo, si fa una funzione
                'DaComprare': (entryReyReno_bb is not None) or (entryIoInvesto is not None),
                'Open': df.tail(1)['Open'].values[0].round(3),
                'Close': df.tail(1)['Close'].values[0].round(3),
                'EMA200': df.tail(1)[func.ema200].values[0].round(3),
                'LowerBB': df.tail(1)[func.lbb].values[0].round(3),
                'xAxis': list(map(lambda x: x.strftime("%d/%m"), df.tail(10).index.tolist())),
                'yAxisHigh': high,
                'yAxisLow': low,
                'yAxisOpen': openData,
                'yAxisClose': close,
                'yData': [list(x) for x in zip(close, openData, low, high)],
                'ema200Series': df.tail(10)[func.ema200].values.tolist(),
                'hbbSeries': df.tail(10)[func.hbb].values.tolist(),
                'lbbSeries': df.tail(10)[func.lbb].values.tolist(),
                'ema20High': df.tail(10)[func.ema20high].values.tolist(),
                'ema20Low': df.tail(10)[func.ema20low].values.tolist(),
                'ema144': df.tail(10)[func.ema144].values.tolist()
            }
            symbolsToBuyExtended.append(data)

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


if __name__ == "__main__":
    main()
