var Pair = {
    CHI : 1  ,                       // 吃牌
    PENG : 2  ,                      // 碰牌
    BU_GANG : 3  ,                   // 补杠
    MING_GANG : 4  ,                 // 明杠
    AN_GANG : 5  ,                   // 暗杠
    QI_PAI : 6  ,                    // 弃牌
    TING_PAI : 7  ,                  // 听牌
    CHU_PAI : 8  ,                   // 出牌
    MO_PAI : 9  ,                    // 摸牌
    GANG_MO_PAI : 10 ,               // 杠后摸牌
    CHI_HU : 11 ,                    // 吃胡
    MO_HU : 12 ,                     // 自摸胡
    QIANG_GANG_HU : 13 ,             // 抢杠胡
};

Pair.name = function (t) {
    const nameMap = {'1':'吃牌','2':'碰牌','3':'补杠','4':'明杠','5':'暗杠','6':'弃牌','7':'听牌','8':'出牌','9':'摸牌','10':'杠后摸牌','11':'吃胡','12':'自摸胡','13':'抢杠胡'};
    return nameMap[t];
    // // for (var key in Pair) {
    // //     if (Pair[key] == t) {
    // //         return nameMap[t];
    // //     }
    // // }
    // return "unknown";
};

Pair.sound = function (t) {
    const soundMap = {'1':'','2':'peng.mp3','3':'bugang.mp3','4':'minggang.mp3','5':'angang.mp3','6':'','7':'','8':'','9':'','10':'','11':'hu.mp3','12':'zimo.mp3','13':'qiangganghu.mp3'};
    return soundMap[t];
};

Pair.isPengGangChi = function(type){
    return (type == Pair.CHI || type == Pair.PENG || type == Pair.AN_GANG || type == Pair.BU_GANG || type == Pair.MING_GANG);
};

Pair.isPeng = function(type){
    return (type == Pair.PENG);
};

Pair.isGang = function(type){
     return (type == Pair.AN_GANG || type == Pair.BU_GANG || type == Pair.MING_GANG);
};

Pair.isHu = function(type){
    return (type == Pair.MO_HU || type == Pair.QIANG_GANG_HU || type == Pair.CHI_HU);
};

Pair.isQi = function(type){
    return (type == Pair.QI_PAI);
};

Pair.isChi = function(type){
    return (type == Pair.CHI);
};

module.exports = Pair;