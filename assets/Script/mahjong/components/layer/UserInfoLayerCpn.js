var OnlineLoadData = require("OnlineLoadData");
var CommonHelper = require("CommonHelper");
cc.Class({
    extends: cc.Component,

    properties: {
        idLabel : {
            default : null,
            type : cc.Label,
        },

        userNameLabel : {
            default : null,
            type : cc.Label,
        },

        ipLabel : {
            default : null,
            type : cc.Label,
        },

        playerDisTextArr : {
            default : [],
            type : cc.RichText,
        },

        headSp : {
            default : null,
            type : cc.Sprite,
        },
        noDisText : {
            type : cc.RichText,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(playerData){
        //this.userNameLabel.string = opt.nickname;
        this.userNameLabel.string = playerData.getDisplayName();
        this.idLabel.string = playerData.getDisplayId();
        this.ipLabel.string = playerData.ip;
        var disTextArr = this.getDisTextArr(playerData.uid);
        this.changeDisTextArr(disTextArr);
        var url = playerData.url;
        this.loadHeadSp(url);
    },

    loadHeadSp : function(url){
        this.node.getComponent('OnlineLoadData').getSpriteByUrl(url);
    },

    getDisTextArr : function(uid){
        var playerDataList = cc.mj.gameData.getPlayerDataMgr().getPlayerDataList();
        var playerData= cc.mj.gameData.getPlayerData(uid);
        var lon = playerData.longitude;
        var lan = playerData.latitude;
        var DisTextArr = [];
        if(lon != 0 && lan != 0){
            for(var i = 0 ; i < playerDataList.length; ++i){
            var otherPlayerData = playerDataList[i];
            if(otherPlayerData.uid != playerData.uid){
                var otherLon = otherPlayerData.longitude;
                var otherLat = otherPlayerData.latitude;
                if(otherLat != 0 && otherLon != 0 ){
                    var dis = CommonHelper.getDistance(otherLon,otherLat,lon,lan);
                    if(dis > 0){
                        DisTextArr.push({"name":otherPlayerData.getDisplayName(),"dis":dis});
                    }
                }
            }
        }
        }

        return DisTextArr;
    },

    changeDisTextArr  : function(textArrData){
        this.noDisText.node.active = (textArrData.length == 0);
        for(var i = 0 ; i < this.playerDisTextArr.length; ++i){
            if(i < textArrData.length){
                this.playerDisTextArr[i].node.active = true;
                var iDis = Math.floor(Number(textArrData[i].dis));
                var m = 'm';
                if(iDis > 1000){
                    iDis = Math.floor(iDis / 1000);
                    m = 'km';
                }
                var string = '<color=#572303>与【</c><color=#0b40d0>'+textArrData[i].name+'</color>】的距离为'+iDis+m;
                this.playerDisTextArr[i].string = string;
            }else{
                this.playerDisTextArr[i].node.active = false;
            }
        }
    }
});
