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
    function add_new(item){
        if(!item){
             return undefined;   
        }

        tl.displayed.unshift([item]);

        if(tl.length >= 10){
            var store = tl.displayed.pop().shift();
            if(tl.bottom.length < 100){
                tl.bottom.unshift(store);
            }
        }       
        
        tl.length++;
        tl.Update();
    }

    return {
        add: add_new,
    };
}