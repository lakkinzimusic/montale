const express = require("express");
const port = 8081;


var exec = require('child_process').exec;
// exec('kill -9 $(lsof -t -i:'+port+');', function(){
//     console.log('port killed')
// }); // Убивает процесс занимающий порт назначения

const hbs = require("hbs");


const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const app = express();
const client = redis.createClient();
const multer = require('multer');

// const hbs = require("express-handlebars");
const hbsRegisterHelper = require('./middleware/hbsRegisterHelper');
const setHeaders = require('./middleware/setHeaders');
app.use(hbsRegisterHelper);

const Cart = require('./models/cartModel');


const models = require('./orm');
const initCart = require('./middleware/initCart');
const initBaseElements = require('./middleware/initBaseElements');

global.__basedir = __dirname;
app.use(flash());
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
};

const corsApiOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors());
app.use(setHeaders);

let store = new redisStore({host: 'localhost', port: 6379, client: client, ttl: 7200});
app.use(cookieParser());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});


app.set("view engine", "hbs");

app.use('/images', express.static(path.join(__dirname, 'images')));
hbs.registerPartials(__dirname + "/views/partials");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const authRouter = require("./routes/authRouter.js");
const productRouter = require("./routes/productRouter.js");
const accountRouter = require("./routes/accountRouter.js");
const cartRouter = require("./routes/cartRouter.js");

const catalogRouter = require("./routes/catalogRouter.js");
const apiRouter = require("./routes/apiRouter.js");


app.use(multer({storage: fileStorage}).single('file'));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views/imgs')));

app.use(session({
    secret: 'ssshhhhh',
    store: store,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 60 * 24 * 30 * 1000,
        //httpOnly: false,
        secure: false
    },
}));


app.use((req, res, next) => {
    res.locals.breadcrumbs = [{url:'/', label:'Главная'}];
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use(initCart);
app.use(initBaseElements);
// const initFavouritesProducts = require('./middleware/initFavouritesProducts');

// app.use(initFavouritesProducts);

app.use("/", homeRouter);
app.use("/users",  userRouter);
app.use("/product",  productRouter);
app.use("/account",  accountRouter);
app.use("/cart",  cartRouter);
app.use(authRouter);
app.use(catalogRouter);


app.use("/api",apiRouter);


/*app.use(errorController.get404);*/

models.sequelize.sync().then(function() {
    app.listen(port, function () {
        console.log("server: "+port);
    });
});
