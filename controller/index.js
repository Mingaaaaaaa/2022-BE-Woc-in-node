//写对应的方法。链接接口层和数据库
const db = require('../model')

login = (req, res) => {
    console.log("login")
    db.login(req.body, res)
}
add = (req, res) => {
    console.log("add")
    db.add(req.body, req, res)
}
Delete = (req, res) => {
    console.log("delete")
    db.Delete(req.body.id, req, res)
}
update = (req, res) => {
    console.log("login")
    db.update(req.body, req, res)
}
find = (req, res) => {
    db.find(Number(req.query.name), req, res)
}
logout = (req, res) => {
    console.log("login")
    res.send(" a sucessfully!")
}
module.exports = { login, add, Delete, update, find, logout }