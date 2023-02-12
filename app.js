const PORT = 3000;

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hi');
});

app.listen(PORT, () => {
    console.log('Server Listening on PORT', PORT);
});