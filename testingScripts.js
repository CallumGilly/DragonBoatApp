const boat = require('./boat');
let test = boat.sessionToBoat(5);
test.then((value) => {
    console.log(value);
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
    console.log(value.optimiseBoat());
    console.log([value.BowSternMoment(),value.PortStarboardMoment()]);
})