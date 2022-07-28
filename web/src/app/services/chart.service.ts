import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { SymbolToShow } from '../models/symbol-to-show';
import cloneDeep from 'lodash.clonedeep';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {}

  getEmptyChart() {
    var option = {};
    return option;
  }

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
    for (i = 0; i <= symbol.ema144Series!.length; i++) {
      if (
        symbol.yAxisClose![i] > symbol.ema20High![i] &&
        symbol.yAxisClose![i] > symbol.ema20Low![i] &&
        symbol.yAxisClose![i] > symbol.ema144Series![i]
      ) {
        break;
      }
    }

    let y; // first index of exit
    for (y = 0; y <= symbol.ema144Series!.length; y++) {
      if (symbol.yAxisClose![y] < symbol.ema20Low![y]) {
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
                coord: [symbol.xAxis![i], symbol.yAxisClose![i]],
                value: symbol.yAxisClose![i],
                itemStyle: {
                  color: '#177E89',
                },
              },
              {
                name: 'Exit',
                coord: [symbol.xAxis![y], symbol.yAxisClose![y]],
                value: symbol.yAxisClose![y],
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

  private getPieChartData(orders: Order[]) {
    var profitable = orders.filter((x) => x.profit >= 0).length;
    return [profitable, orders.length - profitable];
  }

  getPieChart(orders: Order[]) {
    var pieData = this.getPieChartData(orders); // first profitable, second not profitable
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
            { value: pieData[0], name: 'Profitable' },
            { value: pieData[1], name: 'Not Profitable' },
          ],
        },
      ],
    };
    return option;
  }

  private getHistData(orders: Order[]) {
    var orders_sort = cloneDeep(orders);
    orders_sort.sort((a, b) => a.percentageVariation - b.percentageVariation);
    var minVar: number = orders_sort[0].percentageVariation;
    var maxVar: number = orders_sort[orders.length - 1].percentageVariation;
    var step: number = Math.abs(minVar - maxVar) / 10;

    var bins: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    orders_sort.forEach((x) => {
      if (
        minVar <= x.percentageVariation &&
        x.percentageVariation < minVar + step
      )
        bins[0] += 1;
      if (
        minVar + step <= x.percentageVariation &&
        x.percentageVariation < minVar + 2 * step
      )
        bins[1] += 1;
      if (
        minVar + 2 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 3 * step
      )
        bins[2] += 1;
      if (
        minVar + 3 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 4 * step
      )
        bins[3] += 1;
      if (
        minVar + 4 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 5 * step
      )
        bins[4] += 1;
      if (
        minVar + 5 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 6 * step
      )
        bins[5] += 1;
      if (
        minVar + 6 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 7 * step
      )
        bins[6] += 1;
      if (
        minVar + 7 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 8 * step
      )
        bins[7] += 1;
      if (
        minVar + 8 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 9 * step
      )
        bins[8] += 1;
      if (
        minVar + 9 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 10 * step
      )
        bins[9] += 1;
      if (
        minVar + 10 * step <= x.percentageVariation &&
        x.percentageVariation < minVar + 11 * step
      )
        bins[10] += 1;
    });

    var data = [];
    for (let i = 0; i <= bins.length - 1; i++) {
      if (i <= 5) {
        data.push({
          value: bins[i],
          itemStyle: {
            color: '#ee6666',
          },
        });
      } else {
        data.push({
          value: bins[i],
          itemStyle: {
            color: '#91cc75',
          },
        });
      }
    }

    return data;
  }

  getHistChart(orders: Order[]) {
    var histData = this.getHistData(orders);
    var option = {
      title: {
        text: 'Istogramma delle variazioni',
        left: '10%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: ['min', '', '', '', '', '0', '', '', '', '', 'MAX'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: histData,
          type: 'bar',
          //color: ['#ee6666'],
        },
      ],
    };
    return option;
  }

  getBacktestIoInvesto(
    symbol: string,
    xAxis: string[],
    yData: any,
    ema20High: number[],
    ema20Low: number[],
    ema144Series: number[]
  ) {
    debugger
    var option = {
      xAxis: {
        data: xAxis,
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
        data: [symbol, 'EMA 20 Minimi', 'EMA 20 Massimi', 'EMA 144'],
      },
      series: [
        {
          name: symbol,
          type: 'candlestick',
          data: yData,
        },
        {
          name: 'EMA 20 Minimi',
          type: 'line',
          data: ema20Low,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 20 Massimi',
          type: 'line',
          data: ema20High,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 144',
          type: 'line',
          data: ema144Series,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }
}
