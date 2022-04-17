//Require needed modules
const express = require(`express`);
const mysql = require(`mysql`);
const dotenv = require(`dotenv`).config();
const crypto = require(`crypto`);

//Require fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Homemade modules
const dbHandler = require("./databaseHandler");
const boat = require("./boat");

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
    const sqlStatement = `SELECT * FROM team WHERE teamName=?`;
    
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
    //Check if user has a valid cookie
    checkUsernameCookie(req.signedCookies.username,0, (cookieData) => {
        if (cookieData.valid) {
            // If they do redirect them without the need to login
            res.redirect(`/members`)
        } else {
            //If not make them login
            res.render(`login`, {data: undefined});
        }
    });
});

// Handle login requests
//http://expressjs.com/en/api.html#res.cookie
router.post(`/login`, (req,res) => {

    //Generate the statement to be used to query the database
    const sqlStatement = `SELECT username FROM paddlertable WHERE username=? AND password = ?;`
    let username = req.body.username.toLowerCase();

    //Query the database with the defined statement to see if the user exists
    db.query(sqlStatement,[username, hash(req.body.password)], (err,result) => {
        if (err) {
            throw err
        }
        
        //Confirm that the results aren't null
        if (result[0] != undefined) {
            //Generate a random string, insert it into the cookie table with reference to the username so that the cookie can't be modified
            const cookieSQL = `INSERT INTO cookietable (username, cookie) VALUES (?, ?)`;
            let cookieRandValue = genRandomString(60)
            db.query(cookieSQL,[result[0].username, cookieRandValue], (err) => {
                if (err) {
                    throw err;
                }
                if (result[0].remember = `yes`) {
                    //Return a 1 month cookie if user wants to be remembered then render the member area
                    res.cookie(`username`, cookieRandValue, {maxAge: 1000 * 60 * 60 * 24 * 30, signed:true}).redirect(`/members`);
                } else {
                    //Return a session cookie when the user doesn't want to be remembered then render the member area
                    res.cookie(`username`, cookieRandValue, {expires: 0, signed:true}).redirect(`/members`);
                    
                }
            });
        }else {
            //Render the login page if the user is not found
            res.render(`login`, {data: {error: `User not found`}});
        }
    });
});

//Handle member area requests
router.get(`/members`, (req,res) => {
    checkUsernameCookie(req.signedCookies.username, 1, (cookieData) => {
        if (cookieData.valid) {
            res.render(`members`, {data: {fname: cookieData.result.firstName}, privilegeLevel: 1});
        } else {
            checkUsernameCookie(req.signedCookies.username,0, (cookieData) => {
                if (cookieData.valid) {
                    //Render the members area if the cookie is valid
                    res.render(`members`, {data: {fname: cookieData.result.firstName}, privilegeLevel: 0});
                } else {
                    // If the user cookie is not in the database then clear cookies and make them login again
                    res.clearCookie(`username`).render(`login`, {data: {error: `Signed Out`}});
                }
            });
        }
    })
    
});

router.get(`/errorpage`, (req,res) => {
    res.render(`errorpage`, {errorList: {errorCode: 418, Description: `I am a teapot, also, Why did you come here?`}});
});

//Handle signup requests
router.get(`/signup`, (req,res) => {
    //Get the ID from the URL
    let linkID = req.query.id;

    //Parse the link ID to the linkID checker
    signupCheck(linkID, true,(valid, result) => {
        if (valid) {
            //If the link is valid send the user the signup page.
            res.render(`signup`, {data: {creator: result.firstName + ` ` + result.lastName}});
        } else {
            //If invalid send the user to the error page
            res.render(`errorpage`, {errorList: {errorCode: 410, Description: `The link provided is no longer valid, Sorry`}});
        } 
    });
});

router.post(`/signup`, (req,res) => {
    let signupData = req.body;
    createUser(signupData, (valid, failurePoint) => {
        if (valid) {
            //Use the signup check to reduce any values if needed
            console.log(req.query.id);
            linkID = req.query.id;
            res.render(`login`, {data: {message: "Account Created"}});           
        } else {
            res.render(`signup`, {data: {message: failurePoint}});
        }
    });
});

router.get('/boatDesign', (req,res) => {

    checkUsernameCookie(req.signedCookies.username,1, (cookieData) => {
        if (cookieData.valid) {
            //Continue with boat design if there cookie is valid
            //Check to see if a session has been specified in the URL
            let designData = req.query;
            if (designData.sessionID !== undefined) {
                //Check a boat is linked to the session  
                const selectBoatSQL = "SELECT * FROM boatlink WHERE sessionID=?"
                db.query(selectBoatSQL, [designData.sessionID], (err,result)=> {
                    if (err) {
                        throw err;
                    }
                    if(result.length == 0) {
                        const getBoatListSQL = "SELECT * FROM boat";
                        db.query(getBoatListSQL, [],(err, result) => {
                            res.render(`pickBoat`, {boatList: result})
                        });
                    } else {
                        let currentBoat = boat.sessionToBoat(designData.sessionID);
                        currentBoat.then((value) => {
                            value.saveBoat(designData.sessionID).then(() => {
                                res.render(`design`, {boat: value, portStarboardAngle: value.calculatePortStarboardAngle(), bowSternAngle: value.calculateBowSternAngle(), PortStarboardMoment: value.PortStarboardMoment(), BowSternMoment: value.BowSternMoment()});
                            });
                        });
                    }
                });
                
            } else {
                const sqlStatement = "SELECT * FROM sessiontable WHERE sessionDate > UTC_DATE ORDER BY sessionDate ASC"
                db.query(sqlStatement,[],(err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.render(`pickSession`, {sessionList: result})
                });
            }
        } else {
            // If the user cookie is not in the database then clear cookies and make them login again
            //TODO: Log this
            res.clearCookie(`username`).render(`login`, {data: {error: `Invalid Privilege level or signed out, this will be logged`}});
        }
    });

    // res.render(`design`, {data: {}});
});

router.put(`/boatDesign`, (req,res) => {
    if (req.query.type == "setBoat") {
        const setBoatSQL = "INSERT INTO boatlink (sessionID,boatID) VALUES (?, ?)";
        db.query(setBoatSQL, [req.body.sessionID, req.body.selectedBoat], (err => {
            if (err) {
                throw err;
            }
            res.send({"setStatus": "OK"})
        }))
    }
});

router.patch('/boatDesign', (req,res) => {
    if (req.query.type == "swap") {
        boat.sessionToBoat(req.query.sessionID).then((value) => {
            value.swapAndSave(req.query.sessionID, req.body.pos1Row, req.body.pos1Side, req.body.pos2Row, req.body.pos2Side).then(() => {
                res.send({"swapStatus":"OK"});
            });
        });
    } else if (req.query.type == "lock") {
        boat.sessionToBoat(req.query.sessionID).then((value) => {
            value.lockAndSave(req.query.sessionID, req.body.index, req.body.side).then(() => {
                res.send({"lockStatus":"OK"});
            })
        })
    } else if (req.query.type = "balance") {
        boat.sessionToBoat(req.query.sessionID).then((value) => {
            value.optimiseBoat();
            value.saveBoat(req.query.sessionID).then(() => {
                res.send({"balanceStatus":"OK"});
            })
        })
    }else {
        res.send("Hello");
        console.log("Here");
    }
})

router.get("/booking", (req,res) => {
    checkUsernameCookie(req.signedCookies.username,0, (cookieData) => {
        if (cookieData.valid) {
            //Get data about the upcoming sessions
            const sessionStatement = "SELECT * FROM ((sessiontable INNER JOIN boatlink ON boatlink.sessionID=sessiontable.sessionID) INNER JOIN boat ON boatlink.boatID=boat.boatID) WHERE sessionDate > UTC_DATE ORDER BY sessionDate ASC";
            const paddlersBooked = "SELECT sessionID,COUNT(username) FROM sessionlink GROUP BY sessionID"
            //Get the count for every session
            let queryList = [];
            queryList[queryList.length] = dbHandler.queryDB(sessionStatement, []);
            queryList[queryList.length] = dbHandler.queryDB(paddlersBooked, []);
            Promise.allSettled(queryList).then(value => {
                let sessionID = null;
                //TODO: Make dis work without breaking all other session
                // if (req.query.sessionID != undefined) {
                //     sessionID = req.query.sessionID;
                // }
                //Render the booking area if the cookie is valid with data about the upcoming sessions
                res.render("booking", {sessionsData: value, prevSession: sessionID});
            });

        } else {
            // If the user cookie is not in the database then clear cookies and make them login again
            res.clearCookie(`username`).render(`login`, {data: {error: `Signed Out`}});
        }
    });
});

router.patch("/booking", (req,res) => {
    checkUsernameCookie(req.signedCookies.username,0, (cookieData) => {
        const paddlerSqlStatement = "SELECT * FROM ((((sessiontable INNER JOIN sessionlink ON sessiontable.sessionID=sessionlink.sessionID) INNER JOIN boatlink ON boatlink.sessionID=sessiontable.sessionID) INNER JOIN boat ON boat.boatID=boatlink.boatID) INNER JOIN paddlertable ON sessionlink.username=paddlertable.username) INNER JOIN location ON sessiontable.locationName = location.locationName WHERE sessionlink.sessionID=?"
        db.query(paddlerSqlStatement, [req.body.sessionID], (err,results) => {
            if (err) {
                throw err;
            }
            const dataSqlStatement = "SELECT longitude, latitude, sessionDate FROM sessiontable INNER JOIN location ON sessiontable.locationName = location.locationName WHERE sessiontable.sessionID=?"
            db.query(dataSqlStatement, [req.body.sessionID], (err,result) => {
                getWeather(result[0].longitude,result[0].latitude).then(myData => {
                    let index = -1;
                    for (var x = 0; x < myData.daily.time.length; x++) {
                        let theDate = new Date(myData.daily.time[x]);
                        if (theDate.getDate() == result[0].sessionDate.getDate() && theDate.getMonth() == result[0].sessionDate.getMonth() && theDate.getFullYear() == result[0].sessionDate.getFullYear()) {
                            index = x;
                        }
                        
                    }
                    res.send({sessionData: results, username: cookieData.result.username, weatherData: myData, weatherPos: index});                
                });
            })
        });
    });
});

async function getWeather(longitude, latitude) {
    //Get Weather Data
    let apiRequest = "https://api.open-meteo.com/v1/forecast?latitude="+ latitude + "&longitude="+ longitude + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,windgusts_10m_max&windspeed_unit=kn&timezone=Europe%2FLondon";
    let weatherData = await fetch(apiRequest)
    let data = weatherData.json();
    return data;
}

router.post("/booking", (req,res) => {
    //find the username from the cookie
    const checkCookieSQL = `SELECT username FROM cookietable WHERE cookie=?`;
    const paddlersBookedSQL = "SELECT COUNT(username) FROM sessionlink WHERE sessionID=?";
    const maxSeatsSQL = `SELECT boatSize FROM boat INNER JOIN boatlink ON boat.boatID=boatlink.boatID WHERE boatlink.sessionID=?`;
    let checkCookie = dbHandler.queryDB(checkCookieSQL, [req.signedCookies.username]);
    let paddlersBooked = dbHandler.queryDB(paddlersBookedSQL, [req.body.sessionID]);
    let maxSeats = dbHandler.queryDB(maxSeatsSQL, [req.body.sessionID]);
    Promise.allSettled([checkCookie,paddlersBooked,maxSeats]).then(value => {
        // console.log(`username: ${value[0].value[0].username}, placesTaken: ${Object.values(value[1].value[0])[0]}, maxSeats: ${value[2].value[0].boatSize}`)
        if (Object.values(value[1].value[0])[0] < value[2].value[0].boatSize) {
            const alreadyBookedSQL = `SELECT * FROM sessionlink WHERE username=? AND sessionID=?`;
            db.query(alreadyBookedSQL, [value[0].value[0].username,req.body.sessionID], (err,result) => {
                if (result.length == 0) {
                    const bookSessionSQL = `INSERT INTO sessionlink (username, sessionID) VALUES (?, ?)`;
                    db.query(bookSessionSQL, [value[0].value[0].username, req.body.sessionID], (err,results) => {
                        if (err) {
                            throw err;
                        }
                        //Get data about the upcoming sessions
                        const sessionStatement = "SELECT * FROM ((sessiontable INNER JOIN boatlink ON boatlink.sessionID=sessiontable.sessionID) INNER JOIN boat ON boatlink.boatID=boat.boatID) WHERE sessionDate > UTC_DATE ORDER BY sessionDate ASC";
                        const paddlersBooked = "SELECT sessionID,COUNT(username) FROM sessionlink GROUP BY sessionID"
                        //Get the count for every session
                        let queryList = [];
                        queryList[queryList.length] = dbHandler.queryDB(sessionStatement, []);
                        queryList[queryList.length] = dbHandler.queryDB(paddlersBooked, []);
                        Promise.allSettled(queryList).then(value => {
                            //Render the booking area if the cookie is valid with data about the upcoming sessions
                            // res.render("booking", {sessionsData: value, prevSession: req.body.sessionID});
                            res.redirect("/booking?sessionID=" + req.body.sessionID);
                        });
                    });
                }
            });
        }
    });
});

router.delete("/booking", (req,res) => {
    const delLinkSQL = "DELETE FROM sessionlink WHERE username=? AND sessionID=?";
    console.log([req.body.username,req.body.sessionID]);
    db.query(delLinkSQL, [req.body.username,req.body.sessionID], (err,result) => {

        if (err) {
            res.status(500).send({error: err});
            throw err;
            console.log("error")
        } else {
            res.redirect(307,"/booking" + req.body.sessionID);
        }
        // //Get data about the upcoming sessions
        // const sessionStatement = "SELECT * FROM ((sessiontable INNER JOIN boatlink ON boatlink.sessionID=sessiontable.sessionID) INNER JOIN boat ON boatlink.boatID=boat.boatID) WHERE sessionDate > UTC_DATE ORDER BY sessionDate ASC";
        // const paddlersBooked = "SELECT sessionID,COUNT(username) FROM sessionlink GROUP BY sessionID"
        // //Get the count for every session
        // let queryList = [];
        // queryList[queryList.length] = dbHandler.queryDB(sessionStatement, []);
        // queryList[queryList.length] = dbHandler.queryDB(paddlersBooked, []);
        // Promise.allSettled(queryList).then(value => {
        //     //Render the booking area if the cookie is valid with data about the upcoming sessions
        //     res.render("booking", {sessionsData: value, prevSession: req.body.sessionID});
        // });
    });
});

router.get("/makeSession", (req,res) => {
    checkUsernameCookie(req.signedCookies.username,1, (cookieData) => {
        if (cookieData.valid == true) {
            //If the cookie data is valid render the make session page
            res.render("makeSession")
        } else {
            // If the user cookie is not in the database then clear cookies and make them login again
            //TODO: Log this
            res.clearCookie(`username`).render(`login`, {data: {error: `Invalid Privilege level or signed out, this will be logged`}});
        }
    });
});

router.post("/makeSession", (req,res) => {
    checkUsernameCookie(req.signedCookies.username,1, (cookieData) => {
        if (cookieData.valid == true) {
            const insertionSQL = "INSERT INTO sessiontable (sessionDate, Description) VALUES(?, ?)";
            db.query(insertionSQL, [req.body.sessionDate, req.body.sessionDescription], (err) => {
                if (err) {
                    throw err;
                }
                const getSessionID = "SELECT sessionID FROM sessiontable where sessionDate=?";
                db.query(getSessionID, [req.body.sessionDate], (err,results) => {
                    res.redirect("/boatDesign?sessionID=" + results[0].sessionID);
                })
            })
        } else {
            // If the user cookie is not in the database then clear cookies and make them login again
            //TODO: Log this
            res.clearCookie(`username`).render(`login`, {data: {error: `Invalid Privilege level or signed out, this will be logged`}});
        }
    });
});

function createUser(userData, callback) {
    const passwordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/ //Regex to be used to check that a valid password is used. Generated by thepolyglotdeveloper https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    valid = true;
    failurePoint = ``;
    //Check username is longer than 4 characters
    if (userData.username.length < 4) {
        valid = false;
        failurePoint = "Username too Short";
    }
    if (userData.username.length > 100) {
        valid = false;
        failurePoint = "Username too Long";
    }
    //Check the passwords match
    if (userData.password == userData.passwordConfirmation) {
        //Check the password is strong enough
        if (!passwordRegex.test(userData.password)) {
            valid = false;
            failurePoint = "Password does not meet pattern requirements (1+ lowercase, 1+ uppercase, 1+ numbers, 1+ special characters)"
        }
    } else {
        valid = false;
        failurePoint = `Passwords don't match`;
    }
    //Check user does not exist
    const duplicateSQLStatement = "SELECT * FROM paddlertable WHERE username=?"
    db.query(duplicateSQLStatement, [userData.username], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length != 0) {
            valid = false;
            failurePoint = `Username already exists`
        }
        if (valid) {
            //Insert user into paddler table
            const sqlStatement = "INSERT INTO paddlertable (username, firstname, lastname, gender, password) VALUES (?, ?, ?, ?, ?)";
            let data = [userData.username, userData.firstName, userData.lastName, userData.gender, hash(userData.password)];
            db.query(sqlStatement, data, (err) => {
                //Throw any errors
                if (err) {
                    throw err;
                }
                //Add their weight if inputted
                if (userData.inputWeightNow == "on") {
                    const weightSQLStatement = "UPDATE paddlertable SET weight=?, weightLastUpdate=? WHERE username=?"
                    weightData = [userData.weight, getTodayDate(), userData.username];
                    db.query(weightSQLStatement,weightData, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
                //At the same time, add there membership number if inputted
                if (userData.inputMembershipNumberNow == "on") {
                    const memNumSQLStatement = "UPDATE paddlertable SET BDAMemberShipNum=?, BDAExpiry=? WHERE username=?"
                    memNumData = [userData.MembershipNumber,userData.MembershipExpiration,userData.username]
                    db.query(memNumSQLStatement, memNumData, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
                //Call back
                callback(valid, failurePoint);
            });    
        } else {
            callback(valid, failurePoint);
        }
    });    
}

//Check if a signup link is valid
function signupCheck(linkID, updateFlag, callback) {
    
    //Make a request to the database to collect all data about it
    const sqlStatement = `SELECT signupLinks.linkID, signupLinks.maxUses, signupLinks.expiration, paddlertable.firstName, paddlertable.lastName FROM signuplinks INNER JOIN paddlertable ON signuplinks.creator = paddlertable.username WHERE linkID = ?;`
    db.query(sqlStatement, [linkID], (err, result) => {
        if (err) {
            throw err;
        }

        //Create a flag to be set to false if the link is invalid
        let validLinkFlag = false;
        if (result[0] != undefined) {
            validLinkFlag = true;
            
            // If an expiration exists then check it is in the future, if not invalid
            if (result[0].expiration != null) {
                if (result[0].expiration < Date.now()) {
                    validLinkFlag = false;
                }
            }

            // If an maxUses exists then check it is not 0, if it is invalid
            if (result[0].maxUses != null) {
                if (result[0].maxUses == 0) {
                    validLinkFlag = false;
                }
                //Decrease the max uses by one if not null and a update request is made
                if (updateFlag == true) {
                    let decreaseStatement = `UPDATE signupLinks SET maxUses=? WHERE linkID=?;`;
                    db.query(decreaseStatement,[result[0].maxUses - 1, result[0].linkID], (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
        }
        callback(validLinkFlag, result[0]);
    });
}


function getTodayDate() {
    let currentDate = new Date();
    return `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth()}-${currentDate.getUTCDate()}`

}
// console.log(genRandomString(30,97));
function genRandomString(length, minNum = 33) { //Generate a string of a set length for use with cookie generation and signup link generation
    let randString = ``;
    for (var pos = 0; pos <= length; pos++) {
        // Append a char with an ascii code between 33 and 126
        randString += String.fromCharCode(minNum + Math.floor(Math.random() * (126 - minNum)));
    }
    return randString;
}

function checkUsernameCookie(usernameCookie, minPrivilege, callback) { //Check if a cookie is valid
    //Define sql statement to be used
    const sqlStatement = `SELECT privilegeLevel, cookietable.username FROM paddlertable INNER JOIN cookietable ON paddlertable.username = cookietable.username WHERE cookietable.cookie=?`
        
    //Query the database with the username cookie
    db.query(sqlStatement, [usernameCookie], (err,result) => {
        //Throw an error if one occurs
        if(err) {
            throw err;
        }

        //Check to see if the user is in the database, return true if they are
        if (result[0] != undefined) {
            if (result[0].privilegeLevel >= minPrivilege) {
                callback({valid: true, result: result[0]});
            } else {
                callback({valid: false});
            }
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