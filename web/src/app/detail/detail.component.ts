import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import { SymbolToShow } from '../models/symbol-to-show';
import { SymbolService } from '../services/symbol.service';
import { ChartService } from '../services/chart.service';
import { DetailSymbol } from '../models/detail-symbol';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  selectedSymbol: string = '';
  selectedStrategy?: number;
  selectedStrategyDesc: string = '';
  symbol: DetailSymbol = new DetailSymbol()

  constructor(
    private route: ActivatedRoute,
    private symbolService: SymbolService,
    private chartService: ChartService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.selectedSymbol = params['simbolo'];
    });
  }

  ngOnInit(): void {
    this.symbolService.getSymbolDetail(this.selectedSymbol, this.selectedStrategy).subscribe(res => {
      this.symbol = new DetailSymbol(res)
      var chartDom = document.getElementById('main')!;
      var myChart = echarts.init(chartDom);
      myChart.setOption(
        this.chartService.getDefaultChartOption(this.symbol),
        true
      );
    })
  }

  onStrategySelected() {
    this.symbolService.getSymbolDetail(this.selectedSymbol, this.selectedStrategy).subscribe(res => {
      this.symbol = new DetailSymbol(res)
      var chartDom = document.getElementById('main')!;
      var myChart = echarts.init(chartDom);
      switch (this.selectedStrategy) {
        case 1:
          myChart.setOption(this.chartService.getBollingerBandChartOption(this.symbol), true);
          this.selectedStrategyDesc = `<b>Apertura posizione long:</b> per aprire una posizione, 
          il prezzo di chiusura deve essere minore del <b> valore della banda di Bollinger inferiore</b>.
          A questo punto deve essere piazzato un ordine pari al 97% del valore attuale (<i><b>i.e:</b>
          chiusura * 0.97</i>). 
          <br><br>
          <b>Chiusura posizione long</b>: la chiusura della posizione avviene appena l'oscillatore <b>RSI</b>
          raggiunge il <b>valore maggiore o uguale di 50</b> oppure dopo che la posizione 
          è rimasta aperta per <b>10 giorni</b>.`;
          break;
        case 2:
          myChart.setOption(this.chartService.getIoInvestoMeansChartOption(this.symbol), true);
          this.selectedStrategyDesc = `<b>Apertura posizione long:</b> per aprire una posizione, 
          il prezzo di chiusura deve essere maggiore della <b>media esponenziale a 144 periodi</b>, 
          della <b>media esponenziale</b> calcolata su <b> 20 periodi dei massimi</b> e dei <b>minimi</b>.
          <br><br>
          <b>Chiusura posizione long</b>: la posizione viene chiusa non appena il prezzo di chiusura a
          è <b>minore</b> della <b>EMA dei minimi dei 20 periodi</b>.`;
          break;
        case 3:
          myChart.setOption(this.chartService.getIoInvestoROCChartOption(this.symbol), true);
          this.selectedStrategyDesc= `<b>Apertura posizione long:</b> per l'apertura di una posizione il ROC medio e lungo
          devono <b>essere positivi</b>, inoltre l'acquisto scatta quando il ROC veloce su 20 periodi <b>passa da negativo 
          a positivo</b>.
          <br><br>
          <b>Chiusura posizione long</b>: la posizione viene chiusa quando il ROC veloce presenta un <b>incrocio ribassista 
          sul valore -5</b>.`
          break;
        case 4:
          myChart.setOption(this.chartService.getIoInvestoDonchianChartOption(this.symbol), true);
          this.selectedStrategyDesc = `<b>Apertura posizione long:</b> deve avvenire l\'incrocio rialzista delle medie, ovvero la 
          media mobile a 5 periodi deve incrociare al rialzo la media mobile a 20 periodi, e inoltre la chiusura del prezzo deve essere
          maggiore della banda di Donchian. 
          <br><br>
          <b>Chiusura posizione long</b>: la condizine di uscita da una posizione long si verifica quando si ha un incrocio ribassista 
          delle medie.`
          break;
        case 5:
          myChart.setOption(this.chartService.getIoInvestoCCIChartOption(this.symbol), true);
          this.selectedStrategyDesc = `<b>Apertura posizione long:</b> deve avvenire l\'incrocio rialzista delle, e il CCI (Commodity Channel Index) 
          deve essere maggiore di -100.
          <br><br>
          <b>Chiusura posizione long</b>: la condizione di chiusura di una posizione long, è l\'incrocio ribassista delle medie.`
          break;
        default:
          myChart.setOption(
            this.chartService.getDefaultChartOption(this.symbol),
            true
          );
          this.selectedStrategyDesc = '';
          break;
      }
    })
  }
}
