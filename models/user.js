var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

var UserModel = mongoose.model("mapappusers", UserSchema)

module.exports = UserModel
