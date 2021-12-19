//Require person object
const person = require(`./person`);
//Require database access
const databaseHandler = require('./databaseHandler');

//Define the boat object
class boat {
    //Need to add a bias for all boats

    //First call handling
    constructor(boatData, paddlerList, bias = 0.8) {
        //Get and store the boat data from database
        this.boatSize = boatData.boatSize;
        this.widthArray = boatData.widthArray.substring(1, boatData.widthArray.length - 1).split(",");
        this.lengthArray = boatData.lengthArray;
        this.boatName = boatData.boatName;
        this.bias = bias
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
            allPaddlers[allPaddlers.length] = new person(element.username, element.gender, element.weight, element.preference);
        });
        //Sort list of paddlers
        allPaddlers.sort((a, b) => {
            return a.weight - b.weight
        });
        //Place all paddlers into each side of there boat filling the first two spots and then in the order LF -> RF -> LB -> RB such that the heaver people are at the middle/ back
        allPaddlers.forEach(paddler => {
            let notFound = true;
            for (var sideIndex = 0; sideIndex <= this.left.length / 2 && notFound; sideIndex++) {
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

    //Calculate the moment between port and starboard in the clockwise direction
    PortStarboardMoment() {
        //Variable the clockwise moment will be stored in
        let CWMoment = 0;
        //Iterate along the boat and calculate the clockwise moment as you go
        for (var x = 0; x < this.right.length; x++) {
            if (this.right[x] !== null) {
                CWMoment += this.widthArray[x] * this.right[x].weight;
            }
            if (this.left[x] !== null) {
                CWMoment -= this.widthArray[x] * this.left[x].weight;
            }
        }
        return CWMoment;
    }

    //Calculate the moment between Bow and stern in the clockwise direction
    BowSternMoment() {
        //Variable the clockwise moment will be stored in
        let CWMoment = 0;
        //Iterate along the boat and calculate the moment in the clockwise direction (port view)
        //moment of seat = seat dist from 4/5 * 0.8 * weight
        for (var seatNum = 0; seatNum < this.left.length; seatNum++) {
            if (seatNum <= 4) {
                let multiplier = ((4 - seatNum) * 0.8 + (0.8 - this.bias));
                if (this.left[seatNum] !== null) {
                    CWMoment -= multiplier * this.left[seatNum].weight;
                }
                if (this.right[seatNum] !== null) {
                    CWMoment -= multiplier * this.right[seatNum].weight;
                }
            } else { // (seatNum > 4)
                let multiplier = ((seatNum - 5) * 0.8 + this.bias);
                if (this.left[seatNum] !== null) {
                    CWMoment += multiplier * this.left[seatNum].weight;
                }
                if (this.right[seatNum] !== null) {
                    CWMoment += multiplier * this.right[seatNum].weight;
                }
            }
        }
        return CWMoment;
    }

    //Used to get the position of a given user
    getUserPos(user) {
        let position = null;
        for (var x = 0; x < this.left.length; x++) {
            if (this.left[x].username == user) {
                position = x;
            } else if (this.right[x].username == user) {
                position = -1 * (x + 1);
            }
        }
        return position;
    }

    //Used to lock a user into a specific seat whe
    setSeat(username, newPos, lockedSide = true) {
        let position = this.getUserPos(username)
        let activeArray;
        if (position < 0) {
            position = (position * -1) - 1;
            activeArray = this.right;
        } else {
            activeArray = this.left;
        }
    }
}

function sessionToBoat(sessionID) {
    const getBoatSQL = "SELECT boat.boatSize, boat.widthArray, boat.lengthArray, boat.boatName FROM boat INNER JOIN boatlink ON boat.boatID = boatlink.boatID WHERE boatlink.sessionID=?";
    const getPaddlersSQL = "SELECT paddlertable.username, paddlertable.gender, paddlertable.preference, paddlertable.weight FROM paddlertable INNER JOIN sessionlink ON paddlertable.username = sessionlink.username WHERE sessionlink.sessionID = ?"
    let boatData = databaseHandler.queryDB(getBoatSQL, [sessionID]);
    let paddlerList = databaseHandler.queryDB(getPaddlersSQL, [sessionID]);
    return new Promise((resolve, reject) => {
        Promise.allSettled([boatData, paddlerList]).then((values) => {
            let theBoat = new boat(values[0].value[0], values[1].value);
            resolve(theBoat);
        });
    });

}

//Export the boat object
module.exports = boat;
module.exports.sessionToBoat = sessionToBoat;