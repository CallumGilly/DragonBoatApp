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

    //Used to lock a user into a specific seat. Pos coded so that pos < 0 its on the right and pos = (pos * -1) -1
    setSeat(username, newPos, lockedSide = true) {
        let currentPosition = this.getUserPos(username)
        let currentArray;
        if (currentPosition < 0) {
            currentPosition = (currentPosition * -1) - 1;
            currentArray = this.right;
        } else {
            currentArray = this.left;
        }
        let newArray;
        let theNewPos
        if (newPos < 0) {
            theNewPos = (newPos * -1) - 1;
            newArray = this.right;
        } else {
            theNewPos = newPos;
            newArray = this.left;
        }
        let tempPaddler = currentArray[currentPosition];
        currentArray[currentPosition] = newArray[theNewPos];
        newArray[theNewPos] = tempPaddler;
        newArray[theNewPos].lockedSide = lockedSide;
        newArray[theNewPos].lockedRow = true;
    }

    optimisePortStarboardValidSwap(pad1,pad2) {
        if (pad1 === null) {
            if(pad2 === null) {
                return false;
            } else if (pad2.lockedSide == true) {
                return false;
            }
        } else if (pad1.lockedSide == true)  {
            return false;            
        } else if(pad2 === null) {
            return true;
        } else if (pad2.lockedSide == true) {
            return false;
        }
        return true;
    }

    //Change the side of the boat until it is
    optimisePortStarboard(followPreferences=true) {
        //If negative back heavy/ right heavy
        const initialMoment = this.PortStarboardMoment();

        let bestMoment = Math.abs(initialMoment);
        let bestLeft = -1;
        let bestRight = -1;
        for (var row = 0; row < 10; row++) {
            //if should be !F + FV Which vir absorption is !F + V where v is the valid check
            //Only swap if not lockedside of not following preference
            if (!followPreferences || this.optimisePortStarboardValidSwap(this.left[row],this.right[row])) {
                let tempValue = this.left[row];
                this.left[row] = this.right[row];
                this.right[row] = tempValue;
                var moment = Math.abs(this.PortStarboardMoment());
                if (moment < bestMoment) {
                    bestMoment = moment;
                    bestLeft = row;
                    bestRight = row;
                }
                tempValue = this.left[row];
                this.left[row] = this.right[row];
                this.right[row] = tempValue;
            }            
        }
        if (bestLeft !== -1) {
            let tempValue = this.left[bestLeft];
            this.left[bestLeft] = this.right[bestRight];
            this.right[bestRight] = tempValue;
            return true;
        } else {
            return false;
        }
    }

    fineOptimiseBowStern() {
        //If negative back heavy/ right heavy
        const initialMoment = this.BowSternMoment();
        let bestMoment = Math.abs(initialMoment);
        //Sides, pos1, pos2 sides in form: 1 = LeftLeft, 2 = LeftRight, 3 = RightLeft, 4 = RightRight
        let best = [-1,-1,-1];
        for (var row = 1; row < 10; row++) {
            let tempValue = this.left[row];
            this.left[row] = this.left[row - 1];
            this.left[row - 1] = tempValue;
            var moment = Math.abs(this.BowSternMoment());
            if (moment < bestMoment) {
                bestMoment = moment;
                best = [1,row,row-1]
            }
            tempValue = this.left[row];
            this.left[row] = this.left[row - 1];
            this.left[row - 1] = tempValue;

            tempValue = this.left[row];
            this.left[row] = this.right[row - 1];
            this.right[row - 1] = tempValue;
            moment = Math.abs(this.BowSternMoment());
            if (moment < bestMoment) {
                bestMoment = moment;
                best = [2,row,row-1]
            }
            tempValue = this.left[row];
            this.left[row] = this.right[row - 1];
            this.right[row - 1] = tempValue;
            
            tempValue = this.right[row];
            this.right[row] = this.left[row - 1];
            this.left[row - 1] = tempValue;
            moment = Math.abs(this.BowSternMoment());
            if (moment < bestMoment) {
                bestMoment = moment;
                best = [3,row,row-1]
            }
            tempValue = this.right[row];
            this.right[row] = this.left[row - 1];
            this.left[row - 1] = tempValue;

            tempValue = this.right[row];
            this.right[row] = this.right[row - 1];
            this.right[row - 1] = tempValue;
            moment = Math.abs(this.BowSternMoment());
            if (moment < bestMoment) {
                bestMoment = moment;
                best = [4,row,row-1]
            }
            tempValue = this.right[row];
            this.right[row] = this.right[row - 1];
            this.right[row - 1] = tempValue;

        }
        if (best !== [-1,-1,-1]) {
            switch (best[0]) {
                case 1:
                    var tempValue = this.left[best[1]];
                    this.left[best[1]] = this.left[best[2]];
                    this.left[best[2]] = tempValue;
                    break;
                case 2:
                    var tempValue = this.left[best[1]];
                    this.left[best[1]] = this.right[best[2]];
                    this.right[best[2]] = tempValue;
                    break;
                case 3:
                    var tempValue = this.right[best[1]];
                    this.right[best[1]] = this.left[best[2]];
                    this.left[best[2]] = tempValue;
                    break;
                case 3:
                    var tempValue = this.right[best[1]];
                    this.right[best[1]] = this.right[best[2]];
                    this.right[best[2]] = tempValue;
                    break;
                default:
                    break;
            }
            return true;
        } else {
            return false;
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