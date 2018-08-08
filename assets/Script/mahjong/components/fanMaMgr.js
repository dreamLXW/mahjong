var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        fanMaPrefab : {
            type : cc.Prefab,
            default : null,
        },
        _num : 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    playingFanMa : function(jiangMaData){
        if(jiangMaData.length == 0 ){
            console.log('没有奖码');
            return;
        }
        var length = jiangMaData.length;
        this.length = length;
        this.initLayout(length)
        for(var i = 0 ; i < length ; ++i){
            var jiangmaNode = cc.instantiate(this.fanMaPrefab);
            this.node.addChild(jiangmaNode);
            var commonMjCardCpn = jiangmaNode.getComponent('CommonMjCardCpn');
            commonMjCardCpn.setIsWinChip(jiangMaData[i].type);
            commonMjCardCpn.setMahjongData(jiangMaData[i].card);
            commonMjCardCpn.playingFanMa(this.onOneFanMaComplete.bind(this));
        }
    },

    onDisable : function(){
        this.node.removeAllChildren();
    },    

    initLayout : function(childrenNum){
        var layout = this.getComponent(cc.Layout);
        var cellSize = layout.cellSize;
        var width = 0 ;
        var height = 0;
        if(childrenNum > 8){    
            width = cellSize.width * 6;
            height = cellSize.height * (childrenNum/6);
        }else{
            width = cellSize.width * childrenNum;
            height = cellSize.height ;
        }
        this.node.removeAllChildren();
        this.node.width = width;
        this.node.height = height;
    },
    
    onOneFanMaComplete : function(){
        this._num ++ ;
        console.log('this._num:' + this._num + '   length:' + this.length);
        if(this._num == this.length){
            this._num = 0;
            this.emitFanGuiComplete();
            var commonDialogCpn = this.node.getComponent('CommonDialogCpn');
            commonDialogCpn.onClickCloseBtn();
        }
    },

    emitFanGuiComplete : function(){
        console.log('动作完毕');
        CommonHelper.emitActionCompelete();
    },
});
