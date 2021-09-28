const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
    _id: {type:Number, required:true},
    nom: {type:String, required:true},
    prenom: { type: String, required: true},
    tel: { type: Number },
    email: { type: String, required: true },
    affiche :{ type: Boolean }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('particulier', UserSchema);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);