var GameToAppHelper = require('GameToAppHelper');
var CatalogHelper = require('CatalogHelper');
var CommonHelper = require('CommonHelper');
var GameToWechatGameHelper = require("GameToWechatGameHelper");
var MessageBoxMgr = require('MessageBoxMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        totalSettleLayerItemPrefab : {
            type : cc.Prefab,
            default : null,
        },
        itemContainerNodeArr : {
            type : cc.Node,
            default : [],
        },
        _isCapturing : false,
    },

    // use this for initialization
    onLoad: function (){

    },

    init : function(seatTotalSettleEvent){
        this._seatTotalSettleEvent = seatTotalSettleEvent;
        this.initItemNodeArr(seatTotalSettleEvent.roundPlayerSettleList);
    },

    initItemNodeArr : function(roundPlayerSettleList){
        for(var i = 0 ; i < this.itemContainerNodeArr.length ; ++i){
            var itemContainerNode = this.itemContainerNodeArr[i];
            var totalSettleLayerItem = null;
            if(itemContainerNode.childrenCount > 0){
                totalSettleLayerItem = itemContainerNode.children[0];
            }else{
                totalSettleLayerItem = cc.instantiate(this.totalSettleLayerItemPrefab);
                itemContainerNode.addChild(totalSettleLayerItem);
            }
            var totalSettleLayerItemCpn = totalSettleLayerItem.getComponent('TotalSettleLayerItemCpn');
            if(i >= roundPlayerSettleList.length){
                itemContainerNode.active = false;
                //totalSettleLayerItemCpn.setVisible(false);
            }else{
                itemContainerNode.active = true;
                //totalSettleLayerItemCpn.setVisible(true);
                totalSettleLayerItemCpn.init(roundPlayerSettleList[i]);
            }
            
        }
    },

    onClickBtnDetail : function(){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var Node = ModalLayerMgr.getTop('RoomRecordLayer');
            var NodeCpn = Node.getComponent('RoomRecordLayerCpn');
            var isCanPlayback = false;
            NodeCpn.init(this._seatTotalSettleEvent,isCanPlayback);
            ModalLayerMgr.showTop('RoomRecordLayer');  
        }
    },

    onClickBtnCommonShare : function(){
        MessageBoxMgr.reset();
        if(this._isCapturing == true){
            return;
        }
        var self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            self._isCapturing = true;
            GameToWechatGameHelper.getSetting('scope.writePhotosAlbum',function(status){
                self._isCapturing = false;
                if(status == true){
                    console.log("onshow scope.writePhotosAlbum");
                    self._isCapturing = true;
                    var fileName = GameToWechatGameHelper.getRenderTexture();
                    GameToWechatGameHelper.saveImage(fileName,function(status){
                        self._isCapturing = false;
                    });
                }else{
                    GameToWechatGameHelper.getScopeWritePhotosAlbum();
                }
            });
        } else {
            if(CC_JSB) {
                var roomId = cc.mj.gameData.roomInfo.roomId;
                
                var fileName = roomId + '.png';
                var filePath = jsb.fileUtils.getWritablePath() + fileName;
                //var filePath = CatalogHelper.getRecordCatalog() + fileName;
                if(jsb.fileUtils.isFileExist(filePath)){
                    this.showShareLayer(filePath);
                    return;
                }
                this._isCapturing = true;
                
               
                //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
                var renderTexture = cc.RenderTexture.create(1280,720, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
    
                //实际截屏的代码
                renderTexture.begin();
                //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
                cc.find('Canvas')._sgNode.visit();
                renderTexture.end();
                renderTexture.saveToFile(fileName,cc.ImageFormat.PNG, true, function () {
                    cc.log("capture screen successfully!");
                    self.showShareLayer(filePath);
                    self._isCapturing = false;    
                    // var toPath = CatalogHelper.getRecordCatalog()+fileName;
                    // console.log("toPath:"+toPath);
                    // GameToAppHelper.CopyFile(filePath,toPath);
                });
                //打印截图路径
                cc.log(filePath);
            }
        }
    },

    onClickBtnSpecialShare : function(){
        
    },

    onClickBtnClose : function(){
        CommonHelper.backToLastScene();
    },  

    showShareLayer : function(filePath){
        var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
        if(ModalLayerMgr){
            var shareLayerNode = ModalLayerMgr.getTop('ShareLayer');
            var shareLayerCpn = shareLayerNode.getComponent('ShareLayerCpn');
            shareLayerCpn.initFilePath(filePath);
            ModalLayerMgr.showTop('ShareLayer');
        }
    },
});
