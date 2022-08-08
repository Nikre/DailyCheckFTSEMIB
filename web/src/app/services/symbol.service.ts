import { Injectable } from '@angular/core';
import { SymbolToShow } from '../models/symbol-to-show';
import symbolsFromJson from '../../../../symbolsToBuyExtented.json';
import symbolAll from '../../../../symbolsAll.json';
import { SymbolAll } from '../models/symbol-all';
import { DashboardSymbol } from '../models/dashboard-symbol';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DetailSymbol } from '../models/detail-symbol';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  constructor(private http: HttpClient) {}

  getSymbols() {
    return this.http.get<DashboardSymbol[]>('http://127.0.0.1:5000/dashboard');
  }

  getSymbolDetail(symbol: string, strategy?: number) {
    var params: HttpParams = new HttpParams()
      .set('symbol', symbol)
      .set('strategy', strategy != null ? strategy : '')
    return this.http.get<DetailSymbol>('http://127.0.0.1:5000/detail', {params: params});
  }

  getAllDataBacktest(symbol: string) {
    const symbolAllarray = symbolAll as Array<any>;
    return symbolAllarray.filter((x) => x.Simbolo == symbol);
  }

  getBacktestFromOrder(symbol: string) {
    const symbolAllarray = symbolAll as Array<any>;
    var symbolBacktested = new SymbolAll(
      symbolAllarray.filter((x) => x.Simbolo == symbol)[0]
    ); // la funzione filter restituisce un array
    return symbolBacktested;
  }
}
