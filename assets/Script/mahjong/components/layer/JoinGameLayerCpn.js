var tempClient = require('MjRequestSpecificClient');
var RoomInfoData = require('RoomInfoData');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        _roomNumStr : '',
        _roomNumMaxNum : 6,
        roomNumLabel : {
            default : null,
            type : cc.Label,
        },
        buttonContainer : {
            type : cc.Node,
            default : null,
        },

    },

    // use this for initialization
    onLoad: function () {
        const maxNum = 9;
        for(var i = 0 ; i <= maxNum; ++i){
            var button = this.buttonContainer.getChildByName('button'+i);
            button.on('click',this.onNumButtonClcik,this);
        }
        var delButton = this.buttonContainer.getChildByName('buttondel');
        delButton.on('click',this.onNumButtonClcik,this);
        var resetButton = this.buttonContainer.getChildByName('buttonreset');
        resetButton.on('click',this.onNumButtonClcik,this);
    },

    freshView : function(){
        this.roomNumLabel.string = this._roomNumStr;
    },

    onEnable : function(){
        this._roomNumStr = '';
        this.freshView();
    },

    onNumButtonClcik: function (event) {
        var button = event.detail;
        var buttonName = button.node.name;
        console.log(buttonName);
        const str = 'button';
        var index = buttonName.substr(str.length,buttonName.length);
        var numberIndex = Number(index);
        if(numberIndex >= 0 && numberIndex <= 9){
            this.inputNum(numberIndex);
        }
        if(index == 'del'){
            this.deleteNum();
        }else if(index == 'reset'){
            this.resetNum();
        }
     },

     inputNum : function(num){
        if(this._roomNumStr.length < this._roomNumMaxNum){
            this._roomNumStr += num;
            this.freshView();
        }
        if(this._roomNumStr.length == this._roomNumMaxNum){
            this.excuteGetRoomInfo();
            this.closeMyself();
        }
     },

     deleteNum : function(){
        this._roomNumStr = this._roomNumStr.slice(0,this._roomNumStr.length-1);
        this.freshView();
     },

     resetNum : function(){
        this._roomNumStr = '';
        this.freshView();
     },

     excuteGetRoomInfo : function(){
        tempClient.getRoomInfo(null,Number(this._roomNumStr),true,this.onGetRoomInfoCB.bind(this));
     },

     onGetRoomInfoCB : function(roomInfoData){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        var ruleLayerNode = ModalLayerMgr.getTop('RoomInfoLayer');
        var ruleLayerCpn = ruleLayerNode.getComponent('RoomInfoLayerCpn');
        ruleLayerCpn.init(roomInfoData,true);
        ModalLayerMgr.showTop('RoomInfoLayer');
     },

     closeMyself : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        ModalLayerMgr.closeTop(this.node);
    },
    
});
