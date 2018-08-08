var CommonHelper = require('CommonHelper');
var PairCfg = require('PairCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        wordSp : {
            default : [],
            type : cc.Sprite,
        },
        topNode :{
            default : null,
            type : cc.Node,
        },
        _fromPos : {
            default : new cc.Vec2()
        },
        _toPos : {
            default : new cc.Vec2()
        },
        _mahjongData : -1,
    },

    // use this for initialization
    onLoad: function () {
        
    },

    setMahjongData : function(mahjongData){//吃的要改成数组
        this._mahjongData = mahjongData;
        for(var i = 0 ; i < this.wordSp.length; ++i){
            console.log('PairCpn setMahjongData');
            console.log(this.wordSp[i]);
            if(this.wordSp[i]){
                this.wordSp[i].spriteFrame = CommonHelper.getMahjongWord(mahjongData);
            }
        }
    },

    setPengGangType : function(type){
        if(type == PairCfg.PENG){
             this.topNode.active = false;
        }else{
            this.topNode.active = true;
        }
    },

    playingPengGangAction : function(fromPos,toPos,type){
        this.setPengGangType(type); 
        this._fromPos = fromPos;
        this._toPos = toPos;
        this.node.position = this._fromPos;
        var pengGangAnimation = this.node.getComponent(cc.Animation);
        pengGangAnimation.on('finished',  this.onAnimationComplete,    this);
        pengGangAnimation.play();
    },

    playingBuGangAction : function(fromWolrdPos){
        var buGangNode = this.topNode.children[0];
        var nodePos = this.topNode.convertToNodeSpaceAR(fromWolrdPos);
        this.topNode.active = true;
        buGangNode.position = nodePos;
        const duration = 0.1;
        buGangNode.runAction(cc.sequence(cc.delayTime(duration),cc.moveTo(duration,cc.p(0,0)),cc.callFunc(function(){this.emitPengGangPaiComplete();},this)));
    },

    onAnimationComplete : function(){//在animation最后一帧设置回调
        this.node.runAction(this.getMoveToOriginAction());
    },

    getMoveToOriginAction : function(){//还有变小
        const duration = 0.1;
        var action = cc.sequence(
                cc.scaleTo(0.1, 1.5), 
                cc.delayTime(0.15),
                cc.spawn(cc.moveTo(duration,this._toPos), cc.scaleTo(duration,1,1)),
                cc.callFunc(function(){this.emitPengGangPaiComplete();},this));
        return action;
    },

    
    emitPengGangPaiComplete : function(){
        console.log('动作完毕');
        CommonHelper.emitActionCompelete();
    },

    isMahjongDataEqual : function(mahjongData){
        return (this._mahjongData == mahjongData);
    }
});
