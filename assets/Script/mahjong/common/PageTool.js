cc.Class({
    extends: cc.Component,

    properties: {
        curPageLabel : {
            default : null,
            type : cc.Label,
        },
        totalPageLabel : {
            default : null,
            type : cc.Label,
        },
        preBtn : {
            default : null,
            type : cc.Button,
        },
        nextBtn : {
            default : null,
            type : cc.Button,
        },
        itemContainer : {
            default : null,
            type : cc.Node,
        },
        itemNodeCpnName : '',
        _curPage : 0,
        _dataArr : [],
    },

    // use this for initialization
    onLoad: function () {
        this.preBtn.node.on('click',this.onClickPreBtn,this);
        this.nextBtn.node.on('click',this.onClickNextBtn,this);
    },

    init : function(dataArr,itemCpnName){
        if(itemCpnName != undefined && itemCpnName != null){
            this.itemNodeCpnName = itemCpnName;
        }
        if(dataArr){
            this._dataArr = dataArr;
        }
        this.initItems();

    },

    jumpToPage : function(pageIndex){
        if(pageIndex >= 0 && pageIndex <= this.getTotalPage()){
            this._curPage = pageIndex;
            this.fresh();
        }   
    },

    initItems : function(){
        var perPageNum = this.getPerPageNum();
        for(var i = 0 ; i < perPageNum; ++i){
            this.getItemByIndex(i).children[0].getComponent(this.itemNodeCpnName).init();
        }
    },

    getPerPageNum : function(){
        var pageNum = 0;
        if(!this._perPageNum){
            for(var i = 0 ; i < this.itemContainer.childrenCount; ++i){
                if(this.getItemByIndex(i) == null){
                    break;
                }else{
                    pageNum ++;
                    this._perPageNum = pageNum;
                }
            }
        }
        return this._perPageNum;
    },

    getItemByIndex : function(index){
        return this.itemContainer.getChildByName('item'+index);
    },

    fresh : function(){
        var perPageNum = this.getPerPageNum();
        var totalPage = this.getTotalPage();
        totalPage == 0?this.totalPageLabel.string = "1":this.totalPageLabel.string = totalPage ;
        this.curPageLabel.string = this._curPage + 1;
        this.preBtn.node.active = !(this._curPage <= 0);
        this.nextBtn.node.active = !(this._curPage >= (totalPage-1));

        var dataStartIndex = this._curPage * perPageNum;
        for(var i = 0 ; i < perPageNum; ++i){
            var index = dataStartIndex + i;
            if(index >= this._dataArr.length){
                this.getItemByIndex(i).children[0].getComponent(this.itemNodeCpnName).fresh(null);
            }else{
                this.getItemByIndex(i).children[0].getComponent(this.itemNodeCpnName).fresh(this._dataArr[index],index);
            }
        }
    },

    getTotalPage : function(){
        var perPageNum = this.getPerPageNum();
        var totalPage = Math.ceil(this._dataArr.length / perPageNum);    
        return totalPage;
    },

    onClickNextBtn : function(){
        this.jumpToPage(this._curPage + 1);
    },

    onClickPreBtn : function(){
        this.jumpToPage(this._curPage - 1);
    },
});
