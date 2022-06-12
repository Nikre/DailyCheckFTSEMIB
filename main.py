import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt 
import ta

def add_indicators(df):
    df[ema200] = ta.trend.EMAIndicator(df['Close'], window=200).ema_indicator()

symbols = pd.read_html('https://it.wikipedia.org/wiki/FTSE_MIB')[4]['Codice alfanumerico']

# Indicators
ema200 = 'EMA 200'

# Data test
df = yf.download(symbols[0], period='1y')

# Add the indicators
add_indicators(df)

print(df.tail())