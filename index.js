//Main code file
//Created by Callum Gilchrist
// Require needed library's for express
const express = require(`express`);
const ejs = require(`ejs`);
const cookieParser = require(`cookie-parser`);
const dotenv = require(`dotenv`).config();

//Import homemade modules
const routes = require(`./routes`);

//Create app object and set a "port" variable
const app = express();
const port = 3030;

//Allow the /public directory to be accessed by anyone
app.use(`/public`, express.static(`public`));

//Use EJS as the view engine to allow for template use
app.set(`view engine`, `ejs`);

//Allow the user to parse data to the sever through urlencoded and JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Allow the sever to parse cookies and set the secret
app.use(cookieParser(process.env.COOKIE_SECRET));

//Forward requests made to / to the routes module
app.use(`/`, routes);

//Listen on the port defined at the top of the program
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})