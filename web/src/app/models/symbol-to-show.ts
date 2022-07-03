export class SymbolToShow {
    simbolo: string;
    societa: string;
    strategia: number;
    apertura: number;
    chiusura: number;
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
    
    constructor(obj: any) {
        this.simbolo = obj.Simbolo;
        this.societa = obj.Societa;
        this.strategia = obj.Strategia;
        // TODO: aggiungere anche la strategia letterale

        this.apertura = obj.Open;
        this.chiusura = obj.Close;
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
    }
}
