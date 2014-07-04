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
    update_stream();
    function update_stream(){
        var index = streams.home.length-1;
        while(index >=0){
          var tweet = streams.home[index];
          var text = '@' + tweet.user + ': ' + tweet.message;
          var div = create_div('<div></div>', text, 'messages');
          var history = $('#history').children();
          if($(history).length >= 10){
             $('history').last().remove();
          }
          $(div).prependTo('#history');
          index-=1;
        }
    }

    function create_div(type, text, item_class, item_id){
      if(!type){
        return undefined;
      }
      var new_div = $(type);
      if(item_class){
        $(new_div).prop('class', item_class);
      }
      if(item_id){
        $(new_div).prop('id', item_id)
      }
      if(text){
        $(new_div).text(text);
      }
      return new_div;
    }

});