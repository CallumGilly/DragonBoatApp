//Require database access
const db = require("./databaseHandler");

//Define person object
class person {
    constructor (username=null, gender=null, weight=0, pref=null, dbLocked=false) {
        if (username == null) {
            this.isNull = true;
        } else {
            this.isNull = false;
        }
        this.username = username;
        this.gender = gender;
        this.perf =  pref;
        this.weight =  weight;
        if (dbLocked == 1) {
            dbLocked = true;
        } else {
            dbLocked = false;
        }
        this.lockedSide = dbLocked;
        this.lockedRow = dbLocked;
    }

    valid () {
        if (this.weight == undefined) { return false}
        return true;
    }
}
module.exports = person;