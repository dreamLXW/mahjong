var MaCfg =  {
    JiangMa : 1,
    FaMa : 2,
    MaiMa : 3,
};
MaCfg.name  = function(type){
    const nameMap = {'1':'奖马','2':'罚马','3':'买马'};
    return nameMap[type];
}
module.exports = MaCfg;
