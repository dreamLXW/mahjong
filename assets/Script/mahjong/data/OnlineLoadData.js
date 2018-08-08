cc.Class({
    extends: cc.Component,
    properties : {
        defaultSPFR : {
            type : cc.SpriteFrame,
            default : null,
        },
        bindSp : {
            type : cc.Sprite,
            default : null,
        },
        width : 100,
        height : 100,
        loadingDone : false,
    },

    getSpriteByUrl : function(url,w,h){
        this.width = w || this.width;
        this.height = h || this.height;
        console.log(cc.js.getClassName(this)+url);
        this.setSpfrToBindSp(this.defaultSPFR);
        if(url == null || url == undefined || url==''){
            return;
        }
        cc.loader.load(url,function(err,tex){
            if(err){
                console.log(err);//如果下载失败的话就绑定默认的
                this.setSpfrToBindSp(this.defaultSPFR);
            }else{
                if(tex instanceof cc.Texture2D){
                    this.loadingDone = true;
                    var spfr = new cc.SpriteFrame(tex);
                    this.setSpfrToBindSp(spfr);
                }else{
                    this.setSpfrToBindSp(this.defaultSPFR);
                }
            }  
        }.bind(this));
    },

    getLoadingDone : function(){
        return this.loadingDone;
    },

    setSpfrToBindSp : function(spfr){
        if(!spfr){
            console.log("没有默认绑定的图片");
            return;
        }
        var spfrwidth = spfr.getOriginalSize().width;
        var spfrheight = spfr.getOriginalSize().height;
        var scaleX = this.width / spfrwidth;
        var scaleY = this.height / spfrheight;
        this.bindSp.type = cc.Sprite.Type.SIMPLE;
        this.bindSp.sizeMode = cc.Sprite.SizeMode.RAW;
        this.bindSp.trim = true;
        this.bindSp.node.scaleX = scaleX;
        this.bindSp.node.scaleY = scaleY;
        this.bindSp.spriteFrame = spfr;
    }

    
});