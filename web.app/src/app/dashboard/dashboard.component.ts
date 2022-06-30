import { Component, OnInit } from '@angular/core';
import { SymbolToShow } from '../models/symbol-to-show';
import symbolsFromJson from '../../../../symbolsToBuyExtented.json';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  symbols: SymbolToShow[] = [];

  constructor() {
    symbolsFromJson.forEach(x => {  
      this.symbols.push(new SymbolToShow(x))
    })
  }

  ngOnInit(): void {
  }

}
