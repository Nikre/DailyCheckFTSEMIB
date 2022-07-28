import { Injectable } from '@angular/core';
import { SymbolToShow } from '../models/symbol-to-show';
import symbolsFromJson from '../../../../symbolsToBuyExtented.json';
import symbolAll from '../../../../symbolsAll.json';
import { SymbolAll } from '../models/symbol-all';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {

  symbols: SymbolToShow[] = [];

  constructor() {
    // Mapping the json into model
    symbolsFromJson.forEach((x) => {
      this.symbols.push(new SymbolToShow(x));
    });
  }

  getSymbol(society?: string) {
    if (society) {
      return this.symbols.filter((x) =>
        x.societa!.toLowerCase().includes(society.toLowerCase())
      );
    }
    return this.symbols;
  }

  getSymbolFromSymbol(symbol: string) {
    return this.symbols.filter((x) => x.simbolo == symbol)[0];
  }

  getAllDataBacktest(symbol: string) {
    const symbolAllarray = symbolAll as Array<any>; 
    return symbolAllarray.filter(x => x.Simbolo == symbol) 
  }
  
  getBacktestFromOrder(symbol: string) {
    const symbolAllarray = symbolAll as Array<any>; 
    var symbolBacktested = new SymbolAll(symbolAllarray.filter(x => x.Simbolo == symbol)[0]) // la funzione filter restituisce un array
    return symbolBacktested
  }
}
