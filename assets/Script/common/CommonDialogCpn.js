cc.Class({
    extends: cc.Component,

    properties: {
        clsoeBtn:{
            type:cc.Button,
            default:null,
        },
        confirmBtn:{
            type:cc.Button,
            default:null,
        },

        _closeFunc : {
            default : null,
            type : Function,
        },

        _confirmFunc : {
            default : null,
            type : Function,
        },
        _confirmFuncParam :{
            default : null,
            type : cc.Object,
        },
        bg : {
            type : cc.Node,
            default : null
        },
        isUseDisplayEffect : true,
        isClickBlankAutoClose:false,//点击空白自动关闭
        modalTypeName : "COMMON",//另外一种类型是"UNCOMMON"
    },

    // use this for initialization
    onLoad: function () {   
        if(this.isClickBlankAutoClose){
            this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this);
        }    
    },

    setCloseFunc : function(closeFunc){
        this._closeFunc = closeFunc;
    },

    onClickCloseBtn:function(){
       if(!this._closeFunc){
           this.defaultCloseFunc(this.node);
       }else{
           this._closeFunc(this.node);
       }
    },

    defaultCloseFunc : function(node){
         this.node.removeFromParent();
    },

    onClickConfirm:function(event){
        if(this._confirmFunc){
            this._confirmFunc(this._confirmFuncParam);
        }
    },
    
    onTouchEnd:function(touch){
        if(!this.bg){
            this.bg = this.node.getChildByName('bg');
        }
        if(this.bg){
            var pos = this.node.convertTouchToNodeSpaceAR(touch);
            var rect = this.bg.getBoundingBox();
            if(!rect.contains(pos)){//点击空白
                this.onClickCloseBtn();
            }
        }
    },

    init : function(confirmFunc,confirmFuncParam){
        this._confirmFunc = confirmFunc;
        this._confirmFuncParam = confirmFuncParam;
    },

    onDestroy:function(){
        this._confirmFunc = null;
        if(this.isClickBlankAutoClose){
            this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this);
        } 
    },

    onEnable : function(){
        // if(this.isUseDisplayEffect){
        //     this.node.scale = 0.8;
        //     this.node.runAction(cc.scaleTo(1.0,1.0,1.0).easing(cc.easeElasticOut()));
        // }

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
