export class Order {
    symbol: string; 
    society: string; 
    strategy: number; 
    openOrderDate: Date;
    entryPrice: number;
    closeOrderDate: Date;
    exitPrice: number;
    profit: number;

    constructor(obj: any) {
        this.symbol = obj.Symbol
        this.society = obj.Societa
        this.strategy = obj.Strategy
        this.openOrderDate = new Date(obj.OpenOrderDate)
        this.entryPrice = obj.EntryPrice
        this.closeOrderDate = new Date(obj.CloseOrderDate)
        this.exitPrice = obj.ExitPrice
        this.profit = this.exitPrice - this.entryPrice
    }
}
