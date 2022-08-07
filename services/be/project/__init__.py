import func.database as db 
import func.func as func
import json
from flask import Flask, jsonify, Response
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
        df = db.get_stock_for_dashboard(symbol[0]) # lo zero è perchè è una tupla
        func.add_indicators(df)
        df = df.round(3) # La round() non è inplace

        strategies = [func.check_entry_ioInvesto(df.tail(1)), func.check_entry_rayReno_bb(df.tail(1))]
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