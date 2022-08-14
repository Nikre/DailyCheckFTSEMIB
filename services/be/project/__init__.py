import func.database as db 
import func.func as func
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return jsonify(hello="world")


@app.route("/test")
def test():
    return jsonify(test="altro link")


@app.route("/flask-integration", methods=["GET"])
def flask():
    data = {
        "stringhe": "Ciao Mondo",
        "numeri": 33,
        "arrayStringhe": ["stringa1", "stringa2"],
        "arrayNumbers": [33, 44, 55],
        "arrayArrayNumbers": [[20, 34, 10, 38],
                              [40, 35, 30, 50],
                              [31, 38, 33, 44],
                              [38, 15, 5, 42]]
    }
    return jsonify(data)

@app.route("/dashboard", methods=["GET"])
def dashboard():
    symbols = db.get_stocks_symbols()
    data_fe = []
    strategies = []
    for symbol in symbols:
        df = db.get_stock(symbol[0]) # lo zero è perchè è una tupla
        func.add_indicators(df)
        df = df.round(3) # La round() non è inplace
        # print(df)
        strategies = [func.check_entry_rayReno_bb(df.tail(1)), func.check_entry_ioInvesto_means(df.tail(1)), func.check_entry_ioInvesto_roc(df.tail(2)),
            func.check_entry_ioInvesto_Donchian(df.tail(2)), func.check_entry_ioInvesto_CCI(df.tail(2))]
        temp = {
            'society': df.tail(1)[func.society].values[0],
            'symbol': df.tail(1)[func.symbol].values[0],
            'open': df.tail(1)[func.open_label].values[0],
            'close': df.tail(1)[func.close].values[0],
            'trend': func.trend_analysis(df.tail(1)),
            'variation': func.percentage_calculator(first=df.tail(1)[func.open_label].values[0], last=df.tail(1)[func.close].values[0]),
            'strategies': ' - '.join(list(filter(lambda item: item is not None, strategies)))
        }
        data_fe.append(temp)

    return jsonify(data_fe)


@app.route("/detail", methods=["GET"])
def detail():
    args = request.args.to_dict()
    symbol = args.get('symbol') # Simbolo da andare a prendere dal db
    strategy = args.get('strategy') # La strategia più essere vuota
    society = db.get_society_from_symbol(symbol) # Lo zero è perchè una tupla

    df = db.get_stock(symbol)

    func.add_indicators(df)
    df = df.round(3) # La round() non è inplace
    xData = func.get_xData(df.tail(func.lastSample))
    yData = func.get_yData(df.tail(func.lastSample))

    if (strategy == ''):
       indicators = func.get_default_indicators(df.tail(func.lastSample))
    elif (strategy == "1"):
        indicators = func.rayner_teo_bollinger_indicators(df.tail(func.lastSample))
    elif (strategy == "2"):
        indicators = func.io_investo_means_indicators(df.tail(func.lastSample))
    elif (strategy == "3"):
        indicators = func.io_investo_roc_indicators(df.tail(func.lastSample))
    elif (strategy == "4"):
        indicators = func.io_investo_donchian_indicators(df.tail(func.lastSample))
    elif (strategy == "5"):
        indicators = func.io_investo_cci_indicators(df.tail(func.lastSample))
    
    data_fe = {
        'society': society,
        'xData': xData,
        'yData': yData,
        'indicators': indicators
    }
    return jsonify(data_fe)
