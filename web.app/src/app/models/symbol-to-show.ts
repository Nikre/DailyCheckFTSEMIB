export class SymbolToShow {
    simbolo: string;
    societa: string;
    strategia: number;
    apertura: number;
    chiusura: number;
    ema200: number;
    lbb: number;

    constructor(obj: any) {
        this.simbolo = obj.Simbolo;
        this.societa = obj.Societa;
        this.strategia = obj.Strategia;
        this.apertura = obj.Open;
        this.chiusura = obj.Close;
        this.ema200 = obj.EMA200;
        this.lbb = obj.LowerBB;
    }
}
