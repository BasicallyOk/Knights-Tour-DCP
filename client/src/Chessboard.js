import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Chessboard = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('/dcp').then(response => setData(response.data))
    }, [])

    useEffect(() => {
        const position = {}
        const squareSize = 50;
        // position of board's top left
        const boardTopx = 0;
        const boardTopy = 0;
        let canvas = document.getElementById("canvasChessboard");
        let context = canvas.getContext("2d");

        canvas.width  = 5000;
        canvas.height = 5000;

        for(let i=0; i<100; i++) {
            for(let j=0; j<100; j++) {
                context.fillStyle = ((i+j)%2===0) ? "white":"black";
                let xOffset = boardTopx + j*squareSize;
                let yOffset = boardTopy + i*squareSize;
                context.fillRect(xOffset, yOffset, squareSize, squareSize);
            }
        }
        // draw the border around the chessboard
        context.strokeStyle = "black";
        context.strokeRect(boardTopx, boardTopy, squareSize*8, squareSize*8)

        context.strokeStyle = 'red';
        context.lineWidth = 2;

        
        for(let i=0; i<100; i++) {
            for(let j=0; j<100; j++) {
                let xOffset = boardTopx + j*squareSize + 25;
                let yOffset = boardTopy + i*squareSize + 25;
                
                let pos = `${i},${j}`;
                position[pos] = [xOffset, yOffset]
            }
        }

        if (data.length > 0) {
            for (let i=1; i<data.length; i++) {
                context.beginPath();
                context.moveTo(position[`${data[i-1][0]},${data[i-1][1]}`][0], position[`${data[i-1][0]},${data[i-1][1]}`][1]);
                context.lineTo(position[`${data[i][0]},${data[i][1]}`][0], position[`${data[i][0]},${data[i][1]}`][1]);
                context.stroke();
            }
        }
    }, [data]);

    

    return (
        <>
            <canvas id="canvasChessboard" >

            </canvas>
        </>
    );
}

export default Chessboard;