var CommonHelper = require('CommonHelper');
var TempClient = require('MjRequestSpecificClient');
cc.Class({
    extends: cc.Component,

    properties: {
        goldPatternItemPrefab : {
            type : cc.Prefab,
            default : null
        },
        goldPatternContainer : {
            type : cc.Node,
            default : null
        },
        _ramdomPatternItem : {
            type : cc.Node,
            default : null
        },
    },

    onLoad : function(){
        this.initData();
        this.initView();   
    },

    initView : function(){
        if(this._goldPatternDataList){
            for(var i = 0 ; i < this._goldPatternDataList.length; ++i){
                var patternItem = cc.instantiate(this.goldPatternItemPrefab);
                patternItem.getComponent("GoldPatternItemCpn").initData(this._goldPatternDataList[i]);
                this.goldPatternContainer.addChild(patternItem);
            }
            this._ramdomPatternItem = cc.instantiate(this.goldPatternItemPrefab);
        }
    },

    freshView : function(){
        for(var i = 0 ; i < this.goldPatternContainer.childrenCount; ++i){
            var patternItem = this.goldPatternContainer.children[i];
            patternItem.getComponent("GoldPatternItemCpn").initView();
        }
    },

    onEnable : function(){
        cc.mj.ownUserData.emitChange();
        this.freshView();
        this.getOnlinePlayerNumber();
    },

    onDisable : function () {
    },

    initData : function(data){
        var goldPatternDataList = [{"config":{"id":1,"maiMaNumber":1,"guiPai":"fan","diFen":100,"majiangType":"chaoshan"},"playerNum":100,"goldUpLimit":10200},
        {"config":{"id":2,"maiMaNumber":1,"guiPai":"fan","diFen":100,"majiangType":"shantou"},"playerNum":100,"goldUpLimit":10200},
        {"config":{"id":3,"maiMaNumber":1,"guiPai":"fan","diFen":100,"majiangType":"chaozhou"},"playerNum":100,"goldUpLimit":10200}];
        var data = goldPatternDataList;
        this._goldPatternDataList = data;
    },

    onClickRecharge : function(target,customdata){
        var canvas = cc.find('Canvas');
        if(canvas){
            var LobbyScene = canvas.getComponent('LobbyScene');
            LobbyScene.onClickRecharge(target,customdata);
        } 
    },

    onClickRandom : function(){
        var length = this._goldPatternDataList ? this._goldPatternDataList.length : 0;
        if(length > 0){
            var random = CommonHelper.GetRandomNum(0,length - 1);
            var data = this._goldPatternDataList[random];
            var goldPatternItemCpn = this._ramdomPatternItem.getComponent("GoldPatternItemCpn");
            goldPatternItemCpn.initData(data);
            goldPatternItemCpn.onClickBtn();
        }
    },

    getOnlinePlayerNumber : function(){
        var self = this;
        TempClient.getGoldLobbyOnlineNumber(function(cbdata){
            self.changeOnlinePlayerNumber(cbdata.playerNumberList);
            self.freshView();
        })
    },

    changeOnlinePlayerNumber : function(onLinePlayerNumberList){
        for(var i = 0 ;i < onLinePlayerNumberList.length; ++i){
            var id = onLinePlayerNumberList[i].id;
            var playerNumber = onLinePlayerNumberList[i].number;
            var index = this._goldPatternDataList.findIndex(function(value){return (value.config.id == id)})
            if(index != -1 ){
                this._goldPatternDataList[index].playerNum = playerNumber;
            }
        }
    },
});
