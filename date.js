// The 1st function is quite long and more space consuming and second is shorter and comparitively less space consuming

// 1st function ----------------------------------------------------
module.exports.dayTime = dayTime;

function dayTime(){
    const today = new Date();
    //   const currentDay = today.getDay();
    // it has many things search it on stackoverflow
    const options = {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "numeric",
        month: "short", 
        year: "2-digit",
    };
    const day = today.toLocaleDateString("en-IN", options);
    
    return day;
}
// 2nd function -----------------------------------------------------

exports.dayDate = function(){
    const today = new Date();
    //   const currentDay = today.getDay();
    // it has many things search it on stackoverflow
    const options = {
        weekday: "long",
        day: "numeric",
        month: "short"
    };
    
    return today.toLocaleDateString("en-IN", options);
}