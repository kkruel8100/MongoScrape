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

// Route for posting saves Articles to the db
app.post("/save", function(req, res) {

  db.Article.find({ title: req.body.title }, function(err, docs) {
    if (!docs.length) {
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

    } else {
      console.log("Article exists.");
    }
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for deleting Article from the db
app.post("/delete/:id", function(req, res) {

  db.Article
    .findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      noteId = dbArticle.note;
      if (noteId) {
        db.Note.findByIdAndRemove(noteId, function(error, done) {
          if (error) {
            console.log(error);
          }
        });
      }
    });

  db.Article.findByIdAndRemove(req.params.id, function(error, done) {
    if (error) {
      console.log(error);
    } else {
      res.send({ reload: true });
    }
  });
});

// Route for deleting Note from the db
app.post("/deletenote/:noteId", function(req, res) {

  db.Note.findByIdAndRemove(req.params.noteId, function(error, done) {
    if (error) {
      console.log(error);
    } else {
      res.send({ reload: true });
    }
  });
});

module.exports = app;