const axios = require("axios");
const generalLogger = require("../logging/generalLogger")(module)
require("dotenv").config();


/**
 * Fetch current busyness from the Prediction API
 * 
 * Returns ML API dictionary results
 */
const current = (req, res, next) => {
    res.req.ip //sets the object
    generalLogger.info(`current prediction requested`)

    const uri = `${process.env.FLASK_API_URL}/prediction/current?key=${process.env.FLASK_API_KEY}` 

    axios.get(uri)
      .then(response => {
        // Handle empty/null API result:
        if (response.data === null || response.data === undefined){
            generalLogger.warn("warning, prediction list is empty")
            res.status(200).json({});
            next()
        }
        else {
            generalLogger.info("response is OK")
            res.status(200).json(response.data)
            next()
        }
      })
      // If error, respond 500 and log error message
      .catch(error => {
        generalLogger.error(`error getting prediction: ${error}`)
        res.status(500).json({"error": error})
        next()
      });
}




module.exports = {current};