    // import Board from './Board';
    let currLoc = [5, 5]
    const board = {
        boardArray: [],   
        width: 8,
        height: 8,
    }

    for (let i = 0; i < board.width; i++) {
        let column = []
        for (let j = 0; j < board.height; j++) {
            column.push(-1)
        }
        board.boardArray.push(column)
    }

    /*
    Partition the board into smaller one to distribute to dcp workers
    */
    let partedWidth = board.width, partedHeight = board.height
    while (partedWidth > 5 && partedHeight > 5) {
        partedHeight /= 2
        partedWidth /= 2
    }

    partedHeight *= 2
    partedWidth *= 2

    /* WORK FUNCTION */
    // async function workFn(array, currLoc) {
        let arrayCopy = [...board.boardArray];
        let start = currLoc

        function isValid (location) {
            return location[0] < board.boardArray.length && location[1] < board.boardArray[0].length
        }

        function notVisited(location) {
            return board.boardArray[location[0]][location[1]] === -1
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
            let possibleMoves = []
            for (let i = 0; i < moves.length; i++) {
                if (isValid(moves[i]) && notVisited(moves[i])) {
                    possibleMoves.push(moves[i])
                }
            }
            return possibleMoves
        }

        function next() {
            /**
             * Based on Warnsdorff's Heuristics
             */
            const start = Math.floor(Math.random() * 8)
            let minIndex = -1
            let minDegree = 9
            const moves = nextMoves(currLoc)

            for (let i = 0; i < moves.length; i++) {
                const index = (start + i)%8
                let degree
                if (!isValid(moves[index])) {
                    continue
                } else if (!notVisited(moves[index])) {
                    continue
                } else {
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
                if (nextLoc) {
                    currLoc = nextLoc
                    array[currLoc[0]][currLoc[1]] = visitedCounter
                    visitedCounter++
                } else {
                    if (size === visitedCounter) { // Success State
                        console.log("Found tour")
                        return true
                    } else { // Fail State          
                        array = arrayCopy // Reset array
                        currLoc = start // Reset Location
                        return false
                    }
                }
            }
        }

        while (!findTour(board.boardArray, currLoc)) {
            console.log("Try again")
        }

        console.log("Board Solved")
        console.log(board.boardArray);

        // return board.boardArray;
    // }
    /* INPUT SET */
    // const inputSet = [board.Board];

    // const job = compute.for(inputSet, workFn, [[5, 5]]);

    // job.public.name = 'knights-tour-dcp';

    // // SKIP IF: you do not need a compute group
    // // job.computeGroups = [{ joinKey: 'KEY', joinSecret: 'SECRET' }];
    // job.computeGroups = [{ joinKey: "aitf", joinSecret: "9YDEXdihud" }];


    // // Not mandatory console logs for status updates
    // job.on('accepted', () => {
    // console.log(` - Job accepted with id: ${job.id}`);
    // });
    // job.on('result', (ev) => {
    // console.log(` - Received result ${ev}`);
    // });
    // job.on("status", (ev) => {
    //     console.log("Got status update: ", ev);
    // });
    // job.on("complete", (ev) => {
    //     console.log("got complete");
    // });
    // job.on("readystatechange", (arg) => {
    //     console.log(`new ready state: ${arg}`);
    // });
    // job.on("error", (err) => {
    //     console.error(`Error: ${JSON.stringify(err)}`);
    // });

    // /* PROCESS RESULTS */
    // let resultSet = await job.exec();
    // resultSet = Array.from(resultSet);
    // // console.log(resultSet.toString().replace(',', ''));
    // console.log(' - Job Complete');