import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /** Funzione che restituiesce la data in formato Date partendo da 
   * una stringa in formato dd/mm/yyyy, questo perchè il formato std
   * di typescript è mm/dd/yyyy, PORCO DIO.
   * 
   * Ariporco dio. Per confrontare le date le ho dovute mettere nel formato stringa
   * in modo tale da fare un confronto, se no ritorna false, perche va anche a valutare
   * il fuso orario 
   */
  getDateFromString(stringDate: string, toDateString: boolean) {
    var dateParts = stringDate.split('/');
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    if (toDateString) return dateObject.toDateString()
    return dateObject
  }

  /** 
   * Maledetto il signore, le date, devo tener conto degli zeri, quindi 18/4/2044, deve essere 18/04/2044,
   * così come 9/8/1993 deve essere 09/08/1993
   * 
   * Usata per il marker
   */
  getStringDateFromDateObject(date: Date) {
    var d, m, y = 0;
    d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
    m = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    y = date.getFullYear()
    debugger
    return d + '/' + m + '/' + y
  }

  /**
   * Funzione che calcola gli indici di un dell'intervallo dell'ordine
   * 
   * @returns 
   * [srtInd, endInx]
   */
  getInterval(order: Order, backtestDates: string[]) {

    var xAxisDates = backtestDates.map((x) =>
      this.getDateFromString(x, true)
    );

    var filterStartDate = new Date(order.openOrderDate);
    filterStartDate.setDate(order.openOrderDate.getDate() - 2);
    if (filterStartDate.getDay() >= 6 || filterStartDate.getDay() == 0) {
      // se è una domenica (valore 0) o un sabato (valore 6)
      filterStartDate.setDate(order.openOrderDate.getDate() - 4);
    }
    var filterEndDate = new Date(order.closeOrderDate);
    filterEndDate.setDate(order.closeOrderDate.getDate() + 2);
    if (filterEndDate.getDay() >= 6 || filterEndDate.getDay() == 0) {
      filterEndDate.setDate(order.closeOrderDate.getDate() + 4);
    }

    var startIndex =
      xAxisDates.indexOf(filterStartDate.toDateString()) == -1
        ? 0
        : xAxisDates.indexOf(filterStartDate.toDateString());
    var endIndex = xAxisDates.indexOf(filterEndDate.toDateString());

    return [startIndex, endIndex]
  }

}
