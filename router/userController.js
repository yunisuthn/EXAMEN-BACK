const account = require('../controllers/lib');

module.exports = function (app) {
    app.post('/login',account.login)
    .post('/signup',account.signup)

    .post('/particulier',account.createPart)
    .get('/particulier',account.getPart)


    .post('/article', account.createArt)
    .get('/article', account.findArt)
    .post('/autoIncr/:noteId', account.auto)
    .get('/article/:profilId', account.findOneArt)
    .post('/article/:noteId', account.update)
    // .delete('/article/:noteId', account.delete)
    .get('/userArticle/:noteId', account.findUserArt)
    .get('/photos/:photo_profil', account.lireImage)
    .post('/activer/:noteId', account.activer)
}