var FanXingCfg = require('FanXingCfg');
var Seat = function (opt) {
    this.groupCtrlNum = opt.groupCtrNum;                       //群管理分
    this.maxGameRoundNum = opt.gameNumber;                       // 局数 8, 16
    this.wanFa = opt.playerType;                              // 玩法:wu_zi(无字100), wu_feng（无风108）
    this.hupai  = opt.hupai;                                //chi_hu(吃胡),zi_mo(自摸)
    this.jiHu  = opt.jiHu;                                  // 倍数：吃胡能否鸡胡
    this.genZhuang = opt.genZhuang;                         // 倍数：跟庄
    this.doubleLimit = opt.doubleLimit;                           // 封顶：封顶5倍，封顶10倍，不舍封顶（10000）   
    this.guiPai = opt.guiPai;                               // 鬼牌：wu(无鬼)，zhong(红中做鬼)，fan(翻鬼),ban(白板做鬼)   
    this.wuGuiJiaBei = opt.wuGuiJiaBei || false;          // 无鬼加倍 
    this.siGuiHuPai = opt.siGuiHuPai;                       // 四鬼胡牌
    this.guiShuangBei = opt.guiShuangBei;                   // 四鬼胡牌双倍
    this.jiangMaNumber = opt.jiangMaNumber;                 //奖马
    this.maGenGang = opt.maGenGang || false;                // 马跟杠  
    this.liuJuSuanGang = opt.liuJuSuanGang|| false;                 //流局算杠
    this.gangBaoQuanBao = opt.gangBaoQuanBao || false;      // 吃杠杠爆全包 
    this.lianZhuang = opt.lianZhuang;                       //连庄   
    this.faMaNumber = opt.faMaNumber;                        // 罚马牌数
    this.maiMaNumber = opt.maiMaNumber;                      // 买马牌数
    this.diFen = opt.diFen;                               // 底分 
    this.shiBeiBuJiFen = opt.shiBeiBuJiFen;
    this.playerNum = opt.playerNumber || 4;
    this.biHu = opt.biHu || false;
    this.majiangType = opt.majiangType;
    this.autoStart = opt.autoStart || false;
    this.shiFanKeChiHu = opt.shiFanKeChiHu;
    this.qiangGangHuQuanBao = opt.qiangGangHuQuanBao;
    this.pointMode = opt.pointMode;
    this.huTypeList = opt.huTypeList;
    this.pointList = opt.pointList || [];
    this.rawOpt = JSON.stringify(opt);
    this.getRawOpt = function () {
        return JSON.parse(this.rawOpt);
    }

    this.isSetGroupCtl = function(){
        return (this.groupCtrlNum != undefined && this.groupCtrlNum != null && this.groupCtrlNum != 0);
    }

    this.getMahjongName = function(){
        return (this.majiangType ? cc.mj.i18n.t('mjconfig.mahjongType.'+this.majiangType):'潮汕麻将');
    }

    this.getDifenStr = function(){
        return this.diFen ? cc.mj.i18n.t('mjconfig.diFen').replace('?',this.diFen) : '';
    },

    this.isAllSamePoint = function(){
        var isAllSamePoint = true;
        var isHaveSamePointMahjongTypeArr = ['shantou'];
        var samePoint = 0;
        for(var i = 1 ; i < this.pointList.length; ++i){
            var point = this.pointList[i];
            if(point.mode == 'default' && point.score == 0){
                continue;
            }
            if(point.mode != 'normal' || point.score != this.pointList[i-1].score ){
                isAllSamePoint = false;
                break;
            }
        }
        isAllSamePoint = (isHaveSamePointMahjongTypeArr.indexOf(this.majiangType) == -1) ? false : isAllSamePoint; 
        return isAllSamePoint;
    },

    this.getRuleArr = function(space){
        var labelStrArr = ['','','',''];
        var perLabelNumArr = [0,0,0,0];
        var perLabelMaxNumArr = [7,6,6,9];
        var pushStr = function(index,str){
            if(str != ''){
                perLabelNumArr[index]++;
                if(perLabelNumArr[index] >= perLabelMaxNumArr[index] && perLabelNumArr[index] % perLabelMaxNumArr[index] == 1){
                    labelStrArr[index] += '\n';
                }else if(perLabelNumArr[index] > 1){
                    labelStrArr[index] += space;
                }
                labelStrArr[index] += str;
            }
        }
        if(this.diFen){
            pushStr(0,cc.mj.i18n.t('mjconfig.diFen').replace('?',this.diFen));
        }
        if(this.isSetGroupCtl()){
            pushStr(0,cc.mj.i18n.t('mjconfig.groupCtrlNum').replace('?',this.groupCtrlNum));
        }
        if(this.maxGameRoundNum && this.maxGameRoundNum < 100){
            pushStr(0,cc.mj.i18n.t('mjconfig.gameRoundNum').replace('?',this.maxGameRoundNum));
        }
        if(this.wanFa){
            pushStr(0,this.wanFa == 'normal'? '' : (cc.mj.i18n.t('mjconfig.wanFa.'+this.wanFa)));
        }
        if(this.hupai){
            pushStr(0,(this.hupai == 'chi_hu'?cc.mj.i18n.t('mjconfig.hupai.chiHu'):cc.mj.i18n.t('mjconfig.hupai.ziMo')));
        }
        if(this.jiHu){
            pushStr(0,cc.mj.i18n.t('mjconfig.beishu.jiHu'));
        }
        var isShiBeiBuJifen = (this.shiBeiBuJiFen && this.majiangType != 'chaozhou');
        var zimoBackStrArr = [];
        var zimoBackStr = '';
        if(this.shiFanKeChiHu){
            zimoBackStrArr.push(cc.mj.i18n.t('mjconfig.hupai.shiFanKeChiHu'));
        }
        if(isShiBeiBuJifen){
            zimoBackStrArr.push(cc.mj.i18n.t('mjconfig.hupai.shiBeiBuJiFen'));
        }
        for(var i = 0 ; i < zimoBackStrArr.length; ++i){
            if(i != 0){
                zimoBackStr += ',';
            }
            zimoBackStr += zimoBackStrArr[i];
        }
        if(zimoBackStr != ''){
            pushStr(0,'(' + zimoBackStr + ')');
        }
        if(this.qiangGangHuQuanBao){
            pushStr(1,cc.mj.i18n.t('mjconfig.jiesuan.qiangGangHuQuanBao'));
        }
        if(this.gangBaoQuanBao){
            pushStr(1, cc.mj.i18n.t('mjconfig.jiesuan.GangBaoQuanBao'));
        }
        if(this.huTypeList){
            for(var i = 0 ; i < this.huTypeList.length; ++i){
                var huType = this.huTypeList[i];
                pushStr(1, cc.mj.i18n.t('mjconfig.huType.'+huType.type).replace('?',huType.double));
            }
        }
        if(this.genZhuang){
            pushStr(1,cc.mj.i18n.t('mjconfig.beishu.genZhuang'));
        }

        if(this.liuJuSuanGang){
            pushStr(1, cc.mj.i18n.t('mjconfig.jiesuan.liuJuSuanGnag'));
        }

        if(this.lianZhuang){
            pushStr(1,  cc.mj.i18n.t('mjconfig.jiesuan.lianZhuang'));
        }

        if(this.biHu){
            pushStr(1,  cc.mj.i18n.t('mjconfig.jiesuan.biHu'));
        }
        if(this.shiBeiBuJiFen && this.majiangType == 'chaozhou'){
            pushStr(1,  cc.mj.i18n.t('mjconfig.hupai.shiBeiBuJiFen'));
        }
        if(this.pointMode){
            pushStr(2,this.pointMode == 'normal'? '' : ( cc.mj.i18n.t('mjconfig.pointMode.'+this.pointMode)));
        }
        var isAllSamePoint = this.isAllSamePoint();
        if(isAllSamePoint){
            if(this.pointList.length > 0 && this.pointList[0].score > 0){
                pushStr(2, cc.mj.i18n.t('mjconfig.pointList.samepoint').replace('?',this.pointList[0].score));
            }
        }else{
            for(var i = 0 ; i < this.pointList.length; ++i){
                var point = this.pointList[i];
                if(point.mode == 'normal'){
                    pushStr(2,  cc.mj.i18n.t('mjconfig.pointList.'+point.type).replace('?',point.score));
                }
            }
        }

        if(this.guiPai){
            pushStr(3,  cc.mj.i18n.t('mjconfig.guiPai.'+this.guiPai));
        }
        if(this.wuGuiJiaBei){
            pushStr(3,  cc.mj.i18n.t('mjconfig.guiPai.wuGuiJiaBei'));
        }
        if(this.siGuiHuPai){
            pushStr(3,  cc.mj.i18n.t('mjconfig.guiPai.siGuiHuPai'));
            if(this.guiShuangBei){
                pushStr(3,cc.mj.i18n.t('mjconfig.guiPai.shuangBei'));
            }
        }
        if(this.jiangMaNumber != undefined){
            pushStr(3,  (this.jiangMaNumber >0 ? cc.mj.i18n.t('mjconfig.jiangMa.jiangMaNum').replace('?',this.jiangMaNumber) : cc.mj.i18n.t('mjconfig.jiangMa.no')));
        }
        if(this.maGenGang){
            pushStr(3,   cc.mj.i18n.t('mjconfig.jiangMa.maGenGang'));
        }
        pushStr(3,this.maiMaNumber >0 ?   cc.mj.i18n.t('mjconfig.maiMa.maiMaNum').replace('?',this.maiMaNumber) : '');
        pushStr(3,this.faMaNumber >0 ?   cc.mj.i18n.t('mjconfig.maiMa.faMaNum').replace('?',this.faMaNumber) : '');
        if(this.doubleLimit){
            pushStr(3,  (this.doubleLimit <10000 ? cc.mj.i18n.t('mjconfig.doubleLimit.doubleLimitNum').replace('?',this.doubleLimit) : cc.mj.i18n.t('mjconfig.doubleLimit.no')));
        }  
        if(cc.mj.roomInfo.isGoldRoom() && this.majiangType == 'chaozhou'){
            pushStr(3,  "封顶1000分");
        }
        return labelStrArr;
    }

    this.getRuleStr = function(space){
        var ruleArr = this.getRuleArr(',');
        var content = "";
        for(var i = 0 ; i < ruleArr.length; ++i){
            if(ruleArr[i] != ""){
                content += ruleArr[i]
                if(i != ruleArr.length - 1){
                    content += '\n';
                }
            }
        }
        return content;
    }
};


Seat.createGroupCtrNum = 0;
Seat.setCreateGroupCtrNum = function(createGroupCtrNum){
    this.createGroupCtrNum = createGroupCtrNum;
}
Seat.isSetGroupCtrNum = function(){
    return (this.createGroupCtrNum != undefined && this.createGroupCtrNum != null && this.createGroupCtrNum != 0);
}


module.exports = Seat;