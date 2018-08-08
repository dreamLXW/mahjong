//房间信息数据，包括房间id和房间配置信息
var SeatCfg = require('SeatCfg');
var ProtoUtil = require("ProtoUtil");
var Player = require('PlayerData');
var SeatStatusConfig = require('SeatStatusCfg');

cc.Class({
    name : 'RoomInfoData',
    properties: {
        roomId : {
            get : function(){
                return this._roomId;
            },
            set : function(value){
                this._roomId = value;
            },
            type : Number,
        },
        roomNo : -1,
        roomCreator : null,
        roomConfig : SeatCfg,
        clubId : 0,
        groupId : 0,
        gameStatus : "wait",             
    },

    initRoomConfig : function(opt){
        if(opt){
            this.roomConfig = new SeatCfg(opt);
        }
    },    

    isRoomNoValid : function(){
        return this.roomNo > 0;
    },

    clearData : function(){
        this.roomId = null;
        this.roomNo = -1;
        this.roomCreator = null;
        this.roomConfig = null;
        this.clubId = 0;
        this.groupId = 0;
        this.gameStatus = "wait";
    },

    initRoomId : function(id){
        this.roomId = id;
    },

    initRoomNo : function(roomNo){
        if(roomNo){
            this.roomNo = roomNo;
        }
    },

    initRoomCreator : function(player){
        if(player && (!this.roomCreator || (this.roomCreator && this.roomCreator.uid != player.uid))){
            var playerData = new Player();
            playerData.initData(player);
            this.roomCreator = playerData;
        }
    },

    initRoomType : function(roomType){//金币场"gold_room"，房卡场"card_room"
        this.roomType = roomType;
    },

    isGoldRoom : function(){
        return (this.roomType == "gold_room");
    },

    initData:function(opt){//初始化房间配置和房间id
        this.gameStatus = ProtoUtil.decode(opt.status);
        this.initRoomConfig(ProtoUtil.decode(opt.config));
        this.initRoomId(ProtoUtil.decode(opt.rid));
        this.initRoomCreator(opt.roomCreator);
        this.initRoomNo(opt.roomNum);
        this.initRoomType(opt.roomPattern);
        this.clubId = opt.clubId || this.clubId;
        this.groupId = opt.groupId || this.groupId;
    },

    getShareRoomInfo: function () {
        var info =  {
            roomId : this.roomId,
            roomNum : this.roomNo,
        }
        if(this.isClubGame()){
            info.clubId = this.clubId;
        }
        if(this.isGroupGame()){
            info.groupId = this.groupId;
        }
        if (this.roomCreator) {
            info.userId = this.roomCreator.uid;
        }
        if (this.roomCreator) {
            info.userName = this.roomCreator.nickname;
        }
        if (this.roomConfig) {
            var ruleArr = this.roomConfig.getRuleArr(',');
            console.log(ruleArr);
            var content = "";
            for(var i = 0 ; i < ruleArr.length; ++i){
                if(ruleArr[i] != ""){
                    content += ruleArr[i]
                    if(i != ruleArr.length - 1){
                        content += '\n';
                    }
                }
            }
            info.content = content;
            info.title = this.roomConfig.getMahjongName();
        }
        info = JSON.parse(JSON.stringify(info));    //TODO:对象拷贝
        if (info.config) {
            info.config = ProtoUtil.encode(info.config); 
        }
        return {"shareRoomInfo":info};
    },

    getGuiType : function(){
        return this.roomConfig.guiPai;
    },

    isGameStatusStart : function(){
        return (this.gameStatus == SeatStatusConfig.StartStatus);
    },

    isGameStatusReady : function(){
         return (this.gameStatus == SeatStatusConfig.ReadyStatus);
    },

    isGameStatusWait : function(){
        return (this.gameStatus == SeatStatusConfig.WaitStatus);
    },

    isMySelfInSettleStatus : function(){//房间在结算状态且自己没有点击继续游戏
        //var myPlayerData = this.getPlayerData(cc.mj.ownUserData.uid);
        return (this.gameStatus == SeatStatusConfig.ReadyStatus && cc.mj.ownUserData.ready == false);
    },

    isMySelfReadyAndGameStatusReady : function(){
        return (this.gameStatus == SeatStatusConfig.ReadyStatus && cc.mj.ownUserData.ready == true);
    },

    isGameStatusOver : function(){
        return (this.gameStatus == SeatStatusConfig.OverStatus);
    },

    setGameStatusReady:function(){
        this.gameStatus = SeatStatusConfig.ReadyStatus;
    },

    setGameStatusDissolve:function(){
        this.gameStatus = SeatStatusConfig.DissolveStatus;
    },

    isGameStatusDissolve : function(){
        return (this.gameStatus == SeatStatusConfig.DissolveStatus);
    },

    setGameStatusOver : function(){
        this.gameStatus = SeatStatusConfig.OverStatus;
    },

    isGroupGame : function(){
        return (this.groupId && (Number(this.groupId) > 0));
    },

    isClubGame : function(){
        return (this.clubId && (Number(this.clubId) > 0));
    },
});
