var CommonHelper = require('CommonHelper')
cc.Class({
    extends: cc.Component,

    properties: {
        isPassive : cc.Boolean,
        influenceUidList : [],
        singleScore : cc.Integer,
        tatalScore : cc.Integer,
    },

    init : function(opt){
        this.isPassive = opt.isPassive;//是否被动  
        this.influenceUidList = [];
        this.singleScore = opt.singleScore;
        this.totalScore  = this.singleScore;
        if(this.isPassive){
            this.influenceUidList.push(opt.uid);
        }else{
            this.influenceUidList.push(opt.fromUid);
        }
    },

    mergeAnotherGenZhuangtypeItemData : function(anothergenZhuangTypeItemData){
        var influenceUid = anothergenZhuangTypeItemData.influenceUidList[0];
        this.influenceUidList.push(influenceUid);
        this.totalScore = this.singleScore * this.influenceUidList.length;
    },

    getSingleScore : function(){
        var score =  ( (this.isPassive == true) ?  (this.singleScore * (-1)) : this.singleScore );
        return CommonHelper.numberToString(score);
    },

    getTotalScore : function(){
        var score =  ( (this.isPassive == true) ?  (this.totalScore * (-1)) : this.totalScore );
        return CommonHelper.numberToString(score);
    },

});
