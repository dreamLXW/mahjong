var tempClient = require('MjRequestSpecificClient');
var MjSoundHelper = require('MjSoundHelper');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        DissolveRoomBtn : {
            type : cc.Node,
            default : null,
        },
        toggleGroup : {
            default : null,
            type : cc.Node,
        },
        musicToggle : {
            default : null,
            type : cc.Node,
        },
        effectToggle : {
            default : null,
            type : cc.Node,
        },
        bgmSlider : {
            type : cc.Slider,
            default : null,
        },
        effectSlider : {
            type : cc.Slider,
            default : null,
        },
    },

    onLoad: function () {
        this.node.on('OnMySelfChangeToTop',this.onMySelfChangeToTop,this);
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
            self.onBmgSlider(self.bgmSlider);
            self.onEffectSlider(self.effectSlider);
        })));
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initLayer();
            this.onFreshWechatSetting();
        }
    },

    initLayer : function () {
        this.bgmSlider.node.active = false;
        this.effectSlider.node.active = false;
        this.musicToggle.active = true;
        this.effectToggle.active = true;
    },

    onSoundToggleChange : function(target){
        var name = target.node.name;
        const str = 'toggle';
        var i = Number(name.substr(str.length,name.length));
        console.log('onSoundToggleChange' + i);
        switch(i){
            case 1 : {
                cc.sys.localStorage.setItem('lanType',1);
                this.freshView();
            }
            break;
            case 2 :
            break;
        }
    },

    onClickReuestDissolve : function(){
        tempClient.CommonUidRequestDissove();
    },

    onEnable : function(){
        console.log('settingonenable');
        this.freshView();
    },

    freshView : function(){
        this.DissolveRoomBtn.active = cc.mj.gameData.roomInfo.isGoldRoom() ? false : (cc.mj.gameData.roomInfo.isGameStatusReady() || cc.mj.gameData.roomInfo.isGameStatusStart());
        
        var lanType = cc.sys.localStorage.getItem('lanType');
        console.log(lanType);
        if(!lanType){
            lanType = 1;
            cc.sys.localStorage.setItem('lanType',lanType);
        }
        var index = (Number(lanType) == 1 ? 1 : 2);     
        var toggleCpn = this.toggleGroup.getChildByName('toggle'+index).getComponent(cc.Toggle);
        toggleCpn.check();
        
        var otherLantypeLabel = this.toggleGroup.getChildByName('toggle'+2).getChildByName('label').getComponent(cc.Label);
        otherLantypeLabel.string = ('   '+(index == 1 ? '地方话' : cc.mj.i18n.t('lanType.'+lanType))); 
        
        var bgmVol = cc.sys.localStorage.getItem('bgmVol');
        var effectVol = cc.sys.localStorage.getItem('effectVol');
        if(bgmVol == undefined || bgmVol == null){
            bgmVol = 0.5;
        }
        if(effectVol == undefined || effectVol == null){
            effectVol = 0.5;
        }
        this.effectSlider.progress = effectVol;
        this.bgmSlider.progress = bgmVol;
    },

    onMySelfChangeToTop : function(){
        console.log('onMySelfChangeToTop');
        this.freshView();
    },

    onClickBtnMoreLanSet : function(){
        console.log('onClickBtnMoreLanSet');
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            ModalLayerMgr.showTop('SoundsChoiceLayer');
        }
    },

    onFreshWechatSetting : function () {
        var musicSwitch = cc.sys.localStorage.getItem("musicSwitch");
        if (musicSwitch == undefined || musicSwitch == null || musicSwitch == "") {
            this.musicToggle.getComponent(cc.Toggle).isChecked = true;
        } else {
            if (musicSwitch == 1) {
                this.musicToggle.getComponent(cc.Toggle).isChecked = true;
            } else {
                this.musicToggle.getComponent(cc.Toggle).isChecked = false;
            }
        }
        var effectSwitch = cc.sys.localStorage.getItem("effectSwitch");
        if (effectSwitch == undefined || effectSwitch == null || effectSwitch == "") {
            this.effectToggle.getComponent(cc.Toggle).isChecked = true;
        } else {
            if (effectSwitch == 1) {
                this.effectToggle.getComponent(cc.Toggle).isChecked = true;
            } else {
                this.effectToggle.getComponent(cc.Toggle).isChecked = false;
            }
        }
    },

    onMusicToggleChange : function(){
        var musicToggle = this.musicToggle.getComponent(cc.Toggle);
        if (musicToggle.isChecked) {
            cc.sys.localStorage.setItem("musicSwitch",1);
            MjSoundHelper.playingBgMusic();
        } else {
            cc.sys.localStorage.setItem("musicSwitch",2);
            MjSoundHelper.stopBgMusic();
        }
        this.onFreshWechatSetting();
    },

    onEffectToggleChange : function(target){
        var effectToggle = this.effectToggle.getComponent(cc.Toggle);
        if (effectToggle.isChecked) {
            cc.sys.localStorage.setItem("effectSwitch", 1);
        } else {
            cc.sys.localStorage.setItem("effectSwitch", 2);
        }
        this.onFreshWechatSetting();
    },

    onBmgSlider : function(slider){
        var progress = Math.round(slider.progress * 10) / 10;
        console.log(progress);
        cc.sys.localStorage.setItem('bgmVol',progress);
        slider.node.getChildByName("mask").width = slider.node.width * progress;
        MjSoundHelper.freshBgMusicVol();
        console.log("onBmgSlider");
    },

    onEffectSlider : function(slider){
        var progress = Math.round(slider.progress * 10) / 10;
        console.log(progress);
        cc.sys.localStorage.setItem('effectVol',progress);
        slider.node.getChildByName("mask").width = slider.node.width * progress;
        console.log("onEffectSlider");
    },

});
