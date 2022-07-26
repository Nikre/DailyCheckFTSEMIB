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
    let i; // first index of entry
    for (i = 0; i <= symbol.ema144Series.length; i++) {
      if (
        symbol.yAxisClose[i] > symbol.ema20High[i] &&
        symbol.yAxisClose[i] > symbol.ema20Low[i] &&
        symbol.yAxisClose[i] > symbol.ema144Series[i]
      ) {
        break;
      }
    }

    let y; // first index of exit
    for (y = 0; y <= symbol.ema144Series.length; y++) {
      if (symbol.yAxisClose[y] < symbol.ema20Low[y]) {
        break;
      }
    }

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
          markPoint: {
            data: [
              {
                name: 'Entry',
                coord: [symbol.xAxis[i], symbol.yAxisClose[i]],
                value: symbol.yAxisClose[i],
                itemStyle: {
                  color: '#177E89',
                },
              },
              {
                name: 'Exit',
                coord: [symbol.xAxis[y], symbol.yAxisClose[y]],
                value: symbol.yAxisClose[y],
                itemStyle: {
                  color: '#81171B',
                },
              },
            ],
          },
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
          data: symbol.ema144Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getBollingerBandChartOption(symbol: SymbolToShow) {
    // TODO: aggiungere anche il qui il markpoint
    var option = {
      grid: [
        {
          left: '10%',
          right: '10%',
          bottom: 200,
        },
        {
          left: '10%',
          right: '10%',
          height: 80,
          bottom: 80,
        },
      ],
      xAxis: [
        {
          data: symbol.xAxis,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          data: symbol.xAxis,
          gridIndex: 1,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: true },
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: true },
          axisLine: { show: true },
          axisTick: { show: true },
          splitLine: { show: true },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: [
          symbol.simbolo,
          'EMA 200',
          'High Bollinger band',
          'Lower Bollinger band',
          'RSI',
        ],
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
        {
          name: 'RSI',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: symbol.rsi,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getPieChart(profitable: number, totalOrder: number) {
    var option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          color: ['#91cc75', '#ee6666'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Profitable' },
            { value: 735, name: 'Not Profitable' },
          ],
        },
      ],
    };
    return option;
  }
}
