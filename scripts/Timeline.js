function Timeline(item_id, arrays, item_style){
    
    if(!arrays){
        arrays = [[],[],[]];   
    }
    this.list = item_id;
    this.top = arrays[0];
    this.displayed = arrays[1];
    this.bottom = arrays[2];
    
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
        max_display: [10,22],
        max_bottom: 100,
        max_top: 100,
};

Timeline.prototype.Update = function(){ 
    $(this.list).empty();
    var len = this.displayed.length-1;
    for(var i = len; i >= 0; i--){
            
        var value = this.displayed[i];
        var list_id = "h_" + i;
        
        $(value[1]).remove();
            
        var new_item = $('<li>'+value[0]+'</li>');
        $(new_item).attr('id', list_id);
        $(new_item).prependTo($(this.list));
            
        value[1]=$(new_item);
    }
}

function timeline_container(item_id, outer_arrays,item_style){
    var tl = new Timeline(item_id, outer_arrays, item_style);
    var max_display = tl.limits.max_display;
    var max_bottom = tl.limits.max_bottom;
    var max_top = tl.limits.max_top;
    function add_new(item){
        if(item === undefined){
             return undefined;   
        }

        tl.displayed.unshift([item]);

        if(tl.length >= max_display[0]){
            var store = tl.displayed.pop().shift();
            if(tl.bottom.length < max_bottom){
                tl.bottom.unshift(store);
            }
        }       
        
        tl.length++;
        tl.Update();
    }

    function more(amount){
        var max = max_display[1] - max_display[0];
        if(amount === undefined){
            amount = max;   
        }
        if(amount > tl.bottom.length){
            amount= tl.bottom.length;   
        }
        var i = 0;
        while(i < amount){
            tl.displayed.push([tl.bottom.shift()]);
            tl.length++;
            i++;   
        }
        
        tl.Update();        
    }
    
    function less(amount){
        var max = tl.displayed.length - max_display[0];

        if(amount === undefined){
             amount = max;
        }

        if(amount > max){
            amount = 0;
        }

        var i = 0;
        while(i < amount){
            tl.bottom.unshift(tl.displayed.pop().shift()); 
            tl.length--;
            i++;
        }
        tl.Update();
    }
    return {
        add: add_new,
        more: more,
        less: less,
        limits: tl.limits,
    };
}