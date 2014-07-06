$(document).ready(function(){

    window.visitor = prompt('Please enter a username:'); //temporary setting
    streams.users[visitor] = [];

    //timeline_container is in Timeline.js
    //manages the history and user timeline view
    var timeline = timeline_container('#history'); 
    var user_timeline = [visitor, timeline_container('#user')];

    //Keeps track of tweets seen when retrieving from streams
    var iter_hist = get_tweets(streams.home);
    var iter_user = get_tweets(streams.users[user_timeline[0]]);

    update_stream();
    setInterval(function(){ 
      update_stream();
    }, 10000);

    //Manages the on click events that control css animations
    init_animations(['#div-history', '.user-timeline', '.send-tweet', '#view',
      $('#div-history').height(), $('.user-timeline').height()]);

    $('#send').on('click', function(){
        if(!visitor){
          return;
        }

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

    $('#history').on('click','.users', function(event) {
        $('#user').empty();

        //Changes current user timeline
        var username = $(this).attr('id');
        user_timeline = [username, timeline_container('#user')];
        iter_user= get_tweets(user_timeline[1]);
        
        event.stopImmediatePropagation();
        update_user_stream();
      });

    function update_stream(){
      var tweet;

        while(tweet = iter_hist(streams.home)){
          var span = '<span class="users" id="'+ tweet.user+'""><em>@'
                              + tweet.user +'</em></span>';
          var text = span + ': ' + tweet.message;
          timeline.add(text);
          if(tweet.user === user_timeline[0]){
            update_user_stream();
          }
        }
    }

    function update_user_stream(){
      var tweet;

      while(tweet = iter_user(streams.users[user_timeline[0]])){
          var span = '<span><em>@' + tweet.user +'</em></span>';
          var text = span + ': ' + tweet.message;
          
          user_timeline[1].add(text);
      }
    }

  //Manages getting a single tweet
  //works with both streams.home and streams.users[username]
  function get_tweets(tweet_array){
    var index = 0;
    return function(updated_array){
        var tweet
        if(updated_array){
          tweet = updated_array[index];
          tweet_array = updated_array;
        }
        else if(tweet_array > index){
          var tweet = tweet_array[index];
        }
        index++;
        return tweet;
      }
  }
  
  function init_animations(panels){

      //panel = [history_div, user-timeline_div, send-message_div, parent_div
      // history_div_height, user-timeline_div_height]  

      //sets on click for moving timeline divs  
      $(panels.slice(0,3).join(', ')).on('click', function(event){

          //Only triggers when #div-history is collapsed
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
      
      //Clicking the body resets the view
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