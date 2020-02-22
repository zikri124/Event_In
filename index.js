const express = require('express')
const app = express()
const port = 5006
const router = require('./router')

app.listen(port, () => {
    console.log("Listen to", port)
})

app.use(express.json())

app.use('/', router)