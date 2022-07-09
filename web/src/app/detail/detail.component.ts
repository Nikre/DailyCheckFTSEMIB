import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { SymbolToShow } from '../models/symbol-to-show';
import { SymbolService } from '../services/symbol.service';
import { TooltipComponentFormatterCallbackParams } from 'echarts';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  selectedSymbol: string = '';
  selectedStrategy?: number;
  selectedStrategyDesc: string = '';
  symbol: SymbolToShow;

  constructor(
    private route: ActivatedRoute,
    private symbolService: SymbolService,
    private chartService: ChartService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.selectedSymbol = params['simbolo'];
    });
    this.symbol = this.symbolService.getSymbolFromSymbol(this.selectedSymbol);
    // this.dataForCandelstick = this.buildData(this.symbol);
  }

  ngOnInit(): void {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    myChart.setOption(this.chartService.getDefaultChartOption(this.symbol), true);
  }

  onStrategySelected() {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    
    switch (this.selectedStrategy) {
      case 1:
        myChart.setOption(this.chartService.getBollingerBandChartOption(this.symbol), true);
        this.selectedStrategyDesc = "bollinger"
        break;
      case 2:
        myChart.setOption(this.chartService.getIoInvestoChartOption(this.symbol), true);
        this.selectedStrategyDesc = "La chiusura deve essere maggiore della <b>media a 144 periodi</b>"
        break;
      default:
        myChart.setOption(this.chartService.getDefaultChartOption(this.symbol), true)
        this.selectedStrategyDesc = ""
        break;
    }
  }
}
