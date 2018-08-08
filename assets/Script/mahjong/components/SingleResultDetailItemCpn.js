var CommonHelper = require('CommonHelper');
var HuTypeCfg  = require('HuTypeCfg');
var PairCfg = require('PairCfg');
var MaCfg = require('MaCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        singleScoreLabel : {
            type : cc.Label,
            default : null,
        },
        totalScoreLabel : {
            type : cc.Label,
            default : null,
        } ,
        huTypeLabel : {
            type : cc.Label,
            default : null,
        },
        detailLabel : {
            type : cc.Label,
            default : null,
        },
        InfluenceUidLabel : {
            type : cc.Label,
            default : null,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    initPlayerDataMgr : function(playerDataMgr){
        this._playerDataMgr = playerDataMgr;
    },

    initHutypeItemData : function(uid,huTypeItemData){
        this.singleScoreLabel.string = huTypeItemData.getSingleScore();
        this.totalScoreLabel.string = huTypeItemData.getTotalScore();
        var influenceUidList = huTypeItemData.influenceUidList;
        this.initInfluenceUidLabel(uid,influenceUidList);

        var huType = huTypeItemData.huType;
        var realType = HuTypeCfg.huTypeMap[huType];
        var typeText = HuTypeCfg.huTypeIntroArr[realType];
        this.huTypeLabel.string = huTypeItemData.isPassive?typeText.name1:typeText.name;
        if(this._mahjongType == 'chaozhou'){
            this.detailLabel.string = huTypeItemData.getMenqingDetailStr() ;
        }else{
            this.detailLabel.string = huTypeItemData.getCommonDetailStr(this._mahjongType);
        }
    },

    initInfluenceUidLabel : function(myuid,influenceUidList){
        var str = '';
        if(influenceUidList.length == 3){
            str = '三家';
        }else{
            const sideTextArr = {"self":'自家',"right":'下家',"up":'对家',"left":'上家'};
            for(var i = 0 ; i < influenceUidList.length; ++i){
                var relativePos = this._playerDataMgr.getRelativePosBetween(myuid,influenceUidList[i]);
                var sideNameArr = CommonHelper.getSideNameArr("myself",this._playerDataMgr.getMaxNum());
                var side = sideNameArr[relativePos-1];
                str += sideTextArr[side];
                str += '、';
            }
            str= str.substr(0,str.length-1);
        }

        this.InfluenceUidLabel.string = str;
    },

    initMaTypeItemData : function(uid,maTypeItemData){
        this.singleScoreLabel.string = maTypeItemData.getSingleScore();
        this.totalScoreLabel.string = maTypeItemData.getTotalScore();
        var influenceUidList = maTypeItemData.influenceUidList;
        this.initInfluenceUidLabel(uid,influenceUidList);
        var isPassive = maTypeItemData.isPassive;
        var beText = maTypeItemData.isPassive?'被':'';

        var maType = maTypeItemData.type;
        var originmaTypeName = MaCfg.name(maType);
        var maTypeName = beText + originmaTypeName;
        this.huTypeLabel.string = maTypeName;

        var maNumStr = maTypeItemData.number?(originmaTypeName+'x'+maTypeItemData.number) : '';
        this.detailLabel.string = maTypeName + maTypeItemData.getScorePerMa() + ' ' + maNumStr ;
    },

    initGangTypeItemData : function(uid,gangTypeItemData){
        this.singleScoreLabel.string = gangTypeItemData.getSingleScore();
        this.totalScoreLabel.string = gangTypeItemData.getTotalScore();
        var influenceUidList = gangTypeItemData.influenceUidList;
        this.initInfluenceUidLabel(uid,influenceUidList);
        var beText = gangTypeItemData.isPassive?'被':'';

        var pairType = gangTypeItemData.pairType;
        var pairTypeName = PairCfg.name(pairType);
        pairTypeName = beText + pairTypeName;
        this.huTypeLabel.string = pairTypeName;

        var jiangMaStr = gangTypeItemData.jiangMaNumber > 0 ? (' 奖马x'+(Number(gangTypeItemData.jiangMaNumber)+1)) : '';
        this.detailLabel.string = pairTypeName + gangTypeItemData.getScorePerGang() + jiangMaStr;
    },

    initZhuangTypeData : function(uid,zhuangTypeItemData){
        this.singleScoreLabel.string = zhuangTypeItemData.getSingleScore();
        this.totalScoreLabel.string = zhuangTypeItemData.getTotalScore();
        var influenceUidList = zhuangTypeItemData.influenceUidList;
        this.initInfluenceUidLabel(uid,influenceUidList);
        var beText = zhuangTypeItemData.isPassive?'被':'';

        var zhangTypeName = beText + '跟庄';
        this.huTypeLabel.string = zhangTypeName;

        this.detailLabel.string = zhangTypeName + this.singleScoreLabel.string;
    },

    initMahjongType : function(mahjongType){
        this._mahjongType = mahjongType;
    },
});
