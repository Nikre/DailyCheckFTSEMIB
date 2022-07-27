import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { Order } from '../models/order';
import { BacktestService } from '../services/backtest.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'backtest-detail',
  templateUrl: './backtest-detail.component.html',
  styleUrls: ['./backtest-detail.component.css'],
})
export class BacktestDetailComponent implements OnInit {
  page = 1;
  pageSize = 8;
  collectionSize: number;
  currentRate = 8;
  ordersToShow: Order[];
  selectedSymbol: string = '';
  selectedSociety: string = '';
  averageDuration: number;
  averageProfit: number;
  
  constructor(
    private backtestService: BacktestService,
    private chartService: ChartService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params) => {
      this.selectedSymbol = params['simbolo'];
      this.selectedSociety = params['societa'];
    });

    this.ordersToShow = this.backtestService.getOrders(this.selectedSymbol, 1); // momentanemante settato a 1
    // dopo di che devo aggiungere anche il secondo backtesting, prima di far quello forse conviene usare un db
    this.ordersToShow.sort((a, b) =>  Number(a.openOrderDate) - Number(b.openOrderDate))
    this.collectionSize = this.ordersToShow.length;
    this.averageDuration = Math.round(this.ordersToShow.reduce((sum, current) => sum + current.duration, 0) / this.ordersToShow.length);
    this.averageProfit = this.ordersToShow.reduce((sum, current) => sum + current.profit, 0) / this.ordersToShow.length;
  }

  ngOnInit(): void {
    var pieChartDom = document.getElementById('pieChart')!;
    var pieChart = echarts.init(pieChartDom);
    pieChart.setOption(this.chartService.getPieChart(this.ordersToShow), true);
    
    var histChartDom = document.getElementById('histChart')!;
    var histChart = echarts.init(histChartDom);
    histChart.setOption(this.chartService.getHistChart(this.ordersToShow), true);
  }

  selectedOrder(order: Order) {
    console.log(order.profit)
  }
}
