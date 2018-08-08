cc.Class({
    extends: cc.Component,
    //方位1-4，东南西北
    properties: {
        blinkNum : 20,
        blinkspArr : {
            default : [],
            type : cc.Sprite,
        },
        wordspRootNode : {
            default : null,
            type : cc.Node,
        },
        wordspArr : {
            default : [],
            type : cc.Sprite,
        },
        _curBlinkSp : {
            default : null,
            type : cc.Sprite,
        },
        numLabel : {
            type : cc.Label,
            default : null,
        },
        _myCurDirection : 1,//我的方位
        _directionNum : 4,
    },

    // use this for initialization
    onLoad: function () {
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    blink : function(side){//1-4
        this.setVisible(true);
        if(this._curBlinkSp){
            this._curBlinkSp.node.stopAllActions();
        }
        this.hideAllBlinkSp();
        this._curBlinkSp = this.getBlinkSpByName(side);
        this._curBlinkSp.node.active = true;
        this._curBlinkSp.node.runAction(this.getBlinkAction());
        this.startCountDown(this.blinkNum);
    },

    getBlinkSpByName : function(name){
        return this.blinkspArr.find(function(blickSp){
            return (blickSp.node.name == name);
         })
    },

    hideAllBlinkSp : function(){
        for(var i = 0 ; i < this.blinkspArr.length; ++i){
            this.blinkspArr[i].node.active = false;
        }
    },

    setMainDirection : function(direction){//就是玩家自身的方位
        var curDirection = this._myCurDirection;
        if(curDirection == direction){
            return;
        }
        this._myCurDirection = direction;
        var rotate = (direction - 1)*90;
        this.wordspRootNode.rotation = rotate;
        // for(var i = 0 ; i < this._directionNum ; ++i){
        //     this.wordspArr[i].node.rotation = -rotate;
        // }       
    },

    getBlinkAction : function(){
        var self = this;
        var action = cc.sequence(cc.blink(this.blinkNum+1,this.blinkNum+1),cc.callFunc(function(){self.hideAllBlinkSp();}));
        //var action = cc.blink(this.blinkNum,this.blinkNum);
        return action;
    },

    startCountDown : function(blinkNum){
        this.unscheduleAllCallbacks();
         var interval = 1;
        var repeat = this.blinkNum;
        var delay = 0;
        var num = blinkNum;
        this.schedule(function(){
            if(num < 10){
                this.numLabel.string = '0'+num;
            }else{
                this.numLabel.string = num;
            }
            --num;
        }, interval, repeat, delay);
    },

    setVisible : function(isVisible){
        this.node.active = isVisible;
    },

    setDirectionVisible : function(isVisible){
        for(var i = 0 ; i < this._directionNum ; ++i){
            this.wordspArr[i].node.active = isVisible;
        } 
    },
});
