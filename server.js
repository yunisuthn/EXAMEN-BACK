//Définition des modules
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const methodOverride = require('method-override')
const mongoose = require("mongoose");


//On définit notre objet express nommé app
const fileUpload = require('express-fileupload');
//Connexion à la base de donnée
app.use(methodOverride('X-HTTP-Method')) 
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('X-Method-Override'))
app.use(methodOverride('_method'))
app.use(cors())
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

/*mongoose.connect('mongodb://localhost/exam').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});*/ 

mongoose.connect('mongodb+srv://ony:sayna123456@cluster0-lwzb3.mongodb.net/test?retryWrites=true&w=majority').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

//Body Parser     mongodb+srv://ony:<password>@cluster0-lwzb3.mongodb.net/test?retryWrites=true&w=majority
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);

app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Définition du routeur
var router = express.Router();
app.use('/', router);
require(__dirname + '/router/userController')(router);

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Profil app"});
});
//Définition et mise en place du port d'écoute
var port = 8081;
app.listen(port, () => console.log(`Listening on port ${port}`));