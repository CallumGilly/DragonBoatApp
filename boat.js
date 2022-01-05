//Require person object
const person = require(`./person`);
//Require database access
const databaseHandler = require('./databaseHandler');

//Define the boat object
class boat {
    //Need to add a bias for all boats

    //First call handling
    constructor(boatData, paddlerList,isSaved, bias = 0.8) {
        //Get and store the boat data from database
        this.boatSize = boatData.boatSize;
        this.widthArray = boatData.widthArray.substring(1, boatData.widthArray.length - 1).split(",");
        this.lengthArray = boatData.lengthArray;
        this.boatName = boatData.boatName;
        this.bias = bias;
        
        //Create arrays to contain data about paddler position
        this.left = []
        for (var x = 0; x < this.boatSize / 2; x++) {
            this.left[x] = new person;
        }
        this.right = []
        for (var x = 0; x < this.boatSize / 2; x++) {
            this.right[x] = new person;
        }
        if (isSaved) {
            paddlerList.forEach(element => {
                let currentPaddler = new person(element.username, element.gender, element.weight, element.preference, element.isLocked);
                if (element.tempSide == "L") {
                    this.left[element.tempRow] = currentPaddler;
                } else if (element.tempSide == "R") {
                    this.right[element.tempRow] = currentPaddler;
                } else {
                    let notFound = true;
                    for (var sideIndex = 0; sideIndex <= this.left.length / 2 && notFound; sideIndex++) {
                        if (this.left[sideIndex].isNull == true) {
                            this.left[sideIndex] = currentPaddler;
                            notFound = false;
                        } else if (this.right[sideIndex].isNull == true) {
                            this.right[sideIndex] = currentPaddler;
                            notFound = false;
                        } else if (this.left[this.left.length - sideIndex - 1].isNull == true) {
                            this.left[this.left.length - sideIndex - 1] = currentPaddler;
                            notFound = false;
                        } else if (this.right[this.right.length - sideIndex - 1].isNull == true) {
                            this.right[this.right.length - sideIndex - 1] = currentPaddler;
                            notFound = false;
                        }
                    }
                }
            });
        } else {
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
                    if (this.left[sideIndex].isNull == true) {
                        this.left[sideIndex] = paddler;
                        notFound = false;
                    } else if (this.right[sideIndex].isNull == true) {
                        this.right[sideIndex] = paddler;
                        notFound = false;
                    } else if (this.left[this.left.length - sideIndex - 1].isNull == true) {
                        this.left[this.left.length - sideIndex - 1] = paddler;
                        notFound = false;
                    } else if (this.right[this.right.length - sideIndex - 1].isNull == true) {
                        this.right[this.right.length - sideIndex - 1] = paddler;
                        notFound = false;
                    }
                }
            });
        }
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
            //Only swap if not locked side of not following preference
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

    fineOptimiseBowStern(followPreferences=true) {
        //If negative back heavy/ right heavy
        const initialMoment = this.BowSternMoment();
        let bestMoment = Math.abs(initialMoment);
        //Sides, pos1, pos2 sides in form: 1 = LeftLeft, 2 = LeftRight, 3 = RightLeft, 4 = RightRight
        let best = [-1,-1,-1];
        for (var row = 1; row < 10; row++) {
            if(!followPreferences || !this.left[row].lockedRow && !this.left[row - 1].lockedRow) {
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
            }

            if(!followPreferences || !this.left[row].lockedRow && !this.right[row - 1].lockedRow && !this.left[row].lockedSide && !this.right[row - 1].lockedSide) {
                let tempValue = this.left[row];
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
            }
            if(!followPreferences || !this.right[row].lockedRow && !this.left[row - 1].lockedRow && !this.right[row].lockedSide && !this.left[row - 1].lockedSide) {
                let tempValue = this.right[row];
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
            }

            if(!followPreferences || !this.right[row].lockedRow && !this.right[row - 1].lockedRow) {
                let tempValue = this.right[row];
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

        }
        if (!this.compArrs(best, [-1,-1,-1])) {
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

    corseOptimiseBowStern(followPreferences=true) {
        const initialBowSternMoment = this.BowSternMoment();
        const initialPortStarboardMoment = this.PortStarboardMoment();
        let bestMoment = Math.abs(initialBowSternMoment);
        let bestLeft = -1;
        let bestRight = -1;
        //If negative back heavy/ right heavy
        let range = [0, 0, 0, 0];
        if (initialBowSternMoment < 0) {
            range = [5, 9, 0, 4];
        } else {
            range = [0, 4, 5, 9];
        }
        for (var initial = range[0]; initial <= range[1]; initial++) {
            for (var secondary = range[2]; secondary <= range[3]; secondary++) {
                if (initialPortStarboardMoment < 0) {                    
                    if (!followPreferences || (!this.left[secondary].lockedSide && !this.left[secondary].lockedRow && !this.right[initial].lockedRow && !this.right[initial].lockedSide)) {
                        let tempValue = this.left[secondary];
                        this.left[secondary] = this.right[initial];
                        this.right[initial] = tempValue;
                    }                    
                } else {
                    if (!followPreferences || (!this.right[secondary].lockedSide && !this.right[secondary].lockedRow && !this.left[initial].lockedRow && !this.left[initial].lockedSide)) {                    
                        let tempValue = this.left[initial];
                        this.left[initial] = this.right[secondary];
                        this.right[secondary] = tempValue;
                    }
                }
                
                let swappedMoment =this.BowSternMoment();
                if (Math.abs(swappedMoment) < bestMoment) {
                    if (initialPortStarboardMoment < 0) {
                        bestLeft = secondary;
                        bestRight = initial;
                    } else {
                        bestLeft = initial;
                        bestRight = secondary;
                    }
                    bestMoment = Math.abs(swappedMoment);
                }

                if (initialPortStarboardMoment < 0) {
                    if (!followPreferences || (!this.left[secondary].lockedSide && !this.left[secondary].lockedRow && !this.right[initial].lockedRow && !this.right[initial].lockedSide)) {
                        let tempValue = this.left[secondary];
                        this.left[secondary] = this.right[initial];
                        this.right[initial] = tempValue;
                    }
                } else {
                    if (!followPreferences || (!this.right[secondary].lockedSide && !this.right[secondary].lockedRow && !this.left[initial].lockedRow && !this.left[initial].lockedSide)) {                    
                        let tempValue = this.left[initial];
                        this.left[initial] = this.right[secondary];
                        this.right[secondary] = tempValue;
                    }  
                }

            }
        }

        if (bestLeft !== -1) {
            let temp = this.left[bestLeft];
            this.left[bestLeft] = this.right[bestRight];
            this.right[bestRight] = temp;
            return true;
        } else {
            return false;
        }

    }

    compArrs(arr1,arr2) {
        if (arr1.length !== arr2.length) {return false};
        for (var index = 0; index < arr1.length; index++) {
            if (arr1[index] !== arr2[index]) {return false;};
        }
        return true;
    }

    optimiseBoat() {
        let timeoutCounter = 0
        let flag = true;

        for (var counter = 0; counter < 5; counter++) {
            while (flag && timeoutCounter < 10000) {
                flag = this.corseOptimiseBowStern();
                timeoutCounter++;
            }
            timeoutCounter = 0
            flag = true;
            while (flag && timeoutCounter < 100) {
                flag = this.fineOptimiseBowStern();
                timeoutCounter++;
            }
            timeoutCounter = 9000
            flag = true;
        }
        
        timeoutCounter = 0
        flag = true;
        while (flag && timeoutCounter < 10000) {
            flag = this.optimisePortStarboard();
            timeoutCounter++;
        }

    }

    lockAndSave(sessionID, index, side) {
        const lockedSQL = "SELECT isLocked FROM sessionLink WHERE username=? AND sessionID=?";
        let currentArr;
        if (side=="L") {
            currentArr = this.left;
        } else {
            currentArr = this.right;
        }
        let initialSelect = databaseHandler.queryDB(lockedSQL, [currentArr[index].username, sessionID])
        return new Promise ((resolve,reject) => {
            Promise.allSettled([initialSelect]).then((value) => {
                const updateSQL = "UPDATE sessionlink SET isLocked=? WHERE username=? AND sessionID=?";
                let lockVal;
                if (value[0].value[0].isLocked == 0) {
                    lockVal = 1;
                } else {
                    lockVal = 0
                }
                let updater = databaseHandler.queryDB(updateSQL, [lockVal, currentArr[index].username, sessionID]);
                    Promise.allSettled([updater]).then((values) => {
                        resolve();
                    });
            })
        })
    }

    swapAndSave(sessionID, pos1Row, pos1Side, pos2Row, pos2Side) {
        let pos1Arr;
        let pos2Arr;
        if (pos1Side == "L") {
            pos1Arr = this.left;
        } else {
            pos1Arr = this.right;
        }

        if (pos2Side == "L") {
            pos2Arr = this.left;
        } else {
            pos2Arr = this.right;
        }

        let tempPaddler = pos1Arr[pos1Row];
        pos1Arr[pos1Row] = pos2Arr[pos2Row];
        pos2Arr[pos2Row] = tempPaddler;
        const updateSQL = "UPDATE sessionLink SET tempSide=?, tempRow=? WHERE username=? AND sessionID=?";
        let save1 = databaseHandler.queryDB(updateSQL, [pos2Side,pos2Row, pos2Arr[pos2Row].username, sessionID]);
        let save2 = databaseHandler.queryDB(updateSQL, [pos1Side,pos1Row, pos1Arr[pos1Row].username, sessionID]);

        return new Promise ((resolve, reject) => {
            Promise.allSettled([save1,save2]).then((values) => {
                resolve();
            });
        });
    }

    saveBoat(sessionID) {
        let promiseList = [];
        promiseList[promiseList.length] = databaseHandler.queryDB("UPDATE sessiontable SET designSaved=1 WHERE sessionID=?", [sessionID]);
        for (var row = 0; row < this.left.length; row++) {
            const updateLeft = "UPDATE sessionLink SET tempSide='L', tempRow=? WHERE username=? AND sessionID=?";
            const updateRight = "UPDATE sessionLink SET tempSide='R', tempRow=? WHERE username=? AND sessionID=?";
            if (!this.left[row].isNull) {
                promiseList[promiseList.length] = databaseHandler.queryDB(updateLeft, [row, this.left[row].username,sessionID]);
            }
            if (!this.right[row].isNull) {
                promiseList[promiseList.length] = databaseHandler.queryDB(updateRight, [row, this.right[row].username,sessionID]);
            }
        }
        return new Promise ((resolve, reject) => {
            Promise.allSettled(promiseList).then((values) => {          
                resolve();
            });
        });
    }

    calculatePortStarboardAngle() {
        return (this.PortStarboardMoment() / 30);
    }

    calculateBowSternAngle() {
        return (this.BowSternMoment() / -30);
    }

}

function sessionToBoat(sessionID) {
    const getBoatSQL = "SELECT boat.boatSize, boat.widthArray, boat.lengthArray, boat.boatName FROM boat INNER JOIN boatlink ON boat.boatID = boatlink.boatID WHERE boatlink.sessionID=?";
    const getPaddlersSQL = "SELECT paddlertable.username, paddlertable.gender, paddlertable.preference, paddlertable.weight, sessionlink.tempSide, sessionlink.tempRow, sessionlink.isLocked FROM paddlertable INNER JOIN sessionlink ON paddlertable.username = sessionlink.username WHERE sessionlink.sessionID = ?"
    const getIsSavedSQL = "SELECT designSaved FROM sessionTable WHERE sessionID=?"
    let boatData = databaseHandler.queryDB(getBoatSQL, [sessionID]);
    let paddlerList = databaseHandler.queryDB(getPaddlersSQL, [sessionID]);
    let isSaved = databaseHandler.queryDB(getIsSavedSQL, [sessionID]);
    return new Promise((resolve, reject) => {
        Promise.allSettled([boatData, paddlerList,isSaved]).then((values) => {
            let theBoat = new boat(values[0].value[0], values[1].value,values[2].value[0].designSaved);
            resolve(theBoat);
        });
    });
}

//Export the boat object
module.exports = boat;
module.exports.sessionToBoat = sessionToBoat;