# MongoScrape

### Overview

A web app that allows user to scrape news from the New York Times Technology website and then save favorite articles. The user can view and leave notes on the latest news. The user can then delete notes and delete articles.

### Technology

1. node

2. express

3. express-handlebars

4. mongo database

5. mongoose

6. body-parser

7. cheerio

8. request

9. deployed to Heroku: https://radiant-escarpment-51895.herokuapp.com/

10. mLab for Heroku deployment.

## Instructions

* App:

  1. When the user scrapes the website, the following will be displayed:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. 
