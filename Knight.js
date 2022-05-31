const {merge} = require('./Board')
async function main() {
    const compute = require('dcp/compute');

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
                visited: [[5, 5]]
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

    async function knightsTour(board){
        progress();
        // import Board from './Board';
        // Starting location does not matter since we're looking for a closed undirected tour
        let currLoc = [...board.visited[0]]
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
        let start = currLoc
    
        /**
         * Check if the tour is a closed tour
         * @returns true if the last location and the starting location can be connected
         */
        function isClosedTour() {
            return (
                (Math.abs(currLoc[0] - 2) === 2 && Math.abs(currLoc[1] - 2) === 1) ||
                (Math.abs(currLoc[0] - 2) === 1 && Math.abs(currLoc[1] - 2) === 2)      
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
    
        function findTour(array, currLoc) {
            let size = array.length * array[0].length
            let visitedCounter = 1
            array[currLoc[0]][currLoc[1]] = 0
            while (true) {
                let nextLoc = next()
                board.visited.push(nextLoc)
                if (nextLoc) {
                    currLoc[0] = nextLoc[0];
                    currLoc[1] = nextLoc[1];
                    array[currLoc[0]][currLoc[1]] = visitedCounter
                    visitedCounter++
                } else {
                    if (size === visitedCounter && isClosedTour() && isMergeable()) { // Success State, add && isClosedTour() to u know
                        console.log("Found tour")
                        return true
                    } else { // Fail State    
                        board.boardArray.length = 0 // Reset Array      
                        for (let i = 0; i < board.width; i++) {
                            let column = []
                            for (let j = 0; j < board.height; j++) {
                                column.push(-1)
                            }
                            board.boardArray.push(column)
                        }
                        currLoc = start // Reset Location
                        return false
                    }
                }
            }
        }
    
        while (!findTour(board.boardArray, currLoc)) {
            progress()
            console.log("Try again")
        }
        progress()
    }

    /* INPUT SET */
    const inputSet = partition(8, 8);

    const job = compute.for(inputSet, knightsTour);

    job.public.name = 'knights-tour-dcp';

    // SKIP IF: you do not need a compute group
    // job.computeGroups = [{ joinKey: 'KEY', joinSecret: 'SECRET' }];
    job.computeGroups = [{ joinKey: "aitf", joinSecret: "9YDEXdihud" }];


    // Not mandatory console logs for status updates
    job.on('accepted', () => {
        console.log(` - Job accepted with id: ${job.id}`);
    });
    job.on('result', (ev) => {
        console.log(` - Received result ${ev}`);
    });
    job.on("status", (ev) => {
        console.log("Got status update: ", ev);
    });
    job.on("complete", (ev) => {
        console.log("got complete");
    });
    job.on("readystatechange", (arg) => {
        console.log(`new ready state: ${arg}`);
    });
    job.on("error", (err) => {
        console.error(`Error: ${JSON.stringify(err)}`);
    });

    /* PROCESS RESULTS */
    let resultSet = await job.exec();
    resultSet = Array.from(resultSet);
    resultSet = [].slice.call(resultSet[0])
    const newBoard = [...resultSet, ...resultSet, ...resultSet, ...resultSet]
    console.log(' - Job Complete');
    // console.log(newBoard);

    return newBoard

    // const mergedBoard = merge(newBoard);
    // console.log(mergedBoard)
}

module.exports = main

