const axios = require("axios");
const { generalLogger } = require("../../logging/backend/express/logger");

//fetch prediction from ML:
const queryPrediction = (req, res, next) => {
    // get date from params and fix it to be the correct format
    let date = new Date(Date.parse(req.params.date)).toISOString();
    generalLogger.info(`prediction requested for: ${req.params}`)
    generalLogger.info(`converted to ISOString: ${date}`);

    const uri = `http://127.0.0.1:7000/predict/${date}` 

    axios.get(uri)
      .then(response => {
        if (response.data === null || response.data === undefined || response.data.length === 0){
          generalLogger.warn(`prediction list is empty: ${response.data}`)
          res.status(200).json([]); //send empty JSON list if empty response received
        }
        else {
          //make sure response has correct format [location_id, busyness_score]:
          const data = []
            for (item of response.data){
              if ("busyness_score" && "location_id" in item){
                data.push(item);
              }
              else {
                generalLogger.warn(`prediction item skipped (incorrect format): ${item}`);
              }
            }
            generalLogger.info("prediction result OK")
            res.status(200).json(data) //response is OK and contains data
            
        }
      })
      .catch(error => {
        res.status(500).json({"error": error})
      });


}

module.exports = {queryPrediction};