import { CellValuesType } from "./board"
import { SoSGame } from "./sosGame"

export function computePossibleSoSCombinations(symbol: keyof CellValuesType<string>, rowIndex: number, columnIndex: number, sosGame: SoSGame) {
    const possibleCombinationsWithO = [
        [[rowIndex - 1, columnIndex], [rowIndex, columnIndex], [rowIndex + 1, columnIndex]], // Vertical SOS #1
        [[rowIndex, columnIndex - 1], [rowIndex, columnIndex], [rowIndex, columnIndex + 1]], // Horizontal SOS #1
        [[rowIndex - 1 , columnIndex - 1], [rowIndex, columnIndex], [rowIndex + 1, columnIndex + 1]], // Negative Slope Diagonal SOS #1
        [[rowIndex - 1, columnIndex + 1], [rowIndex, columnIndex], [rowIndex + 1, columnIndex - 1]] // Positive Slope Diagonal SOS #1
    ]

    const possibleCombinationsWithS = [
        [[rowIndex - 2, columnIndex], [rowIndex - 1, columnIndex], [rowIndex, columnIndex]], // Vertical SOS #1
        [[rowIndex, columnIndex], [rowIndex + 1, columnIndex], [rowIndex + 2, columnIndex]], // Vertical SOS #2
        [[rowIndex, columnIndex- 2], [rowIndex, columnIndex - 1], [rowIndex, columnIndex]], // Horizontal SOS #1
        [[rowIndex, columnIndex], [rowIndex, columnIndex + 1], [rowIndex, columnIndex + 2]], // Horizontal SOS #2
        [[rowIndex - 2, columnIndex - 2], [rowIndex - 1, columnIndex - 1], [rowIndex, columnIndex]], // Negative Slope Diagonal SOS #1
        [[rowIndex, columnIndex], [rowIndex + 1, columnIndex  + 1], [rowIndex + 2, columnIndex + 2]], // Negative Slope Diagonal SOS #2
        [[rowIndex - 2, columnIndex + 2], [rowIndex - 1, columnIndex + 1], [rowIndex, columnIndex]], // Positive Slope Diagonal SOS # 1
        [[rowIndex, columnIndex], [rowIndex + 1, columnIndex - 1], [rowIndex + 2, columnIndex - 2]], // Positive Slope Diagonal SOS # 1
    ]

    try {
        let possibleCombinations = possibleCombinationsWithO

        if (symbol == "S") {
            possibleCombinations = possibleCombinationsWithS
        }
        
        const sosLocationsToLookFor: any = []
        const [boardRowSize, boardColumnSize] = sosGame.board.size

        for (const combination of possibleCombinations) {
            let isCombinationValid = true
            
            // Look through all 3 cell locations in each possible SOS combination and see if cell locations exceed the board size
            for (const [cellRowIndex, cellColumnIndex] of combination) {
                if (cellRowIndex < 0 || cellRowIndex > boardRowSize - 1) {
                    isCombinationValid = false
                    break
                }

                if (cellColumnIndex < 0 || cellColumnIndex > boardColumnSize - 1) {
                    isCombinationValid = false
                    break
                }
            }

            // Only include SOS combinations where all 3 cell locations don't exceed board size
            if (isCombinationValid == true) {
                sosLocationsToLookFor.push([combination])
            }
        }

        return sosLocationsToLookFor
    }
    catch(err) {
        console.log(err)
    }
}