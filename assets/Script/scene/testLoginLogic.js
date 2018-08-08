var SystemConfig = require("SystemConfig");
var CustomHttpRequest = require('CustomHttpRequest');
var CustomHttpClient = require("CustomHttpClient");
var CommonHelper = require('CommonHelper');

cc.Class({
    extends: cc.Component,

    properties: {
        idInput : {
            default : null,
            type : cc.EditBox,
        },
        ridInput : {
            default : null,
            type : cc.EditBox,
        },
        clubInviteCodeInput : {
            default : null,
            type : cc.EditBox,
        },
        groupInput : {
            default : null,
            type : cc.EditBox,
        },
        confirmBtn : {
            default : null,
            type : cc.Button,
        },
        testTop : {
            type : cc.Node,
            default : null,
        },
        phoneInput : {
            default : null,
            type : cc.EditBox,            
        },
        pwdInput : {
            default : null,
            type : cc.EditBox,
        },
        pthoneconfirmBtn : {
            default : null,
            type : cc.Button,
        },
        customLoginNode : {
            type : cc.Node,
            default : null,
        },
        phoneLoginNode : {
            type : cc.Node,
            default : null,
        },
        phoneListContent : {
            type : cc.Node,
            default : null, 
        },

        testConfigNode : {
            type : cc.Node,
            default : null, 
        },
        testLoginNode : {
            type : cc.Node,
            default : null, 
        },
        ipInput : {
            default : null,
            type : cc.EditBox,
        },
        portInput : {
            default : null,
            type : cc.EditBox,
        },
        hostToggleNode : {
            default : null,
            type : cc.Node,
        },
        exportsToggleNode : {
            default : null,
            type : cc.Node,
        },
        canNormalLogin : true,
    },

    // use this for initialization
    onLoad: function () {
        this.freshPhoneListContent();
        this.freshLoginConfig();
    },

    onConfirmInputParam : function(){//与服务端认证
        var uid = Number(this.idInput.string);
        var token = uid;
        var rid = this.ridInput.string;
        if(uid == '' || token == ''){
            return;
        }
        var initData = {'uid' : uid, 'uToken':token,'roomId' : rid,'gameId':2};
        this.initLoginDataAndLogin(initData);
    },

    onConfirmPhoneInputParam : function(){
        var phone = this.phoneInput.string;
        var pwd = this.pwdInput.string;
        var rid = this.ridInput.string;
        var clubInviteCode = this.clubInviteCodeInput.string;
        var groupId = this.groupInput.string;
        if(phone == '' || pwd == ''){
            return;
        }
        var ip = SystemConfig.gameIp;
        var port = SystemConfig.gamePort;
        var url = ip+":"+port+"/test/login?telephone="+phone+"&password="+pwd+"&system=2";
        
        var customHttpRequest = new CustomHttpRequest();
        customHttpRequest.setRequestType('GET');
        customHttpRequest.setTimeout(10000);
        customHttpRequest.setUrl(url);
        CustomHttpClient.instance.send(customHttpRequest,function(customHttpRequest1){
            if(customHttpRequest1){
                var jsonObj = JSON.parse(customHttpRequest1.xhr.responseText);
                if(jsonObj.code == 200){
                    var token = jsonObj.res.data.auth_key;
                    var uid = jsonObj.res.data.user_id;
                    var initData = {'uid' : uid, 'uToken':token,'roomId' : rid,'gameId':2};
                    if(clubInviteCode != "" || groupId != ""){
                        initData.gameData = {};
                    }
                    if(clubInviteCode != ""){
                        initData.gameData.clubInviteCode = Number(clubInviteCode);
                    }
                    if(groupId != ""){
                        initData.gameData.groupId = Number(groupId);
                    }
                    this.rememberPhoneNumber(phone,pwd);
                    this.initLoginDataAndLogin(initData);
                }else{
                    CommonHelper.showMessageBox('提示',String(jsonObj.code),function(){},null,false);                    
                }
            }else{  
                var contentText = '网络错误';
                CommonHelper.showMessageBox('提示',contentText,function(){},null,false);
            }            
        }.bind(this));
    },

    hide : function(){
        this.testTop.active = false;
    },

    show : function(){
        this.testTop.active = true;
        if (SystemConfig.isReal()) {
            if(cc.sys.platform === cc.sys.WECHAT_GAME){
                this.testTop.active = false;
                var loadingLogic = this.node.getComponent('LoadingLogic');
                loadingLogic.startPlatformLoginLogic();
            }
        }
    },

    initLoginDataAndLogin : function(initData){
        var loadingLogic = this.node.getComponent('LoadingLogic');
        loadingLogic.initGameCommonInitData(initData);
        loadingLogic.initGameSpecialInitData(initData.gameData);
        loadingLogic.startLoadOnlineData();
    },

    rememberPhoneNumber : function(phone,pwd){
        var key = "mjphone";
        var phoneListJson = this.getLocalStoragePhoneListJson();
        if(phoneListJson == undefined || phoneListJson == null){
            phoneListJson = {};
        }
        phoneListJson[phone] = pwd;
        cc.sys.localStorage.setItem(key,JSON.stringify(phoneListJson));
    },

    freshPhoneListContent : function(){
        var phoneListJson = this.getLocalStoragePhoneListJson();
        for(var phone in phoneListJson){
            console.log(phone);
            var pwd = phoneListJson[phone];
            var phoneLabelItem = new cc.Node();
            var layout = phoneLabelItem.addComponent(cc.Layout);
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            var label = phoneLabelItem.addComponent(cc.Label);
            label.string = phone;
            label.fontSize = 30;
            phoneLabelItem.on(cc.Node.EventType.TOUCH_END,this.onClickPhoneItem,this);
            this.phoneListContent.addChild(phoneLabelItem);
        }
    },

    onClickPhoneItem : function(eventTouch){
        var node = eventTouch.target;
        var label = node.getComponent(cc.Label);
        var phone = label.string;
        var phoneListJson = this.getLocalStoragePhoneListJson();
        var pwd = phoneListJson[phone];
        console.log(phone + "  " + pwd);

        this.phoneInput.string = phone;
        this.pwdInput.string = pwd;
    },

    getLocalStoragePhoneListJson : function(){
        var key = "mjphone";
        var value = cc.sys.localStorage.getItem(key);
        console.log("------" + value);
        value = value ? JSON.parse(value) : {};
        return value;
    },

    /**
     * hostConfig
     */
    freshLoginConfig :function () {
        var hostToggleItems = this.hostToggleNode.getComponent(cc.ToggleContainer).toggleItems;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            hostToggleItems[0].check();
        } else {
            hostToggleItems[1].check();
        }
        var configMode = ["local", "test", "dev"];
        var exportsToggleItems = this.exportsToggleNode.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < configMode.length; i++) {
            if (SystemConfig.mode == configMode[i]) {
                exportsToggleItems[i].check();
            }
        }
    },

    onClickHostConfigButton : function () {
        var platformType = 0;
        var hostToggleItems = this.hostToggleNode.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < hostToggleItems.length; i++) {
            if (hostToggleItems[i].isChecked) {
                SystemConfig.setHost(i);
                platformType = i;
                break;
            }
        }
        var configMode = ["local", "test", "dev"];
        var exportsToggleItems = this.exportsToggleNode.getComponent(cc.ToggleContainer).toggleItems;
        for (let i = 0; i < exportsToggleItems.length; i++) {
            if (exportsToggleItems[i].isChecked) {
                SystemConfig.setSysConfigMode(configMode[i]);
                break;
            }
        }

        if (this.ipInput.string != "") {
            SystemConfig.setIpAndPort(this.ipInput.string, this.portInput.string);
        }
        this.testConfigNode.active = false;
        this.testLoginNode.active = true;
        var initLogicCpn = this.node.getComponent('initLogic');
        if(initLogicCpn){
            initLogicCpn.showVesion();
        }
        if (SystemConfig.mode == "local") {
            this.customLoginNode.active = true;
            this.phoneLoginNode.active = false;
        } else {
            if (platformType == 0) {
                this.customLoginNode.active = true;
                this.phoneLoginNode.active = false;
            } else {
                this.phoneLoginNode.active = true;
                this.customLoginNode.active = false;
            }
        }
    },

    onClickBackForHostConfigButton : function () {
        this.testConfigNode.active = true;
        this.testLoginNode.active = false;
    },

    onNormalLogin : function () {
        if (this.getCanNormalLogin()) {
            this.setCanNormalLogin(false);
            var loadingLogic = this.node.getComponent('LoadingLogic');
            loadingLogic.startPlatformLoginLogic();
        }
    },

    setCanNormalLogin : function (status) {
        this.canNormalLogin = status;
    },

    getCanNormalLogin : function () {
        return this.canNormalLogin;
    },
});
