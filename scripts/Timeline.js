function Timeline(item_id, update, arrays, item_style){
    
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
Timeline.prototype.CONSTANTS = {
        max_display: [10,21], //Max hidden and max displayed are total entries stored
        max_hidden: 100,    
};

Timeline.prototype.Time = new Timeline_Time();
Timeline.prototype.Update = function(){ 
    //abstract, impliment in container
    throw new Error('You must define the Update method');
}

function timeline_container(item_id, update, outer_arrays,item_style){
    var tl = new Timeline(item_id, outer_arrays, item_style);
    tl.Update = update;

    var max_display = tl.CONSTANTS.max_display;
    var max_hidden = tl.CONSTANTS.max_hidden;

    //for tracking display area size
    var is_open = false;

    //adds a new item to the displayed list
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

        //Uses the higher value of max_display if the view is open
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
        max_display_open: function(amount){
            if(amount !== undefined){
                max_display[1] = amount;
            }
            return max_display[1];
            tl.Update();
        },
        less: less,
        CONSTANTS: function(){ return tl.CONSTANTS },
        is_open: function(){
            return is_open;
        },
        length: function(){
            return tl.length;
        }
    };
}