const express = require('express')
const app = express()
const path = require('path')
const port = 8080

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
//   response.send('Hello from Express!')
    response.sendFile('index.html');
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})