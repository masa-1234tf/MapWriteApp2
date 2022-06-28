//module
var express = require("express")
var session = require("express-session")
var http = require("http")
var mongoose = require("mongoose")
var socketIo = require("socket.io")

var app = express()
var server = http.Server(app);
var io = socketIo(server)
var Schema = mongoose.Schema
app.use(express.urlencoded({ extended: true }))

//.envFile
var port = process.env.PORT
var mongo_url = process.env.MONGODB_URI

//engine set up
app.set("view engine", "ejs")
app.use("/public", express.static("public"))

//Session
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie:{ maxAge: 60*60*1000 }   //session 1hour
}))

// Connecting to MongoDB
mongoose.connect(mongo_url)
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Failure: Unconnected to MongoDB")
    })

//Schema
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
//routes

//index page
app.get("/", (req, res) => {
    res.render("index", { user: req.session.user, session: req.session.userId })
})
//login
app.post("/", (req, res) => {
    UserModel.findOne({ name: req.body.name }, (err, savedUserData) => {
        if (savedUserData) {
            if (req.body.password === savedUserData.password) {
                req.session.userId = savedUserData._id //add session id
                req.session.user = savedUserData.name  //add session name
                res.redirect("/")
            }
        } else {
            res.send("NO")
        }
    })
})
//disconnect user
app.get("/disconnect", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})
//Socket.io
var draws = [];
io.sockets.on('connection', function (socket) {

    console.log("Connected Socket.io")

    if (draws.length > 0) {
        socket.emit('first send', draws);
    }
    
    socket.on('clear send', function () {
        socket.broadcast.emit('clear user');
        draws = [];
    });
    socket.on('server send', function (msg) {
        socket.broadcast.emit('send user', msg);
        draws.push(msg);
    });
    socket.on('disconnect', function () {
        io.sockets.emit('user disconnected');
    });
});
//connect
server.listen(port, () => {
    console.log('server listening. Port:' + port);
});