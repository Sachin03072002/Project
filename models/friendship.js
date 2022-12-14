const mongoose= require('mongoose');
const friendshipSchema= new mongoose.Schema({
    //the user who sent this request
    from_user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    // the user who accepted this request 
    to_user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
},{
    timestamps:true
});

const Friendship= mongoose.model('Friendship', friendshipSchema);
modeule.exports=Friendship;