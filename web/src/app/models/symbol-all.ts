export class SymbolAll {
  simbolo: string = "N.D";
  societa: string = "N.D";
  xAxis: [] = [];
  yData: [number[]] = [[]];
  ema200Series: number[] = [];
  hbbSeries: number[] = [];
  lbbSeries: number[] = [];
  rsi: number[] = [];
  ema20High: number[] = [];
  ema20Low: number[] = [];
  ema144Series: number[] = [];

  constructor();
  constructor(obj: any);
  constructor(obj: any = null) {
    if(obj != null) {
      this.simbolo = obj.Simbolo;
      this.societa = obj.Societa;
      this.xAxis = obj.xAxis;
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
}
