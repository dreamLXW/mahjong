var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
var tempClient = require('MjRequestSpecificClient');
var MjSoundHelper = require('MjSoundHelper');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        busyTime : 5, // 5秒
        lastChatTime : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    isValid : function(){//只有在长链接有效的时候才可用

    },

    isBusy : function(){
        var curTime = new Date().getTime();
        var deltaTime = curTime - this.lastChatTime;
        var second = Math.ceil((deltaTime/1000));
        return !(second > this.busyTime);
    },

    recordLastChatTime : function(){
        this.lastChatTime = new Date().getTime();
    },

    sendCommonSentence : function(commonSentenceId,lanType){
        var type = 3;
        var content = {'id':commonSentenceId,'lanType':lanType};//从1开始
        tempClient.seatSendChat(type,content);
        this.recordLastChatTime();
    },

    sendExpress : function(expressId){
        var type = 1;
        tempClient.seatSendChat(type,expressId);
        this.recordLastChatTime();
    },

    sendText :function(text){
        var type = 2;
        tempClient.seatSendChat(type,text);
        this.recordLastChatTime();  
    },

    sendVoice : function(fileName,second){
        var uid = cc.mj.ownUserData.uid;
        var rid = cc.mj.gameData.roomInfo.roomId;
        var url = cc.mj.netMgr.gateUrl+'/voice?uid='+uid+'&rid='+rid+'&second='+second;
        console.log(url);
        var customHttpRequest = new CustomHttpRequest();
        customHttpRequest.setRequestType('UPLOAD');
        customHttpRequest.setTimeout(20000);
        customHttpRequest.setUrl(url);
        customHttpRequest.setFile(fileName); 
        CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
            if(customHttpRequest1){
                console.log('上传成功');
            }else{  
                CommonHelper.showTips("发送语音超时");
                console.log('网络出错');
            }
        });
        this.recordLastChatTime();  
    },

    playTraining : function(){
        var CommomHelper = require('CommonHelper');
        var index = CommomHelper.GetRandomNum(1,4);
        //MjSoundHelper.playTraining(index);
        var type = 4;
        tempClient.seatSendChat(type,index);
        this.recordLastChatTime(); 
    },
});
