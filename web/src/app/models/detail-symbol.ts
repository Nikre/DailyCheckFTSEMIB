export class DetailSymbol {
    society: string = ''
    xData: string[] = []// Array delle date
    yData: [number[]] = [[]]// Array delle date
    indicators: [number[]] = [[]]// Array degli indicatori 

    constructor()
    constructor(obj?: DetailSymbol)

    constructor(obj?: DetailSymbol) {
        if (obj != null) {
            this.society = obj.society
            this.xData = obj.xData
            this.yData = obj.yData
            this.indicators = obj.indicators
        }
    }
}
