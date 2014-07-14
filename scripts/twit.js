$(document).ready(function(){

    window.visitor = prompt('Please enter a username:'); //temporary setting
    streams.users[visitor] = [];

    //Implimenting Timeline.prototype.Update
    var update = function(){ 
            $(this.list).empty();
            var len = this.displayed.length-1;
            for(var i = len; i >= 0; i--){
                    
                var value = this.displayed[i];
                var time_format = value[0].match(/\$(.+?)\$:/);
                this.Time.set_time(new Date(time_format[1]));
                var time_match = this.Time.gft();
                var out = value[0].replace('$'+time_format[1]+'$:', ': <sub>' +time_match+ '</sub>');
                var list_id = "h_" + i;
                
                $(value[1]).remove();
                    
                var new_item = $('<li>'+out+'</li>');
                $(new_item).attr('id', list_id);
                $(new_item).prependTo($(this.list));
                    
                value[1]=$(new_item);
            }
            this.length = this.displayed.length;
        }


    //timeline_container is in Timeline.js
    //manages the history and user timeline view
    var timeline = timeline_container('#history', update); 
    var initial_message = "Hello " + visitor + " your tweets will appear here for now...";
    var user_timeline = [visitor, timeline_container('#user', update)];

    //Keeps track of tweets seen when retrieving from streams
    var iter_hist = get_tweets(streams.home);
    var iter_user = get_tweets(streams.users[visitor]);

    update_stream();
    update_user_stream();

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
          if(text.length <= 0){
            return;
          }
          else{
            writeTweet(text);
            update_stream();
            update_user_stream();
          }
         }
    });

    //Trigger for when a username is clicked, changes the user_timeline to the target
    $('#history').on('click','.users', function(event) {
        $('#user').empty();

        //Changes current user timeline
        var username = $(this).attr('id');
        user_timeline = [username, timeline_container('#user', update)];
        iter_user= get_tweets(user_timeline[1]);
        update_user_stream();
        $('body').click();
        
        event.stopImmediatePropagation();

      });

    function update_stream(){
      var tweet;

        while(tweet = iter_hist(streams.home)){
          var span = '<span class="users" id="'+ tweet.user+'""><em>@'
                              + tweet.user +'</em></span>$'+tweet.created_at+'$';
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

          var span = '<span><em>@' + tweet.user +'</em></span>$'+tweet.created_at+'$';
          var text = span + ': ' + tweet.message;
          
          user_timeline[1].add(text);
      }
    }

  //Manages getting a single tweet
  //works with both streams.home and streams.users[username]
  function get_tweets(tweet_array){
    var index = 0;
    return function(updated_array){
        var tweet;
        if(updated_array){
          tweet_array = updated_array;
        }
        
        if(tweet_array.length > index){
          var tweet = tweet_array[index];
          index++;
        }
        
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
          var tl= user_timeline[1];
          var other_tl = timeline;

          if($(this).attr('id') === $(other).attr('id')){
              other = panels[1];
              other_tl = user_timeline[1];
              tl = timeline;
          }
          
          var _this_height = $(this).attr('height');
          var _other_height = $(other).attr('height');

          other_tl.less();
          var tl_constants = tl.CONSTANTS();

          if(tl.length() < tl_constants.max_display[1]){
            tl.more();
          }

          update_stream();
          update_user_stream();
          $(other).animate({height:"0"},
                                     { duration:300, 
                                       complete: function(){
                                           $(this).hide();
                                       }
                                     });
          $(this).animate({height:"540"},300);
          $(this).addClass('scrollbars');

          $(other).removeClass('scrollbars');
          $(other).off('scroll');
          var scrolled = $(this).scrollTop();

          $(this).on('scroll', function(){
              if(scrolled+20 <= $(this).scrollTop()){
                tl.max_display_open(tl.max_display_open()+2);
                tl.more();
                scrolled = $(this).scrollTop();
              }
          })
          event.stopImmediatePropagation();
      });
      //Clicking the body resets the view
      $('body').on('click', function(event){
          var target = $(event.target).parent();
          var parent = panels[3];
          if($(target).attr('id') !== $(parent).attr('id')){
              if($(panels[0]).height() > panels[4] ) {
                  var max = timeline.CONSTANTS();
                  $(panels[1]).show();
                  timeline.max_display_open(max.max_display[1]);
                  timeline.less();
                 
                             
              }
              else{
                  $(panels[0]).show();
                  var max = user_timeline[1].CONSTANTS();
                  user_timeline[1].max_display_open(max.max_display[1]);
                  user_timeline[1].less();         
              }
              $(panels[0]).animate({height:panels[4]});
              $(panels[1]).animate({height:panels[5]});
          }
      })
    }

});