const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
     "OPTIONS, POST, GET, PUT, PATCH, DELETE");
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.post('/save-calculation', (req, res) => {
    console.log('req is', req.body);
});

app.listen(port, () => {
    console.log('dirname', __dirname);
    console.log('Server is up on port ' + port)
});