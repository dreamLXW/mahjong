cc.Class({
    extends: cc.Component,

    properties: {
        rotateSp : {
            default : null,
            type : cc.Sprite,
        },
        text : {
            default : null,
            type : cc.Label,
        },
        _progress : 0,
        _isModal : true,
    },

    // use this for initialization
    onLoad: function () {       
        if(this.rotateSp){
            this.rotateSp.node.runAction(this.getRotateAction());
            this.node.active = false;
        }
    },

    setText : function(str){
        if(this.text){
            this.text.string = str;
        }
    },

    getRotateAction:function(){
        return cc.rotateBy(0.1,30).repeatForever();
    },

    show:function(){
        console.log("loading is rotating")
        this.node.active = true;
        this.node.getComponent(cc.Button).interactable = this._isModal;
    },

    hide : function(){
        console.log("loading stop rotating")
        var progressCpn = this.node.getComponent(cc.ProgressBar);
        if(!progressCpn){
            this.node.active = false;
        }
        this.setText("");
        this._isModal = true;
    },
    
    setIsModal : function(isModal){
        this._isModal = isModal;
    },

    onDestroy:function(){
        console.log(cc.js.getClassName(this)+" onDestroy");
    },

    setProgressNum : function(progress){
        this._progress = progress;
        var progressCpn = this.node.getComponent(cc.ProgressBar);
        if(progressCpn){
            progressCpn.progress = progress;
        }
    },

    getProgressNum : function(){
        return this._progress;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
