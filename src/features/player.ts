export class Player {
    private playerName: string
    private playerSymbol: string
    public sosCount: number

    constructor(playerName: string, playerSymbol: string){
        this.playerName = playerName
        this.playerSymbol = playerSymbol
        this.sosCount = 0
    }
    
    public getPlayerName() {
        return this.playerName
    }

    public setPlayerName(newPlayerName: string) {
        this.playerSymbol = newPlayerName
    }

    public getPlayerSymbol() {
        return this.playerSymbol
    }

    public setPlayerSymbol(newPlayerSymbol: string) {
        this.playerSymbol = newPlayerSymbol
    }
}
