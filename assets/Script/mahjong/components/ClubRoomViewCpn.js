var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var PlayerData = require('PlayerData');
cc.Class({
    extends: cc.Component,

    properties: {
        majiangTypeLabelArr : {
            default : [],
            type : cc.Node,
        },
        playNodeList : {
            default : [],
            type : cc.Node,
        },
        playerPrefab : {
            type : cc.Prefab,
            default : null,
        },
        label : {
            default : null,
            type : cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('click',this.onButtonClick,this);
    },

    test : function(data){
        this.label.string = data;
    },

    init : function(clubRoom){
        this.rid = clubRoom.rid;
        this.freshMajiangType(clubRoom.majiangType);
        this.freshPlayerViewList(clubRoom.playList);
    },

    freshMajiangType : function(majiangType){
        var majiangTypeToIndex = {'chaoshan':0,'chaozhou':1,'shantou':2};
        var index = majiangTypeToIndex[majiangType];
        for(var i = 0 ; i < this.majiangTypeLabelArr.length; ++i){
            this.majiangTypeLabelArr[i].active = (index == i);
        }
    },

    freshPlayerViewList : function(playerDataList){
        for(var i = 0 ; i < this.playNodeList.length; ++i){
            var clubPlayer = this.playNodeList[i].children[0];
            if(!clubPlayer){
                clubPlayer = cc.instantiate(this.playerPrefab);
                this.playNodeList[i].addChild(clubPlayer);
            }
            var playerCpn = clubPlayer.getComponent('PlayerCpn');
            playerCpn.playerData = (i < playerDataList.length ? playerDataList[i] : new PlayerData());
            playerCpn.fresh();
        }
    },

    onButtonClick : function(){
        tempClient.getRoomInfo(this.rid,null,true,this.onGetRoomInfoCB.bind(this));
    },

    onGetRoomInfoCB : function(roomInfoData){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var ruleLayerNode = ModalLayerMgr.getTop('RoomInfoLayer');
        var ruleLayerCpn = ruleLayerNode.getComponent('RoomInfoLayerCpn');
        ruleLayerCpn.init(roomInfoData,true);
        ModalLayerMgr.showTop('RoomInfoLayer');        
    },
});
