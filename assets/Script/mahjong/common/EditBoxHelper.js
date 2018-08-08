
cc.Class({
    extends: cc.Component,

    properties: {
        length : 0,//设置长度，不考虑汉字还是数字字母
        numeric : false,//是否是纯数字
        byteLenth : 0,//设置字节长度
    },

    onLoad () {
        var self = this;
        var thisEditBox = this.node.getComponent(cc.EditBox);
        thisEditBox.node.on("editing-did-ended", function (event) {
            if (self.numeric) {
                var numberString = "";
                for (let i = 0; i < thisEditBox.string.length; i++) {
                    var indexAscll = thisEditBox.string.charCodeAt(i);
                    if (indexAscll >= 48 && indexAscll <= 57) {
                        numberString += thisEditBox.string.charAt(i);
                    }
                }
                thisEditBox.string = numberString;
            }
            if (self.length !== 0) {
                if (thisEditBox.string.length > self.length) {
                    self.sliceStrToEditBoxString(thisEditBox.string, self.length);
                }
            }
            if (self.byteLenth != 0) {
                var str = thisEditBox.string;
                var bytesCount = 0;
                for (let i = 0; i < str.length; i++) {
                    var strChar = str.charAt(i);
                    if (/^[\u0000-\u00ff]$/.test(strChar)) //匹配双字节
                    {
                        if (self.checkByteLengthOutOfLength(bytesCount, 1)) {
                            self.sliceStrToEditBoxString(str, i);
                            break;
                        } else {
                            bytesCount += 1;
                        }
                    }
                    else {
                        if (self.checkByteLengthOutOfLength(bytesCount, 3)) {
                            self.sliceStrToEditBoxString(str, i);
                            break;
                        } else {
                            bytesCount += 3;
                        }
                    }
                }
            }
        });
    },

    checkByteLengthOutOfLength : function (bytesCount, addNum) {
        if ((bytesCount + addNum) > this.byteLenth) {
            return true;
        }
        return false;
    },

    sliceStrToEditBoxString : function (str, endIndex) {
        var tempStr = str.slice(0, endIndex);
        this.node.getComponent(cc.EditBox).string = tempStr;
    },
});
