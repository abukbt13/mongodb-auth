const express = require('express');
const bodyParser = require('body-parser');

require('./config/db.js');

const userRoute = require('./api/User');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Signup page was successful');
});

app.use('/user', userRoute);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
