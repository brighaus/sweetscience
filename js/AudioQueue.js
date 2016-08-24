var AudioQueue = new Class({
    Implements: Events,
    Binds: ['playNext'],
    initialize: function () {
        this.queuePlayer = new Element('audio');
        this.actionList = [];
        this.playCount = 1;
    },
    getQueuePlayer: function(){
        return this.queuePlayer;
    },
    // refers to a list of audio file paths
    setActionCombo: function(combo) {
        this.actionList = combo;
    },
    getActionCombo: function () {
        return this.actionList;
    },
    playNext: function (evt) {
        _this = evt.target.ctx;
        if(_this.playCount < _this.actionList.length){
            _this.queuePlayer.src = _this.actionList[_this.playCount];
            _this.playCount++;
            _this.queuePlayer.play();
        }
        else{
            _this.queuePlayer.removeEventListener('ended', _this.playNext);
            _this.playCount = 1;
            _this.fireEvent('combocomplete');
        }
    },
    initQueue: function () {
        this.queuePlayer.src = this.actionList[0];
        // have to use standard event listener here.
        // Mootools ended event never fires callback
        this.queuePlayer.addEventListener('ended', this.playNext);
        this.queuePlayer.ctx = this;
        this.queuePlayer.play();
    }
});
