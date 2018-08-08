var SystemConfig = require("SystemConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        uid : {
            get : function(){
                return this._uid;
            },
            set : function(value){
                this._uid = value;
            },
        },
        nickname : {
            get : function(){
                return this._nickname;
            },
            set : function(value){
                this._nickname = value;
            },
        },
        ip : {
            get : function(){
                return this._ip;
            },
            set : function(value){
                this._ip = value;
            },
        },
        sex : -1,
        money : 0,
        gold : 0,
        roomcard : 0,
        side : "",//相对于玩家自己的位置
        url : "",
        direction : 0,
        dingNo : "",
    },

    getDisplayName : function(){
        return this.nickname;
    },

    getDisplayId : function(){
        if(SystemConfig.mode == "test" || SystemConfig.mode == "pro"|| SystemConfig.mode == "dev"){
            return cc.sys.platform === cc.sys.WECHAT_GAME ? this.uid : this.dingNo;
        }else{
            return this.uid;
        }
    },

    setIcon : function(icon){
        this.url = icon || "";
    },

    ctor : function(){
        this.uid = 0;
        this.nickname = "";
        this.ip = "";
        this.telephone = "";
    },

    initData: function (opt) {
        this.uid = opt.uid || 0;
        this.nickname = opt.nickname || "";
        this.setIcon(opt.icon);
        this.ip = opt.ip || "";
        this.direction = opt.position || this.direction;
        this.sex = opt.sex;
        this.dingNo = opt.dingNo;
        this.money = opt.diamond || this.money;
        this.gold = opt.gold || this.gold;
        this.roomcard = opt.roomCard || this.roomcard;
    },
});
