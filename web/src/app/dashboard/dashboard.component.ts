import { Component, OnInit } from '@angular/core';
import { SymbolToShow } from '../models/symbol-to-show';
import symbolsFromJson from '../../../../symbolsToBuyExtented.json';
import { SymbolService } from '../services/symbol.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  symbols: SymbolToShow[]
  searchedSymbol: string = ''

  constructor(private symbolService: SymbolService) {
    this.symbols = this.symbolService.getSymbol()
  } 

  ngOnInit(): void {
  }

  searching() {
    this.symbols = this.symbolService.getSymbol(this.searchedSymbol)
  }

  getStrategiesFromSymbol(symbol: SymbolToShow) {
    var strategie = []
    if (symbol.strategie['ReyReno'] == 1) {
      strategie.push('RayReno')
    }
    if (symbol.strategie['IoInvesto'] == 1) {
      strategie.push('IoInvesto')
    }

    return strategie.join(', ')
  }
}
