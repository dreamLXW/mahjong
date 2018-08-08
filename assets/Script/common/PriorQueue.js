cc.Class({
    extends: cc.Component,

    properties: {
        _priorMap : {
            default : {},
        },
        _priorIndexSortArr : [],
    },

    // use this for initialization
    onLoad: function () {

    },

    pushData : function(data,prior){
        var queue = this.getQueueByPrior(prior);
        queue.push(data);
    },

    shiftData : function(){
        for(var i = 0 ; i < this._priorIndexSortArr.length; ++i){
            var queue = this.getQueueByPrior(this._priorIndexSortArr[i]);
            if(queue.length >0){
                return queue.shift();
            }
        }
        return null;
    },

    isEmpty : function(){
        for (var prior  in this._priorMap){
            if(this._priorMap[prior] instanceof Array && this._priorMap[prior].length>0){
                return false;
            }
        }
        return true;
    },

    getQueueByPrior : function(prior){
        var queue = this._priorMap[prior];
        if(!queue){
            this._priorMap[prior] = [];
            var sortDecreaseFunc = function(v2, v1){ return (Number(v1) - Number(v2));}; 
            this._priorIndexSortArr.push(prior);
            this._priorIndexSortArr.sort(sortDecreaseFunc);
            for(var i = 0 ; i < this._priorIndexSortArr.length ; ++i){
                console.log(this._priorIndexSortArr[i]);
            }
        }
        return this._priorMap[prior];
    },

    clear : function(){
        this._priorMap = {};
        this._priorIndexSortArr = [];
    },
});
