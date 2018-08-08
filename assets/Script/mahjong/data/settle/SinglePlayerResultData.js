var CommonHelper = require('CommonHelper');
var HuTypeItemData = require('HuTypeItemData');
var GangTypeItemData = require('GangTypeItemData');
var MaTypeItemData = require('MaTypeItemData');
var ZhuangTypeItemData = require('ZhuangTypeItemData');
var ServerMaBillData  = function(opt){
    this.uid = opt.uid;
    this.fromUid = opt.fromuid;
    this.singleScore = opt.score;
    this.maNumber = opt.number;
    this.maPaiUid = opt.maPaiUid;
};

var ServerHuBillData = function(opt){
    var FanXing = function(opt){
        this.type = opt.type;
        this.score = opt.score;
        this.mode = opt.mode;
        this.calculate = opt.calculate;
    };

    var ExtraDouble = function(opt){
        this.type = opt.id;
        this.double = opt.double;
        const nameMap = {'1':'无鬼加倍','2':'四鬼胡牌加倍'};
        this.name = nameMap[this.type];
    };

    this.huCard = opt.card;
    this.uid = opt.uid;
    this.fromUid = opt.fromuid;
    this.totalScore = opt.score;
    this.huScore = opt.huScore;
    this.huType = opt.type;
    this.huTypeDouble = opt.huTypeDouble;
    this.fanXingList = [];
    if(opt.pointList){
        for(var i = 0 ; i < opt.pointList.length; ++i){
            this.fanXingList.push(new FanXing(opt.pointList[i]));
        }
    }
    if(opt.extraDouble){
        this.extraDouble = new ExtraDouble(opt.extraDouble);
    }
    this.isLianZhuang = opt.lianZhuang ? opt.lianZhuang.lianZhuang : false;
    this.lianZhuangDouble = opt.lianZhuang ? opt.lianZhuang.double : 0;
    this.lianZhuangNum = opt.lianZhuang ? opt.lianZhuang.times : 0;
    this.jiangMaNumber = opt.jiangMaNumber;
    this.diFen = opt.diFen;

    this.isXiaoHu = opt.xiaoHu;
    this.doubleLimit = opt.doubleLimit || -1;
    this.scoreLimit = opt.scoreLimit || -1;
    this.isShiBeiBuJiFen = opt.shiBeiBuJiFen;
    this.quanBaoType = opt.huTypeQuanBao ? opt.huTypeQuanBao.type : null;
    this.quanBaoNumber = opt.huTypeQuanBao ? opt.huTypeQuanBao.quanBaoNumber : 0;
};

var ServerGenZhuangBillData = function(opt){
    this.uid = opt.uid;
    this.fromUid = opt.fromuid;
    this.singleScore = opt.score;
};

var ServerGangBillData = function(opt){
    this.uid = opt.uid;
    this.fromUid = opt.fromuid;
    this.singleScore = opt.score;
    this.pairType = opt.type;
    this.card = opt.card;
    this.jiangMaNumber = opt.jiangMaNumber;
};

cc.Class({
    extends: cc.Component,

    properties: {
        uid : -1,
        totalScore : -1,
        curScore : -1,
        huTypeItemDataList : {
            default : [],
            type : HuTypeItemData,
        },
        zhuangTypeItemData : {
            default : null,
            type : ZhuangTypeItemData,          
        },
        gangTypeItemDataList : {
            default : [],
            type : GangTypeItemData,
        },
        maTypeItemDataList : {
            type : MaTypeItemData,
            default : [],
        },
        userName : {
            get : function(){
                return 'betty';
            }
        },
        isRoomId : {
            get : function(){
                return false;
            }
        },
        url : {
            get : function(){
                return '';
            }
        },  
    },

    // use this for initialization
    onLoad: function () {

    },

    initUid : function(uid){
        this.uid = uid;
    },

    getUid : function(){
        return this.uid;
    },

    setTotalScore : function(totalScore){
        if(this.totalScore != -1){
            console.log('你已经赋过值');
        }
        this.totalScore = totalScore;
    },

    setCurScore : function(curScore){
         if(this.curScore != -1){
            console.log('你已经赋过值');
        }
        this.curScore = curScore;       
    },

    addMaBillData : function(maBillItem,maCfg,isFrom){
        var serverMaBillData = new ServerMaBillData(maBillItem);
        // serverMaBillData.isPassive = isPassive;
        serverMaBillData.type = maCfg;
        serverMaBillData.isFrom = isFrom;
        serverMaBillData.myuid = this.uid;
        var maTypeItemData = new MaTypeItemData();
        maTypeItemData.init(serverMaBillData);
        var isMerged = false;
        for(var i = 0 ; i < this.maTypeItemDataList.length; ++i){
            if(this.maTypeItemDataList[i].isCanMerge(maTypeItemData)){
                isMerged = true;
                this.maTypeItemDataList[i].mergeAnotherMatypeItemData(maTypeItemData);
                break;
            }
        }
        if(!isMerged){
            this.maTypeItemDataList.push(maTypeItemData);
        }
    },

    addHuBillData : function(huBillItem,isPassive){
        var serverHuBillData = new ServerHuBillData(huBillItem);
        serverHuBillData.isPassive = isPassive;
        var huTypeItemData = new HuTypeItemData();
        huTypeItemData.init(serverHuBillData);
        var isMerged = false;

        for(var i = 0 ; i < this.huTypeItemDataList.length; ++i){
            if(this.huTypeItemDataList[i].isCanMerge(huTypeItemData)){
                isMerged = true;
                this.huTypeItemDataList[i].mergeAnotherHutypeItemData(huTypeItemData);
                break;
            }
        }
        if(!isMerged){
            this.huTypeItemDataList.push(huTypeItemData);
        } 
    },

    addGangBillData : function(gangBillItem,isPassive){
         var serverGangBillData = new ServerGangBillData(gangBillItem);
        serverGangBillData.isPassive = isPassive;
        var gangTypeItemData = new GangTypeItemData();
        gangTypeItemData.init(serverGangBillData);
        var isMerged = false;
        for(var i = 0 ; i < this.gangTypeItemDataList.length; ++i){
            if(this.gangTypeItemDataList[i].isCanMerge(gangTypeItemData)){
                isMerged = true;
                this.gangTypeItemDataList[i].mergeAnotherGangtypeItemData(gangTypeItemData);
                break;
            }
        }
        if(!isMerged){
            this.gangTypeItemDataList.push(gangTypeItemData);
        }      
    },

    addGenZhuangBillData : function(genZhuangBillItem,isPassive){
        var serverGenZhuangBillData = new ServerGenZhuangBillData(genZhuangBillItem);
        serverGenZhuangBillData.isPassive = isPassive;
        var zhuangTypeItemData = new ZhuangTypeItemData();
        zhuangTypeItemData.init(serverGenZhuangBillData);
        if(this.zhuangTypeItemData){
            this.zhuangTypeItemData.mergeAnotherGenZhuangtypeItemData(zhuangTypeItemData);
        }else{
            this.zhuangTypeItemData = zhuangTypeItemData;
        } 
    },

    addShiBeiBuJiFenHuTypeData : function(shiBeiBuJiFenUidList,huType,isPassive){
        var HuTypeCfg = require('HuTypeCfg')
        for(var i = 0 ; i < shiBeiBuJiFenUidList.length; ++i){
            var huBillItem = {'score':0,'huScore':0,'shiBeiBuJiFen':true,'type':huType};
            if(isPassive){
                huBillItem.uid = shiBeiBuJiFenUidList[i];
                huBillItem.fromuid = this.uid;
            }else{
                huBillItem.uid = this.uid;
                huBillItem.fromuid = shiBeiBuJiFenUidList[i];
            }
            this.addHuBillData(huBillItem,isPassive);
        }
    }

});
