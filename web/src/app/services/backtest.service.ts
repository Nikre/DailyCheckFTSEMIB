import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import bakctestingJson from '../../../../backtesting.json';

@Injectable({
  providedIn: 'root'
})
export class BacktestService {

  orders: Order[] = [];

  constructor() { 
    bakctestingJson.forEach((x) => {
      this.orders.push(new Order(x));
    });
  }
}
