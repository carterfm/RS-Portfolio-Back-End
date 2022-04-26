const express = require ('express');
const db = require('./config/connection');
const routes = require('./controllers');
// This is a necessary bit of middleware to allow our frontend to access this api
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(routes);
app.use(cors());

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    })
})