import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { SymbolToShow } from '../models/symbol-to-show';
import { SymbolService } from '../services/symbol.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  selectedSymbol: string = '';
  selectedStrategy: number = 0;
  // dataForCandelstick: number[];
  symbol: SymbolToShow;

  constructor(private route: ActivatedRoute,
      private symbolService: SymbolService) {
    this.route.queryParams.subscribe(params => {
      this.selectedSymbol = params['simbolo'];
    });
    this.symbol = this.symbolService.getSymbolFromSymbol(this.selectedSymbol);
    // this.dataForCandelstick = this.buildData(this.symbol);
  }

  ngOnInit(): void {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    // var xAxisData: string[] = []
    debugger
    // this.symbol.xAxis.forEach(x => {
    //   console.log(new Date(x))
    //   xAxisData.push(new Date(x).toLocaleString())
    // })
    option = {
      xAxis: {
        data: this.symbol.xAxis
      },
      yAxis: {
        scale: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
      },
      series: [
        {
          type: 'candlestick',
          data: this.symbol.yData
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: this.symbol.ema200Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'High Bollinger band',
          type: 'line',
          data: this.symbol.hbbSeries,
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        },
        {
          name: 'Lower Bollinger band',
          type: 'line',
          data: this.symbol.lbbSeries,
          smooth: true,
          lineStyle: {
            opacity: 0.5
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }

}
