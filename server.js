var express = require("express");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

// Our scraping tools

var request = require("request");
var cheerio = require("cheerio");

// Set Handlebars.
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScraper", {
  useMongoClient: true
});

// Depending if you are doing a local host or heroku this depends on the switch
// mongoose.connect("mongodb://heroku_qklsgtbh:1ve7j2b8kaftm428vs89fadnol@ds113746.mlab.com:13746/heroku_qklsgtbh");

// requiring routes
var routes = require("./controllers/controllers.js");
app.use("/", routes);

var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});