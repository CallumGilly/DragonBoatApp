//Require database access
const db = require("./databaseHandler");

//Define person object
class person {
    constructor (username, gender, weight, pref) {
        this.username = username;
        this.gender = gender;
        this.perf =  pref;
        this.weight =  weight;
        this.locked = false;
    }

    valid () {
        if (this.weight == undefined) { return false}
        return true;
    }
}
module.exports = person;