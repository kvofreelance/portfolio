// Fastclick
// ------------------
$(function() {
    FastClick.attach(document.body);

    // Load list of categories. (For portfolio)
    // ---------------
    // Example:
    // <a href="#" class="filter" data-filter="all">All</a> 
    // <a href="#" class="filter" data-filter="web-design"> iOS</a> 
    // <a href="#" class="filter" data-filter="print"> Android</a> 
    // <a href="#" class="filter" data-filter="illustration">HTML5-based</a>
    // <hr>
    // ---------------
    $.fn.loadCategories = function(){
    	var element = this;
    	$.getJSON( "json/categories.json", function( data ) {
		  var html = "";
		  $.each( data, function( id, item ) {
		  	var itemHtml = "<a href='#' class='filter' data-filter='" + item.filter + "'> " + item.title + "</a>";
		  	html += itemHtml;
		  });
		  html += "<hr>"

		 $(element).html(html);

			$("#item-choice a").click(function(e){
				e.preventDefault();
			});
		});
    }

    $.fn.loadSiteName = function(){
    	var element = this;
    	$.getJSON( "json/settings.json", function( data ) {
		  $(element).html(data.title);
		});
    }

    $.fn.loadNavBar = function(){
    	var element = this;
    	$.getJSON( "json/settings.json", function( data ) {
		  var html = "<nav><ul class='list-inline' id='menu'>";
		  var current_path = window.location.pathname.split('/').pop();
		  $.each( data.menu, function( id, item ) {
		  	if(current_path === item.url) {
				html += "<li class=' active'><a href='"+item.url+"'>"+item.name+"</a></li>";
		  	} else {
		  		html += "<li><a href='"+item.url+"'>"+item.name+"</a></li>";
		  	}
		  });
		  html += "</ul></nav>"

		  $(element).html(html);
		});
    }

    $('#item-choice').loadCategories();
    $('#name > a ').loadSiteName();
    $('#navbar').loadNavBar();

    $.fn.loadProjectsList = function(){
    	$.getJSON( "json/projects-list.json", function( data ) {

    	  var html = "";
		  $.each( data, function( id, item ) {
		  	var jsonData = $.fn.getSyncData(item);
		  	var itemHtml = $.fn.createIntroProjectCard(jsonData, item);
		  	html += itemHtml;
		  	//console.log(itemHtml);
		  });

		  $('#Grid').html(html);

		  $('#Grid').mixitup();
   		});
   	}

   	$.fn.getSyncData = function(item) {
   		return $.parseJSON(
			$.ajax(
			    {
			       url: item, 
			       async: false,
			       dataType: 'json'
			    }
			).responseText
		);
   	}

   	$.fn.createIntroProjectCard = function(jsonData, filename) {
   		// Parse category
   		var category_list = "";
   		$.each( jsonData.categories, function( id, item ) {
		  	if(id == 0) {
		  		category_list += item;
		  	} else {
		  		category_list += (", "+item);
		  	}
		});

		// Parse tags
   		var tags_list = "";
   		$.each( jsonData.tags, function( id, item ) {
		  	if(id == jsonData.tags.length - 1) {
		  		tags_list += ("<a href='#'> "+item+"</a>");
		  	} else {
		  		tags_list += ("<a href='#'> "+item+"</a>,");
		  	}
		});

   		var html =  "<div data-filter='"+jsonData.filter+"' class='col-lg-6 col-md-12 col-sm-12 col-xs-6 mix "+jsonData.filter+"'>"+
				 		"<div class='panel panel-default item'>"+
                            "<div class='panel-heading'>"+
                                "<a href='project-example.html?file="+encodeURIComponent(filename)+"'>"+
                                    "<img class='img-responsive item-img' src='"+jsonData.image_thumb+"' alt='"+jsonData.project_name+"'>"+
                                "</a>"+
                            "</div>"+
                            	"<div class='panel-body'>"+
                                    "<a href='project-example.html'><h4 class='item-title'>"+jsonData.project_name+"</h4></a>"+
                                    "<p class='item-category'><span style='color: black; font-style: normal;'>Platforms: </span>"+category_list+"</p>"+
                                    "<p class='item-description'>"+jsonData.short_description+"</p>"+
                                    "<hr>"+
                                    "<p class='item-tags'>"+tags_list+"</p>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
        return html;
   	}

    $.fn.createFulldescription = function(){
      var url = decodeURIComponent((new RegExp('[?|&]file=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
      if (url != null) {
        var jsonData = $.fn.getSyncData(url);

        // Insert carousel
        var carouselHtml = $.fn.createCarouselHtml(jsonData.images);
        $('#myCarousel').html(carouselHtml);
        $('.carousel').carousel({
          interval: 5000
        });

        $('#project_title').html(jsonData.project_name);

        var tagsHtml = "";
        $.each( jsonData.tags, function( id, item ) {
          if(id == jsonData.tags.length) {
            tagsHtml += ("<a href='#'> "+item+"</a>");
          } else {
            tagsHtml += ("<a href='#'> "+item+"</a>,");
          }
        });
        $('#item-tags-full').html(tagsHtml);

        $('#item-description').html(jsonData.full_description);

        console.log(jsonData);
      }
    }

    $.fn.createCarouselHtml = function(imgArray) {
      var html = "<ol class='carousel-indicators'>";
      $.each( imgArray, function( id, item ) {
        if(id == 0) {
          html += ("<li data-target='#myCarousel' data-slide-to='"+id+"' class='active'></li>");
        } else {
          html += ("<li data-target='#myCarousel' data-slide-to='"+id+"'></li>");
        }
      });
      html += "</ol>";
      html += "<div class='carousel-inner' style='height:367px'>";
      $.each( imgArray, function( id, item ) {
        if(id == 0) {
          html += ("<div class='active item'><img src='"+item+"' class='carousel-image' alt=''></div>");
        } else {
          html += ("<div class='item'><img src='"+item+"' class='carousel-image' alt=''></div>");
        }
      });
      html += "</div>";
      html += ("<a class='carousel-control left' href='#myCarousel' data-slide='prev'>&lsaquo;</a>"+
              "<a class='carousel-control right' href='#myCarousel' data-slide='next'>&rsaquo;</a>");

      return html;
    }

   	$.fn.loadProjectsList();
    $.fn.createFulldescription();

});

   	

// Load more
// ------------------
var loadMoreContent = "";

$("a.load-more").click(function(e){
    e.preventDefault();
    if(loadMoreContent == "")
        loadMoreContent = $(this).prev().html();
    
    $(this).prev().append(loadMoreContent);
});


// Scroll TOP
// ------------------
$("a.scroll-top").click(function(e){
    e.preventDefault();
    $.smoothScroll({offset:0});
})


// Portfolio
// ------------------


