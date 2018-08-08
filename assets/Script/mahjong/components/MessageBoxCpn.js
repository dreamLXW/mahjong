cc.Class({
    extends: cc.Component,

    properties: {
        chioce0 : {
            type : cc.Node,
            default : null,
        },
        chioce1 : {
            type : cc.Node,
            default : null,            
        },
        titleLabel:{
            type : cc.Label,
            default : null,
        },
        contentLabel:{
            type : cc.RichText,
            default : null,
        },
        isActive : false,
        _onOkFunc : null,
        _onOkParam : null,
        _onCancelFunc : null,
        _onCancelParam : null,
    },

    // use this for initialization
    onLoad: function () {
    },

    init : function(data){//{"title":title,"content":content,"onOk":cb,"onOkParam":cbparam,"onCancel":cb,"onCancelParam":cbparam,"isNeedCancel":isNeedCancel}
        this.fresh(data);
    },
    
    onClickOk : function(){
        if(this._onOkFunc){
            this._onOkFunc(this._onOkParam);
        }
        this.onClose();
    },

    onClickCancel : function(){
        if(this._onCancelFunc){
            this._onCancelFunc(this._onCancelParam);
        }
        this.onClose();
    },

    onClose : function(){
        var MessageBoxMgr = require("MessageBoxMgr");
        MessageBoxMgr.onClose();
    },

    // onDisable : function(){
    //     var MessageBoxMgr = require("MessageBoxMgr");
    //     MessageBoxMgr.onClose();
    // },

    fresh : function(data){
        this.contentLabel.string = data.content;
        this.chioce0.active = !data.isNeedCancel;
        this.chioce1.active = data.isNeedCancel;
        this._onOkFunc = data.onOk;
        this._onOkParam = data.onOkParam;
        this._onCancelFunc = data.onCancel;
        this._onCancelParam = data.onCancelParam;
        this._isImportant = data.isImportant;
    },
});
