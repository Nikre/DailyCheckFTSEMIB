export class SymbolToShow {
    simbolo: string;
    societa: string;
    strategie: any;
    buyable: boolean;
    apertura: number;
    chiusura: number;
    variazione: number;
    ema200: number;
    lbb: number;
    xAxis: number[];
    yAxisHigh: number[];
    yAxisLow: number[];
    yAxisOpen: number[];
    yAxisClose: number[];
    yData: [number[]];
    ema200Series: number[];
    hbbSeries: number[];
    lbbSeries: number[];
    rsi: number[];
    ema20High: number[];
    ema20Low: number[];
    ema144Series: number[];
    
    constructor(obj: any) {
        this.simbolo = obj.Simbolo;
        this.societa = obj.Societa;
        this.strategie = obj.Strategie;
        this.buyable = obj.DaComprare
        this.apertura = obj.Open;
        this.chiusura = obj.Close;
        this.variazione = ((this.chiusura - this.apertura) / this.apertura) * 100
        this.ema200 = obj.EMA200;
        this.lbb = obj.LowerBB;
        this.xAxis = obj.xAxis;
        this.yAxisHigh = obj.yAxisHigh;
        this.yAxisLow = obj.yAxisLow;
        this.yAxisOpen = obj.yAxisOpen;
        this.yAxisClose = obj.yAxisClose;
        this.yData = obj.yData;
        this.ema200Series = obj.ema200Series;
        this.hbbSeries = obj.hbbSeries;
        this.lbbSeries = obj.lbbSeries;
        this.rsi = obj.rsi;
        this.ema20High = obj.ema20High;
        this.ema20Low = obj.ema20Low;
        this.ema144Series = obj.ema144Series;
    }
}
