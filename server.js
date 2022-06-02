const express = require('express')
const PORT = 5000
const app = express()
const main = require('./Knight')

app.get('/dcp', async (req, res) => {
    try {
        const board = await require('dcp-client').init('https://scheduler.distributed.computer').then(main)
        res.send(board)
        
    } catch (error) {
        console.log(error)
    }
})

app.get('/test', (req, res) => {
    res.send({message: 'api endpoint found!'})
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))