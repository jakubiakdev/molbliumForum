const jwt = require('jsonwebtoken');

interface payload {
    userId: number,
    email: string
}

export default {
    generate: (payload: payload) => {
        return jwt.sign(payload, process.env.jwtsecret, { expiresIn: '1h' });
    },
    verify: (authHeader: string, decode: boolean = false) => {
        const token = authHeader && authHeader.split(' ')[1]
        if(decode) {
            let decode
            jwt.verify(token, process.env.jwtsecret, (err: any, dec: any) => {
                if(err) {
                    throw err
                }
                decode = dec
            })
            return decode
        } else {            
            return jwt.verify(token, process.env.jwtsecret);
        }
    },
}