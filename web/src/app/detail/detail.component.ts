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
      yAxis: {},
      series: [
        {
          type: 'candlestick',
          data: [
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [38, 15, 4, 42],
            [38, 15, 4, 42],
            [38, 15, 4, 42]
          ]
        }
      ]
    };

    option && myChart.setOption(option);

  }

  buildData(symbol: SymbolToShow) {
    
  }
}
