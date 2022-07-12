//module
var express = require("express")
var session = require("express-session")
var http = require("http")
var mongoose = require("mongoose")
var socketIo = require("socket.io")
var favicon = require("serve-favicon")
var path = require("path")
var routers = require("./routes")

var app = express()
var server = http.Server(app);
var io = socketIo(server)
var Schema = mongoose.Schema
var sessionMiddleware = app.session
app.use(express.urlencoded({ extended: true }))

//.envFile
var port = process.env.PORT
var mongo_url = process.env.MONGODB_URI
//favicon
app.use(favicon(path.join(__dirname, './public/image', 'favicon.ico')))
//engine set up
app.set("view engine", "ejs")
app.use("/public", express.static("public"))

//Session
var sessionMiddleware = session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie:{ maxAge: 24*60*60*1000 }   //session 3hour
})
app.session = sessionMiddleware;
app.use(sessionMiddleware);

// Connecting to MongoDB
mongoose.connect(mongo_url)
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Failure: Unconnected to MongoDB")
    })

//Schema
//Schema Model
var UserModel = require("./models/user")
//routes
app.use(routers)
//index page
//login
var userName = []
app.post("/login", (req, res) => {
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
})
//disconnect user
//Socket.io
//send session data 
io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
})
var draws = []
io.sockets.on('connection', function (socket) {

    userName.name = socket.request.session.username
    console.log("socket.io connected user name:" + userName[0])

    if (draws.length > 0) {
        socket.emit('first send', draws);
    }
        
    socket.on('clear send', () => {
        socket.broadcast.emit('clear user');
        draws = [];
    })
    socket.on('server send', (msg) => {
        socket.broadcast.emit('send user', msg);
        draws.push(msg);
    })
    socket.on('disconnect', () => {
        io.sockets.emit('user disconnected');
    })
})



//connect
server.listen(port, () => {
    console.log('server listening. Port:' + port);
});