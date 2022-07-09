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
    private chartService: ChartService
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
    myChart.setOption(
      this.chartService.getDefaultChartOption(this.symbol),
      true
    );
  }

  onStrategySelected() {
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);

    switch (this.selectedStrategy) {
      case 1:
        myChart.setOption(
          this.chartService.getBollingerBandChartOption(this.symbol),
          true
        );
        this.selectedStrategyDesc = 'bollinger';
        break;
      case 2:
        myChart.setOption(
          this.chartService.getIoInvestoChartOption(this.symbol),
          true
        );
        this.selectedStrategyDesc = `<b>Apertura posizione long:</b> per aprire una posizione, 
        il prezzo di chiusura deve essere maggiore della <b>media esponenziale a 144 periodi</b>, 
        della <b>media esponenziale</b> calcolata su <b> 20 periodi dei massimi</b> e dei <b>minimi</b>.
        <br><br>
        <b>Chiusura posizione long</b>: la posizione viene chiusa non appena il prezzo di chiusura a
        è <b>minore</b> della <b>EMA dei minimi dei 20 periodi</b>.`;
        break;
      default:
        myChart.setOption(
          this.chartService.getDefaultChartOption(this.symbol),
          true
        );
        this.selectedStrategyDesc = '';
        break;
    }
  }
}
