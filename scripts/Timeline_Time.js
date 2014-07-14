function Timeline_Time(date){
    if(date !== undefined){
        this.end = new Date(Date.now()); //end time is now
        this.date = date;
    }
    this.self = this;
}

Timeline_Time.prototype = new Object();
Timeline_Time.prototype.constructor = new Timeline_Time();
Timeline_Time.prototype.set_time = function(date){
    this.date = date;
    this.end = new Date(Date.now());
}

//Gets the formatted time
Timeline_Time.prototype.get_formatted_time = function(){
    var end = self.end;
    var start = self.date;
    if(self.same_hour(self)){
        self.time = self.get_diff(self);
    }
    else{
        self.time = date.getDate()+"/"+date.getMonth()+ " "+date.getHours() + ":" +date.getMinutes()+ self.am_pm(self);
        return time;
    }
}

//Shorthand for get_formatted_time
Timeline_Time.prototype.gft = function(){
    self = this.self;
    this.get_formatted_time(this);
    return this.time;
}

//Checks if time is in the am or pm
Timeline_Time.prototype.am_pm = function(){
    var end = self.end;
    var start = self.date;

    if(date.getHours() > 12){
        self.ap = " pm";
    }
    else{
        self.ap = " am";
    }    
}

//Checks if start time and end time are in the exact same hour
Timeline_Time.prototype.same_hour = function(){
        var end = self.end;
        var start = self.date;
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

//gets the difference between now / provided time and now/ end time
Timeline_Time.prototype.get_diff = function(){
        var end = self.end;
        var start = self.date;

        var min_diff = end.getMinutes() - start.getMinutes();
        if(min_diff){
            return min_diff + " minutes ago";
        }
        else{
            return (end.getSeconds() - start.getSeconds())+
            " seconds ago";
        }
}