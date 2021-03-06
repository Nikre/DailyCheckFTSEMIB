export class Order {
    symbol: string; 
    society: string; 
    strategy: number; 
    openOrderDate: Date;
    entryPrice: number;
    closeOrderDate: Date;
    exitPrice: number;
    profit: number;
    duration: number;
    percentageVariation: number;

    constructor(obj: any) {
        this.symbol = obj.Symbol
        this.society = obj.Societa
        this.strategy = obj.Strategy
        this.openOrderDate = new Date(obj.OpenOrderDate)
        this.entryPrice = obj.EntryPrice
        this.closeOrderDate = new Date(obj.CloseOrderDate)
        this.exitPrice = obj.ExitPrice
        this.profit = this.exitPrice - this.entryPrice
        this.duration = Math.round(Math.abs(Number(this.closeOrderDate) - Number(this.openOrderDate)) / (24 * 60 * 60 * 1000));
        this.percentageVariation = ((this.exitPrice - this.entryPrice)/ this.entryPrice) * 100
    }
}
