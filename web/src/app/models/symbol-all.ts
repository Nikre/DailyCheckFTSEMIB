export class SymbolAll {
  simbolo: string;
  societa: string;
  xAxis: number[];
  yDataAll: [number[]];
  ema200SeriesAll: number[];
  hbbSeriesAll: number[];
  lbbSeriesAll?: number[];
  rsiAll: number[];
  ema20HighAll: number[];
  ema20LowAll: number[];
  ema144SeriesAll: number[];

  constructor(obj: any) {
    this.simbolo = obj.Simbolo;
    this.societa = obj.Societa;
    this.xAxis = obj.xAxis;
    this.yDataAll = obj.yDataAll;
    this.ema200SeriesAll = obj.ema200SeriesAll;    
    this.hbbSeriesAll = obj.hbbSeriesAll;    
    this.lbbSeriesAll = obj.lbbSeriesAll;    
    this.rsiAll = obj.rsiAll;    
    this.ema20HighAll= obj.ema20HighAll;    
    this.ema20LowAll = obj.ema20LowAll;    
    this.ema144SeriesAll = obj.ema144SeriesAll;
  }
}
