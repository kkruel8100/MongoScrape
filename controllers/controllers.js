var express = require("express");

var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var index = require("./../models/index.js");

// Initialize Express
var app = express();

// Require all models
var db = require("../models");

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.render("index", {
    title: "Mongo Scraper"
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {

  request("https://www.nytimes.com/section/technology", function(error, response, html) {
    // Load the html body from request into chehttps://stackoverflow.com/questionserio
    var $ = cheerio.load(html);

    var newScrape = [];

    $("#latest-panel .story-body a").each(function(i, element) {

      var title = $(this)
        .find(".story-meta h2.headline")
        .text();
      var link = $(this)
        .attr("href");
      var summary = $(this)
        .find(".story-meta p.summary")
        .text();

      var news = {
        title: title,
        link: link,
        summary: summary
      };

      if (title) {
        newScrape.push(news);
      }
    });
    res.json(newScrape);
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/save", function(req, res) {
  console.log(req.body);
  db.Article
    .create(req.body)
    .then(function(dbArticle) {
      // If we were able to successfully scrape and save an Article, send a message to the client
      return res.send("Add Complete");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

module.exports = app;