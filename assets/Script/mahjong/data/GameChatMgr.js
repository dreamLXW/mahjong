cc.Class({
    extends: cc.Component,

    properties: {
        _isTalkPlaying : false,
        _talkEventList : [],
        _waitTalkEventList : [],
    },

    ctor : function(){
        this.reset();
    },

    reset : function(){

    },

    pushTalkEvent : function(talkEvent){
        this._talkEventList.push(talkEvent);
    },

    playing : function(){
        this.playingTalkAction();
    },

    playingTalkAction: function(){     
        if (this._isTalkPlaying || (this._talkEventList.length == 0 && this._waitTalkEventList.length == 0)) {
            return;
        }
        this.checkWaitTalkEventList();
        var talkEvent = this._talkEventList.shift();
        if(talkEvent){
            var type = talkEvent.EventName;
            if(type == 'TalkVoiceEvent'){
                if(talkEvent.isComplete()){
                    this._isTalkPlaying = true;
                    cc.mj.gameData.playerDataMgr.onTalkAction(talkEvent);                    
                }else{
                    this._waitTalkEventList.push(talkEvent);
                }
            }else if(type == 'TalkChatEvent'){
                // this._isTalkPlaying = true;
                // cc.mj.gameData.playerDataMgr.onTalkAction(talkEvent);
            }
        }
    },

    checkWaitTalkEventList : function(){
        var deleteNum = this._waitTalkEventList.length;
        for(var i = 0 ; i < this._waitTalkEventList.length;++i){
            var talkEvent = this._waitTalkEventList[i]
            var status = talkEvent.status;
            if(status == 'complete'){
                this._talkEventList.unshift(talkEvent);
                deleteNum = i+1;
                console.log('complete deletenum:'+deleteNum+'  length:'+this._talkEventList.length);
                break;
            }else if(status != 'error'){
                deleteNum = i;
                console.log('error'+deleteNum);
                break;
            }
        }
        console.log('deleteNum'+deleteNum);
        if(deleteNum > 0){
            this._waitTalkEventList.splice(0,deleteNum);
        }
    },

    onTalktEventComplete : function(){
        this._isTalkPlaying = false;
    }
});
