var UserModel = require("../models/user")
var userName = []
module.exports = userName
module.exports = (req, res) => {
    UserModel.findOne({ name: req.body.name }, (err, savedUserData) => {
        if (savedUserData) {
            if (req.body.password === savedUserData.password) {
                req.session.userId = savedUserData._id //add session id
                req.session.user = savedUserData.name  //add session name
                userName.push(req.session.user)
                res.redirect("/")
            }
        } else {
            res.send("NO")
        }
    })
}


