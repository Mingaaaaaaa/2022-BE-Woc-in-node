const jwt = require("jsonwebtoken")

//加密的密钥
const secretKey = "Back_End_Woc"

//第二次可以用jwt.verify(req.body.token,secretKey,(err,decoded)=>{...})来验证token
//首次登陆后生成token
module.exports = {
    getToken: (userInfo, role) => {
        const token = jwt.sign(
            {  userInfo },   //加密的信息
            secretKey,//密钥
            { expiresIn: 60*60*24 }//token 的配置
        )
        return token
    },
    verifyToken: (token, secretKey) => {
        let res
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log("err", err);
                res = err
            }
            else {
                res = decoded
            }
        })
        return res
    }
}