import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { SymbolToShow } from '../models/symbol-to-show';
import { SymbolService } from '../services/symbol.service';
import { TooltipComponentFormatterCallbackParams } from 'echarts';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  selectedSymbol: string = '';
  selectedStrategy?: number;
  symbol: SymbolToShow;

  constructor(
    private route: ActivatedRoute,
    private symbolService: SymbolService
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
    var option: EChartsOption;

    option = {
      xAxis: {
        data: this.symbol.xAxis,
      },
      yAxis: {
        scale: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: [this.symbol.simbolo, 'EMA 200'],
      },
      series: [
        {
          name: this.symbol.simbolo,
          type: 'candlestick',
          data: this.symbol.yData
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: this.symbol.ema200Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };

    option && myChart.setOption(option, true);
  }

  onStrategySelected() {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    
    switch (this.selectedStrategy) {
      case 1:
        myChart.setOption({
          xAxis: {
            data: this.symbol.xAxis,
          },
          yAxis: {
            scale: true,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: [this.symbol.simbolo, 'EMA 200', 'High Bollinger band', 'Lower Bollinger band'],
          },
          series: [
            {
              name: this.symbol.simbolo,
              type: 'candlestick',
              data: this.symbol.yData,
            },
            {
              name: 'EMA 200',
              type: 'line',
              data: this.symbol.ema200Series,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'High Bollinger band',
              type: 'line',
              data: this.symbol.hbbSeries,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'Lower Bollinger band',
              type: 'line',
              data: this.symbol.lbbSeries,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
          ],
        }, true);
        break;
      case 2:
        myChart.setOption({
          xAxis: {
            data: this.symbol.xAxis,
          },
          yAxis: {
            scale: true,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: [this.symbol.simbolo, 'EMA 20 Minimi', 'EMA 20 Massimi', 'EMA 144'],
          },
          series: [
            {
              name: this.symbol.simbolo,
              type: 'candlestick',
              data: this.symbol.yData,
            },
            {
              name: 'EMA 20 Minimi',
              type: 'line',
              data: this.symbol.ema20Low,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'EMA 20 Massimi',
              type: 'line',
              data: this.symbol.ema20High,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
            {
              name: 'EMA 144',
              type: 'line',
              data: this.symbol.ema144,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
          ],
        }, true);
        break;
      default:
        myChart.setOption({
          xAxis: {
            data: this.symbol.xAxis,
          },
          yAxis: {
            scale: true,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: [this.symbol.simbolo, 'EMA 200'],
          },
          series: [
            {
              name: this.symbol.simbolo,
              type: 'candlestick',
              data: this.symbol.yData,
            },
            {
              name: 'EMA 200',
              type: 'line',
              data: this.symbol.ema200Series,
              smooth: true,
              lineStyle: {
                opacity: 0.5,
              },
            },
          ]
        }, true)
    }
  }
}
