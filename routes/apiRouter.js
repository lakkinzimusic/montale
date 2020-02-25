const express = require("express");
const router = express.Router();
const auth = require('./api/authRouter');
const stats = require('./api/statsRouter');
const catalog = require('./api/catalogRouter');
const common = require('./api/commonRouter');
const shop = require('./api/shopRouter');
const users = require('./api/usersRouter');
const page = require('./api/pageRouter');
const orders = require('./api/ordersRouter');

const apiAccess = require('../middleware/apiAccess');

router.use("/auth" ,auth);
router.use("/stats", apiAccess.apiAccess, stats);
router.use("/catalog", apiAccess.apiAccess, catalog);
router.use("/order", apiAccess.apiAccess, orders);
router.use("/shop", apiAccess.apiAccess, shop);
router.use("/users", apiAccess.apiAccess, users);
router.use("/page", apiAccess.apiAccess, page);
router.use("/", apiAccess.apiAccess, common);


module.exports = router;

