import mongoose from "mongoose";
const {Schema, model} = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        require: true
    },
    bio: String,
    surname: String,
    nick: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    role:{
        type: String,
        default:"role_user"
    },
    password:{
        type: String,
        require: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at:{
        type:Date,
        default: Date.now
    }
});

export default model("User",userSchema,);