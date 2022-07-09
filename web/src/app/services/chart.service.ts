import { Injectable } from '@angular/core';
import { SymbolToShow } from '../models/symbol-to-show';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {}

  getDefaultChartOption(symbol: SymbolToShow) {
    var option = {
      xAxis: {
        data: symbol.xAxis,
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
        data: [symbol.simbolo, 'EMA 200'],
      },
      series: [
        {
          name: symbol.simbolo,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: symbol.ema200Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getIoInvestoChartOption(symbol: SymbolToShow) {
    var option = {
      xAxis: {
        data: symbol.xAxis,
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
        data: [symbol.simbolo, 'EMA 20 Minimi', 'EMA 20 Massimi', 'EMA 144'],
      },
      series: [
        {
          name: symbol.simbolo,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 20 Minimi',
          type: 'line',
          data: symbol.ema20Low,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 20 Massimi',
          type: 'line',
          data: symbol.ema20High,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 144',
          type: 'line',
          data: symbol.ema144,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option
  }

  getBollingerBandChartOption(symbol: SymbolToShow) {
    var option = {
      xAxis: {
        data: symbol.xAxis,
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
        data: [symbol.simbolo, 'EMA 200', 'High Bollinger band', 'Lower Bollinger band'],
      },
      series: [
        {
          name: symbol.simbolo,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: symbol.ema200Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'High Bollinger band',
          type: 'line',
          data: symbol.hbbSeries,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'Lower Bollinger band',
          type: 'line',
          data: symbol.lbbSeries,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    }
    return option
  }
}
