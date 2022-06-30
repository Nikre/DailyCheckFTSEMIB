from pickle import TRUE
import pandas as pd
import yfinance as yf
# import matplotlib.pyplot as plt 
# import ta
import func
import json
import getopt, sys


def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'e')
    except getopt.GetoptError as err:
        # print help information and exit:
        print(err)  # will print something like "option -a not recognized"
        sys.exit(2)
    
    extented = False
    
    for o, a in opts:
        if o == '-e':
            extented = True


    # Get all the symbols
    symbols = pd.read_html('https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
    societies = pd.read_html('https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']

    symbolsToBuy = []
    symbolsToBuyExtended = []
    # Iterate 
    for symbol, society in zip(symbols, societies):

        print(f'Analizzo {society}')
        df = yf.download(symbol, period='1y')
        if (len(df.index) < 200): # necessario perchè alcuni titoli possono avere pochi dati
            continue
        func.add_indicators(df)
        
        if (extented):
            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Strategia': 1, # Ray
                'Open': df.tail(1)['Open'].values[0],
                'Close': df.tail(1)['Close'].values[0],
                'EMA200': df.tail(1)[func.ema200].values[0],
                'LowerBB': df.tail(1)[func.lbb].values[0]
            }
            symbolsToBuyExtended.append(data)
        
        if (func.check_entry_rayReno_bb(symbol, df.tail(1)) is not None):
            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Prezzo_ordine': df.tail(1)['Close'].values[0] * 0.97,
                'Strategia': 1 # Ray 
            }
            symbolsToBuy.append(data)


        if (func.check_entry_ioInvesto(symbol, df.tail(1)) is not None):
            data = {
                'Simbolo': symbol,
                'Societa': society,
                'Prezzo_ordine': df.tail(1)['Close'].values[0],
                'Strategia': 2 # ioInvesto 
            }
            symbolsToBuy.append(data)

    with open('symbolsToBuy.json', 'w') as f:
        json.dump(symbolsToBuy, f)
    
    if (extented):
        with open('symbolsToBuyExtented.json', 'w') as f:
           json.dump(symbolsToBuyExtended, f) 

if __name__ == "__main__":
    main()