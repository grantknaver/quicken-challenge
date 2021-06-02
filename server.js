const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
     "OPTIONS, POST, GET, PUT, PATCH, DELETE");
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let lastSubmissionData = [];
app.post('/save-calculation', (req, res) => {
    console.log('req.body', req.body);
    lastSubmissionData = req.body;
    res.send({message: 'Calculation Saved'});
});

app.get('/get-calculation', (req, res) => {
    res.send(lastSubmissionData);
});

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});