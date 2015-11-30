$(window).load(function(){

  regex();
  clickevent();

  $("#instagram-list li .text").click(function(){
    alert("test");
  });

  // INITIALIZE MASONRY SELECTOR
 	var msnry = new Masonry('#instagram-list',{
   	itemSelector: '#instagram-list li',
   	columnWidth: '.grid-sizer',
   	gutter: 20,
 	});

 	setInterval(function(){
	  msnry.reloadItems();
	  msnry.layout();
    setTimeout(getUrl, 1500);
    setTimeout(regex, 1500);
  },100);

});

$(window).resize(function(){
    var win = $(this); //this = window
    if (win.height() >= 820) {
      var msnry = new Masonry('#instagram-list',{
        itemSelector: '#instagram-list li',
        columnWidth: 250,
        gutter: 20,
      });

      setInterval(function(){
    msnry.reloadItems();
    msnry.layout();
    setTimeout(getUrl, 1500);
    setTimeout(regex, 1500);
  },100);
    }
});

// ADD CLICKED HASHTAG TO SEARCHBAR
function clickevent(){
  $('#instagram-list li .text a.hashtags').click(function() {
    alert("test");
    var $hashtag = $(this).text();
    var $formattedText = $hashtag.replace(/#([^ ]+)/g, "$1");
    $('#search').val($formattedText);
    //angular.element(document.getElementById('search')).scope().change().setTimeout(1500);
  });
}

function regex(){
  // REGEX FOR HASHTAGS
  $("#instagram-list li .text").each(function() {
    
      var $this = $(this),
        thisText = $this.text(),
        formattedText = thisText.replace(/#([^ ]+)/g, "<a class='hashtags'> #$1</a>");
      $this.html(formattedText);
              
  });

  // REGEX FOR AD (USERNAMES)
  $("#instagram-list li .text:contains('@')").html(function(_, html) {
      return html.replace(/@([^ ]+)/g, "<a class='username' href='https://instagram.com/$1' target='_blank'>@$1</a>");
  });
}

function getUrl() { 

  $('.instagram-item .videourl').each(function () { 
    
    if($(this).html().length > 0){
      $(this).siblings('.image').append('<i id="video" class="fa fa-play fa-3x"></i>');
    }
  });

}

setTimeout(getUrl, 1500);

