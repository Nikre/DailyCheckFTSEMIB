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
  isLoading: boolean = true

  constructor(private symbolService: SymbolService) {}

  ngOnInit(): void {
    this.symbolService.getSymbols().subscribe((res) => {
      this.symbols = res;
      this.isLoading = false
    });
  }

  searching() {
    this.isLoading = true
    this.symbolService.getSymbols().subscribe((res) => {
      this.symbols = res.filter((x) =>
        x.society.toLowerCase().includes(this.searchedSymbol.toLowerCase())
        );
        this.isLoading = false
      });
  }
}
