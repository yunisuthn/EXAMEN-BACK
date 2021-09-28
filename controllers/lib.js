const User = require('../schema/schemaUser.js');
const Particulier = require('../schema/particulier.js');
const Atelier = require('../schema/atelier.js');
const passwordHash = require("password-hash");

var front = []
const fs = require("fs");
exports.signup = (req, res) => {
    if (!req.body.nom || !req.body.prenom || !req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        User.find()
            .then(users => {
                //res.send(notes);//autoincrement
                var idautom
                if (users.length == 0) {
                    idautom = 0
                } else {
                    idautom = parseInt(users[users.length - 1]._id) + 1
                }
                console.log('user==', idautom);

                var user = {
                    _id: idautom,
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    specialite: req.body.specialite,
                    password: passwordHash.generate(req.body.password)
                }
                var findUser = new Promise(function (resolve, reject) {
                    User.findOne({
                        email: user.email
                    }, function (err, result) {
                        if (err) {
                            //reject(500);
                            res.status(500).json({
                                "text": "Erreur interne"
                            })
                        } else {
                            if (result) {
                                reject(204)
                            } else {
                                resolve(true)
                            }
                        }
                    })
                })

                findUser.then(function () {
                    var _u = new User(user);
                    _u.save(function (err, user) {
                        if (err) {
                            res.status(500).json({
                                "text": "Erreur interne"
                            })
                        } else {
                            res.status(200).json({
                                "text": "Succès",
                                "token": user.getToken(),
                                "id": user._id
                            })
                        }
                    })
                }, function (error) {
                    switch (error) {
                        case 500:
                            res.status(500).json({
                                "text": "Erreur interne"
                            })
                            break;
                        case 204:
                            res.status(204).json({
                                "text": "L'adresse email existe déjà"
                            })
                            break;
                        default:
                            res.status(500).json({
                                "text": "Erreur interne"
                            })
                    }
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'some error'
                });
            });
    }
}


exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        User.findOne({
            email: req.body.email
        }, function (err, user) {

            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            } else if (!user) {
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            } else {
                if (user.authenticate(req.body.password)) {
                    console.log('front  ==== ', front);

                    res.status(200).json({
                        "token": user.getToken(),
                        "text": "Authentification réussi",
                        'id': user._id
                    })
                } else {
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
}

exports.createPart = (req, res) => {
    if (!req.body.nom || !req.body.prenom || !req.body.email) {
        console.log('console.log 1 ' + req.file);

        console.log('console.log 2 ' + req.body.nom);


        return res.status(400).send({
            message: "profil content can not be empty"

        });
    }

    Particulier.find()
        .then(user => {
            //autoincrement
            let idautom;
            if (user.length == 0) {
                idautom = 0
            } else {
                idautom = parseInt(user[user.length - 1]._id) + 1
            }

            // //images
            const profil = new Particulier({

                _id: idautom,
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                tel: req.body.tel

            });

            var findUser = new Promise(function (resolve, reject) {
                Particulier.findOne({
                    email: profil.email
                }, function (err, result) {
                    if (err) {
                        //reject(500);
                        res.status(500).json({
                            "text": "Erreur interne"
                        })
                    } else {
                        if (result) {
                            reject(204)
                        } else {
                            resolve(true)
                        }
                    }
                })
            })

            findUser.then(function () {
                profil.save()
                    .then(() => {
                        Particulier.find()
                            .then(data => {
                                res.send(data);
                                
                            })
                    }).catch(err => {
                        res.status(200).send({
                            message: err.message || "Something wrong while creating the profil."

                        });
                    });
            })
        })
        .catch(
            err => {
            res.status(200).send({
                message: err.message || "Something wrong while creating the profil."

            });
        }
        )
};

exports.getPart = (req, res) => {
    Particulier.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'some error'
            });
        });
};


exports.createArt = (req, res) => {
    if (!req.body.titre || !req.body.prix) {
        console.log('console.log 1 ' + req.file);

        console.log('console.log 2 ' + req.body.titre);


        return res.status(400).send({
            message: "profil content can not be empty"

        });
    }

    Atelier.find()
        .then(user => {
            //autoincrement
            let idautom;
            if (user.length == 0) {
                idautom = 0
            } else {
                idautom = parseInt(user[user.length - 1]._id) + 1
            }

            // //images
            let imageFile = req.files.photo_profil;
            console.log('inona ny ato o!' + imageFile)
            let nomImage = idautom
            res.setHeader('Content-Type', 'text/plain');

            imageFile.mv(`${__dirname}/public/${nomImage}.jpg`, function (err) {
                if (err) {
                    return res.status(200).send(err);
                }
            });
            const profil = new Atelier({

                _id: idautom,
                user: req.body.user,
                titre: req.body.titre,
                description: req.body.description,
                date: req.body.date,

                debut: req.body.debut,
                duree: req.body.duree,
                placedispo: req.body.placedispo,
                placeres: req.body.placeres,
                affiche: true,
                prix: req.body.prix,
                photo_profil: '' + nomImage + '.jpg'
            });

            profil.save()
                .then(() => {
                    Atelier.find()
                        .then(data => {
                            res.send(data);
                            console.log('data==== ', data);

                        })
                }).catch(err => {
                    res.status(200).send({
                        message: err.message || "Something wrong while creating the profil."

                    });
                });
        })
};

exports.findArt = (req, res) => {
    Atelier.find()
        .then(notes => {
            for (let i = 0; i < notes.length; i++) {
                if(notes[i].affiche == true){
                    res.send(notes);
                    console.log("notes == ",notes[i].affiche);                   
                }
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'some error'
            });
        });
};

exports.findOneArt = (req, res) => {
    Atelier.findById(req.params.profilId)
        .then(profilchoix => {
            if (!profilchoix) {
                return res.status(404).send({
                    message: "profil not found with id" + req.params.profilId
                });
            }
            else {
                res.send(profilchoix);
            }


        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "profil not found with id " + req.params.profilId
                });
            }
            return res.status(500).send({
                message: "Something wrong retrieving profil with id " + req.params.profilId
            });
        });
};

exports.update = (req, res) => {
    // Validate Request
    if (!req.body.titre) {
        return res.status(400).send({
            message: "article content can not be empty"
        });
    }
    // Find note and update it with the request body
    Atelier.findByIdAndUpdate(req.params.noteId, {
        titre: req.body.titre || "Untitled Note",
        description: req.body.description,
        date: req.body.date,
        debut: req.body.debut,
        duree: req.body.duree,
        placedispo: req.body.placedispo,
        placeres: req.body.placeres,
        prix: req.body.prix
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
}

exports.findUserArt = (req, res) => {
    var data = []
    Atelier.find()
        .then(notes => {
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].user == req.params.noteId) {
                    data.push(notes[i]);
                }
            }
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'some error'
            });
        });
};

exports.lireImage = (req, res) => {
    try {
        let picture = fs.readFileSync('./controllers/public/' + req.params.photo_profil)
        console.log('req.params.photo_profil', req.params.photo_profil);

        res.write(picture)
        res.end()
    } catch (e) {
        console.log("erreur be miitsy", e.stack);
    }
}

exports.auto = (req, res) => {

    // Find note and update it with the request body
   
    Atelier.find()
        .then(notes => {
            
            for (let i = 0; i < notes.length; i++) {
                if (req.params.noteId == notes[i]._id) {
                    notes[i].placeres = notes[i].placeres + 1;
                    //res.send(notes);

                    Atelier.findByIdAndUpdate(req.params.noteId, {
                        placeres: notes[i].placeres
                    }, { new: true })
                        .then(note => {
                            if (!note) {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            res.send(note);
                        }).catch(err => {
                            if (err.kind === 'ObjectId') {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            return res.status(500).send({
                                message: "Error updating note with id " + req.params.noteId
                            });
                        });
                }
                
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'some error'
            });
        });
} 

exports.activer = (req, res) => {

    // Find note and update it with the request body
   
    Atelier.find()
        .then(notes => {
            
            for (let i = 0; i < notes.length; i++) {
                if(notes[i].affiche == true){
                    notes[i].affiche = false;
                    //res.send(notes);
                    console.log("notes == ",notes[i].affiche);  
                    
                    Atelier.findByIdAndUpdate(req.params.noteId, {
                        affiche: notes[i].affiche
                    }, { new: true })
                        .then(note => {
                            if (!note) {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            res.send(note);
                        }).catch(err => {
                            if (err.kind === 'ObjectId') {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            return res.status(500).send({
                                message: "Error updating note with id " + req.params.noteId
                            });
                        });

                }else{
                    notes[i].affiche = true;
                    
                    Atelier.findByIdAndUpdate(req.params.noteId, {
                        affiche: notes[i].affiche
                    }, { new: true })
                        .then(note => {
                            if (!note) {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            res.send(note);
                        }).catch(err => {
                            if (err.kind === 'ObjectId') {
                                return res.status(404).send({
                                    message: "Note not found with id " + req.params.noteId
                                });
                            }
                            return res.status(500).send({
                                message: "Error updating note with id " + req.params.noteId
                            });
                        });
                }
                if (req.params.noteId == notes[i]._id) {
                    notes[i].placeres = notes[i].placeres + 1;
                    //res.send(notes);

                    
                }
                
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'some error'
            });
        });
} 