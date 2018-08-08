var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        isPassive : cc.Boolean,
        isFrom : cc.Boolean,
        type : cc.Integer,
        influenceUidList : [],
        singleScore : cc.Integer,
        totalScore : cc.Integer,
        number : cc.Integer,
        maPaiUid : cc.Integer,
    },

    init : function(opt){
        this.uid = opt.myuid;
        this.type       = opt.type;
        this.isFrom = opt.isFrom;//是否被动
        this.influenceUidList = [];
        this.singleScore = opt.singleScore;
        this.totalScore = this.singleScore;
        this.number = opt.maNumber;
        this.maPaiUid = opt.maPaiUid;
        if(this.isFrom){
            this.influenceUidList.push(opt.uid);
        }else{
            this.influenceUidList.push(opt.fromUid);
        }
        this.isPassive = !(this.uid == this.maPaiUid);//maUid是否等于拥有这个matypeitemdata的uid
    },

    isCanMerge : function(anotherMatypeItemData){
        //return false;
        return ( this.isPassive == anotherMatypeItemData.isPassive 
            && this.isFrom == anotherMatypeItemData.isFrom
            && this.singleScore == anotherMatypeItemData.singleScore
            && this.number == anotherMatypeItemData.number 
            && this.maPaiUid == anotherMatypeItemData.maPaiUid);
    },

    mergeAnotherMatypeItemData  : function(anotherMatypeItemData){
        var influenceUid = anotherMatypeItemData.influenceUidList[0];
        this.influenceUidList.push(influenceUid);
        this.totalScore = this.singleScore * this.influenceUidList.length;
    },

    getSingleScore : function(){
        var score =  ( (this.isFrom == true) ?  (this.singleScore * (-1)) : this.singleScore );
        return CommonHelper.numberToString(score);
    },

    getTotalScore : function(){
        var score =  ( (this.isFrom == true) ?  (this.totalScore * (-1)) : this.totalScore );
        return CommonHelper.numberToString(score) /*+ "  买" + this.maPaiUid*/;
    },

    getScorePerMa : function(){
         var score =  ( (this.isFrom == true) ?  (this.singleScore * (-1)) : this.singleScore );
         score /= Number(this.number);
         return CommonHelper.numberToString(score);
    }


});