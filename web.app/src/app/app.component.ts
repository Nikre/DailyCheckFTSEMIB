import { Component, OnInit } from '@angular/core';
import symbols from '../../../symbolsToBuyExtented.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  symbols: any;
  
  ngOnInit(): void {
    console.log('OnInit')
  }

  constructor() {
    debugger
    this.symbols = symbols
    console.log(symbols)
  }

}
