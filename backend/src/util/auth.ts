const jwt = require('jsonwebtoken');

export interface JWTPayload {
    userId: number,
    accountId: number
}

export default {
    generate: (payload: JWTPayload) => {
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