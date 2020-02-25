const express = require("express");
const router = express.Router();
import jwt from 'jsonwebtoken'
const service = require('../../services/authService');
const fs = require('fs');
const path = require('path');

const private_key = fs.readFileSync(path.resolve(__basedir, 'jwtRS256.key'));
const public_key = fs.readFileSync(path.resolve(__basedir, 'jwtRS256.key.pub'));



router.post('/login', async function(req,res){

    console.log(private_key);
    console.log([req.body.login, req.body.password]);
    let user = await service.loadUserByCredentials(req.body.username, req.body.password);
    if(!user){
        return res.status(422).json({error:"Неверные данные"});
    } else {
        if(user.is_admin != 1) return res.status(401).json({error:"Неверные данные"});
        let token = jwt.sign({ id: user.id, username: user.username }, private_key, { algorithm: 'RS256'});
        return res.json({token:token});
    }
});

router.get('/user', async function(req,res){
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        try {
            let decoded = jwt.verify(token, public_key, { algorithm: 'RS256'});
            return res.json({user:decoded});
        } catch (e) {
            console.log(e);
            return res.status(401).json({error:'invalid signature'});
        }

    } else {
        return res.status(401).json({error:'no token'});
    }
});


module.exports = router;
