var CommonHelper = require('CommonHelper');
var FanXingCfg = require('FanXingCfg');
var HuTypeCfg = require('HuTypeCfg');
cc.Class({
    extends: cc.Component,

    properties: {
        isPassive : cc.Boolean,
        influenceUidList : [],
        singleScore : cc.Integer,
        totalScore : cc.Integer,
    },

    init : function(opt){
        this.isPassive = opt.isPassive;//是否被动
        this.influenceUidList = [];
        if(this.isPassive){
            this.influenceUidList.push(opt.uid);
        }else{
            this.influenceUidList.push(opt.fromUid);
        }
        this.singleScore = opt.totalScore;
        this.totalScore = this.singleScore;
        this.huType = opt.huType;
        this.huCard = opt.huCard ;
        this.huTypeDouble = opt.huTypeDouble;
        this.fanXingList = opt.fanXingList;

        this.extraDouble = opt.extraDouble;
        this.isLianZhuang = opt.isLianZhuang;
        this.lianZhuangDouble = opt.lianZhuangDouble;
        this.lianZhuangNum = opt.lianZhuangNum;
        this.jiangMaNumber = opt.jiangMaNumber;
        this.diFen = opt.diFen;

        this.isXiaoHu = opt.isXiaoHu;
        this.doubleLimit = opt.doubleLimit;
        this.scoreLimit = Number(opt.scoreLimit);
        this.isShiBeiBuJiFen = opt.isShiBeiBuJiFen;
        this.quanBaoType = opt.quanBaoType;
        this.quanBaoNumber = opt.quanBaoNumber;
        //
        this.uid = opt.uid;
    },

    mergeAnotherHutypeItemData : function(hutypeItemData){
        var uid = hutypeItemData.influenceUidList[0];
        this.influenceUidList.push(uid);

        this.totalScore += hutypeItemData.singleScore;
    },

    isCanMerge : function(hutypeItemData){
        var isCan = false;
        if( this.isPassive == hutypeItemData.isPassive &&
            this.singleScore == hutypeItemData.singleScore &&
            this.huType == hutypeItemData.huType &&
            this.huCard == hutypeItemData.huCard &&
            this.huTypeDouble == hutypeItemData.huTypeDouble &&
            this.isLianZhuang == hutypeItemData.isLianZhuang &&
            this.lianZhuangDouble == hutypeItemData.lianZhuangDouble &&
            this.jiangMaNumber == hutypeItemData.jiangMaNumber &&
            this.diFen == hutypeItemData.diFen &&
            this.isXiaoHu == hutypeItemData.isXiaoHu &&
            this.doubleLimit == hutypeItemData.doubleLimit &&
            this.isShiBeiBuJiFen == hutypeItemData.isShiBeiBuJiFen &&
            this.quanBaoType == hutypeItemData.quanBaoType
        ){
            isCan = true;
        }
        if((!this.extraDouble) != (!hutypeItemData.extraDouble)){
            isCan = false;
        }else{
            if(this.extraDouble && hutypeItemData.extraDouble){
                if( this.extraDouble.type != hutypeItemData.extraDouble.type ||
                    this.extraDouble.double != hutypeItemData.extraDouble.double ){
                        isCan = false;
                    }
    
            }
        }
        if(isCan){
            var fanXing1 = this.fanXingList;
            var fanXing2 = hutypeItemData.fanXingList;
            if(fanXing1.length != fanXing2.length){
                isCan = false;
            }else{
                var sortFunc = function(v1, v2){ return (Number(v1.type) - Number(v2.type));}; 
                fanXing1.sort(sortFunc);
                fanXing2.sort(sortFunc);
                for(var i = 0 ; i < fanXing1.length; ++i){
                    if(fanXing1[i].type != fanXing2[i].type || fanXing1[i].score != fanXing2[i].score){
                        isCan = false
                    }
                }
            }
        }
        return isCan;
    },

    getSingleScore : function(){
        var score = ( (this.isPassive == true) ?  (this.singleScore * (-1)) : this.singleScore );
        return CommonHelper.numberToString(score);
    },

    getTotalScore : function(){
        var score = ( (this.isPassive == true) ?  (this.totalScore * (-1)) : this.totalScore );
        return CommonHelper.numberToString(score);
    },

    isShiBeiBujiFen : function(){
        return (/*this.isPassive == true && */this.isShiBeiBuJiFen == true);
    },

    getDetailStr : function(){
        return this.getCommonDetailStr();
    },

    getJiangMaStr : function(){
        var jiangma = this.jiangMaNumber > 0 ? ('奖马x' + (Number(this.jiangMaNumber)+1)) : '';
        return jiangma;
    },

    getQuanBaoStr : function(){
        var quanbaoStr = '';
        if(this.quanBaoType){
            var quanBaoTypeName = HuTypeCfg.getName(this.quanBaoType);
            quanbaoStr = quanBaoTypeName+'全包x'+this.quanBaoNumber;
            if(this.quanBaoType == HuTypeCfg.GANGBAO){
                quanbaoStr = '吃杠' +  quanbaoStr;
            }
        }
        return quanbaoStr;
    },

    getExtraDoubleStr : function(){
        var extraDouble = this.extraDouble ? (this.extraDouble.name + 'x' + this.extraDouble.double) : '';
        return extraDouble;
    },

    getDifenStr : function(){
        var difen = '底分+'+this.diFen;
        return difen;
    },

    getLianZhuangStr : function(){
        var lianZhuangNumStr = this.lianZhuangNum ? ('连庄+'+this.lianZhuangNum) : '';
        var lianZhuangDoubleStr = this.lianZhuangDouble ? ('连庄x'+this.lianZhuangDouble) : '';
        var lianzhuang = this.isLianZhuang ? (lianZhuangDoubleStr == '' ? lianZhuangNumStr : lianZhuangDoubleStr) : '';
        return lianzhuang;
    },

    getPaiXingStr : function(){
        var paixing = '';
        var isHaveDahu = false;
        var daHuScore = 0;
        for(var i = 0 ; i < this.fanXingList.length; ++i){
            var fanXing = this.fanXingList[i];
            var mode = fanXing.mode;
            var fanXingName = FanXingCfg[fanXing.type].name;
            var fanXingScore = fanXing.score;
            var calculate = fanXing.calculate == 'mul' ? 'x' : '+';
            if(mode == 'da_hu'){
                isHaveDahu = true;
                daHuScore = fanXingScore;
                continue;
            }else{
                if(fanXing.calculate == 'mul'){
                    paixing += fanXingName + 'x' + fanXingScore + ' ';
                }else{
                    paixing = fanXingName + '+' + fanXingScore + ' ' + paixing;
                }  
            }
        }
        if(isHaveDahu){
            paixing += '大胡+' + daHuScore + ' ';
        }
        paixing = paixing.substr(0, paixing.length - 1);
        return paixing;
    },

    getMenqingDetailStr : function(){
        var detailStrArr = [];
        var quanbao = this.getQuanBaoStr();
        var jiangma = this.getJiangMaStr();
        var lianzhuang = this.getLianZhuangStr();
        if((this.doubleLimit > 0) || this.isShiBeiBujiFen() || this.scoreLimit > 0){
            if(this.doubleLimit > 0){
                var limitScore = cc.mj.gameData.roomInfo.isGoldRoom() ? 1000 : 40;
                detailStrArr.push(this.doubleLimit+'倍'+'封顶+' + limitScore,lianzhuang,jiangma);
            }
            if(this.scoreLimit > 0){
                detailStrArr.push(this.scoreLimit+'分封顶',jiangma);
            }
            if(this.isShiBeiBujiFen()){
                detailStrArr.push(cc.mj.i18n.t('mjconfig.hupai.shiBeiBuJiFen'));
            }
        }else{
            var paixing = this.getPaiXingStr();
            var tianDiHuType = '';
            var huPaiType = '';            
            var extraDouble = this.getExtraDoubleStr();
            var difen = this.getDifenStr();
            if(HuTypeCfg.isSpecailHu(this.huType)){
                var huTypeName = this.isPassive ? HuTypeCfg.huTypeIntroArr[this.huType].name1 : HuTypeCfg.huTypeIntroArr[this.huType].name;
                if(this.huType == HuTypeCfg.TIANHU || this.huType == HuTypeCfg.DIHU){
                    tianDiHuType += huTypeName + 'x' + this.huTypeDouble;
                }else{
                    huPaiType += huTypeName + 'x' + this.huTypeDouble;
                }
            }
            detailStrArr.push(difen,paixing,tianDiHuType,lianzhuang,huPaiType,extraDouble,quanbao,jiangma);
        }
        return this.convertDetailStrArrToString(detailStrArr,' ');
    },

    convertDetailStrArrToString : function(arr,space){
        var str = '';
        for(var i = 0 ; i < arr.length; ++i){
            str += arr[i]
            if(i != arr.length-1 && arr[i] != ''){
                str += space;
            }
        }
        return str;
    },

    getCommonDetailStr : function(playType){
        var detailStrArr = [];
        var jiangma = this.getJiangMaStr();
        var quanbao = this.getQuanBaoStr();
        if((this.doubleLimit > 0) || this.isShiBeiBujiFen() ){
            if(this.doubleLimit > 0){
                detailStrArr.push('封顶'+this.doubleLimit+'倍 ',quanbao,jiangma);
            }
            if(this.isShiBeiBujiFen()){
                detailStrArr.push(cc.mj.i18n.t('mjconfig.hupai.shiBeiBuJiFen'));
            }
        }else{
            var paixing = this.getPaiXingStr();;
            var huPaiType = '';            
            var extraDouble = this.getExtraDoubleStr();
            var difen = '底分x'+this.diFen;;
            var lianzhuang = this.getLianZhuangStr();
            if(HuTypeCfg.isSpecailHu(this.huType)){
                var huTypeName = this.isPassive ? HuTypeCfg.huTypeIntroArr[this.huType].name1 : HuTypeCfg.huTypeIntroArr[this.huType].name;
                huPaiType += huTypeName + 'x' + this.huTypeDouble+' ';
            }
            if(playType == 'shantou'){
                detailStrArr.push(paixing,difen,lianzhuang,huPaiType,extraDouble,quanbao,jiangma);
            }else{
                detailStrArr.push(paixing,huPaiType,extraDouble,difen,lianzhuang,quanbao,jiangma);
            }
            
        }
        return this.convertDetailStrArrToString(detailStrArr,' ');
    },

    isHavePingHu : function(){//有平胡时没有其他番型
        for(var i = 0 ; i < this.fanXingList.length; ++i){
            if(this.fanXingList[i].type == 1){
                return true;
            }
        }
        return false;
        //return (this.fanXingList[0].type == 1);
    }
});