var EventName  = require('EventName');
var CommonHelper =  {
   
};

CommonHelper.getMahjongWord = function(mahjongData){//.png
    var url = 'mahjong/png/mjcard';
    var spriteAtlas = cc.loader.getRes(url,cc.SpriteAtlas);
    var spriteFrame = spriteAtlas.getSpriteFrame('mj_'+mahjongData);
    return spriteFrame;
};

CommonHelper.getSideNameArr = function(relativeSide,playerNum){
    var sideNameArr = [];
    switch(playerNum){
        case 2 : {
            sideNameArr = ["myself","up"];
        }
        break;
        case 3 : {
            var relativeSideArr = {"myself":["myself","right","left"],"right":["myself","up","left"],"left":["myself","up","right"]}
            sideNameArr = relativeSideArr[relativeSide] ? relativeSideArr[relativeSide] : ["myself","right","left"];
        }
        break;
        default : {
            sideNameArr = ["myself","right","up","left"];
        }
        break;
    }
    return sideNameArr;
};

CommonHelper.getViewPosBySideName = function(sideName,playerNum){
    var sideNameArr = CommonHelper.getSideNameArr("myself",playerNum);
    var index = sideNameArr.findIndex(function(value){return (value == sideName);});
    return index + 1;
};

CommonHelper.convertDirection = function(direction,playerNum){
    var convertdirection = direction;
    switch(playerNum){
        case 2 : {
            var arr = ['1','3'];
            convertdirection = arr[direction-1];
        }
        break;
        case 3 : {
            var arr = ['1','2','4'];
            convertdirection = arr[direction-1];
        }
        break;
    } 
    return convertdirection;   
};

CommonHelper.getRelativeViewPos = function(direction,fromDirection,maxNum){//fromDirection相对于direction的位置
    var viewpos = (fromDirection + maxNum - direction)%maxNum + 1;
    return viewpos;
},

CommonHelper.emitActionCompelete = function(){
    cc.global.rootNode.emit(EventName.OnSeatEventComplete);
},

CommonHelper.emitTalkCompelete = function(){
    cc.global.rootNode.emit(EventName.OnTalktEventComplete);
},

CommonHelper.numberToString = function(number){
    if(Number(number) > 0){
        return String('+'+number);
    }else{
        return String(number);
    }
},

CommonHelper.showMessageBox = function(title,content,cb,cbparam,isNeedCancel){
    var data = {"title":title,"content":content,"onOk":cb,"onOkParam":cbparam,"isNeedCancel":isNeedCancel};
    CommonHelper.showMessageBoxByRawData(data);
},

CommonHelper.showMessageBoxByRawData = function(data){
    var MessageBoxMgr = require('MessageBoxMgr');
    MessageBoxMgr.showMessageBoxByRawData(data);
},

CommonHelper.getRunSceneModalMgr = function(){
    var canvas = cc.find('Canvas');
    if(canvas){
        var initLogic = canvas.getComponent('initLogic');
        var topContainerNode = initLogic.getModalContainer();
        var ModalLayerMgr = topContainerNode.getComponent('ModalLayerMgr');
        return ModalLayerMgr;       
    } 
},

CommonHelper.showTips = function(text){
    var topNode = cc.find('Canvas/topLayer/tipsLayer');
    if(topNode){
        var autoDisapearMessageMgr = topNode.getComponent('AutoDisapearMessageMgr');
        autoDisapearMessageMgr.showDisapearMessage(text);     
    } 
},
      
 CommonHelper.getDistance =  function(lon1,lat1,lon2,lat2)  
    {  
        var EARTH_RADIUS = 6378137;//赤道半径(单位m)  
        var rad = function(d){//转化为弧度(rad) 
            return d * Math.PI / 180.0;  
        }

       var radLat1 = rad(lat1);  
       var radLat2 = rad(lat2);  
       var a = radLat1 - radLat2;  
       var b = rad(lon1) - rad(lon2);  
       var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));  
       s = s * EARTH_RADIUS;  
       //s = Math.round(s * 10000) / 10000;  
       return s;  
},

CommonHelper.backToLastScene = function(){//之后再改动//还未改动，而且代码更垃圾了
    var sceneName = cc.director.getScene().name;
    if(sceneName == 'mahjongscene'){
        cc.director.loadScene('lobbyscene');
    }
},

CommonHelper.GetRandomNum = function (Min,Max){   
    var Range = Max - Min;   
    var Rand = Math.random();   
    return Math.floor(Rand*(Range+1)+Min);   
},

CommonHelper.getNewNumber = function (number) {
    if (number >= 10000) {
        var tempNum = (Math.floor((number / 10000) * 100) / 100) + "万";
        number = tempNum;
    }
    return number;
},

//rule为true就是由大到小排序
CommonHelper.sortByTag = function (array, condition, rule) {
    var arrayLength = array.length;
    var tempArray = [];
    for (let i = 0; i < arrayLength; i++) {
        var bigIndex = CommonHelper.getBigIndex(array, condition, rule);
        tempArray.push(bigIndex);
    }
    array.length = 0;
    for (let i = 0; i < tempArray.length; i++) {
        array.push(tempArray[i]);
    }
},

CommonHelper.getBigIndex = function (array, condition, rule) {
    var BigObj = array[0];
    if (array.length > 1) {
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                var objA = array[i];
                var objB = array[j]
                if (rule == true?objA[condition] < objB[condition]:objA[condition] > objB[condition]) {
                    var tempObj= objB;
                    if (rule == true?tempObj[condition] > BigObj[condition]:tempObj[condition] < BigObj[condition]) {
                        BigObj = tempObj;
                    }
                }
            }
        }
    }
    array.splice(array.indexOf(BigObj), 1);
    return BigObj;
},

module.exports = CommonHelper;