var BoxingTrainer = new Class({
  Implements: Events,
  Binds: ['callCombo'],
    /*
'J', // jab
'DJ',// double jab
'TJ',// triple jab
'LJ',// low jab
'JH',// Jab Hook
'C', // cross
'H', // hook
'LB',// left body
'RB',//right body
'4S', // four straights
'PO', //punch out
'LPO'// -- Low punch out
*/

    roundTime: 180 * 1000, // default, 3 min round
    roundBreak: 45 * 1000, // default, 45 seconds rest
    numRounds: 5,
    curRoundNum: 1, //counter for number of rounds
    curRound: null, // actual round in session
    punchCombos: [],
    roundCompleteAudio: 'time', // audio file that gets called at the end of a round
    soundSrc: 'audio/', // sound files
    vidSrc: 'video/', // video files
    comboDelay: 5 * 1000, // seconds until the next combo
    comboSubsetTime: 15 * 1000, // beginning of round uses a smaller selection of strikes
    comboSubset: [0, 1, 2], // indexes of strikes to use during the subset
    punchOutTime: 30 * 1000, // punch out at end of round
    punchOutType: 'PO',
    isPunchOut: false, // true when elapsed time == round time - this.punchOutTime
    debugConsole: null, // show output
    audioQ: null,
    audioPath: null, //set to access media files
    audioType: ".mp3", // one audio type per executable for now
    isRoundActive: false,
    initialize: function(config) {
        this.setPunchCombos(config.punchCombos);
        this.audioQ = new AudioQueue();
        this.audioQ.ctx = this;
    },
    /** setPunchCombos -- sets the list of possible strikes for this session
      @param -- [] of [] items
     */
    setPunchCombos: function(combos) {
        this.punchCombos = combos;
    },
    /* setDebugConsole -- sets the container so show debug
      @param -- id of the console || 'console' for console.log calls
    */
    setDebugConsole: function(consoleId) {
        this.debugConsole = $(consoleId);
    },
    /* setNumRounds -- rounds per session
      @param -- rounds
    */
    setNumRounds: function(nr) {
        this.numRounds = nr;
    },

    /* setRoundTime -- sets time per round
      @param -- round time in milliseconds
    */
    setRoundTime: function(ms) {
        this.roundTime = ms;
    },
    /* setRoundBreak -- sets time per break between rounds
      @param -- break time in milliseconds
    */
    setRoundBreak: function(ms) {
        this.roundBreak = ms;
    },
    /* setComboDelay -- sets time between combinations
      @param -- combo time in milliseconds
    */
    setComboDelay: function(ms) {
        this.comboDelay = ms;
    },

    /* setAudioPath -- sets location of audio media
      @param -- string, path to audio dir
    */
    setAudioPath: function(path) {
        this.audioPath = path;
    },

    /* debugOut -- displays to console
      @param -- message to console
    */
    debugOut: function(msg) {
        this.debugConsole.set('html', msg);
    },
    startSession: function() {
        // reset curRoundNum
        this.curRoundNum = 1;
        console.log('calling start round');
        this.startRound();
        console.log('called start round');
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            msg += "<br/>startSession started round " + this.curRoundNum + " of " + this.numRounds + "...<br/>";
            this.debugOut(msg);
        }
    },

    /** callCombo -- calls out the next action
     * @param args from delay {}
     *   idx [int] if present, combo item to call
     *   combo [array] if present, combo to call from
     */
    callCombo: function(args) {
        if (!this.isRoundActive) {return false};
        var msg = '';
        var combo = (args && args.combo) ? args.combo : this.punchCombos.getRandom();
        var combosrc = [];
        var audioPath = this.audioPath + "/";
        for (var i = 0; i < combo.length; i++) {
            followme = audioPath + combo[i] + this.audioType;
            combosrc.push(followme);
        };
        console.log('inside call combo');
        // needs to have an event listener that calls
        // a new combo when the last audio in
        // the combo fires a combocomplete event.
        // display the combo 
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            msg += "<br/>callCombo kicking off...<br/>";
            this.debugOut(msg);
            console.log(msg);
        }
        

        
        this.audioQ.setActionCombo(combosrc);
        // display the combo 
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            msg += "<br/>callCombo displays this combo: " + combo + "...<br/>";
            this.debugOut(msg);
        }
        // run combo through audio q here...
        this.audioQ.initQueue();
    },

    executeBreak: function() {
        // execute break will kill the combo caller
        clearInterval(this.curRound);
        this.isRoundActive = false;
        // execute break will check curRoundNum v num rounds and call the session end routines
        if (this.curRoundNum < this.numRounds) {
            // increment curRound it will also start a countdown timer that executes executeRound
            this.curRoundNum++;
            // play round end sound
            var audioPath = this.audioPath + "/";
            followme = audioPath + this.roundCompleteAudio + this.audioType;
            this.audioQ.setActionCombo([followme]);
            this.audioQ.initQueue();
            // start new round at the end of break time 
            this.startRound.delay(this.roundBreak, this);
        } else {
            this.endSession();
            var isDone = true;
        }
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            if (isDone) {
                msg += "<br/>executeBreak says session complete!<br/>";
            } else {
                msg += "<br/>executeBreak displays rests between rounds...<br/>";
            }
            this.debugOut(msg);
        }
    },

    startRound: function() {
        this.isRoundActive = true;
        // start round countdown, which has a callback to execute break
        this.executeBreak.delay(this.roundTime, this);
        var handleComboComplete = function(evt){
          _this = evt.target.ctx;
          _this.callCombo();
        }
        // call bell sound
        // set combo complete listener
        this.audioQ.addEvent('combocomplete', this.callCombo);
        // call one combo
        console.log('calling call combo...');
        this.callCombo();
        console.log('called call combo');
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            msg += "<br/>startRound says: Round " + this.curRoundNum + "!! started the countdown at: " + this.roundTime + "...<br/>";
            this.debugOut(msg);
        }
    },


    endSession: function() {
        clearTimeout(this.executeBreak);
        if (this.debugConsole) {
            msg = this.debugConsole.get('html');
            msg += "<br/>endSession says session complete!...<br/>";
            this.debugOut(msg);
        }
    }

});