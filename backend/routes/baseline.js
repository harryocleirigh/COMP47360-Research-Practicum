const express = require('express');
const router = express.Router();
const {queryBaseline, queryEventBaseline} = require("../controllers/baseline");

router.route("/:date/:event").get(queryEventBaseline)
router.route("/:date").get(queryBaseline);

module.exports = router;