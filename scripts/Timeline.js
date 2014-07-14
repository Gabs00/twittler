function Timeline(item_id, arrays, item_style){
    
    if(!arrays){
        arrays = [[],[]];   
    }
    this.list = item_id;
    this.displayed = arrays[0];
    this.hidden = arrays[1];
    
    if(item_style){
        $(this.list).addClass(item_style);  
    }
    Object.defineProperty(this, 'length', {
        writable:true,
        enumerable: false,
        value: this.displayed.length
    });
}

Timeline.prototype = new Object();
Timeline.prototype.constructor = new Timeline();
Timeline.prototype.limits = {
        max_display: [10,21], //Max hidden and max displayed are total entries stored
        max_hidden: 100,    
};

Timeline.prototype.get_time = function(date){
    var now = new Date(Date.now());
    if(same_hour(date, now)){
     return get_diff(date, now);
    }
    else{
        var ampm;
        if(date.getHours() > 12){
            ampm = " pm";
        }
        else{
            ampm = " am";
        }
        var time = date.getDate()+"/"+date.getMonth()+ " "+date.getHours() + ":" +date.getMinutes()+ampm;
        return time;
    }
    
    function same_hour(start, end){
        if(start.getHours()-end.getHours()===0){
            if(start.getDate()-end.getDate() === 0){
                if(start.getMonth()-end.getMonth()===0){
                    if(start.getFullYear()-end.getFullYear()===0){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    function get_diff(start, end){
        var min_diff = end.getMinutes() - start.getMinutes();
        if(min_diff){
            return min_diff + " minutes ago";
        }
        else{
            return (end.getSeconds() - start.getSeconds())+
            " seconds ago";
        }
    }
}
Timeline.prototype.Update = function(){ 
    $(this.list).empty();
    var len = this.displayed.length-1;
    for(var i = len; i >= 0; i--){
            
        var value = this.displayed[i];
        var time_format = value[0].match(/\$(.+?)\$:/);
        var time_match = this.get_time(new Date(time_format[1]));
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

function timeline_container(item_id, outer_arrays,item_style){
    var tl = new Timeline(item_id, outer_arrays, item_style);

    var max_display = tl.limits.max_display;
    var max_hidden = tl.limits.max_hidden;

    //for tracking display area size
    var is_open = false;

    function add_new(item, caller){
        if(item === undefined){
             return undefined;   
        }

        if(caller === 'more'){
            tl.displayed.push([item]);
        }
        else{
            tl.displayed.unshift([item]);
        }

        var curr_max = is_open ? max_display[1]:max_display[0];

        if(tl.length >= curr_max){

            var store = tl.displayed.pop().shift();

            if(tl.hidden.length >= max_hidden){
                tl.hidden.pop();                
            }

            tl.hidden.unshift(store);
        }       
        
        tl.Update();
    }

    function more(amount){
        is_open = true;
        var max = max_display[1] - max_display[0];

        if(amount === undefined){
            amount = max;   
        }

        if(amount > tl.hidden.length){
            amount= tl.hidden.length;   
        }

        var i = 0;
        while(i < amount){
            add_new(tl.hidden.shift(), 'more');
            i++;
        }     
    }
    
    function less(amount){
        var max = tl.displayed.length - max_display[0];
        is_open = false;

        if(amount === undefined){
             amount = max;
        }

        if(amount > max){
            amount = 0;
        }

        var i = 0;
        while(i < amount){
            tl.hidden.unshift(tl.displayed.pop().shift()); 
            tl.Update();
            i++;
        }
        

        
    }
    return {
        add: add_new,
        more: more,
        max_display_opend: function(amount){
            if(amount !== undefined){
                max_display[1] = amount;
            }
            return max_display[1];
            tl.Update();
        }
        less: less,
        limits: tl.limits,
        is_open: function(){
            return is_open;
        },
        length: function(){
            return tl.length;
        }
    };
}