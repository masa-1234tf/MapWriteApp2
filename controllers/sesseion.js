module.exports = (req, res) => {
    res.render("index", { user: req.session.user, session: req.session.userId })
}