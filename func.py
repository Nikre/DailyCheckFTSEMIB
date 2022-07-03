import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt 
import ta

# Indicators
ema10 = 'EMA 10'
ema20 = 'EMA 20'
ema20high = 'EMA 20 High'
ema20low = 'EMA 20 Low'
ema50 = 'EMA 50'
ema144 = 'EMA 144'
ema200 = 'EMA 200'
hbb = 'HBB 2.5 std'
lbb = 'LBB 2.5 std'
rsi = 'RSI 2'

def add_indicators(df):
    df[ema20high] = ta.trend.EMAIndicator(df['High'], window=20).ema_indicator() 
    df[ema20low] = ta.trend.EMAIndicator(df['Low'], window=20).ema_indicator() 
    df[ema144] = ta.trend.EMAIndicator(df['Close'], window=144).ema_indicator()
    df[ema200] = ta.trend.EMAIndicator(df['Close'], window=200).ema_indicator()
    df[hbb] = ta.volatility.BollingerBands(df['Close'], window_dev=2.5).bollinger_hband()
    df[lbb] = ta.volatility.BollingerBands(df['Close'], window_dev=2.5).bollinger_lband()
    df[rsi] = ta.momentum.RSIIndicator(df['Close'], window=2).rsi()

def check_entry_rayReno_bb(symbol, data):
    if (data['Close'].values < data[lbb].values) & (data['Close'].values > data[ema200].values): 
        return symbol
    return None

def check_exit_rayReno_bb(symbol, data):
    if (data[rsi].values > 50):
        return symbol
    return None

def check_entry_ioInvesto(symbol, data): 
    if ((data['Close'].values > data[ema20high].values) & 
        (data['Close'].values > data[ema20low].values) & 
        (data['Close'].values > data[ema144].values)):
        return symbol
    return None

def check_exit_ioInvesto(symbol, data):
    if (data['Close'].values < data[ema20low].values):
        return symbol
    return None