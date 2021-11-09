//Require needed modules
const express = require(`express`);
const mysql = require(`mysql`);
const dotenv = require(`dotenv`).config();
const crypto = require(`crypto`);

//Create a router object
const router = express.Router()

//Create database object using data from .ENV file
let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Connect to database
db.connect(err => {
    if (err) {
        console.error(err);
    }
});

// Serve the homepage
router.get(`/`, (req,res) => {
    
    const teamName = `Hurricanes`;
    
    //Make the sqlStatement in a variable
    let sqlStatement = `SELECT * FROM team WHERE teamName=?`;
    
    //Query the database using the pre made SQL statement
    db.query(sqlStatement, [teamName], (err,result) => {

        //If an error occurs render the web page but throw to console
        if (err) {
            throw err;
            res.render(`homepage`, {data: undefined});
        }

        //Render the homepage with data from the database
        res.render(`homepage`, {data: result[0]});
    });
})

//Export the router
module.exports = router;