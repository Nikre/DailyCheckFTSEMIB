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

    }
}
