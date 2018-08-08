var UserMsg = function(userMsg){
    this.type = userMsg.type;
}
var ClubMsg = function(clubMsg){
    this.type = clubMsg.type;//4 好友圈有成员申请加入 5 权限有变动
    this.clubId = clubMsg.clubId;
}
var NoCheckMessageData =  {
    "keyMap" : {
        "1000":{"type":"single"},//好友圈消息
        "1001":{"type":"single"},//用户申请消息
        "1002":{"type":"multi"},//某个好友圈消息
        "1003":{"type":"multi"},//某个好友圈成员消息
        "4":{"type":"multi"},//某个好友圈申请记录消息
        "5":{"type":"multi"},//某个好友圈权限有变动
    },
    "valueMap":{},
};

var relateMap = {
    "1000":["1001","1002"],
    "1002":["1003"],
    "1003":["4"],
};

NoCheckMessageData.init = function(opt){
    //opt = {"club":[{"clubId":7,"type":5},{"clubId":1,"type":4}],"user":[{"type":1}]}
    NoCheckMessageData.reset();
    var userKey = "1001";
    for(var j = 0 ; j < opt.club.length; ++j){
        var clubMsg = new ClubMsg(opt.club[j]);
        NoCheckMessageData.valueMap["" + clubMsg.type+clubMsg.clubId] = true;
        NoCheckMessageData.valueMap["" + clubMsg.type] = true;
    }
    NoCheckMessageData.valueMap[userKey] = opt.user.length > 0 ? true : false;
};

NoCheckMessageData.reset = function(){
    NoCheckMessageData.valueMap = {};
};

NoCheckMessageData.check = function(key,multiKey){
    multiKey = !multiKey ? "" : multiKey;
    if(key == "1001" || key == "4" || key == "5"){
        NoCheckMessageData.valueMap[key+multiKey] = false;
    }
};

NoCheckMessageData.emitChange = function(){
    cc.global.rootNode.emit("NoCheckMessageDataChange");
};

NoCheckMessageData.value = function(key,multiKey){
    if(!relateMap[key]){//没有关联的
        if(NoCheckMessageData.keyMap[key]){
            if(NoCheckMessageData.keyMap[key].type == "single"){
                return NoCheckMessageData.valueMap[key];
            }else{//如果是multi类型，但没有传multiKey,则返回是否有key类型
                return !multiKey ? !!NoCheckMessageData.valueMap[key] : !!NoCheckMessageData.valueMap["" + key+multiKey];
            }
        }else{
            return null;
        }
    }else{
        var thisKeyType = NoCheckMessageData.keyMap[key].type;
        var isUncheck = false;
        for(var i = 0 ; i < relateMap[key].length ; ++i ){
            if(thisKeyType == "single"){
                if(NoCheckMessageData.value(relateMap[key][i]) == true){
                    isUncheck = true;
                }
            }else{
                if(NoCheckMessageData.value(relateMap[key][i],multiKey) == true){
                    isUncheck = true;
                }        
            }
        }
        return isUncheck;
    }
};
module.exports = NoCheckMessageData;