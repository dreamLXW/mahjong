var EventName = require('EventName');
var CommonHelper = require('CommonHelper');
var SystemConfig = require("SystemConfig");
var BaseUserData = require('BaseUserData');
cc.Class({
    extends: BaseUserData,
    properties: {
        ready : {
            get : function(){
                return this._ready;
            },
            set : function(value){
                this._ready = value;
                this.emitChange();
            },
        },
        score : {
            get : function(){
                return this._score;
            },
            set : function(value){
                this._score = value;
                this.emitChange();
            },
        },
        online : {
            get : function(){
                return this._online;
            },
            set : function(value){
                this._online = value;
                this.emitChange();
            },
        },
        
        longitude : 0,
        latitude : 0,
    },

    ctor : function(){
        this._ready = false;
        this._online = false;
        this._score = 0;
    },
    // use this for initialization
    // onLoad: function () {

    // },

    initData: function (opt) {
        this._super(opt);
        if(opt.ready != undefined && opt.ready != null){
            this._ready = opt.ready || false;
        }else{
            this._ready = this._ready;
        }
        this._score = opt.score || 0;
        this._online = opt.online || false;
        this.longitude = opt.longitude || this.longitude;
        this.latitude = opt.latitude || this.latitude;
        if(opt.busy == false || opt.busy == true){
            this.busy = opt.busy;
        }else{
            this.busy = false;
        }
        this.initSide();
    },

    initDataAndEmitChange:function(opt){
        this.initData(opt);
        this.emitChange();
    },

    emitChange : function(){
        console.log('发送玩家信息变化');
        var detail = {'side':this.side,'data':this};
        cc.global.rootNode.emit(EventName.OnPlayerDataChange,detail);
    },

    initSide : function(){
        this.side = cc.mj.gameData.getPlayerDataMgr().getSideByDirection(this.direction);
    },

    onTalkAction : function(talkEvent){
        talkEvent.playerData = this;
        var detail = {'side':this.side,'data':talkEvent};
        cc.global.rootNode.emit(EventName.OnUserTalk,detail);
    },


});
