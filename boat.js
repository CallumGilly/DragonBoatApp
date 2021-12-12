//Require person object
const person = require(`./person`);
//Require database access
const databaseHandler = require('./databaseHandler');

//Define the boat object
class boat {
    //First call handling
    constructor(boatData, paddlerList) {
        //Get and store the boat data from database
        this.boatSize = boatData.boatSize;
        this.widthArray = boatData.widthArray;
        this.lengthArray = boatData.lengthArray;
        this.boatName = boatData.boatName;
        //Create arrays to contain data about paddler position
        this.left = []
        for (var x = 0; x < this.boatSize / 2; x++) {
            this.left[x] = null;
        }
        this.right = []
        for (var x = 0; x < this.boatSize / 2; x++) {
            this.right[x] = null;
        }
        //Convert the paddler list from the database into a standardized array of person objects
        let allPaddlers = []
        paddlerList.forEach(element => {
            allPaddlers[allPaddlers.length] = new person(element.username,element.gender,element.weight,element.preference);
        });
        //Sort list of paddlers
        allPaddlers.sort((a,b) => {
            return a.weight - b.weight
        });
        //Place all paddlers into each side of there boat filling the first two spots and then in the order LF -> RF -> LB -> RB such that the heaver people are at the middle/ back
        allPaddlers.forEach(paddler => {
            let notFound = true;
            for (var sideIndex = 0; sideIndex <= this.left.length / 2 && notFound; sideIndex ++) {
                if (this.left[sideIndex] === null) {
                    this.left[sideIndex] = paddler;
                    notFound = false;
                } else if (this.right[sideIndex] === null) {
                    this.right[sideIndex] = paddler;
                    notFound = false;
                } else if (this.left[this.left.length - sideIndex] === null) {
                    this.left[this.left.length - sideIndex] = paddler;
                    notFound = false;
                } else if (this.right[this.right.length - sideIndex] === null) {
                    this.right[this.right.length - sideIndex] = paddler;
                    notFound = false;
                } 
            }
        });
    }
    
}

function sessionToBoat(sessionID) {
    const getBoatSQL = "SELECT boat.boatSize, boat.widthArray, boat.lengthArray, boat.boatName FROM boat INNER JOIN boatlink ON boat.boatID = boatlink.boatID WHERE boatlink.sessionID=?";
    const getPaddlersSQL = "SELECT paddlertable.username, paddlertable.gender, paddlertable.preference, paddlertable.weight FROM paddlertable INNER JOIN sessionlink ON paddlertable.username = sessionlink.username WHERE sessionlink.sessionID = ?"
    let boatData = databaseHandler.queryDB(getBoatSQL, [sessionID]);
    let paddlerList = databaseHandler.queryDB(getPaddlersSQL, [sessionID]);
    return new Promise((resolve, reject) => {
        Promise.allSettled([boatData, paddlerList]).then((values)=>{
            let theBoat = new boat(values[0].value[0],values[1].value);
            resolve(theBoat);
        });
    });
    
}

//Export the boat object
module.exports = boat;
module.exports.sessionToBoat = sessionToBoat;