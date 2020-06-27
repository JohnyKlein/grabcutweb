const express = require('express')
const app = express();
const port = 3000

app.use(express.static(__dirname + '/public'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/grabcut', (req, res) => res.sendFile(__dirname + '/index.htm'));