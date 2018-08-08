var DiamondConfig = require('DiamondConfig');
var GameToPlatformHelper = require('GameToPlatformHelper');
var CommonHelper = require("CommonHelper");
var GameToWechatGameHelper = require('GameToWechatGameHelper');
var tempClient = require('MjRequestSpecificClient');
var ExchangeConfig = require("ExchangeConfig");
var Code = require('CodeCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        _indexPage : 0,
        pageNodeList : {//因为无法去掉pageview的滚动事件，所以用隐藏的方式
            default : [],
            type : cc.Node,
        },
        originToggleGroup : {
            type : cc.ToggleGroup,
            default : null,
        },
        applePayNode : {
            type : cc.Node,
            default : null,            
        },
        rechargeTypeNode : {
            type : cc.Node,
            default : null,
        },
        payTypeChoicePageView : {
            type : cc.Node,
            default : null,   
        },
        payTypeNode : {
            type : cc.Node,
            default : [],   
        },
        _diamondList : [],
        _curSelDiamondId : 0,
    },

    // use this for initialization
    onLoad: function () {
        this.initView();
    },

    onEnable : function(){
        cc.mj.ownUserData.emitChange();
    },

    onDisable : function () {
    },

    init : function(isFromClub, pageType){
        this.isFromClub = isFromClub;
        this._indexPage = pageType - 1;
        this.freshView();
    },

    initView : function(){
        this.initPayItemList();
        this.hideOtherPlatform();
        this.payTypeChoicePageView.active = false;
        this.payTypeChoicePageView.getComponent("CommonDialogCpn").setCloseFunc(function(node){
            node.active = false;
        })
    },

    hideOtherPlatform : function(){
        if (cc.sys.os == cc.sys.OS_IOS) {
            if(cc.sys.platform === cc.sys.WECHAT_GAME){
                this.rechargeTypeNode.getChildByName("toggle1").active = false;
            }
        } else {
            this.applePayNode.active = false;
        }
    },

    onClickTypeToggleChange : function(target,customEventData){
        var targetnodename = target.node.name;
        const str = 'toggle';
        var i = targetnodename.substr(str.length,targetnodename.length);
        this._indexPage =  i - 1;
        this.freshView();
    },

    freshView : function(){
        this.scrollToPage(this._indexPage);
        this.freshPayItemList();
    },

    scrollToPage : function(index){
        var toggle = this.rechargeTypeNode.getChildByName("toggle" + (index + 1)).getComponent(cc.Toggle);
        toggle.check();
        for(var i = 0 ; i < this.payTypeNode.length; ++i){
            this.payTypeNode[i].active = (index == i);
        }
    },

    freshPayItemList : function(){
        if (this._indexPage == 0) {
            this._diamondList = DiamondConfig.getDiamondListByFlag(1);
        } else {
            this._diamondList = ExchangeConfig.getExchangeListByType(this._indexPage - 1);
        }
        var coinStr = ["钻石", "金币", "房卡"];
        // CommonHelper.sortByTag(this._diamondList, "sort", true);
        if (this._diamondList.length) {
            for(var i = 0 ; i < this.payTypeNode[this._indexPage].childrenCount; ++i){
                var Goods = this._diamondList[i];
                if (Goods) {
                    var price = (this._indexPage == 0?Goods.money:Goods.diamond);
                    var item = this.payTypeNode[this._indexPage].getChildByName('item'+i);
                    item.getChildByName('moneyLabel').getComponent(cc.Label).string = price + (this._indexPage == 0 ? '元' : "");
                    item.getChildByName('nameLabel').getComponent(cc.Label).string = Goods.name;
                    var isGive = (Goods.giveAmount > 0)
                    item.getChildByName('zengsong').active = isGive;
                    if (isGive){
                        var str = '赠送?' + coinStr[this._indexPage];
                        item.getChildByName('zengsong').getChildByName('label').getComponent(cc.Label).string = str.replace('?',Goods.giveAmount);
                    }
                }
            }
        }
    },

    initPayItemList : function(){
        for (let i = 0; i < this.payTypeNode.length; i++) {
            for (let j = 0; j < this.payTypeNode[i].childrenCount; j++) {
                var item = this.payTypeNode[i].getChildByName('item'+j);
                if (i == 0) {
                    item.on(cc.Node.EventType.TOUCH_END,this.onClickBtnGoods,this);
                } else {
                    item.on(cc.Node.EventType.TOUCH_END,this.onClickBtnTransposing,this);
                }
            }
        }
    },

    getCheckDiamondId : function(){
        return this._curSelDiamondId;
    },

    closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);   
        this.payTypeChoicePageView.active = false;    
    },

    onClickBtnGoods : function(event){
        var targetnodename = event.target.name;
        const str = 'item';
        var index = targetnodename.substr(str.length,targetnodename.length);
        var diamondId = this._diamondList[index].diamondId;
        this._curSelDiamondId = diamondId;
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            GameToPlatformHelper.executeRecharge(this._curSelDiamondId,null);
            this.closeMyself();
        }else{
            this.payTypeChoicePageView.active = true;
        }
    },

    onClickBtnTransposing : function (event) {
        var self = this;
        var coinStr = ["个钻石", "个金币", "张房卡"];
        var targetnodename = event.target.name;
        const str = 'item';
        var index = targetnodename.substr(str.length,targetnodename.length);
        var itemData = this._diamondList[index];
        if (itemData) {
            var isGive = (itemData.giveAmount > 0)
            var giveStr = "";
            if ( isGive ) {
                giveStr = "\n再赠送" + itemData.giveAmount + coinStr[this._indexPage];
            }
            var constentStr = "是否使用" + itemData.diamond + coinStr[0] + "置换" + itemData.name + giveStr;
            CommonHelper.showMessageBox("提示",constentStr,function(){self.onSendTranspose(itemData)},null,true);
        }
    },

    onSendTranspose : function (itemData) {
        if (cc.mj.ownUserData.money >= itemData.diamond) {
            tempClient.getTranspose(itemData, true, this.onTransposeDone.bind(this));
        } else {
            CommonHelper.showMessageBox("提示","钻石不足",function(){},null,false);
        }
    },

    onTransposeDone : function (customHttpRequest, itemData) {
        if(customHttpRequest){
            var cbdata = JSON.parse(customHttpRequest.xhr.responseText);
            console.log('MahjongTempClient.quitClub ' + JSON.stringify(cbdata));
            if(cbdata.code == Code.OK){
                cc.global.rootNode.emit("freshUserMoney");
                CommonHelper.showTips("兑换成功");
            } else if (cbdata.code == Code.EXCHANGE_CONFIG_NOT_EQUAL){
                CommonHelper.showMessageBox("提示", Code.getCodeName(cbdata.code), function () {
                    GameToPlatformHelper.ExitGame();
                }, null, false);
            }else{
                CommonHelper.showTips(Code.getCodeName(cbdata.code));
            }
        }else{  
            CommonHelper.showMessageBox("提示","网络错误",function(){},null,false);
        }
    },

    onClickPayType : function (target, customdata) {
        var customData = Number(customdata);
        var diamondId = this.getCheckDiamondId();
        var payArr = ["alipay", "wechatpay","applepay"];
        var payType = payArr[(customData - 1)];
        console.log('onClickPayType' + payType);
        GameToPlatformHelper.executeRecharge(diamondId,payType);
        this.closeMyself();
    },

    onClickClosePayTypeChoicePageView : function () {
        this.payTypeChoicePageView.active = false;  
    },
});
