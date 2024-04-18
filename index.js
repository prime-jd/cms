
require('dotenv').config()
const express = require('express')  
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
app.get('/twitter', (req, res) => {
    res.send('Hello Twitter!')
})
app.get('/github', (req, res) => {res.send('Hello Github!')})