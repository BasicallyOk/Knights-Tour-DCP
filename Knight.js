// const {merge} = require('./Board')
async function main() {
    const compute = require('dcp/compute');

    Number.prototype.mod = function (n) {
        return ((this % n) + n) % n;
    };
      
    function partition(width, height, parentIndex) {
        let boardList = []
        if (width % 4 === 0 && height % 4 === 0) {
            console.log(`perfect partition at index ${parentIndex}`)
            boardList = boardList.concat(perfectPartition(width, height, parentIndex)) 
        } else {
            console.log(`weird partition at index ${parentIndex}`)
            boardList = boardList.concat(weirdPartition(width, height, parentIndex))
        }
        return boardList
    }
    function perfectPartition(height, width, parentIndex) {
        let boardList = []
        if (!isSolvable(Math.floor(width/2), Math.floor(height/2))) {
            return [generateBoard(width, height, parentIndex)]
        }
        for (let i = 0; i < 4; i++) {
            boardList = boardList.concat(partition(height/2, width/2, parentIndex.concat(String(i))))
        }
        return boardList
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
        if (width > height) {
            width = width + height - width
            height = width + height - height
        }
        if (width < 3 || height < 3) {
            return false
        }

        if ((width < 5 && height < 6) || (width < 6 && height < 5)) {
            return false
        }

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
     * Return true if the size is of a minimum board that may contain a solution to the closed knight's tour
     * Will not necessarily return a closed knight's tour, must check using isSolvable
     */
    function minimumSolvable(width, height) {
        if (width >= 6 && height >= 6 && width <= 10 && height <= 10) {
            return true
        }
    }
    
    /**
     * The algorithm will attempt to find a partition that makes all 4 quadrants as small as possible and still solvable
     * Current algorithm is O(m x n). Maybe it can be faster?
     * @param {Number} width must be smaller or equal to height
     * @param {Number} height 
     */
    function weirdPartition(width, height, parentIndex) {
        // The size of the minimum solvable board using Divide & Conquer
        let i = 4
        let j = 6
        let iTurn = true
        let prevSolvable = null
        if (width % 2 === 1 && height % 2 === 1) {
            throw new Error(`weirdPartition was given an unsolvable board of size [${width}, ${height}]`)
        }
        if (minimumSolvable(width, height)) {
            if (isSolvable(width, height)) {
                console.log(`Minimum solvable of ${width}x${height} reached at index ${parentIndex}`)
                return [generateBoard(width, height, parentIndex)]
            }
            else {
                throw new Error(`weirdPartition was given an unsolvable board of size [${width}, ${height}]`)
            }
        }
        // This makes sure i and j dont go overboard
        while(i <= width / 2 || j <= height % 2) {
            if (i === Math.floor(width % 2)) {
                iTurn = false
            } else if (j === Math.floor(height % 2)) {
                iTurn = true
            }
    
            // Increment i and j in this manner until we get a good size
            if (iTurn) {
                i++
            } else {
                j++
            }
            iTurn = !iTurn
            // If all quadrants are solvable, replace prevSolvable
            if (isSolvable(i, j) && isSolvable(width - i, j) && isSolvable(i, height - j) && isSolvable(width - i, height - j)) { 
                console.log(`prevSolvable updated to [${i}, ${j}] at index ${parentIndex}`)
                prevSolvable = [i, j] 
            }
        }
    
        if (prevSolvable === null) {
            if (isSolvable(width, height)) {
                console.log(`No smaller solvable block, generating for ${width}x${height} at index ${parentIndex}`)
                return [generateBoard(width, height, parentIndex)]
            } else {
                throw new Error(`weirdPartition was given an unsolvable and un-partition-able board of size [${width}, ${height}]`)
            }
        }

        i = prevSolvable[0]
        j = prevSolvable[1]
        console.log(`Size of partition: [${i}, ${j}]`)
    
        return partition(i, j, parentIndex.concat('0')).concat(partition(width - i, j, parentIndex.concat('1')), partition(width - i, height - j, parentIndex.concat('3')), partition(i, height - j, parentIndex.concat('2')))
    }
    
    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    /**
     * Merge wrapper, will only work for groups of 4
     * @param {Array} boardList - The list of solved boards to be merged 
     * @returns A completely merged board
     */
    function merge(boardList){
        if (boardList.length === 4) {
            return merge4(boardList)
        }
        let mergedBoardList = []
        while (boardList.length !== 0) {
            mergedBoardList.push(merge(boardList.splice(0, 4)));
        }
        return merge(mergedBoardList)
    }

    /**
     * Merge 4 boards into 1
     * @param {Array<Object>} boardList - A list of 4 mergeable boards to be merged into 1
     */
     function merge4(boardList){
        if (boardList.length === 1) { // Should not be anything other than 1 or 4
            console.log("Only one board given, skipping merge")
            return boardList[0]
        }
    
        console.log('Attempting to merge')
    
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
                    endMoveNum = boardList[0].boardArray[boardList[0].width-1][boardList[0].height-2]
                    startMoveNum = boardList[0].boardArray[boardList[0].width-3][boardList[0].height-1]
                    break
                case 1:
                    diffWidth = boardList[0].width // 1 is top right 
                    startMoveNum = boardList[1].boardArray[1][boardList[1].height-3]
                    endMoveNum = boardList[1].boardArray[0][boardList[1].height-1]
                    break
                case 2:
                    diffWidth = boardList[3].width // allow for non-rectangular solutions
                    diffHeight = boardList[1].height // allow for weird partitions
                    startMoveNum = boardList[2].boardArray[2][0]
                    endMoveNum = boardList[2].boardArray[0][1]
                    break
                case 3:
                    diffHeight = boardList[0].height
                    startMoveNum = boardList[3].boardArray[boardList[3].width -2][2]
                    endMoveNum = boardList[3].boardArray[boardList[3].width -1][0]
                    break
            }
            let directionSwitch = mod((startMoveNum+1), (board.width*board.height)) === endMoveNum
    
            for (let i = 0; i < board.width * board.height; i++) {
                let k = i
                if (directionSwitch) {
                    k = -i
                }
                let loc = board.visited[mod((k + startMoveNum), (board.width * board.height))];
                mergedBoard.visited.push([loc[0] + diffWidth, loc[1] + diffHeight])
            }
    
            tempStart = endMoveNum; // Update tempstart
        }
        return mergedBoard
    }
    
    async function knightsTour(board){
        progress();
        // import Board from './Board';
        // Starting location does not matter since we're looking for a closed undirected tour
        let currLoc = [0, 0]
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
            progress()
            console.log("Try again")
        }
        progress()
        return board
    }

    /* INPUT SET */
    let startTime = Date.now()
    const inputSet = partition(100, 100, '0');
    console.log(inputSet.map(board => [board.width, board.height]))

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
        console.log(` - Received result ${ev.index}`);
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
    console.log(`Time elapsed: ${Date.now() - startTime}`)

    console.log(resultSet.map(result => result.index));
    
    const newBoard = merge(resultSet)

    console.log(' - Job Complete');
    //console.log(resultSet[0]);

    //return newBoard
    return newBoard.visited

    // const mergedBoard = merge(newBoard);
    // console.log(mergedBoard)
}

module.exports = main

