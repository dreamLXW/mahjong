var SeatSettleData  = require('SeatSettleData');
var EventName = require('EventName');
var MahjongTempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var PlayerDataMgr = require('PlayerDataMgr');
var Code = require('CodeCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        playerResultItemArr : {
            type : cc.Node,
            default : [],
        },
        playerResultItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
        playerResultToggleGroup : {
            type : cc.ToggleGroup,
            default : null,
        },
        _seatSettleData : {
            default : null,
            type : SeatSettleData,
        },
        _playerDataMgr : {
            default : null,
            type : PlayerDataMgr,            
        },
        _curPage : 0,
        huMaGangItemList : {
            type : cc.Node,
            default : null,
        },
        singleResultDetailItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
        continueBtn : {
            type : cc.Node,
            default : null,
        },
        returnBtn : {
            type : cc.Node,
            default : null,
        },
        titleNodeList : {
            type : cc.Node,
            default : [],    
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    onPlayerToggleChange : function(target,customEventData){
        console.log('_curPage:'+customEventData);
        this._curPage = Number(customEventData);
        this.freshView();
    },

    init : function(seatSettleEvent){
        var playerDataList = seatSettleEvent.getPlayerList();
        this._seatSettleData = seatSettleEvent.getSeatSettleData();
        this._mahjongType = seatSettleEvent.mahjongType;
        this._playerDataMgr = new PlayerDataMgr;
        this._playerDataMgr.initData(playerDataList,playerDataList.length,false);
        this._curPage = 0;
        this.freshView();
        this.initPlayerResultItemArr();
    },

    freshView : function(){
        var playerData = this._playerDataMgr.getPlayerDataOfViewPos(cc.mj.ownUserData.uid,this._curPage + 1);
        var singlePlayerResultData = this._seatSettleData.settleData.getSinglePlayerResultDataByUid(playerData.uid);
        this.huMaGangItemList.removeAllChildren();
        var uid = singlePlayerResultData.uid;

        var huTypeItemDataList = singlePlayerResultData.huTypeItemDataList;
        if(huTypeItemDataList){
            for(var i = 0 ; i < huTypeItemDataList.length; ++i){
                var huTypeItemNode = cc.instantiate(this.singleResultDetailItemPrefab);
                var huTypeItemNodeCpn = huTypeItemNode.getComponent('SingleResultDetailItemCpn');
                huTypeItemNodeCpn.initMahjongType(this._mahjongType);
                huTypeItemNodeCpn.initPlayerDataMgr(this._playerDataMgr);
                huTypeItemNodeCpn.initHutypeItemData(uid,huTypeItemDataList[i]);
                this.huMaGangItemList.addChild(huTypeItemNode);
            }
        }


        var zhuangTypeItemData = singlePlayerResultData.zhuangTypeItemData;
        var gangTypeItemDataList = singlePlayerResultData.gangTypeItemDataList;
        var maTypeItemDataList = singlePlayerResultData.maTypeItemDataList;

        if(gangTypeItemDataList){
            for(var i = 0 ; i < gangTypeItemDataList.length; ++i){
                var gangTypeItemNode = cc.instantiate(this.singleResultDetailItemPrefab);
                var gangTypeItemNodeCpn = gangTypeItemNode.getComponent('SingleResultDetailItemCpn');
                gangTypeItemNodeCpn.initPlayerDataMgr(this._playerDataMgr);
                gangTypeItemNodeCpn.initGangTypeItemData(uid,gangTypeItemDataList[i]);
                this.huMaGangItemList.addChild(gangTypeItemNode);
            }
        }

        if(zhuangTypeItemData){
            var zhuangTypeItemNode = cc.instantiate(this.singleResultDetailItemPrefab);
            var zhuangTypeItemNodeCpn = zhuangTypeItemNode.getComponent('SingleResultDetailItemCpn');
            zhuangTypeItemNodeCpn.initPlayerDataMgr(this._playerDataMgr);
            zhuangTypeItemNodeCpn.initZhuangTypeData(uid,zhuangTypeItemData);
            this.huMaGangItemList.addChild(zhuangTypeItemNode);
        }

        if(maTypeItemDataList){
            for(var i = 0 ; i < maTypeItemDataList.length; ++i){
                var maTypeItemNode = cc.instantiate(this.singleResultDetailItemPrefab);
                var maTypeItemNodeCpn = maTypeItemNode.getComponent('SingleResultDetailItemCpn');
                maTypeItemNodeCpn.initPlayerDataMgr(this._playerDataMgr);
                maTypeItemNodeCpn.initMaTypeItemData(uid,maTypeItemDataList[i]);
                this.huMaGangItemList.addChild(maTypeItemNode);
            }
        }
        var isGoldRoom = cc.mj.gameData.roomInfo.isGoldRoom();
        this.continueBtn.active = this.isCanContinue();
        this.returnBtn.active = isGoldRoom ? true : !this.isCanContinue();
        var index = isGoldRoom ? 0 : 1;
        for(var i = 0 ; i < this.titleNodeList.length; ++i){
            this.titleNodeList[i].active = (index == i)
        }
    },

    onClickBtnContinueGame : function(){
        //CommonHelper.emitActionCompelete();
        this.continueGame();
        if(this.isCanContinue()){
            MahjongTempClient.requestContinueGame(function(cbdata){
                cc.global.loading.hide();
                if(cbdata && cbdata.code != Code.OK){
                    console.log(cbdata);
                    if(cc.mj.gameData.roomInfo.isGoldRoom() && cbdata.code != Code.USER_GOLD_NOT_ENOUGH){
                        cc.mj.gameData.roomInfo.setGameStatusDissolve();
                        cc.mj.gameData.getPlayerDataMgr().clearPlayerDataList();
                        cc.global.rootNode.emit(EventName.OnSeatDissolve);
                    }else{
                        CommonHelper.showMessageBox("提示",Code.getCodeName(cbdata.code),function(){
                            CommonHelper.backToLastScene();
                        },null,false);
                    }
                }
            });
        } 
        
    },

    isCanContinue : function(){
         return (cc.mj.gameData.roomInfo.isGameStatusReady() && !cc.mj.gameData.isLastRound());
    },

    continueGame : function(){
        cc.mj.ownUserData.ready = true;
        cc.global.rootNode.emit(EventName.OnGameStatusChange);
    },

    onClickBtnDetail : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var Node = ModalLayerMgr.getTop('SingleResultCardDetailLayer');
            var NodeCpn = Node.getComponent('SingleResultCardDetailLayerCpn');
            ModalLayerMgr.showTop('SingleResultCardDetailLayer');
            NodeCpn.init(this._seatSettleData,this._playerDataMgr);     
        }
    },

    onClickExit : function(){
        if(cc.mj.gameData.roomInfo.isGoldRoom()){
            CommonHelper.backToLastScene();
        }else{
            this.closeMyself();
        }
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);
    },

    initPlayerResultItemArr : function(){
        var bid = this._seatSettleData.bid;
        var isLianZhuang = this._seatSettleData.isLianZhuang;
        var roomUid = this._seatSettleData.roomUid;
        for(var i = 0 ; i < this.playerResultItemArr.length; ++i){
            var playerResultItem = this.playerResultItemArr[i];
            if(this.playerResultItemArr[i].childrenCount == 0){
                this.playerResultItemArr[i].addChild(cc.instantiate(this.playerResultItemPrefab));
                this.playerResultItemArr[i].children[0].getComponent('SingleResultPlayerItemCpn').setToggleGroup(this.playerResultToggleGroup);
                var toogleEvent = new cc.Component.EventHandler();
                toogleEvent.target = this.node;
                toogleEvent.component = "SingleResultLayerCpn";
                toogleEvent.handler = "onPlayerToggleChange";
                toogleEvent.customEventData = i;
                this.playerResultItemArr[i].children[0].getComponent('SingleResultPlayerItemCpn').setToggleEvent(toogleEvent);
            }
            var playerData = this._playerDataMgr.getPlayerDataOfViewPos(cc.mj.ownUserData.uid,i+1);
            var singleResultPlayerItemCpn = playerResultItem.children[0].getComponent('SingleResultPlayerItemCpn');
            if(playerData){
                singleResultPlayerItemCpn.setEnable(true);
                var singlePlayerResultData = this._seatSettleData.settleData.getSinglePlayerResultDataByUid(playerData.uid);
                singleResultPlayerItemCpn.init(singlePlayerResultData,playerData,bid,isLianZhuang,roomUid);
            }else{
                singleResultPlayerItemCpn.setEnable(false);
            }

        }
    },

    //  : function(){
    //     console.log("单局结算窗口onDestoy");
    //     CommonHelper.emitActionCompelete();
    // }
    onDisable : function(){
        console.log("单局结算窗口onDisable");
        CommonHelper.emitActionCompelete();        
    },

    onEnable : function(){
        this._curPage = 0;
        this.checkToggle(this._curPage);
        this.freshView();
    },

    checkToggle : function(index){
        for(var i = 0 ; i < this.playerResultItemArr.length; ++i){
            this.playerResultItemArr[i].children[0].getComponent('SingleResultPlayerItemCpn').setCheck(i==index);
        }
    },
});
