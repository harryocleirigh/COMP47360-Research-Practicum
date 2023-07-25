const express = require('express');
const router = express.Router();
const {current, event} = require("../controllers/prediction");

// Router for 'app/v1/prediction/current'
router.route("/current").get(current);
router.route("/event/:eventID").get(event);

module.exports = router;