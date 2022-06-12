import pandas as pd
import yfinance as yf
# import matplotlib.pyplot as plt 
# import ta
import func
import json

# Get all the symbols
symbols = pd.read_html('https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']
societies = pd.read_html('https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Società']

symbolsToBuy = []
# Iterate 
for symbol, society in zip(symbols, societies):

    df = yf.download(symbols[0], period='1y')
    func.add_indicators(df)
    
    if (func.check_entry_rayReno_bb(symbol, df.tail(1)) is not None):
        data = {
            'Simbolo': symbol,
            'Societa': society,
            'Prezzo_ordine': df['Close'] * 0.97,
            'Strategia': 1 # Ray 
        }
        symbolsToBuy.append(data)

    if (func.check_entry_ioInvesto(symbol, df.tail(1))):
        data = {
            'Simbolo': symbol,
            'Societa': society,
            'Prezzo_ordine': df['Close'],
            'Strategia': 2 # Ray 
        }
        symbolsToBuy.append(data)

with open('symbolsToBuy.json', 'w') as f:
    json.dump(symbolsToBuy, f)