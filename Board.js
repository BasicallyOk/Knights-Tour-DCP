function partition(height, width) {
    const ogWidth = width

    while (width > 5 && height > 5 && (width%2 === 0 && height%2 === 0)) {
        width /= 2
        height /= 2
    }
    width *= 2
    height *= 2

    let boardlist = []
    for (let i = 0; i < (ogWidth/width)**2; i++) {
        let board = {
            boardArray: [], 
            width: width, 
            height: height, 
            visited: []
        }
    
        for (let i = 0; i < board.width; i++) {
            let column = []
            for (let j = 0; j < board.height; j++) {
                column.push(-1)
            }
            board.boardArray.push(column)
        }
        boardlist.push(board)
    }
    
    // const sections = array.slice(sx, ex+1).map(i => i.slice(sy, ey));
    
    return boardlist;
}

function generateBoard(width, height, index){
    let board = {
        boardArray: [], 
        width: width, 
        height: height, 
        visited: [], 
        index: index
    }

    for (let i = 0; i < board.width; i++) {
        let column = []
        for (let j = 0; j < board.height; j++) {
            column.push(-1)
        }
        board.boardArray.push(column)
    }
    return board
}
/**
 * 
 * @param {Number} width Must be smaller or equal to height 
 * @param {Number} height 
 * @returns 
 */
function isSolvable(width, height) {
    if (width % 2 === 1 && height % 2 === 1) {
        return false
    }

    if (width === 1 || width === 2 || width === 4) {
        return false
    }

    if (width === 3 && (height === 4 || height === 6 || height === 8)){
        return false
    }

    return true
}

/**
 * 
 * @param {Number} width must be smaller or equal to height
 * @param {Number} height 
 */
function weirdPartition(width, height, parentIndex) {
    let i = Math.floor(width/2);
    let j = Math.floor(height/2);
    let iTurn = true;
    while (true) {
        if (!isSolvable(i, j) || !isSolvable(width - i) || !isSolvable(height-i) || i === width || j === height) {
            if (iTurn) { i++ } else { j++ }
            iTurn = !iTurn
        } else {
            break
        }
    }
    if (i === width || j === height) {
        return [generateBoard(width, height, parentIndex)]
    } else {
        return [].concat(weirdPartition(i, j, `${parentIndex}0`), weirdPartition(width-i, j, `${parentIndex}1`), weirdPartition(i, height-j, `${parentIndex}2`), weirdPartition(width-i, height-j, `${parentIndex}3`))
    }
}

/**
 * Merge 4 boards into 1
 * @param {Array<Object>} boardList - A list of 4 mergeable boards to be merged into 1
 */
function merge(boardList){
    let mergedBoard = {
        boardArray: [], 
        visited: [], 
        height: 0, 
        width: 0
    }
    // For the moment this doesnt allow for weird boards but these props dont matter
    mergedBoard.width += boardList[0].width + boardList[1].width
    mergedBoard.height += boardList[0].height + boardList[3].height

    let tempStart // Unnecessary atm, will be helpful if we want to also update boardArray

    // Loop through each quadrant and update mergedBoard
    for (let quadrant = 0; quadrant < 4; quadrant++) {
        let diffHeight = 0;
        let diffWidth =  0;
        let startMoveNum, endMoveNum;
        let board = boardList[quadrant]
        // Handle change in coordinates based on which quadrant of the board it is
        switch (quadrant) {
            case 0:
                startMoveNum = boardList[0].boardArray[boardList[0].width-1][boardList[0].height-2]
                endMoveNum = boardList[0].boardArray[boardList[0].width-3][boardList[0].height-1]
                break
            case 1:
                diffWidth = boardList[0].width // 1 is top right 
                startMoveNum = boardList[1].boardArray[1][boardList[1].height-3]
                endMoveNum = boardList[1].boardArray[0][boardList[1].height-1]
                break
            case 2:
                diffWidth = boardList[3].width // allow for non-rectangular solutions
                diffHeight = boardList[1].height // allow for weird partitions
                startMoveNum = boardList[2].boardArray[0][2]
                endMoveNum = boardList[2].boardArray[0][1]
                break
            case 3:
                diffHeight = boardList[0].height
                startMoveNum = boardList[2].boardArray[boardList[2].width -2][2]
                endMoveNum = boardList[2].boardArray[boardList[2].width -2][0]
                break
        }

        for (let i = 0; i < board.width * board.height; i++) {
            let loc = board.visited[(i + startMoveNum) % (board.width * board.height)];
            mergedBoard.visited.push([loc[0] + diffWidth, loc[1] + diffHeight])
        }

        tempStart = endMoveNum; // Update tempstart
    }
    return mergedBoard
}

async function knightsTour(board){
    //progress();
    // import Board from './Board';
    // Starting location does not matter since we're looking for a closed undirected tour
    let currLoc = [5, 5]
    // For now, modify this too

    /*
    Partition the board into smaller one to distribute to dcp workers
    */
    // let partedWidth = board.width, partedHeight = board.height
    // while (partedWidth > 5 && partedHeight > 5) {
    //     partedHeight /= 2
    //     partedWidth /= 2
    // }

    // partedHeight *= 2
    // partedWidth *= 2

    /* WORK FUNCTION */
    // async function workFn(array, currLoc) {

    /**
     * Check if the tour is a closed tour
     * @returns true if the last location and the starting location can be connected
     */
    function isClosedTour() {
        return (
            (Math.abs(currLoc[0] - board.visited[0][0]) === 2 && Math.abs(currLoc[1] - board.visited[0][1]) === 1) ||
            (Math.abs(currLoc[0] - board.visited[0][0]) === 1 && Math.abs(currLoc[1] - board.visited[0][1]) === 2)      
        )
    }

    function isMergeable() {
        return (
            Math.abs(board.boardArray[board.width-1][board.height-2] - board.boardArray[board.width-3][board.height-1]) === 1 &&
            Math.abs(board.boardArray[0][board.height-1] - board.boardArray[1][board.height-3]) === 1 &&
            Math.abs(board.boardArray[board.width-1][0] - board.boardArray[board.width-2][2]) === 1 &&
            Math.abs(board.boardArray[0][1] - board.boardArray[2][0]) === 1
        )
    }

    function notOB (location) {
        return (location[0] < board.boardArray.length && location[1] < board.boardArray[0].length
            && location[0] >= 0 && location[1] >= 0)
    }

    function notVisited(location) {
        return board.boardArray[location[0]][location[1]] === -1
    }

    function isValid(location) { // Return true if the knight can move there
        if (notOB(location)) {
            return notVisited(location)
        }
        return false
    }

    function nextMoves(location){
        let nextMoves = []
        nextMoves.push([location[0] + 1, location[1] + 2])
        nextMoves.push([location[0] + 1, location[1] - 2])
        nextMoves.push([location[0] - 1, location[1] + 2])
        nextMoves.push([location[0] - 1, location[1] - 2])
        nextMoves.push([location[0] + 2, location[1] + 1])
        nextMoves.push([location[0] + 2, location[1] - 1])
        nextMoves.push([location[0] - 2, location[1] + 1])
        nextMoves.push([location[0] - 2, location[1] - 1])
        return nextMoves
    }

    function possibleMoves(location) {
        const moves = nextMoves(location)
        let possible = []
        for (let i = 0; i < moves.length; i++) {
            if (isValid(moves[i])) {
                possible.push(moves[i])
            }
        }
        return possible
    }

    function next() {
        /**
         * Based on Warnsdorff's Heuristics
         */
        const start = Math.floor(Math.random() * 8)
        let minIndex = -1
        let minDegree = 8
        const moves = nextMoves(currLoc)

        for (let i = 0; i < 8; i++) {
            const index = (start + i)%8
            let degree = 8
            if (isValid(moves[index])) {          
                degree = possibleMoves(moves[index]).length
            }
            // Pick using Warnsdorff's
            if (degree < minDegree) {
                minIndex = index
                minDegree = degree
            }
        }
        
        if (minIndex === -1) { // Fail or Success State
            return null
        } else {
            return moves[minIndex]
        }
    }

    function findTour() {
        let size = board.boardArray.length * board.boardArray[0].length
        let visitedCounter = 1
        board.boardArray[currLoc[0]][currLoc[1]] = 0
        board.visited.push([...currLoc])
        while (true) {
            let nextLoc = next() 
            if (nextLoc) { 
                currLoc[0] = nextLoc[0];
                currLoc[1] = nextLoc[1];
                board.visited.push([...currLoc])
                board.boardArray[currLoc[0]][currLoc[1]] = visitedCounter
                visitedCounter++
            } else {
                if (size === visitedCounter && isClosedTour() && isMergeable()) { // Success State, add && isClosedTour() to u know
                    console.log("Found tour")
                    return true
                } else { // Fail State    
                    board.boardArray.length = 0 // Reset Array    
                    board.visited.length = 0 // Reset visited 
                    // Reset information within 
                    for (let i = 0; i < board.width; i++) {
                        let column = []
                        for (let j = 0; j < board.height; j++) {
                            column.push(-1)
                        }
                        board.boardArray.push(column)
                    }
                    return false
                }
            }
        }
    }

    while (!findTour()) {
        // progress()
        console.log("Try again")
    }
    // progress()
}

let boardList = weirdPartition(99, 99, 0) // Doesnt work too well for non-squares

let boardSizes = boardList.map(board => {
    [board.width, board.height]
})

console.log(boardSizes)

// for (let board of boardList) {
//     knightsTour(board);
// }

// let merged = merge(boardList)
// for (let i = 0; i < merged.visited.length; i++) {
//     console.log(`${i}: [${merged.visited[i][0]}][${merged.visited[i][1]}]`)
// }
