module.exports = function(req, res, next){
    res.set('Accept-Charset', 'utf-8');
    if(req.headers['content-type'] && req.headers['content-type'].includes('windows-1251')){
        req.headers['content-type'] = req.headers['content-type'].replace('windows-1251', 'utf-8');
    }
    return next();
};
