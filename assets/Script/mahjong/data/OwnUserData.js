var EventName = require('EventName');
var BaseUserData = require('BaseUserData');
cc.Class({//玩家自己的静态用户信息
    extends: BaseUserData,

    properties: {
        token : {
            get : function(){
                return this._userToken;
            },
            set : function(value){
                this._userToken = value;
            },
        },
        telephone : {
            get : function(){
                return this._telephone;
            },
            set : function(value){
                this._telephone = value;
            },
        },
        ready : false,
    },

    // use this for initialization
    onLoad: function () {
    },

    ctor : function(){
        this.token = "";
    },

    initData: function (opt) {
        this._super(opt);
        this.token = opt.token || this.token;
        this.telephone = opt.telephone || this.telephone;
        if(opt.ready != null && opt.ready != undefined){
            this.ready = opt.ready
        }
        this.side = "myself"
    },

    isMeRoomcreator : function(){
        return (this.uid == cc.mj.gameData.roomInfo.roomCreator.uid); 
    },

    isEnoughGold : function(needGold){
        return this.gold >= needGold;
    },

    emitChange : function(){
        console.log('发送自己的用户信息变化');
        var detail = {'side':"myself",'data':this};
        cc.global.rootNode.emit(EventName.OnPlayerDataChange,detail);
    },
});