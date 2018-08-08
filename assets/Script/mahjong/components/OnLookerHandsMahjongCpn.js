var BaseHandsMahjongCpn = require('BaseHandsMahjongCpn');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: BaseHandsMahjongCpn,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
    },

    initOnlookerMahjongs : function(){
        var rotateMap = {'left':92,'right':-89,'myself':0,'up':-180};
        var rotation = rotateMap[this.side];
        var mahjongPrefab = this.getMahjongPrefab();
        if(!this.mj_catch.children[0]){
            this.mj_catch.addChild(cc.instantiate(mahjongPrefab));
        }
        var commonMjCardCpn = this.mj_catch.children[0].getComponent('CommonMjCardCpn');
        commonMjCardCpn.setMainMahjongSpRotate(rotation);
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){//ui节点命名下标从1开始
            var index = i + 1;
            if(!this.mj_s.getChildByName('mj_bg'+index).children[0]){
                this.mj_s.getChildByName('mj_bg'+index).addChild(cc.instantiate(mahjongPrefab));
            }
            var commonMjCardCpn = this.mj_s.getChildByName('mj_bg'+index).children[0].getComponent('CommonMjCardCpn');
            commonMjCardCpn.setMainMahjongSpRotate(rotation);
        }      
    },
    initSide:function(side){
        this._super(side);
        this.initOnlookerMahjongs();
    },

    hideAllCards : function(){
        //mj_catch只有一个孩子
        this.mj_catch.children[0].getComponent('CommonMjCardCpn').setVisible(false); 
        
        for(var i = 0 ; i < this.mj_s.childrenCount; ++i){//ui节点命名下标从1开始
            var index = i + 1;
            this.mj_s.getChildByName('mj_bg'+index).children[0].getComponent('CommonMjCardCpn').setVisible(false); 
        }
    },

    onChuPaiAction: function(data,cardList,handsCardNum){
        this.showHandsByData(cardList);
        this.setGuiPaiComplete(cc.mj.gameData.seatData.guiPai);
    },

    onMoPaiAction : function(cardList,handsCardNum){
        this.showHandsByData(cardList);
        this.setGuiPaiComplete(cc.mj.gameData.seatData.guiPai);
        CommonHelper.emitActionCompelete();
    },

    getMahjongPrefab : function(){
        //this.side
        var prefabMap = {'left':'SideViewMahjong','right':'SideViewMahjong','myself':'FrontViewMahjong','up':'FrontViewMahjong'};
        var prefabName = prefabMap[this.side];
        var url = 'mahjong/prefab/' + prefabName;
        return cc.loader.getRes(url,cc.Prefab);
    },
});
