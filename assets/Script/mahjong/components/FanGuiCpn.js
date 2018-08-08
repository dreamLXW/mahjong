var CommonHelper = require('CommonHelper');
var EventName = require('EventName');
cc.Class({
    extends: cc.Component,

    properties: {
        zhongSp:{
            default:null,
            type:cc.Node,
        },
        fanSp:{
            default:null,
            type:cc.Node,
        },
        banSp:{
            default:null,
            type:cc.Node,
        },
        aniMj:{
            default:null,
            type:cc.Node,
        },
        aniMjWord:{
            default:null,
            type:cc.Sprite,
        },
        guiMj:{
            default:null,
            type:cc.Node,
        },
        guiMjWord:{
            default:null,
            type:cc.Sprite,
        }

    },

    // use this for initialization
    onLoad: function () {
        console.log(this.guiMj);
        this.setVisible(false);
    },

    fanGui(gui,type,isAction){//type:zhong,fan,ban   isAction:是否做动作
        //先忽略动画 
        console.log('fangui:'+gui + 'isAction:'+isAction);
        this.guiPai = gui;
        if(isAction){
            this.setGuiWithAction(gui,type);
        }else{
            this.setGuiWithoutAction(gui);
        }
    },

    setGuiWithoutAction : function(gui){
        this.guiMj.active = true;
        var spriteFrame = CommonHelper.getMahjongWord(gui);
        console.log('guipai set spriteframe ');
        console.log(spriteFrame);
        this.guiMjWord.spriteFrame = spriteFrame;
        this.emitSetGuiComplete();
    },

    setGuiWithAction:function(gui,type){
        var spriteFrame = CommonHelper.getMahjongWord(gui);
        this.guiMjWord.spriteFrame = spriteFrame;
        this.aniMjWord.spriteFrame = spriteFrame;
        var map = {"zhong":this.zhongSp,"ban":this.banSp,"fan":this.fanSp};
        this.zhongSp.active = false;
        this.fanSp.active = false;
        this.banSp.active = false;
        var sp = map[type];
        sp.active = true;
        var animation = this.node.getComponent(cc.Animation);
        animation.play();
        //this.emitSetGuiComplete();
    },    

    emitSetGuiComplete : function(){
        var detail = {'data':this.guiPai};
        cc.mj.gameData.seatData.onSetGuiPaiComplete(detail);
        CommonHelper.emitActionCompelete();
        //cc.global.rootNode.emit(EventName.OnSetGuiPaiComplete,detail);
    },
   
    setVisible : function(isvisible){
        var animation = this.node.getComponent(cc.Animation);
        animation.stop(); 
        this.guiMj.active = isvisible;
        this.aniMj.active = isvisible;
        this.zhongSp.active = isvisible;
        this.fanSp.active = isvisible; 
        this.banSp.active = isvisible;
        this.node.getChildByName('mj_bg7').active = isvisible;
    },
});
