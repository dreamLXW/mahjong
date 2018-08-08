var TimeHelper =  {
   
};

TimeHelper.getFormatTime = function(createTime,formatStr){//%Y%M%D%h%m%s
    var date = new Date(createTime);
    var Y = date.getFullYear();
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
    var D = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
    var h = date.getHours() < 10 ? ('0'+date.getHours()) : date.getHours();;
    var m = date.getMinutes() < 10 ? ('0'+date.getMinutes()) : date.getMinutes();;
    var s = date.getSeconds() < 10 ? ('0'+date.getSeconds()) : date.getSeconds();; 
    var newStr = formatStr.replace('%Y',Y).replace('%M',M).replace('%D',D).replace('%h',h).replace('%m',m).replace('%s',s);
    return newStr;
},

TimeHelper.getSpendTime = function(speed,fromPos,toPos){
    var x = Math.abs(toPos.x - fromPos.x);
    var y = Math.abs(toPos.y = fromPos.y);
    var distance = Math.pow((x*x,y*y),0.5);
    var time = distance / speed;
    time = Math.ceil(time * 10000) * 0.0001;
    time = time <= 0 ? 0.0001 : time;
    console.log("getSpendTime distance " + distance + " speed " + speed + " time " + time); 
    return time;
},

TimeHelper.getDeltaDayBetween = function(time1,time2){//两个时间戳相差多少天
    var date1 = new Date(time1);
    var date2 = new Date(time2);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setMilliseconds(0);
    var oneHourMilSecond = 24 * 60 * 60 * 1000;
    var dalta = parseInt((date1.getTime() - date2.getTime()) / oneHourMilSecond );
    console.log("相差多少天 = " + dalta);
    return dalta;
},

TimeHelper.changeDateToZeroTime = function(date){//返回时间的0时时间
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
},

module.exports = TimeHelper;