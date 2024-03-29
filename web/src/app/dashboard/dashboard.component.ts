import { Component, OnInit } from '@angular/core';
import { SymbolService } from '../services/symbol.service';
import { DashboardSymbol } from '../models/dashboard-symbol';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  symbols: DashboardSymbol[] = [];
  searchedSymbol: string = '';
  isLoading: boolean = true;
  mustFilter: boolean = false;
  market: string = 'ftse_mib'

  constructor(private symbolService: SymbolService) {}

  ngOnInit(): void {
    
    this.symbolService.getSymbols(this.market).subscribe((res) => {
      this.symbols = res;
      this.isLoading = false;
    });
  }

  searching() {
    this.isLoading = true;
    this.symbolService.getSymbols(this.market).subscribe((res) => {
      this.symbols = res.filter((x) =>
        x.society.toLowerCase().includes(this.searchedSymbol.toLowerCase())
      );
      this.isLoading = false;
    });
  }

  filtering() {
    this.isLoading = true;
    this.mustFilter = !this.mustFilter;
    if (this.mustFilter) {
      console.log('Sto filtrando');
      this.symbolService.getSymbols(this.market).subscribe((res) => {
        this.symbols = res.filter((x) => x.strategies != '');
        this.isLoading = false;
      });
    } else {
      this.symbolService.getSymbols(this.market).subscribe((res) => {
        this.symbols = res;
        this.isLoading = false;
      });
    }
  }

  onMarketChanged(market: string) {
    this.market = market
    this.isLoading = true
    this.symbolService.getSymbols(this.market).subscribe((res) => {
      this.symbols = res;
      this.isLoading = false;
    });
  }
}
