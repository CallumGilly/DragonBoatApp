//Require needed modules
const express = require(`express`);
const mysql = require(`mysql`);
const dotenv = require(`dotenv`).config();
const crypto = require(`crypto`);
const e = require("express");

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

// Serve the Login Page

router.get(`/login`, (req,res) => {
    res.render(`login`, {data: undefined});
});

// Handle login requests
//http://expressjs.com/en/api.html#res.cookie
router.post(`/login`, (req,res) => {
    //The statement to be used to query the database
    let username = req.body.username.toLowerCase();
    let sqlStatement = `SELECT username FROM paddlertable WHERE username=? AND password = ?;`

    //Query the database with the defined statement
    db.query(sqlStatement,[username, hash(req.body.password)], (err,result) => {
        if (err) {
            throw err
        }
        //Confirm that the results aren't null
        if (result[0] != undefined) {
            if (result[0].remember = `yes`) {
                //Return a 1 month cookie if user wants to be remembered then render the member area
                res.cookie(`username`, username, {maxAge: 1000 * 60 * 60 * 24 * 12, signed:true}).redirect(`/members`);
            } else {
                //Return a session cookie when the user doesn't want to be remembered then render the member area
                res.cookie(`username`, username, {expires: 0, signed:true}).redirect(`/members`);
                
            }
        }else {
            //Render the login page if the user is not found
            res.render(`login`, {data: {error: `User not found`}});
        }
    });
});

router.get(`/members`, (req,res) => {
    let usernameCookie = req.signedCookies.username;
    checkUsernameCookie(usernameCookie, (cookieData) => {
        console.log(cookieData);
        if (cookieData.valid) {
            //Render the members area
            res.render(`members`, {data: {fname: cookieData.result.firstName}})
        } else {
            // If the user is not in the database then clear cookies and make them login again
            res.clearCookie(`username`).render(`login`, {data: {error: `Data information not found, please log in again`}});
        }
    });
}); 

function checkUsernameCookie(usernameCookie, callback) {
    //Define sql statement to be used
    let sqlStatement = `SELECT * FROM paddlertable WHERE username=?`
        
    //Query the database with the username cookie
    db.query(sqlStatement, [usernameCookie], (err,result) => {
        //Throw an error if one occurs
        if(err) {
            throw err;
        }

        //Check to see if the user is in the database, return true if they are
        if (result[0] != undefined) {
            callback({valid: true, result: result[0]});
        } else {
            callback({valid: false});
        }
    });
}

function hash(password) { // Hash any parsed passwords - helper function to save me from long strings to hash passwords
    return crypto.createHash('sha256').update(password).digest('hex')
}

//Export the router
module.exports = router;