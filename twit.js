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


    var history_divs = (function(){
        var max = 10;
        var results = [];
        for(var i = 0; i < max; i++){
          results.push(create_elem('<div hidden></div>', '', 'messages', 'm_'+i));
          $(results[i]).prependTo('#history');
        }
        return results;
    })();
    update_stream();
    setInterval(function(){ 
      update_stream();
    }, 15000);

    function update_stream(){
        var index = streams.home.length-1;
        while(index >=0){
          var tweet = streams.home[index];
          var text = '@' + tweet.user + ': ' + tweet.message;
          var div = history_divs[index];
          $(div).text(text);
          $(div).show();
          index-=1;
        }
    }

    function create_elem(type, text, item_class, item_id){
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