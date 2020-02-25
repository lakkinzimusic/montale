exports.checkLogine = (req, res, next) => {
    console.log(req.body.email);
    console.log(req.body.password);

    if (!req.body.email) {
        return req.flash('Емэйла нет');
    }
    next();

};
