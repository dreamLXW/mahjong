
var MjSoundHelper = require('MjSoundHelper');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        recordDisplayPrefab : {
            default : null,
            type : cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.setRecordBtnRecordDeletegate();
    },

    setRecordBtnRecordDeletegate : function(){
        this.getComponent('RecordBtn').setRecordDeletegate(this);//因为设置了自己为委托，所以要实现isCanStart函数
    },

    isCanStart : function(){
        if(!cc.mj.gameData.chatClient.isBusy()){
            return true;
        }else{
            CommonHelper.showTips(cc.mj.i18n.t('tips.YUYINJIANGE'));
            return false;
        }
    },

    onRecordStart : function(){
        this.setRecordDisplayVisible(true);
        MjSoundHelper.stopBgMusic();
    },

    onRecordMove : function(moveType){
        this.showRecordDisplayType(this.getRecordDisplayNode(),moveType);
    },

    onRecordEnd : function(fileName,second,moveType){
        this.setRecordDisplayVisible(false);
        if(second > 0 && moveType != 'up'){
            this.upLoadFile(fileName,second);
        }else{
            console.log('录音时间过短');
        }
        MjSoundHelper.playingBgMusic();
    },

    getRecordDisplayNode : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var recordDisplay = ModalLayerMgr.getTop('RecordDisplay');
            return recordDisplay;
        }        
    },

    setRecordDisplayVisible : function(visible){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var recordDisplay = ModalLayerMgr.getTop('RecordDisplay');
            var anim = recordDisplay.getComponent(cc.Animation);
            if(visible){
                ModalLayerMgr.showTop('RecordDisplay');
                this.showRecordDisplayType(recordDisplay,'down');
                anim.play("record");
            }else{
                ModalLayerMgr.closeTop(recordDisplay);
                anim.stop("record");
            }
        }        
    },

    showRecordDisplayType : function(recordDisplayNode,type){
        var isDown = (type == 'down');
        recordDisplayNode.getChildByName('down').active = isDown;
        recordDisplayNode.getChildByName('up').active = !isDown;
    },

    upLoadFile : function(fileName,second){
        cc.mj.gameData.chatClient.sendVoice(fileName,second);  
    },

});
