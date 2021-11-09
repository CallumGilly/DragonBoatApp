//Require needed modules
const express = require(`express`);

//Create a router object
const router = express.Router()

router.get(`/`, (req,res) => {
    res.render(`homepage`);
})

//Export the router
module.exports = router;