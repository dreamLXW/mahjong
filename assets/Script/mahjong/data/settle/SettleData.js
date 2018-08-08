var SinglePlayerResultData = require('SinglePlayerResultData');
var MaCfg = require('MaCfg');
var ServerScoreData = function(serverScoreData){
    this.uid = serverScoreData.uid;
    this.totalScore = serverScoreData.score;
    this.curScore = serverScoreData.addScore;
};
cc.Class({
    extends: cc.Component,

    properties: {
        type : -1,//1，胡牌,2，黄庄
        singlePlayerResultDataMap : null,
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(opt){
        this.singlePlayerResultDataMap = {};
        this.type = opt.type;
        this.resolveHuData(opt.hu);
        this.resolveGangData(opt.gangBillList);
        this.resolveGenZhuangData(opt.genZhuangBillList);
        this.resolveScoreData(opt.scoreList);
        
    },

    resolveShiBeiBuJiFenHuTypeBillList : function(shiBeiBuJiFenHuTypeBillList){
        if(!shiBeiBuJiFenHuTypeBillList){
            return;
        }
        for(var i = 0 ; i < shiBeiBuJiFenHuTypeBillList.length; ++i){
            var shiBeiBuJiFenHuTypeBill = shiBeiBuJiFenHuTypeBillList[i];
            var shiBeiBuJiFenUidList = shiBeiBuJiFenHuTypeBill.shiBeiBuJiFenUidList;
            var uid = shiBeiBuJiFenHuTypeBill.uid;
            var fromUid = shiBeiBuJiFenHuTypeBill.fromuid;
            var huType = shiBeiBuJiFenHuTypeBill.type;
            var singlePlayerResultData = this.getSinglePlayerResultDataByUid(uid);
            var passiveSinglePlayerResultData = this.getSinglePlayerResultDataByUid(fromUid);
            singlePlayerResultData.addShiBeiBuJiFenHuTypeData(shiBeiBuJiFenUidList,huType,false);
            passiveSinglePlayerResultData.addShiBeiBuJiFenHuTypeData(shiBeiBuJiFenUidList,huType,true);
        }

    },

    resolveMaBillList : function(maBillList,type){//完成
        if(maBillList){
            for(var i = 0 ; i < maBillList.length ; ++i){
                    var maBillItem = maBillList[i];
                    var winUid = maBillItem.uid;
                    var lostUid = maBillItem.fromuid;
                    var maPaiUid = maBillItem.maPaiUid;
                    var singlePlayerResultData = this.getSinglePlayerResultDataByUid(winUid);
                    var passiveSinglePlayerResultData = this.getSinglePlayerResultDataByUid(lostUid);
                    singlePlayerResultData.addMaBillData(maBillItem,type,false);
                    passiveSinglePlayerResultData.addMaBillData(maBillItem,type,true);
            }
        }
    },

    resolveHuData : function(hu){
        if(!hu){
            return;
        }
        this.resolveMaBillList(hu.maiMaBillList,MaCfg.MaiMa);
        this.resolveMaBillList(hu.faMaBillList,MaCfg.FaMa);
        var huBillList = hu.huBillList;
        if(huBillList){
            for(var i = 0 ; i < huBillList.length ; ++i){
                var huBillItem = huBillList[i];
                var uid = huBillItem.uid;
                var fromUid = huBillItem.fromuid;   
                var singlePlayerResultData = this.getSinglePlayerResultDataByUid(uid);
                var passiveSinglePlayerResultData = this.getSinglePlayerResultDataByUid(fromUid);
                singlePlayerResultData.addHuBillData(huBillItem,false);
                passiveSinglePlayerResultData.addHuBillData(huBillItem,true);                          
            }
        }
        this.resolveShiBeiBuJiFenHuTypeBillList(hu.shiBeiBuJiFenHuTypeBillList);
    },

    resolveGangData : function(gangBillList){
        if(!gangBillList){
            return;
        }
        for(var i = 0 ; i < gangBillList.length; ++i){
            var gangBillItem = gangBillList[i];
            var uid = gangBillItem.uid;
            var fromUid = gangBillItem.fromuid;
            var singlePlayerResultData = this.getSinglePlayerResultDataByUid(uid);
            var passiveSinglePlayerResultData = this.getSinglePlayerResultDataByUid(fromUid);
            singlePlayerResultData.addGangBillData(gangBillItem,false);
            passiveSinglePlayerResultData.addGangBillData(gangBillItem,true);
        }
    },

    resolveGenZhuangData : function(genZhuangBillList){
        if(!genZhuangBillList){
            return;
        }
        for(var i = 0 ; i < genZhuangBillList.length; ++i){
            var zhuangBillItem = genZhuangBillList[i];
            var uid = zhuangBillItem.uid;
            var fromUid = zhuangBillItem.fromuid;
            var singlePlayerResultData = this.getSinglePlayerResultDataByUid(uid);
            var passiveSinglePlayerResultData = this.getSinglePlayerResultDataByUid(fromUid);
            singlePlayerResultData.addGenZhuangBillData(zhuangBillItem,false);
            passiveSinglePlayerResultData.addGenZhuangBillData(zhuangBillItem,true);
        }        
    },

    resolveScoreData : function(scoreList){//完成
        for(var i = 0 ; i < scoreList.length; ++i){
            var serverScoreData = new ServerScoreData(scoreList[i]);
            var singlePlayerResultData = this.getSinglePlayerResultDataByUid(serverScoreData.uid);
            singlePlayerResultData.setCurScore(serverScoreData.curScore);
            singlePlayerResultData.setTotalScore(serverScoreData.totalScore);
        }
    },

    getSinglePlayerResultDataByUid : function(uid){//完成
        if(this.singlePlayerResultDataMap[uid]){
            return this.singlePlayerResultDataMap[uid];
        }else{
            return this.createSinglePlayerResultDataOfUid(uid);
        }       
    },

    createSinglePlayerResultDataOfUid : function(uid){//完成
        var singlePlayerResultData = new SinglePlayerResultData();
        singlePlayerResultData.initUid(uid);
        this.singlePlayerResultDataMap[uid] = singlePlayerResultData;
        return singlePlayerResultData;
    },

    getHuTypeItemDataList : function(){
        var huTypeItemDataList = [];
        for(var uid in this.singlePlayerResultDataMap){
            var singlePlayerResultData = this.singlePlayerResultDataMap[uid];
            if(singlePlayerResultData instanceof SinglePlayerResultData){
                for(var i = 0 ; i < singlePlayerResultData.huTypeItemDataList.length ; ++i){
                    if(singlePlayerResultData.huTypeItemDataList[i].isPassive == false){
                        huTypeItemDataList.push(singlePlayerResultData.huTypeItemDataList[i]);
                    }
                }
            }
        }
        return huTypeItemDataList;
    },

    getHuTypes : function(){//数据来源包括HuBillList和shiBeiBuJiFenHuTypeBillList
        var huTypeList = [];
        var HuTypeItemDataList = this.getHuTypeItemDataList();
        for(var i = 0 ; i < HuTypeItemDataList.length; ++i){
            var item = HuTypeItemDataList[i];
            var huTypeItem = {'type':item.huType,'uid':item.uid,'influenceUid':item.influenceUidList,'huCard':item.huCard};
            huTypeList.push(huTypeItem);
        }
        return huTypeList;
    },

    getHasCardHuTypes : function(){//数据来源包括HuBillList
        var huTypeList = this.getHuTypes();
        var hasCardHuTypeList = [];
        for(var i = 0 ; i < huTypeList.length; ++i){
            var huCard = huTypeList[i].huCard;
            if(huCard != undefined && huCard != null && huCard != NaN){
                hasCardHuTypeList.push(huTypeList[i]);
            }
        }
        return hasCardHuTypeList;
    },
});
