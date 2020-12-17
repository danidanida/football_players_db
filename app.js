const express = require('express');
const app = express();
const ejs = require('ejs'); // templates 
const getHomePage = require('./routes/index');
const { addPlayerPage, addPlayer, editPlayerPage, editPlayer, deletePlayer } = require('./routes/player');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const port = 5070;

/* CONNECT TO DB */
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'fan',
    password: 'Goal123!',
    database: 'socka'
})

db.connect((err) => {
    if (err) {
        // console.log(err)
        throw err
    } else {
        console.log('DB connected')
    }
});
global.db = db;

/***** MIDDLEWARE */

app.set('views', __dirname + '/views'); // on znaet shto shablony zdes
app.set('view enjine', 'ejs')

app.use(express.static(__dirname + '/public'))  // реагирует на любой реквест 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // расшифровываем пост реквест в json

app.use(fileUpload());

app.get('/', getHomePage) // реагирует на метод GET
app.get('/add', addPlayerPage)
app.post('/add', addPlayer)
app.get('/edit/:id', editPlayerPage)
app.post('/edit/:id', editPlayer)
app.get('/delete/:id', deletePlayer)

app.listen(port);



// http://localhost:5070/?name=John */