var CommonHelper = require('CommonHelper');
var Code = require('CodeCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        majiangTypeBgList : {
            type : cc.Node,
            default : [],
        },
        goldUpLimitLabel : cc.Label,
        playerNumLabel : cc.Label,
        difenLabel : cc.Label,
        guiPaiLabel : cc.Label,
        guiPaiLabel : cc.Label,
        maiMaLabel : cc.Label,
    },

    initData : function(data) {
        this._data = data;
    },

    onLoad : function(){
        this.initView();
    },

    initView : function(){
        if(this._data){
            var config = this._data.config;
            var majiangType = config.majiangType;
            for (var i = 0 ; i < this.majiangTypeBgList.length ; ++i){
                this.majiangTypeBgList[i].active = (this.majiangTypeBgList[i].name == "bg" + majiangType)
            }
            var maiMaNumber = config.maiMaNumber;
            var guiPai = config.guiPai;
            var diFen = config.diFen;
            this.maiMaLabel.string = maiMaNumber >0 ?   cc.mj.i18n.t('mjconfig.maiMa.maiMaNum').replace('?',maiMaNumber) : '';
            this.guiPaiLabel.string = cc.mj.i18n.t('mjconfig.guiPai.'+guiPai);
            this.difenLabel.string = cc.mj.i18n.t('mjconfig.diFen').replace('?',diFen)
            this.playerNumLabel.string =  this._data.playerNum;
            this.goldUpLimitLabel.string =  CommonHelper.getNewNumber(this._data.goldUpLimit);
        }
    },

    onClickBtn : function(){
        if(this.checkGold()){
            cc.global.loading.show();
            cc.mj.roomInfo.initRoomConfig(this._data.config);
            cc.mj.roomInfo.initRoomType("gold_room");
            var Canvas = cc.find('Canvas');
            Canvas.getComponent('LobbyScene').enterRoom();
        }else{
            CommonHelper.showTips(Code.getCodeName(Code.USER_GOLD_NOT_ENOUGH));
        }
    },

    checkGold : function(){
        var needGold = this._data.goldUpLimit;
        return (cc.mj.ownUserData.isEnoughGold(needGold));
    },
});
