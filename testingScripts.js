const boat = require('./boat');
let test = boat.sessionToBoat(5);
test.then((value) => {
    // console.log(value);
    console.log(value.BowSternMoment());
    console.log(value.fineOptimiseBowStern());
    console.log(value.BowSternMoment());
    console.log(value.fineOptimiseBowStern());
    console.log(value.BowSternMoment());
    console.log(value.fineOptimiseBowStern());
    console.log(value.BowSternMoment());
})