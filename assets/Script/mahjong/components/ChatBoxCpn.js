var MjSoundHelper = require('MjSoundHelper');
var CommonHelper = require('CommonHelper');
var SensitiveVocaburary = require('SensitiveVocaburary');
var GameToWechatGameHelper = require('GameToWechatGameHelper');
cc.Class({//聊天对话框
    extends: cc.Component,

    properties: {
        expressNodeContainer : {
            default : null,
            type : cc.Node,
        },
        commonstencescrollviewcontent : {
            default : null,
            type : cc.Node,
        },
        commonsentenceitemPrefab : {
            default : null,
            type : cc.Prefab,
        },
        pageView : {
            default : null,
            type : cc.PageView,
        },
        chatEdit : {
            default : null,
            type : cc.EditBox,
        },
        ExpressNodePrefab : {
            type : cc.Prefab,
            default : null,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.initView();
    },

    onEnable : function(){
        this.initCommonSentenceView();
    },

    initCommonSentenceView : function(){
        this.commonstencescrollviewcontent.removeAllChildren();
        var lanType = MjSoundHelper.getLanType();
        var index = (Number(lanType) == 1 ? 1 : 2);  
        var sex = cc.mj.ownUserData.sex;
        if(cc.mj.i18n){
            var count = cc.mj.i18n.t('commonsentence.lanType'+index+'.sex'+sex+'.count');
            var text = '';
            for(var i = 1 ; i <= count ; ++i){
                text = cc.mj.i18n.t('commonsentence.lanType'+index+'.sex'+sex+'.'+i);
                if(text && text!= ''){
                    var itemPrefab = cc.instantiate(this.commonsentenceitemPrefab);
                    itemPrefab.getChildByName('Label').getComponent(cc.Label).string = text;
                    itemPrefab.tag = i;
                    itemPrefab.on(cc.Node.EventType.TOUCH_END,this.onTouchEndCommonSentence,this);
                    this.commonstencescrollviewcontent.addChild(itemPrefab);
                }
            }        
        }
    },

    initExpressView : function(){
        for(var i = 0 ; ;++i){
            var spriteAtlasUrl = 'mahjong/png/expression';
            var spriteAtlas = cc.loader.getRes(spriteAtlasUrl,cc.SpriteAtlas);
            var url = 'bq_'+i;
            var spriteFrame = spriteAtlas.getSpriteFrame(url);
            if(!spriteFrame){
                break;
            }else{
                var expressNode = cc.instantiate(this.ExpressNodePrefab);
                expressNode.tag = i;
                expressNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                expressNode.on(cc.Node.EventType.TOUCH_END,this.onTouchEndExpressNode,this);
                this.expressNodeContainer.addChild(expressNode);   
            }
        }
    },

    initView : function (){
        this.initCommonSentenceView();
        this.initExpressView();
        if(cc.sys.os == cc.sys.OS_IOS){
            this.chatEdit.inputMode = cc.EditBox.InputMode.ANY;
        }
    },

    onClickToggle : function(target,customEventData){
        var targetnodename = target.node.name;
        const str = 'toggle';
        var i = targetnodename.substr(str.length,targetnodename.length);
        console.log('pageindex:' + i);
        this.pageView.scrollToPage(i-1,0.1);
    },

    onClickSendBtn : function (target){
        if(this.chatEdit && this.chatEdit.string !=''){
            //this.chatEdit.setFocus(false);
            var content = this.chatEdit.string;
            if(SensitiveVocaburary.isValid(content)){
                cc.mj.gameData.chatClient.sendText(content);
                this.closeMyself();
            }else{
                CommonHelper.showTips("敏感词汇，发送失败");
            }
            this.chatEdit.string = '';
        }
    },

    onTouchEndExpressNode : function(event){
        var node = event.target;
        var tag = node.tag;
        var content = tag;//从0开始
        cc.mj.gameData.chatClient.sendExpress(content);
        this.closeMyself();
    },

    onTouchEndCommonSentence : function(event){
        var node = event.target;
        var tag = node.tag;
        var lanType = MjSoundHelper.getLanType();
        cc.mj.gameData.chatClient.sendCommonSentence(tag,lanType);
        this.closeMyself();
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);
    },

    onDisable : function(){
        GameToWechatGameHelper.hideKeyboard();
    },
});
