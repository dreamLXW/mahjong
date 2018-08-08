var SeatStatusCfg =  {
    StartStatus : 'start',  //牌局正在进行
    WaitStatus : 'wait',    //等待玩家进入
    ReadyStatus : 'ready',  //结算后等待玩家主动继续游戏
    OverStatus : 'over',    //over(打完设定局数)
    DissolveStatus : 'dissolve',// dissolve (房间解散)
};

module.exports = SeatStatusCfg;
