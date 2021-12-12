const boat = require('./boat');
let test = boat.sessionToBoat(5);
test.then((value) => {
    console.log(value);
})