//var UpdatePanel = require('../UI/UpdatePanel');
var CommonHelper = require('CommonHelper');
cc.Class({
    extends: cc.Component,

    properties: {
        proManifestUrl: cc.RawAsset,
        testManifestUrl: cc.RawAsset,
        _updating: false,
        _canRetry: false,
        _storagePath: '',
        updateTipsLabel : cc.Label,
        hotUpdateProgressLabel : cc.Label,
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.updateTipsLabel.string = "找不到本地版本文件";
                console.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.updateTipsLabel.string = "下载远程资源失败";
                console.log("Fail to download manifest file, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.updateTipsLabel.string = "已经更新到最新版本";
                console.log("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log("检查到有新资源包");
                this.updateTipsLabel.string = "New version found, please try to update.";
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.updateTipsLabel.string = "找不到本地版本文件";
                console.log("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var bytePercent = event.getPercent(); 
                var fileProgress = event.getPercentByFile(); 
                var downloadFileNum = event.getDownloadedFiles(); 
                var downloadBytes = event.getDownloadedBytes(); 
                var totalFileNum = event.getTotalFiles(); 
                var totalBytes = event.getTotalBytes(); 
                this.hotUpdateProgressLabel.string = bytePercent >0 ?Math.round(bytePercent *100) + "%" : '';
                cc.global.loading.setProgressNum(bytePercent);
                this.updateTipsLabel.string = "正在下载资源包";
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                console.log("bytePrecent:"+bytePercent + " fileProgress:" + fileProgress + " downloadFileNum:"+downloadFileNum+" downloadBytes:"+downloadBytes+" totalFileNum:"+totalFileNum+" totalBytes:"+totalBytes);
                var msg = event.getMessage();
                if (msg) {
                    //this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.updateTipsLabel.string = "下载远程资源失败";
                console.log("Fail to download manifest file, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.updateTipsLabel.string = "已经更新到最新版本";
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                this.hotUpdateProgressLabel.string = "100%"
                this.updateTipsLabel.string = "更新资源完成";
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update finished. ' + event.getMessage());
                this.updateTipsLabel.string = "更新资源失败";
                // this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                var self = this;
                CommonHelper.showMessageBox("提示","更新资源失败，再尝试一次",function(){self.retry();},null,false);
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                this.updateTipsLabel.string = "更新资源失败:"+ event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                this.updateTipsLabel.string = "解压缩资源失败";
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
            cc.global.rootNode.emit('OnHotUpdateComplete');
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('MJHotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },
    
    retry: function () {
        if (!this._updating && this._canRetry) {
            //this.panel.retryBtn.active = false;
            this._canRetry = false;
            console.log('Retry failed Assets...');
            //this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },
    
    checkUpdate: function () {
        if (this._updating) {
            console.log('Checking or updating ...');
            //this.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this.loadManifest(this._am);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            console.log('Failed to load local manifest ...');
            //this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this.loadManifest(this._am);
            }

            this._failCount = 0;
            this._am.update();
            //this.panel.updateBtn.active = false;
            this._updating = true;
            this.updateTipsLabel.node.active = true;
            this.updateTipsLabel.string = "正在为您检查资源包更新";
        }
    },
    
    show: function () {
        // if (this.updateUI.active === false) {
        //     this.updateUI.active = true;
        // }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'mahjong-remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        //var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                console.log("Verification passed : " + relativePath);
                //panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                console.log('Using custom manifest');
                //panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });
        console.log('Hot update is ready, please check or directly update.');
        //this.panel.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            console.log('Max concurrent tasks count have been limited to 2');
            //this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        
        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },

    loadManifest : function(am){
        var SystemConfig = require('SystemConfig');
        if(SystemConfig.isReal()){
            am.loadLocalManifest(this.proManifestUrl);
        }else{
            am.loadLocalManifest(this.testManifestUrl);
        }
    },
});
