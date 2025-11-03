abstract class Player {
    private playerSymbol: string

    constructor(playerSymbol: string){
        this.playerSymbol = playerSymbol
    }

    public getPlayerSymbol() {
        return this.playerSymbol
    }

    public setPlayerSymbol(newPlayerSymbol: string) {
        this.playerSymbol = newPlayerSymbol
    }
}

export class RedPlayer extends Player {
    constructor(playerSymbol: string) { 
        super(playerSymbol);
    }
}

export class BluePlayer extends Player {
    constructor(playerSymbol: string) { 
        super(playerSymbol);
    }
}