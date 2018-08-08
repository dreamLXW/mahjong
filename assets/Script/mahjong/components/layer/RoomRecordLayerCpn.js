var MjGameData = require('MjGameData');
cc.Class({
    extends: cc.Component,

    properties: {
        playerTitleItemArr : {
            type : cc.Node,
            default : [],
        },

        RoomRecordItemPrefab : {
            type : cc.Prefab,
            default : null,
        },

        RoomRecordItemContainer : {
            type : cc.Node,
            default : null,
        },

        PlaybackLabel : {
            type : cc.Node,
            default : null,
        },

        singleSettleLabel : {
            type : cc.Node,
            default : null,
        },

        _isCanPlayback : false,
        scrollView : {
            type : cc.ScrollView,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('OnMySelfChangeToTop',this.onMySelfChangeToTop,this);
    },

    onMySelfChangeToTop : function(){
        cc.mj.gameData = new MjGameData;
        cc.mj.gameData.roomInfo.setGameStatusOver();
    },

    onDestroy :function(){
        this.node.off('OnMySelfChangeToTop',this.onMySelfChangeToTop,this);
    },

    init : function(seatTotalSettleEvent,isCanPlayback){
        this.scrollView.scrollToTop(0);
        this._isMeIn = seatTotalSettleEvent.isMeIn;
        this._isCanPlayback = isCanPlayback && this._isMeIn;
        
        var roundTotalSettleList = seatTotalSettleEvent.roundTotalSettleList;
        this.rid = seatTotalSettleEvent.rid;
        var playerScoresofFirstRound = seatTotalSettleEvent.roundPlayerSettleList;
        this.initPlayerTitles(playerScoresofFirstRound);

        for(var i = 0 ; i < roundTotalSettleList.length; ++i){
            var roundItemData = roundTotalSettleList[i];
            var roomRecordItem = this.getRoomRecordItem(i);
            if(roomRecordItem){
                roomRecordItem.active = true;
                roomRecordItem.getComponent('RoomRecordLayerItemCpn').init(roundItemData.round,roundItemData.createTime,roundItemData.playerScoreList);
            }else{
                roomRecordItem = this.createRoomRecordItem(roundItemData.round,roundItemData.createTime,roundItemData.playerScoreList);
                this.RoomRecordItemContainer.addChild(roomRecordItem);
            }
            var roomRecordLayerItemCpn = roomRecordItem.getComponent('RoomRecordLayerItemCpn');
            roomRecordLayerItemCpn.initRid(this.rid); 
            roomRecordLayerItemCpn.setPlaybackBtnVisible(this._isCanPlayback);
            roomRecordLayerItemCpn.setSingleSettleBtnVisible(this._isMeIn);
        }
        this.setPlaybackLabelVisible(this._isCanPlayback );
        this.setSingleSettleLabelVisible(this._isMeIn);
        this.hideUnuseRoomRecordItem(roundTotalSettleList.length);
        cc.mj.gameData.seatData.totalRound = roundTotalSettleList.length;
    },

    hideUnuseRoomRecordItem : function(startIndex){
        for(; startIndex < this.RoomRecordItemContainer.childrenCount; ++ startIndex){
            this.getRoomRecordItem(startIndex).active = false;
        }
    },

    initPlayerTitles : function(playerInfoArr){
        for(var i = 0 ; i < this.playerTitleItemArr.length ; ++i){
            var item = this.playerTitleItemArr[i];
            if(i >= playerInfoArr.length){
                item.active = false;
            }else{
                item.active = true;
                var displayId = (cc.sys.platform === cc.sys.WECHAT_GAME ? ("ID:" + playerInfoArr[i].uid) : ("丁号:" + playerInfoArr[i].dingNo));
                item.getChildByName('usernamelabel').getComponent(cc.Label).string = playerInfoArr[i].nickname;
                item.getChildByName('idlabel').getComponent(cc.Label).string = displayId;
            }
        }
    },

    getRoomRecordItem : function(index){
        var length = this.RoomRecordItemContainer.childrenCount;
        if(index < length){
            return this.RoomRecordItemContainer.children[index];
        }
        return null;
    },

    createRoomRecordItem : function(round,createTime,playerScoreList){
        var roomRecordItem = cc.instantiate(this.RoomRecordItemPrefab);
        var RoomRecordLayerItemCpn = roomRecordItem.getComponent('RoomRecordLayerItemCpn');
        RoomRecordLayerItemCpn.init(round,createTime,playerScoreList);
        return roomRecordItem;
    },

    setPlaybackLabelVisible : function(isVisble){
        this.PlaybackLabel.active = isVisble;
    },

    setSingleSettleLabelVisible : function(isVisble){
        this.singleSettleLabel.active = isVisble;
    }

});
