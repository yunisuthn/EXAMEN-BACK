const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8081;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const route = require('./router/userController');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(express.static("./view"))



var router = express.Router();
app.use('/', router);
require(__dirname + '/router/userController')(router);

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Profil app"});
});
// app.get('/', (req, res) => {
//     res.json({"message": "Welcome to Profil app"});
// });
// app.use('/', route);
app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});