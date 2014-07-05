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

    init_animations(['#div-history', '.user-timeline', '.send-tweet', '#view',
     $('#div-history').height(), $('.user-timeline').height()]);

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

function init_animations(panels){    
    $(panels.slice(0,3).join(', ')).on('click', function(event){
        if($(this).attr('class') == $(panels[2]).attr('class')){
            if($(panels[0]).height() < panels[4]){
                $('body').click();
                $(panels[0]).click();
            }
            event.stopImmediatePropagation();
            return;
        }
        var other = panels[0];
        if($(this).attr('id') === $(other).attr('id')){
            other = panels[1];   
        }
        
        var _this_height = $(this).attr('height');
        var _other_height = $(other).attr('height');
        $(other).animate({height:"0"},
                                   { duration:300, 
                                     complete: function(){
                                         $(this).hide();
                                     }
                                   });
        $(this).animate({height:"540"},300);
        event.stopImmediatePropagation();
    });
    
    $('body').on('click', function(event){
        var target = $(event.target).parent();
        var parent = panels[3];
        if($(target).attr('id') !== $(parent).attr('id')){
            if($(panels[0]).height() > panels[4] ) {
                $(panels[1]).show();            
            }
            else{
                $(panels[0]).show()            
            }
            $(panels[0]).animate({height:panels[4]});
            $(panels[1]).animate({height:panels[5]});
        }
    })
  }

});