cc.Class({
    extends: cc.Component,

    properties: {
        EventName : 'TalkChatEvent',
        uid : -1,
        type : -1,
        content : '',
        EXPRESSTYPE : 1,
        TEXTTYPE : 2,
        COMMONVOICETYPE : 3,
        TRAININGTYPE : 4,
        playerData : {
            default : null,
        }
    },

    init : function(opt){
        this.uid = opt.uid;
        this.type = opt.type;
        this.content = opt.content;
    },

    isMyMessage : function(){
        return this.uid == cc.mj.ownUserData.uid;
    },
    
    isCommonSentence : function(){
        return (this.type == this.COMMONVOICETYPE);
    },

    isExpress : function(){
        return (this.type == this.EXPRESSTYPE);
    },

    isText : function(){
        return (this.type == this.TEXTTYPE);
    },

    isTrainingMsg : function(){
        return (this.type == this.TRAININGTYPE);
    },
});
