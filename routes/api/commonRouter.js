const express = require("express");
const router = express.Router();

router.post('/upload-file', async function(req,res){
    return res.json(req.file.path);
});

module.exports = router;
