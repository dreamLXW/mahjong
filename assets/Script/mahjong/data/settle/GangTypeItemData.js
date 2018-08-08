var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        isPassive : cc.Boolean,
        influenceUidList : [],
        singleScore : cc.Integer,
        tatalScore : cc.Integer,
        pairType : cc.Integer,
        card : cc.Integer,
    },

    init : function(opt){
        this.isPassive = opt.isPassive;//是否被动  
        this.influenceUidList = [];
        this.singleScore = opt.singleScore;
        this.totalScore = this.singleScore;
        this.pairType = opt.pairType;
        this.card = opt.card;
        this.jiangMaNumber = opt.jiangMaNumber;
        if(this.isPassive){
            this.influenceUidList.push(opt.uid);
        }else{
            this.influenceUidList.push(opt.fromUid);
        }
    },

    mergeAnotherGangtypeItemData : function(anothergangTypeItemData){
        var influenceUid = anothergangTypeItemData.influenceUidList[0];
        this.influenceUidList.push(influenceUid);
        this.totalScore = this.singleScore * this.influenceUidList.length;
    },

    isCanMerge : function(anothergangTypeItemData){
        return (
                this.isPassive == anothergangTypeItemData.isPassive && 
                this.singleScore == anothergangTypeItemData.singleScore && 
                anothergangTypeItemData.pairType == this.pairType && 
                anothergangTypeItemData.card == this.card
                );
    },

    getSingleScore : function(){
        var score = ( (this.isPassive == true) ?  (this.singleScore * (-1)) : this.singleScore );
        return CommonHelper.numberToString(score);
    },

    getTotalScore : function(){
        var score =  ( (this.isPassive == true) ?  (this.totalScore * (-1)) : this.totalScore );
        return CommonHelper.numberToString(score);
    },

    getScorePerGang : function(){
        var gangScore = ( (this.isPassive == true) ?  (this.singleScore * (-1)) : this.singleScore );
        if(this.jiangMaNumber != null && this.jiangMaNumber != undefined && this.jiangMaNumber >0){
            var beiShu = this.jiangMaNumber + 1;
            gangScore = gangScore / beiShu;
        }
        return CommonHelper.numberToString(gangScore);
    }

});