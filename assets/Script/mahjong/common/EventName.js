var EventName =  {
    OnPlayerDataChange : 'OnPlayerDataChange',
    OnPlayerZhuangChange : 'OnPlayerZhuangChange',
    OnPlayerNumChange : 'OnPlayerNumChange',
    OnGameStatusChange : 'OnGameStatusChange',
    OnGuiPai : 'OnGuiPai',//应该归在动作队列里，做完鬼牌动画后才可出牌
    OnGameExtraChange : 'OnGameExtraChange',
    OnPlayerMjCardDataChange : 'OnPlayerMjCardDataChange',
    OnSetGuiPaiComplete : 'OnSetGuiPaiComplete',
    OnSeatEventComplete : 'OnSeatEventComplete',
    OnTalktEventComplete : 'OnTalktEventComplete',
    OnLastOutCardSideChange : 'OnLastOutCardSideChange',
    OnSeatSettleMjCardDataChange : 'OnSeatSettleMjCardDataChange',
    OnClubTick : 'OnClubTick',

    OnChuPaiAction : 'OnChuPaiAction',//别人和自己出了牌
    OnMoPaiAction : 'OnMoPaiAction',//别人和自己摸了牌
    OnPengGangPaiAction : 'OnPengGangPaiAction',

    OnMySeatOption : 'OnMySeatOption',

    OnSeatDissolve : 'OnSeatDissolve',
    OnSeatApplyDissolve : 'OnSeatApplyDissolve',

    OnUserTalk : 'OnUserTalk',
    OnHuType : 'OnHuType',
    OnPlaybackMultiOption : 'OnPlaybackMultiOption',
    OnFanMa : 'OnFanMa',
    OnPlaybackEnd : 'OnPlaybackEnd',
    OnSeatApplyStart : 'OnSeatApplyStart',
    OnCloseGame: "OnCloseGame"
};

module.exports = EventName;
