var CommonHelper = require('CommonHelper');
var MessageBoxMgr =  {
    dataList : [],
    isActive : false,
};

MessageBoxMgr.showMessageBox = function(title,content,cb,cbparam,isNeedCancel){
    var data = {"title":title,"content":content,"onOk":cb,"onOkParam":cbparam,"isNeedCancel":isNeedCancel};
    MessageBoxMgr.showMessageBoxByRawData(data);
};

MessageBoxMgr.showMessageBoxByRawData = function(data){
    data.isImportant = !!data.onOk || !!data.onCancel;
    var dataList = MessageBoxMgr.dataList;
    if(dataList.length > 0 && dataList[dataList.length - 1].isImportant == false){
        dataList.pop();
    }
    dataList.push(data);
    MessageBoxMgr.show();
};

MessageBoxMgr.onClose = function(){
    console.log("MessageBoxMgr.onClose");
    var dataList = MessageBoxMgr.dataList;
    MessageBoxMgr.isActive = false;
    MessageBoxMgr.show();
}

MessageBoxMgr.show = function(){
    var dataList = MessageBoxMgr.dataList;
    var ModalLayerMgr = CommonHelper.getRunSceneModalMgr();
    if(ModalLayerMgr){
        var messageBoxNode = ModalLayerMgr.getTop('MessageBox');
        var messageBoxNodeCpn = messageBoxNode.getComponent('MessageBoxCpn');
        console.log("MessageBoxMgr.dataList的长度="+dataList.length);
        console.log("MessageBoxMgr.isActive="+MessageBoxMgr.isActive);
        console.log("messageBoxNodeCpn._isImportant="+messageBoxNodeCpn._isImportant);
        if((MessageBoxMgr.isActive == false || messageBoxNodeCpn._isImportant == false) && dataList.length > 0){
            MessageBoxMgr.isActive = true;
            messageBoxNodeCpn.init(dataList.shift());
            ModalLayerMgr.showTop('MessageBox');    
        }
    } 
}

MessageBoxMgr.reset = function(){
    MessageBoxMgr.isActive = false;
    MessageBoxMgr.dataList = [];
}
module.exports = MessageBoxMgr;