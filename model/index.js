const { token } = require("morgan")
const mysql = require("mysql")
const { getToken, verifyToken } = require('./jwt')
const secretKey = "Back_End_Woc"
//链接数据库
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_db_01'
})
db.query('show tables', (err, mes) => {
    if (err) console.log(err.message)
    console.log(mes)
})

let loginCmd = 'select * from user where user_name = ?'
//user={user_name:'',password:'',email:''}
login = (user, res) => {
    console.log(user);
    db.query(loginCmd, user.user_name, (err, mes) => {
        if (err) {
            console.log("err:");
            console.log(err.message)
            res.send("出了点问题~~~")
        }
        console.log(mes);
        if (mes.length !== 0) {
            if (user.password !== mes[0].password) {
                console.log('密码不对哇');
                res.json({ success: false, errMsg: '登陆失败,请检查密码是否正确！' })
            } else {
                console.log("登陆成功");
                //发token
                user.role = mes[0].role
                let token = getToken(user)
                res.json({ success: true, data: '登陆成功', token: token, role: mes[0].role })
            }
        }
        else res.send("请检查密码是否正确！")
    })
}

let addCmd = 'insert into user set ?'
//user={user_name:'',password:'',email:''}
//管理员加人
add = (user, req, res) => {
    //根据token 判断是否可以加人
    let adminInfo = verifyToken(req.headers.token, secretKey)
    console.log('tokenInfo', adminInfo);
    let userInfo = adminInfo.userInfo
    if (userInfo) {
        if (userInfo.role) {
            //查询用户是否存在
            db.query(loginCmd, user.user_name, (err, mes) => {
                console.log('mes', Object.keys(mes));
                if (mes.length !== 0) {
                    res.send('该用户已存在')
                    console.log(mes);
                }
                else {
                    db.query(addCmd, user, (err, mes) => {
                        if (err) res.send(err.message)
                        if (mes) res.send(userInfo.user_name + "    add sucessfully!\n")
                    })
                }
            })
        }
        else res.send("您权限暂时不够捏")
    }
    else res.send("身份认证失效")
}

let deleteCmd = 'delete from user where id= ?'
//user={user_name:'',password:'',email:''}
//根据token 判断是否可以加人
Delete = (userId, req, res) => {
    let adminInfo = verifyToken(req.headers.token, secretKey)
    let userInfo = adminInfo.userInfo
    if (userInfo) {
        if (userInfo.role) {
            db.query(deleteCmd, userId, (err, mes) => {
                if (err) res.send('删除失败')
                if (mes) res.send(userInfo.user_name + " delete sucessfully!")
            })
        }
        else res.send("您权限暂时不够捏")
    }
    else res.send("身份认证失效")
}

let updateCmd = 'update user set ? where id= ?;'
//user={user_name:'',password:'',email:''}
//根据token 判断是否可以加人
update = (user, req, res) => {
    let adminInfo = verifyToken(req.headers.token, secretKey)
    console.log(adminInfo);
    let userInfo = adminInfo.userInfo
    if (userInfo) {
        if (adminInfo.userInfo.role == 1) {
            db.query(updateCmd, [user, user.id], (err, mes) => {
                if (err) res.send(err.message)
                if (mes) res.send(userInfo.user_name + " update sucessfully!\n")
            })
        }
        else res.send("您权限暂时不够捏")
    }
    else res.send("出了点问题喵~，请联系管理员")
}

let findCmd = 'select * from user where user_name= ?'
//user={user_name:'',password:'',email:''}
find = (name, req, res) => {
    let adminInfo = verifyToken(req.headers.token, secretKey)
    if (adminInfo.userInfo) {
        if (adminInfo.userInfo.role == 1) {
            db.query(findCmd, name, (err, mes) => {
                if (err) res.send(err.message)
                if (mes)
                    res.json({ success: true, msg: '查询成功', data: mes[0] })
            })
        }
        else res.send("您权限暂时不够捏")
    }
    else res.send("出了点问题喵~，请联系管理员")
}

module.exports = { add, Delete, login, find, update }