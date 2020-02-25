import jwt from "jsonwebtoken";
const fs = require('fs');
const path = require('path');
const public_key = fs.readFileSync(path.resolve(__basedir, 'jwtRS256.key.pub'));
const models = require('../orm');

exports.apiAccess = async (req, res, next) => {
    if(req.headers.authorization){
        let token = req.headers.authorization.split(' ')[1];
        try{
            let decrypted = jwt.verify(token, public_key, { algorithm: 'RS256'});
            req.api_user = await models.users.findByPk(decrypted.id);
            if(req.api_user.is_admin != 1){
                return res.status(401).json({error:'forbidden'});
            }
            next();
        } catch (e) {
            return res.status(401).json({error:'invalid token'})
        }
    } else {
        return res.status(401).json({error:'no token'})
    }

};
