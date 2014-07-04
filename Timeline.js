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
    var self = this;
    this.displayed.forEach(
        function(value, index){
            var list_id = "h_" + index;
            if(value[1]){
                if(value[0] !== $(value[1]).html()){
                    
                     $(list_id).val(value[0]);
                    value.push($(list_id));
                }
            }
            else{
                var new_item = $('<li>'+value[0]+'</li>');
                $(new_item).attr('id', list_id);
                console.log($(new_item).html())
                $(new_item).prependTo($(self.list));
                value.push($(new_item));
                
            }
        })
}

function timeline_container(item_id, outer_arrays,item_style){
    var tl = new Timeline(item_id, outer_arrays, item_style);
    function add_new(item){
        if(!item){
             return undefined;   
        }
        if(tl.length >= 10){
            tl.bottom.unshift(tl.displayed.pop().shift());
        }
        
        tl.displayed.unshift([item]);
        tl.length++;
        tl.Update();
    }
    function show_display(){
        return tl.displayed.toString() || 0;   
    }
    return {
        add: add_new,
        display: show_display,
    };
}


var l = timeline_container('#history', undefined, '.history');
l.add('hello');
l.add('world');
l.add('!')