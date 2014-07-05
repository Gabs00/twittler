$(document).ready(function(){
   /* var $body = $('body');
    $body.html('');

    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = $('<div></div>');
      $tweet.text('@' + tweet.user + ': ' + tweet.message);
      $tweet.appendTo($body);
      index -= 1;
    }
    */

    window.visitor = prompt('Please enter a username:'); //temporary setting
    streams.users[visitor] = [];

    var last = 0; //this keeps track of the last index pulled while checking for timeline updates
    var timeline = timeline_container('#history'); //timeline_container is in Timeline.js

    update_stream();
    setInterval(function(){ 
      update_stream();
    }, 15000);

    $('#send').on('click', function(){
      var text = $('#message').val();
      if(text){
        if(text.length > 140){
          alert('You can not send a tweet that is more than 140 characters long');
          return;
        }
        else{
          writeTweet(text);
          update_stream();
        }
       }

    });
    function update_stream(){
      var index = last;
        while(index < streams.home.length){
          var tweet = streams.home[index];
          var text = '@' + tweet.user + ': ' + tweet.message;
          timeline.add(text);
          index++;
        }
        last = index;
    }

});