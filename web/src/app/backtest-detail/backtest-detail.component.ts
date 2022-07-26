import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../models/order';
import { BacktestService } from '../services/backtest.service';

@Component({
  selector: 'backtest-detail',
  templateUrl: './backtest-detail.component.html',
  styleUrls: ['./backtest-detail.component.css'],
})
export class BacktestDetailComponent implements OnInit {
  page = 1;
  pageSize = 15;
  collectionSize: number;
  currentRate = 8;
  ordersToShow: Order[];
  selectedSymbol: string = '';

  constructor(
    private backtestService: BacktestService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params) => {
      this.selectedSymbol = params['simbolo'];
    });

    this.ordersToShow = this.backtestService.getOrders(this.selectedSymbol, 1); // momentanemante settato a 1
    // dopo di che devo aggiungere anche il secondo backtesting, prima di far quello forse conviene usare un db
    this.collectionSize = this.ordersToShow.length;
  }

  ngOnInit(): void {}
}
