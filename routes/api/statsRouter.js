const express = require("express");
const router = express.Router();
const models = require('../../orm');
var Sequelize = require('sequelize');
var os = require('os-utils');

router.get("/count_orders", async function (req, res) {
    let obj = await models.orders.findOne({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count_orders']],
    });
    return res.json({count: obj.dataValues.count_orders})
});

router.get("/sum_orders", async function (req, res) {
    let obj = await models.orders.findOne({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('total_price')), 'sum_orders']],
    });
    return res.json({sum: obj.dataValues.sum_orders})
});

router.get("/count_products", async function (req, res) {
    let obj = await models.products.findOne({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count_products']],
    });
    return res.json({count: obj.dataValues.count_products})
});

router.get("/count_perfumes", async function (req, res) {
    let obj = await models.categories.findOne({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count_perfumes']],
    });
    return res.json({count: obj.dataValues.count_perfumes})
});

router.get("/os_stats", async function (req, res) {
    let cpuUsage, cpuFree;
    /*let cpuUsage = new Promise(async (resolve) => {
        os.cpuUsage(value => {
            cpuUsage = value
        });
    });
    let cpuFree = os.cpuFree(value => {
        cpuFree = value
    })*/

    let setUsage = new Promise(async (resolve) => {
        os.cpuUsage(value => {
            cpuUsage = value
        });
        (function waitForCpuUsage() {
            if (cpuUsage) return resolve();
            setTimeout(waitForCpuUsage, 30);
        })();
    });

    let setFree = new Promise(async (resolve) => {
        os.cpuFree(value => {
            cpuFree = value
        });
        (function waitForCpuFree() {
            if (cpuFree) return resolve();
            setTimeout(waitForCpuFree, 30);
        })();
    });

    await Promise.all([setUsage, setFree]);

    return res.json({
        platform: os.platform(),
        ram: os.totalmem(),
        ram_free: os.freemem(),
        uptime: os.sysUptime(),
        cpu_count: os.cpuCount(),
        cpu_usage: cpuUsage,
        cpu_free: cpuFree,
    })
});


module.exports = router;
