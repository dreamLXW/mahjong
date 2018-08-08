
var MjSoundHelper =  {
    bgCurTime : 0,
};

MjSoundHelper.getEffectSoundVol = function(){
    var effectVol = null;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        effectVol = cc.sys.localStorage.getItem('effectSwitch');
        if(effectVol == null || effectVol == undefined || effectVol == ""){
            effectVol = 1;
        } else {
            if (effectVol == 2) {
                effectVol = 0;
            }
        }
        effectVol = Number(effectVol);
        return effectVol;
    } else {
        effectVol = cc.sys.localStorage.getItem('effectVol');
        if(effectVol == null || effectVol == undefined || effectVol == ""){
            effectVol = 0.5;
        }
        effectVol = Number(effectVol);
        return (effectVol == 0 ? 0.0001 : effectVol);
    }
},

MjSoundHelper.getBgSoundVol = function(){
    var bgmVol = null;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        bgmVol = cc.sys.localStorage.getItem('musicSwitch');
        if(bgmVol == null || bgmVol == undefined || bgmVol == ""){
            bgmVol = 1;
        } else {
            if (bgmVol == 2) {
                bgmVol = 0;
            }
        }
        bgmVol = Number(bgmVol);
        return bgmVol;
    } else {
        bgmVol = cc.sys.localStorage.getItem('bgmVol');
        if(bgmVol == null || bgmVol == undefined || bgmVol == ""){
            bgmVol = 0.5;
        }
        bgmVol = Number(bgmVol);
        return (bgmVol == 0 ? 0.0001 : bgmVol);
    }
},

MjSoundHelper.getLanType = function(){
    var lanType = Number(cc.sys.localStorage.getItem('lanType'));
    if(!lanType){
        lanType = 1;
    }
    return lanType;
},

MjSoundHelper.playingBgMusic = function(curTime){
    if(MjSoundHelper.bgAudioId == -1 || MjSoundHelper.bgAudioId == undefined || MjSoundHelper.bgAudioId == null){
        var bgmVol = MjSoundHelper.getBgSoundVol();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (!bgmVol) {
                return;
            }
        }
        var bgName = 'mjbg.mp3';
        var url = 'res/raw-assets/resources/mahjong/sound/' + bgName;
        MjSoundHelper.bgAudioId = cc.audioEngine.play(url, true, bgmVol);
        if (curTime != null && curTime != undefined && curTime > 0.1) {
            cc.audioEngine.setCurrentTime(MjSoundHelper.bgAudioId, curTime);
        }
    }
},

MjSoundHelper.stopBgMusic = function(){
    var audioId = MjSoundHelper.bgAudioId;
    if(audioId != -1 && audioId != undefined && audioId != null){
        cc.audioEngine.stop(audioId);
        MjSoundHelper.bgAudioId = -1;
    }
},

MjSoundHelper.freshBgMusicVol = function(){
    var audioId = MjSoundHelper.bgAudioId;
    if(audioId != -1 && audioId != undefined && audioId != null){
        var bgmVol = MjSoundHelper.getBgSoundVol();
        cc.audioEngine.setVolume(audioId,bgmVol);
    }
}

MjSoundHelper.playingChuPai = function(mahjongData,sex){
    var lanType = MjSoundHelper.getLanType();
    if(sex == null || sex == undefined){
        sex = 0;
    }
    var url = 'res/raw-assets/resources/mahjong/sound/lantype'+lanType + '/sex'+sex+'/'+mahjongData+'.mp3';
    MjSoundHelper.playingEffect(url);
},

MjSoundHelper.playingGang = function(pairTypeSound,sex){
    var lanType = MjSoundHelper.getLanType();
    if(sex == null || sex == undefined){
        sex = 0;
    }
    var url = 'res/raw-assets/resources/mahjong/sound/lantype'+lanType + '/sex'+sex+'/'+pairTypeSound;
    MjSoundHelper.playingEffect(url);
},

MjSoundHelper.playingPeng = function(sex){
    var lanType = MjSoundHelper.getLanType();
    if(sex == null || sex == undefined){
        sex = 0;
    }
    var url = 'res/raw-assets/resources/mahjong/sound/lantype'+lanType + '/sex'+sex+'/peng.mp3';
    MjSoundHelper.playingEffect(url);
},

MjSoundHelper.playingEffect = function(url){
    var effectVol = MjSoundHelper.getEffectSoundVol();
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        if (!effectVol) {
            return;
        }
    }
    var audioId = cc.audioEngine.play(url, false, effectVol);
    console.log('url = ' + url + '  \ndb = ' + effectVol);
    console.log("audioId=" + audioId);
    if (audioId < 0 || audioId == undefined || audioId == null) {
        var bgCurTime = 0;
        bgCurTime = cc.audioEngine.getCurrentTime(MjSoundHelper.bgAudioId);
        cc.audioEngine.stopAll();
        MjSoundHelper.stopBgMusic();
        MjSoundHelper.playingEffect(url);
        MjSoundHelper.playingBgMusic(bgCurTime);
    }
},

MjSoundHelper.playingHu = function(huUrl,sex){
    var lanType = MjSoundHelper.getLanType();
    if(sex == null || sex == undefined){
        sex = 0;
    }
    var url = 'res/raw-assets/resources/mahjong/sound/lantype'+lanType + '/sex'+sex+'/'+huUrl;
    MjSoundHelper.playingEffect(url);
},

MjSoundHelper.playingCommonSentence = function(lanType,sentenceId,sex){
    if(sex == null || sex == undefined){
        sex = 0;
    }
    var url = 'res/raw-assets/resources/mahjong/sound/lantype'+lanType + '/sex'+sex+'/commonsound'+sentenceId+'.mp3';
    MjSoundHelper.playingEffect(url);
}

MjSoundHelper.playingClick = function(){
    console.log('playingClick');
    var clickName = 'mjclick.mp3'
    var url = 'res/raw-assets/resources/mahjong/sound/'+clickName;
    MjSoundHelper.playingEffect(url);   
}

MjSoundHelper.playTraining = function(ramdomIndex){
    var clickName = ramdomIndex + '.mp3'
    var url = 'res/raw-assets/resources/mahjong/sound/training/'+clickName;
    var effectVol = MjSoundHelper.getEffectSoundVol();
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        if (!effectVol) {
            return;
        }
    }
    effectVol = (effectVol < 0.1 ? effectVol : (effectVol < 0.6 ? 0.6 : effectVol)) ;
    var audioId = cc.audioEngine.play(url,false,effectVol);
    if (audioId < 0 || audioId == undefined || audioId == null) {
        cc.audioEngine.stopAll();
    }
    console.log('url = ' + url + '  \ndb = ' + effectVol);
}
module.exports = MjSoundHelper;