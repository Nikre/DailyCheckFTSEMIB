export class DashboardSymbol {
    society: string = ''
    symbol: string = ''
    open: number = 0
    close: number = 0
    trend: boolean = false
    strategies: string = ''
    variation: number = 0

    constructor()
    constructor(obj?: any)

    constructor(obj?: any) {
        if (obj != null) {
            this.society = obj.society
            this.symbol = obj.symbol
            this.open = obj.open
            this.close = obj.close 
            this.trend = obj.trend
            this.strategies =obj.strategies
            this.variation = obj.variation
        }
    }
}
