import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { SymbolToShow } from '../models/symbol-to-show';
import cloneDeep from 'lodash.clonedeep';
import { DateService } from './date.service';
import { DetailSymbol } from '../models/detail-symbol';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private dateService: DateService) {}

  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  getLoadingChart() {
    var randomColor = this.getRandomColor();
    var option = {
      title: {
        text: 'Seleziona un ordine...',
        left: 'center',
      },
      graphic: {
        elements: [
          {
            type: 'group',
            left: 'center',
            top: '10%',
            children: new Array(15).fill(0).map((val, i) => ({
              type: 'rect',
              x: i * 20,
              shape: {
                x: 0,
                y: -40,
                width: 10,
                height: 80,
              },
              style: {
                fill: randomColor,
              },
              keyframeAnimation: {
                duration: 1000,
                delay: i * 200,
                loop: true,
                keyframes: [
                  {
                    percent: 0.5,
                    scaleY: 0.3,
                    easing: 'cubicIn',
                  },
                  {
                    percent: 1,
                    scaleY: 1,
                    easing: 'cubicOut',
                  },
                ],
              },
            })),
          },
        ],
      },
    };
    return option;
  }

  getDefaultChartOption(symbol: DetailSymbol) {
    var option = {
      xAxis: {
        data: symbol.xData,
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
        data: [symbol.society, 'EMA 200'],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: symbol.indicators[0], // qui c'è solo un indicatore
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getIoInvestoMeansChartOption(symbol: DetailSymbol) {
    // let i; // first index of entry
    // for (i = 0; i <= symbol.indicators[0].length; i++) {
    //   if (
    //     symbol.yData[i][0] > symbol.indicators[0][i] &&
    //     symbol.yData[i][0] > symbol.indicators[1][i] &&
    //     symbol.yData[i][0] > symbol.indicators[2][i]
    //   ) {
    //     break;
    //   }
    // }

    // let y; // last index of exit
    // for (y = symbol.indicators[0].length; y <= i; y--) {
    //   if (symbol.yData[y][0] < symbol.indicators[0][y]) {
    //     break;
    //   }
    // }

    var option = {
      xAxis: {
        data: symbol.xData,
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
        data: [symbol.society, 'EMA 20 Minimi', 'EMA 20 Massimi', 'EMA 144'],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData,
          // markPoint: {
          //   // data: [
          //   //   {
          //   //     name: 'Entry',
          //   //     coord: [symbol.xData[i], symbol.yData[i][0]],
          //   //     value: symbol.yData[i][0],
          //   //     itemStyle: {
          //   //       color: '#177E89',
          //   //     },
          //   //   },
          //     // {
          //     //   name: 'Exit',
          //     //   //coord: [symbol.xData[y], symbol.yData[y][0]],
          //     //   value: symbol.yData[y][0],
          //     //   itemStyle: {
          //     //     color: '#81171B',
          //     //   },
          //     // },
          //   // ],
          // },
        },
        {
          name: 'EMA 20 Minimi',
          type: 'line',
          data: symbol.indicators[0], // ema 20 low
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 20 Massimi',
          type: 'line',
          data: symbol.indicators[1], // ema 20 high
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 144',
          type: 'line',
          data: symbol.indicators[2], // ema 144 
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getIoInvestoROCChartOption(symbol: DetailSymbol) {
    var option = {
      grid: [
        {
          left: '10%',
          right: '10%',
          bottom: 330,
        },
        {
          left: '10%',
          right: '10%',
          height: 60,
          bottom: 230,
        },
        {
          left: '10%',
          right: '10%',
          height: 60,
          bottom: 120,
        },
        {
          left: '10%',
          right: '10%',
          height: 60,
          bottom: 20,
        },
      ],
      xAxis: [
        {
          data: symbol.xData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          data: symbol.xData,
          gridIndex: 1,
          boundaryGap: false,
          axisLine: { onZero: true },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: true },
        },
        {
          data: symbol.xData,
          gridIndex: 2,
          boundaryGap: false,
          axisLine: { onZero: true },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: true },
        },
        {
          data: symbol.xData,
          gridIndex: 3,
          boundaryGap: false,
          axisLine: { onZero: true },
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
        {
          scale: true,
          gridIndex: 2,
          splitNumber: 2,
          axisLabel: { show: true },
          axisLine: { show: true },
          axisTick: { show: true },
          splitLine: { show: true },
        },
        {
          scale: true,
          gridIndex: 3,
          splitNumber: 2,
          axisLabel: { show: true },
          axisLine: { show: true },
          axisTick: { show: true },
          splitLine: { show: true },
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: [
          symbol.society,
          'EMA 200',
          'ROC 20',
          'ROC 50',
          'ROC 100',
        ],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'ROC 20',
          type: 'line',
          areaStyle: {},
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: symbol.indicators[0], // roc 20
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'ROC 50',
          type: 'line',
          areaStyle: {},
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: symbol.indicators[1], // roc 50
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'ROC 100',
          type: 'line',
          areaStyle: {},
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: symbol.indicators[2], // roc 100
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getIoInvestoDonchianChartOption(symbol: DetailSymbol) {
    var option = {
      xAxis: {
        data: symbol.xData,
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
        data: [symbol.society, 'SMA 5', 'SMA 20', 'Donchian Upper Band', 'Donchian Lower Band'],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData
        },
        {
          name: 'SMA 5',
          type: 'line',
          data: symbol.indicators[0], // sma 5
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'SMA 20',
          type: 'line',
          data: symbol.indicators[1], // sma 20
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'Donchian Upper Band',
          type: 'line',
          data: symbol.indicators[2], // Donchian Upper Band 
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'Donchian Lower Band',
          type: 'line',
          data: symbol.indicators[3], // Donchian Lower Band 
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getIoInvestoCCIChartOption(symbol: DetailSymbol){
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
          data: symbol.xData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          data: symbol.xData,
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
          symbol.society,
          'EMA 18',
          'EMA 36',
          'CCI',
        ],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 18',
          type: 'line',
          data: symbol.indicators[0], // ema 18
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'EMA 36',
          type: 'line',
          data: symbol.indicators[1], // ema 36
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'CCI',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: symbol.indicators[2], // cci
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
    return option;
  }

  getBollingerBandChartOption(symbol: DetailSymbol) {
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
          data: symbol.xData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
        {
          data: symbol.xData,
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
          symbol.society,
          'EMA 200',
          'High Bollinger band',
          'Lower Bollinger band',
          'RSI',
        ],
      },
      series: [
        {
          name: symbol.society,
          type: 'candlestick',
          data: symbol.yData,
        },
        {
          name: 'EMA 200',
          type: 'line',
          data: symbol.indicators[0], // ema 200
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'High Bollinger band',
          type: 'line',
          data: symbol.indicators[1], // hbb
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: 'Lower Bollinger band',
          type: 'line',
          data: symbol.indicators[2], // lbb 
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
          data: symbol.indicators[3], // rsi
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

  private getOrdersSort(orders: Order[]) {
    var orders_sort = cloneDeep(orders);
    orders_sort.sort((a, b) => a.percentageVariation - b.percentageVariation);
    return orders_sort
  }

  getMinMaxVariationPercentage(orders: Order[]) {
    var orders_sorted = this.getOrdersSort(orders)
    debugger
    return [orders_sorted[0].percentageVariation, orders_sorted[orders_sorted.length - 1].percentageVariation] 
  }

  /**
   * Funzione che restituisce soltanto i due parametri che servono per il grafico dell'histogramma.
   * 
   * @param orders 
   * @returns array[] - array ordinato delle variazioniin modo tale da capire come sono distribuite,
   * e le rispettive labels
   * 
   */ 
  private getHistData(orders: Order[]) {
    var orders_sort = this.getOrdersSort(orders)

    var labels: string[] = [];
    var data: any = [];

    orders_sort.forEach((x) => {
      data.push({
        value: x.percentageVariation,
        itemStyle: {
          color: x.percentageVariation >= 0 ? '#91cc75' : '#ee6666',
        },
      });
      labels.push(String(Math.round(x.percentageVariation)))
    });

    return [labels, data];
  }

  getHistChart(orders: Order[]) {
    var [histLabels, histData] = this.getHistData(orders);
    var option = {
      title: {
        text: 'Istogramma delle variazioni',
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: histLabels,
      },
      yAxis: {
        type: 'value',
        name: 'Values',
        // nameLocation: 'center',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          align: 'right',
          paddind: '10'
        }
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
    order: Order,
    xAxis: string[],
    yData: any,
    ema20High: number[],
    ema20Low: number[],
    ema144Series: number[]
  ) {
    var option = {
      xAxis: {
        data: xAxis,
      },
      yAxis: {
        scale: true,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          show: false, // con questo flag lo slider è visibile o meno
          type: 'slider',
          top: '90%',
        },
      ],
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
          markPoint: {
            data: [
              {
                name: 'Entry',
                coord: [this.dateService.getStringDateFromDateObject(order.openOrderDate), order.entryPrice],
                // value: order.entryPrice,
                symbolRotate: '90', // angolatura
                itemStyle: {
                  color: '#177E89',
                },
              },
              {
                name: 'Exit',
                coord: [this.dateService.getStringDateFromDateObject(order.closeOrderDate), order.exitPrice],
                // value: order.exitPrice,
                symbolRotate: '90', // angolatura
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
