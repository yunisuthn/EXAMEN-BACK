const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
    _id: {type:Number, required:true},
    user: {type:Number, required:true},
    titre: { type: String, required: true},
    description: { type: String, required: true },
    date: { type: Date, required: true},

    debut: { type: Number, required: true},
    duree: { type: Number, required: true },
    placedispo: { type: Number, required: true },
    placeres: { type: Number, required: true },

    prix: { type: Number, required: true },
    affiche :{type: Boolean},
    photo_profil:String

},
{
    timestamps: true
}
);

module.exports = mongoose.model('atelier', UserSchema);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);