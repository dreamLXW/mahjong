var tempClient = require('MjRequestSpecificClient');
var CommonHelper = require('CommonHelper');
var GameToAppHelper = require('GameToAppHelper');
cc.Class({
    extends: cc.Component,
    properties: {
        requestStr : '',
        failStr : '',
        sucStr : '',
        nameStr : '',
        countDownLabel : {
            type : cc.Label,
            default : null,
        },
        confirmNode: {
            type : cc.Node,
            default : null,
        },
        cancelNode : {
            type : cc.Node,
            default : null,
        },
        waitTipsNode : {
            type : cc.Node,
            default : null,
        },
        requestRichText : {
            type : cc.RichText,
            default : null,
        },
        choicePlayerNodeList : {
            type : cc.Node,
            default : [],
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(data){
        var comfirmUidList = data.comfirmUidList;
        var applyUid = comfirmUidList[0];
        var choiceUid = data.uid;
        var isConfirm = data.comfirm;        
        var second = data.second; 

        var appLyPlayerData = cc.mj.gameData.getPlayerData(applyUid);
        var applyStr = this.requestStr;
        applyStr = applyStr.replace('name',appLyPlayerData.getDisplayName());
        this.requestRichText.string = applyStr;

        var allReponceUid = [];
        this.isMeConfirm = false;
        for(var i = 0 ; i < comfirmUidList.length ; ++i){
            var uid = comfirmUidList[i];
            if(i > 0){
                allReponceUid.push({'uid':comfirmUidList[i],'ret':true});
            }
            if(uid == cc.mj.ownUserData.uid){
                this.isMeConfirm = true;
            }
        }
        this.isMeConfirm ? this.setBtnVisible(false) : this.setBtnVisible(true);
        var otherUidList = cc.mj.gameData.getPlayerDataMgr().getOtherUidList(comfirmUidList);
        for(var i = 0 ; i < otherUidList.length ; ++i){
            allReponceUid.push({'uid':otherUidList[i],'ret':false});
        }

        for(var i = 0; i < this.choicePlayerNodeList.length ; ++i){
            var choicePlayerNode = this.choicePlayerNodeList[i];
            choicePlayerNode.active = (i < allReponceUid.length);
            if(choicePlayerNode.active){
                var uid = allReponceUid[i].uid;
                var ret = allReponceUid[i].ret;
                var comfirmPlayerData = cc.mj.gameData.getPlayerData(uid);
                choicePlayerNode.getChildByName('name').getComponent(cc.Label).string = comfirmPlayerData.getDisplayName();
                choicePlayerNode.getChildByName('agree').active = ret;
                choicePlayerNode.getChildByName('wait').active = !ret;
                choicePlayerNode.getComponent('OnlineLoadData').getSpriteByUrl(comfirmPlayerData.url);
            }
        }

        this.startCoundDown(second);
        if(comfirmUidList.length == cc.mj.gameData.getPlayerDataMgr().getPlayerNumber() || second <=0 ){
            this.showDissolveSucBox(comfirmUidList);
        }else if(isConfirm == false ){
            this.showDissolveFailBox(choiceUid);
        }
    },

    startCoundDown : function(second){
        var iSecond = Number(second);
        if(iSecond > 0){
            var secondCountDownLabel = this.countDownLabel.getComponent('SecondCountDownLabel');
            if(!secondCountDownLabel){
                secondCountDownLabel = this.countDownLabel.addComponent('SecondCountDownLabel');
            }
            secondCountDownLabel.starCountDown(iSecond);
        }
    },

    stopCoundDown : function(){
        var secondCountDownLabel = this.countDownLabel.getComponent('SecondCountDownLabel');
        if(secondCountDownLabel){
            secondCountDownLabel.stopCountDown();
        }
    },

    setBtnVisible : function(isVisible){
        this.cancelNode.active = isVisible;
        this.confirmNode.active = isVisible;
        this.waitTipsNode.active = !isVisible;
    },

    onClickBtnChoice : function(target,data){
        var choice = Number(data) == 0 ? false : true;
        this.isMeConfirm = true;
        this.isMeConfirm ? this.setBtnVisible(false) : this.setBtnVisible(true);
        tempClient.CommonUidConfirmDissove(choice);
    },

    showDissolveFailBox : function(uid){
        this.closeMyself();
        var name = cc.mj.gameData.getPlayerData(uid).getDisplayName();
        var contentText = this.failStr;
        contentText = contentText.replace('name',name);
        CommonHelper.showMessageBox('提示',contentText,function(){},null,false);
    },

    showDissolveSucBox : function(uidList){
        this.closeMyself();
        var contentText = this.sucStr;
        var nameList = '';
        for(var i = 0 ; i < uidList.length ; ++i){
            var name = cc.mj.gameData.getPlayerData(uidList[i]).getDisplayName();
            var nameStr = this.nameStr;
            nameList += nameStr.replace('name',name);
            //contentText = contentText.replace('name'+i,name);
        }
        contentText = contentText.replace('namelist',nameList);
        CommonHelper.showMessageBox('提示',contentText,function(){CommonHelper.backToLastScene();},null,false);
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);
    },
});