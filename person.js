//Require database access
const db = require("./databaseHandler");

//Define person object
class person {
    constructor (username=null, gender=null, weight=0, pref=null) {
        if (username == null) {
            this.isNull = true;
        } else {
            this.isNull = false;
        }
        this.username = username;
        this.gender = gender;
        this.perf =  pref;
        this.weight =  weight;
        this.lockedSide = false;
        this.lockedRow = false;
    }

    valid () {
        if (this.weight == undefined) { return false}
        return true;
    }
}
module.exports = person;