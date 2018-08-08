var PairCfg  = require('PairCfg');
var CommonHelper = require('CommonHelper');
var SoundHelper = require('MjSoundHelper')
cc.Class({
    extends: cc.Component,

    properties: {
        mjZhuoNode : {
            type : cc.Node,
            default : null,
        },
        chuPai : {
            default : null,
            type : cc.Node,
        },      
        lastOutCardIndex : 0,
        side : 'null',
    },

    // use this for initialization
    onLoad: function () {
        //var outs = this.node.getChildByName('outs');//打出的牌
        this.mjZhuoNode = this.node.getChildByName('mj_zhuo');
        this.chuPai = this.mjZhuoNode.getChildByName('mj_chu0');
        this.pointCpn = this.node.getChildByName('point').getComponent('PointCpn');
    },

    hideAllCards : function(){
        if(this.mjZhuoNode){
            for(var i = 0 ; i < this.mjZhuoNode.childrenCount; ++i){
            var outCard = this.mjZhuoNode.children[i].getChildByName('OutCard');
                if(outCard){
                    outCard.active = false;
                }else{
                this.mjZhuoNode.children[i].active = false;
                }
            }
            this.pointCpn.stopPlaying();
        }
        this.lastOutCardIndex = 0;
    },

    showOutCards : function(outCardList){//传过来的列表只存贮类型为出牌的
        this.lastOutCardIndex = 0;
        for(var i = 0 ; i < this.mjZhuoNode.childrenCount-1 ; ++i){
            var index = i + 1;
            if(outCardList[i]){
                this.initOutCard(index,outCardList[i].card);
            }else{
                this.initOutCard(index,null);
            }      
        }
        
        this.rejustScaleIfNeeded();
    },

    initSide : function(sideName){
        this.side = sideName;
    },

    onChuPaiAction : function(seatActionEvent){
        var chuCard = seatActionEvent.cardList[0];
        var uid = seatActionEvent.uid;
        SoundHelper.playingChuPai(chuCard,cc.mj.gameData.getPlayerData(uid).sex);
        var lastIndex = this.lastOutCardIndex + 1;
        var outCard = this.initOutCard(lastIndex,chuCard);//outCard
        //outCard.scale = this.chuPai.scale;
        //outCard.position = outCard.parent.convertToNodeSpaceAR(this.chuPai.convertToWorldSpaceAR(cc.p(0,0))); 
        //outCard.runAction(this.getChuPaiAction());
        outCard.position = cc.p(0,0);
        this.emitChuPaiComplete();
        this.rejustScaleIfNeeded();
    },

    getChuPaiAction : function(){
        const duration = 0.1;
        // var action = cc.sequence(   cc.scaleTo(duration, 2.5),
        //                             cc.delayTime(0.35),
        //                             cc.spawn(cc.moveTo(duration,cc.p(0,0)),cc.scaleTo(duration,1,1)),
        //                             cc.callFunc(function(){this.emitChuPaiComplete();},this)
        //                         );
        var action = cc.sequence(   cc.delayTime(0.15),
                                    cc.spawn(cc.moveTo(duration,cc.p(0,0)),cc.scaleTo(duration,1,1)),
                                    cc.callFunc(function(){this.emitChuPaiComplete();},this)
        );
        return action;
    },

    emitChuPaiComplete : function(){
        console.log('动作完毕');
         cc.mj.gameData.seatData.checkLastOutCardSide();
        //this.mahjongLayerCpn.setLastOutCardSide(this.side);
        CommonHelper.emitActionCompelete();
    },

    initOutCard : function(index,cardData){
        var outCard = this.mjZhuoNode.getChildByName('mj_chu'+index).getChildByName('OutCard');
        if(!outCard){
            console.log('initOutCard可能出错');
            return;
        }
        var commonMjCard = outCard.getChildByName('mj_bg');
        var commonMjCardCpn = commonMjCard.getComponent('CommonMjCardCpn');
        if(!commonMjCardCpn){
            console.log('outCard.addComponent');
            commonMjCardCpn = commonMjCard.addComponent('CommonMjCardCpn');
        }
        this.pointCpn.stopPlaying();
        outCard.position = cc.p(0,0);
        if(cardData == null || cardData == undefined){
            // commonMjCardCpn.setVisible(false);
            outCard.active = false;
        }else{
            this.lastOutCardIndex = index;
        
            // commonMjCardCpn.setVisible(true);
            outCard.active = true;
            commonMjCardCpn.setMahjongData(cardData);   
        }
        return outCard;
    },

    getAnimationWorldPos : function(){
        var worldPos = this.mjZhuoNode.parent.convertToWorldSpaceAR(this.mjZhuoNode.position);
        return worldPos;
    },

    setIsLastOut : function(isLastOut){
        console.log('isLastOut:'+isLastOut + 'this.lastOutCardIndex'+this.lastOutCardIndex + '   side:'+this.side);
        if(this.lastOutCardIndex == 0){
            return;
        }
        var outCard = this.mjZhuoNode.getChildByName('mj_chu'+this.lastOutCardIndex).getChildByName('OutCard');
        if(outCard){
            if(isLastOut){
                this.pointCpn.setPos(outCard.convertToWorldSpaceAR(cc.p(0,0)));
                this.pointCpn.playing();
            }else{
                this.pointCpn.stopPlaying();
            }
        }
    },

    setMahjongLayerCpn : function(mahjongLayerCpn){
        this.mahjongLayerCpn = mahjongLayerCpn;
    },

    rejustScaleIfNeeded : function(){//如果超过3行就缩小
        var scale = ((this.side == 'myself' || this.side == 'up')&& this.lastOutCardIndex > 30) ? 0.85 : 1;
        this.node.scale = scale;
    },

});
