cc.Class({
    extends: cc.Component,

    properties: {
       layerPrefabArr : {
           default : [],
           type : cc.Prefab,
       },
       _topNum : 0,
       _layerNodeMap : null,
       _nodeArrByOrder : {
            default : [],
            type : cc.Node,
       },
    },

    // use this for initialization
    onLoad: function () {
        this._layerNodeMap = {};
        this._topNum = 0;
        this.node.active = false;
    },

    ctor:function(){
        this._layerNodeMap = {};
    },

    getTop  : function(prefabName){
        var node = null;
        if(!this.isPrefabCreate(prefabName)){
            node = this.createNodeByPrefabName(prefabName);
        }else{
            node = this.findNodeByPrefabName(prefabName);
        }
        console.log('getTop');
        return node;
    },

    isTopVisible : function(prefabName){
        var node = this.getTop(prefabName);
        for(var i = 0 ; i < this._nodeArrByOrder.length; ++i){
            if(this._nodeArrByOrder[i] == node){
                return true;
            }
        }
        return false;
    },

    showTop : function(prefabName,zOrder){
        var node = this.getTop(prefabName);
        if(node){
            if(!node.parent){
                var childrenContainer = this.getChildrenContainer(zOrder);
                childrenContainer.addChild(node);
                // this.node.addChild(node);
                var commonDialogCpn = node.getComponent('CommonDialogCpn');
                if(!commonDialogCpn){
                    console.log('没有CommonDialogCpn');
                }else{
                    commonDialogCpn.setCloseFunc(this.onCloseTop.bind(this));
                }
                console.log('!node.parent');
            }
            this.makeNodeOnTop(node);
            this.pushNodeIn_nodeArrByOrder(node);
            this.node.active = true;   
            node.active = true; 
            
        }else{
            console.log('node == null');
        }
    },

    getChildrenContainer : function(zOrder){
        if(zOrder == undefined || zOrder == null){
            zOrder = 0;
        }
        var childrenContainer = this.node.getChildByName('top'+zOrder);
        if(!childrenContainer){
            childrenContainer = new cc.Node('top'+zOrder);
            childrenContainer.setLocalZOrder(zOrder);

            var widget = childrenContainer.addComponent(cc.Widget);
            widget.isAlignTop = true;
            widget.isAlignBottom = true;
            widget.isAlignLeft = true;
            widget.isAlignRight = true;
            this.node.addChild(childrenContainer);
            // widget.updateAlignment();
        }
        return childrenContainer;
    },

    closeTop : function(node){
        this.onCloseTop(node);
    },

    onCloseTop : function(node){
        console.log(this);
        node.active = false;
        this.eraseNodeIn_nodeArrByOrder(node);
        if(this._topNum == 0){
            this.node.active = false;
        }      
        this.emitTopNodeChange();
    },

    emitTopNodeChange : function(){
        var length = this._nodeArrByOrder.length;
        if(length > 0){
            var node = this._nodeArrByOrder[length-1];
            node.emit('OnMySelfChangeToTop');
        }
    },

    pushNodeIn_nodeArrByOrder : function(node){
        //this._topNum++;
        var isFindInArr = false;
        var i = 0 ;
        for(i = 0 ; i < this._nodeArrByOrder.length ; ++i){
            if(node == this._nodeArrByOrder[i]){
                isFindInArr = true;
                break;
            }
        }
        if(isFindInArr == true){
            if(this._nodeArrByOrder.length > 1){
                var length = this._nodeArrByOrder.length;
                var temp = this._nodeArrByOrder[i];
                this._nodeArrByOrder[i] = this._nodeArrByOrder[length-1];
                this._nodeArrByOrder[length-1] = temp;
            }
        }else{
            this._nodeArrByOrder.push(node);
        }
        this._topNum = this._nodeArrByOrder.length;
    },

    eraseNodeIn_nodeArrByOrder : function(node){
        for(var i = 0 ; i < this._nodeArrByOrder.length ; ++i){
            if(this._nodeArrByOrder[i] == node){
                this._nodeArrByOrder.splice(i,1);
                this._topNum = this._nodeArrByOrder.length;
                 console.log('topNum:' + this._topNum);
                return;
            }
        }
        console.log('没有要删除的top');
    },

    findNodeByPrefabName : function(prefabName){
        return this._layerNodeMap[prefabName];
    },

    createNodeByPrefabName : function(prefabName){
        for(var i = 0 ; i < this.layerPrefabArr.length ; ++i){
            if(this.layerPrefabArr[i].name == prefabName){
                var node = cc.instantiate(this.layerPrefabArr[i]);
                this._layerNodeMap[prefabName] = node;
                return node;
            }
        }
        return null;
    },

    isPrefabCreate : function(prefabName){
        return (this._layerNodeMap[prefabName] != null && this._layerNodeMap[prefabName] != undefined);
    },

    makeNodeOnTop : function(node){
        for(var i = 0 ; i < this.node.childrenCount; ++i){
            for(var j = 0 ; j < this.node.children[i].childrenCount; ++j){
                this.node.children[i].children[j].setLocalZOrder(0);
            }
        }
        node.setLocalZOrder(1);
    },

    closeAllTopByModalType : function(modalType){
        for(var i = this._nodeArrByOrder.length - 1 ; i >= 0; --i){
            var node = this._nodeArrByOrder[i];
            var commonDialogCpn = node.getComponent('CommonDialogCpn');
            if(commonDialogCpn && commonDialogCpn.modalTypeName == modalType){
                this.closeTop(node);
            }
        }
    },
});
