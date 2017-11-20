$(document).ready(function() {

  $("#scrapeArticles").on("click", function() {

    $("#articles").empty();

    $.get("/scrape").done(function(result) {

      $.each(result, function(index, value) {
        var title = value.title;
        var link = value.link;
        var summary = value.summary;
        $("#articles").append("<div class='article'><p><h4>" + title + "</h4>\n<a href=" + link + " target='_blank'>" + link + "</a><br/>" + summary + "\n<button id = 'saved' data-title='" + title + "' data-link='" + link + "' data-summary='" + summary + "' type='submit' class='saveBtn btn btn-default pull-right' type='submit'>Save</button>\n</p></div>");
        return index < 20;
      }); //End each result
    }); //End get Route
  });

  // // When you click the savenote button
  $(document).on("click", "#saved", function() {

    var savedArticle = {
      title: $(this).attr("data-title"),
      link: $(this).attr("data-link"),
      summary: $(this).attr("data-summary")
    };
    $.post("/save", savedArticle).done(function(result) {});

    $(this).addClass("blue");
    $(this).text("Saved");

  });

  $("#saveArticles").on("click", function() {
    $("#articles").empty();

    $.getJSON("/articles", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display information on the page
        $("#articles").append("<div class='article'><p data-id='" + data[i]._id + "'><h4>" + data[i].title + "</h4>\n<a href=" + data[i].link + " target='_blank'>" + data[i].link + "</a><br/>" + data[i].summary + "<br /></p></div>");

      }
    });
  });

});