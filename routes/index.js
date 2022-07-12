var router = require("express").Router()

var Session = require("../controllers/sesseion")
var Login = require("../controllers/login")
var Disconnect = require("../controllers/disconnect")

router.get("/", Session)
router.post("/login", Login)
router.get("/disconnect", Disconnect)

module.exports = router