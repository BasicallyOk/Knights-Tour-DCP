const axios = require("axios")

const getData = async () => {
    try { 
        const res = await axios.get('http://localhost:5000/');
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

getData()


