import { Injectable } from '@angular/core';
import symbolsFromJson from '../../../../symbolsToBuyExtented.json';
import { SymbolToShow } from '../models/symbol-to-show';

@Injectable({
  providedIn: 'root'
})
export class SymbolService {

  symbols: SymbolToShow[] = []

  constructor() {
    // Mapping the json into model
    symbolsFromJson.forEach(x => {  
      this.symbols.push(new SymbolToShow(x))
    })
   }

   getSymbol(society?: string) {
    if (society) {
      return this.symbols.filter(x => x.societa.toLowerCase().includes(society.toLowerCase()))
    }
    return this.symbols
   }

}
