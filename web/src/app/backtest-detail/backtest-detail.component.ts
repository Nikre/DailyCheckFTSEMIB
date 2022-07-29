import * as echarts from 'echarts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../models/order';
import { BacktestService } from '../services/backtest.service';
import { ChartService } from '../services/chart.service';
import { SymbolService } from '../services/symbol.service';
import { SymbolToShow } from '../models/symbol-to-show';
import { DateService } from '../services/date.service';

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
  selectedOrder?: Order;
  backtestAllData?: SymbolToShow; // = new SymbolToShow(); 
  
  constructor(
    private symbolService: SymbolService,
    private backtestService: BacktestService,
    private chartService: ChartService,
    private dateService: DateService,
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

    var backtestChartDom = document.getElementById('backtestChart')!;
    var backtestChart = echarts.init(backtestChartDom);
    backtestChart.setOption(this.chartService.getLoadingChart(), true);
    
  }
  
  onOrderSelected(order: Order) {
    this.selectedOrder = order
    
    // TODO metterla dentro un service
    if (this.backtestAllData == null) { // non ho i dati a disposizione quindi li devo prendere
      var data = this.symbolService.getBacktestFromOrder(order.symbol)
      this.backtestAllData = new SymbolToShow(data)
    }

    var xAxisDates = this.backtestAllData.xAxis.map(x => this.dateService.getDateFromString(x, true))

    var filterStartDate = new Date(order.openOrderDate);
    filterStartDate.setDate(order.openOrderDate.getDate() - 2)
    if (filterStartDate.getDay() >= 6 || filterStartDate.getDay() == 0) { // se è una domenica (valore 0) o un sabato (valore 6)
      filterStartDate.setDate(order.openOrderDate.getDate() - 4)
    }
    var filterEndDate = new Date(order.closeOrderDate)
    filterEndDate.setDate(order.closeOrderDate.getDate() + 2)
    if (filterEndDate.getDay() >= 6 || filterEndDate.getDay() == 0) {
      filterEndDate.setDate(order.closeOrderDate.getDate() + 4)

    }

    var startIndex = xAxisDates.indexOf(filterStartDate.toDateString()) == -1 ? 0 : xAxisDates.indexOf(filterStartDate.toDateString())
    var endIndex = xAxisDates.indexOf(filterEndDate.toDateString())
    
    var backtestChartDom = document.getElementById('backtestChart')!;
    var backtestChart = echarts.init(backtestChartDom);
    backtestChart.setOption(this.chartService.getBacktestIoInvesto(this.selectedSymbol, this.backtestAllData.xAxis.slice(startIndex, endIndex + 1), 
    this.backtestAllData.yData.slice(startIndex, endIndex + 1), this.backtestAllData.ema20High.slice(startIndex, endIndex + 1),
     this.backtestAllData.ema20Low.slice(startIndex, endIndex + 1), this.backtestAllData.ema144Series.slice(startIndex, endIndex + 1)), true);
  }
}
