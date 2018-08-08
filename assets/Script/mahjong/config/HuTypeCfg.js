var HAIDIPAO = 1;
var HAIDILAO = 2;
var QIANGGANGHU = 3;
var GANGBAO = 4;
var TIANHU = 5;
var DIHU = 6;
var DIANPAOHU = 7;
var ZIMO = 8;
var HAIDILAOGANGBAO = 9;
var CHIDIHU = 10;
var MODIHU = 11;
var HUANGZHUANG = 12;
var HuTypeCfg =  {
    HAIDIPAO : 1,
    HAIDILAO : 2,
    QIANGGANGHU : 3,
    GANGBAO : 4,
    TIANHU : 5,
    DIHU : 6,
    DIANPAOHU : 7,
    ZIMO : 8,
    HAIDILAOGANGBAO : 9,
    CHIDIHU : 10,
    MODIHU : 11,
    HUANGZHUANG : 12,
    huTypeMap : {1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:HAIDILAO,10:DIHU,11:DIHU,12:HUANGZHUANG},
    huTypeIntroArr : [  {'name':'???','name1':'???','sound':''},
                        {'name':'海底炮','name1':'被海炮','sound':'hu.mp3'},
                        {'name':'海底捞','name1':'被海捞','sound':'zimo.mp3'},
                        {'name':'抢杠胡','name1':'被抢杠','sound':'qiangganghu.mp3'},
                        {'name':'杠爆','name1':'被杠爆','sound':'gangbao.mp3'},
                        {'name':'天胡','name1':'被天胡','sound':'zimo.mp3'},
                        {'name':'地胡','name1':'被地胡','sound':'hu.mp3'},
                        {'name':'吃胡','name1':'点炮','sound':'hu.mp3'},
                        {'name':'自摸','name1':'被自摸','sound':'zimo.mp3'},
                        {'name':'海底捞杠爆','name1':'被海底捞杠爆','sound':'zimo.mp3'},
                        {'name':'地胡','name1':'被地胡','sound':'hu.mp3'},
                        {'name':'地胡','name1':'被地胡','sound':'hu.mp3'},
                        {'name':'','name1':'','sound':''}],
    zimoArr : [ZIMO,TIANHU,HAIDILAO,GANGBAO,HAIDILAOGANGBAO,MODIHU],
};
HuTypeCfg.isZiMo = function(type){
    for(var i = 0 ; i < HuTypeCfg.zimoArr.length; ++i){
        if(type == HuTypeCfg.zimoArr[i]){
            return true;
        }
    }
    return false;
},
HuTypeCfg.isHu = function(type){
    if(!HuTypeCfg.isZiMo(type) && type != HUANGZHUANG){
        return true;
    }else{
        return false;
    }
},

HuTypeCfg.isSpecailHu = function(type){//不包括自摸、点炮
    if(type != HUANGZHUANG && type != ZIMO && type != DIANPAOHU){
        return true;
    }else{
        return false;
    }
},

HuTypeCfg.getName = function(type){
    return HuTypeCfg.huTypeIntroArr[type].name;
},
module.exports = HuTypeCfg;