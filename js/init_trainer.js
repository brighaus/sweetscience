// load the boxing trainer
window.addEvent('domready', function() {
    var comboLists = {

        jch : [
                ['J'],
                ['C'],
                ['H'],
                ['J', 'H'],
                ['J', 'C', 'H'],
                ['C', 'H', 'C'],
                ['J', 'J', 'C']
            ],
        j : [],
        b : [],
        s : [],
        d : []

        };


        var bt = new BoxingTrainer({punchCombos :  comboLists["jch"]});
        bt.setDebugConsole('sessionStatus');
        bt.setRoundTime(60 * 1000);
        bt.setRoundBreak(30 * 1000);
        bt.setComboDelay(2 * 1000);
        bt.setAudioPath("media/audio");

        var numRoundSelect = function() {
            var nr = $('numRounds').get('value');
            bt.setNumRounds(nr);
        }

        $('sessionStarter').addEvent('click', function (event){
            // reset numrounds to selector value
            numRoundSelect();
            bt.startSession();
            return false;
        });
                        
        $('selectRoutine').addEvent('change', function(event){
            // routine selector
            // sets the combo on the boxing trainer obj
            bt.setPunchCombos(comboLists[this.getSelected()[0].get('value')]);
        }); 
        
        $('numRounds').addEvent('change', numRoundSelect);
        
        $('selectRoundtime').addEvent('change', function(event){
            // round time selector
            // sets the time on the boxing trainer obj
            bt.setRoundTime(parseInt(this.getSelected()[0].get('value')) * 1000);
        });

        $('selectBreaktime').addEvent('change', function(event){
            // break time selector
            // sets the time on the boxing trainer obj
            bt.setRoundBreak(parseInt(this.getSelected()[0].get('value')) * 1000);
        });

        $('sessionStop').addEvent('click', function(event){
            //numrounds 0;
            bt.setNumRounds(0);
            // execute break 
            bt.executeBreak();
        }); 

        
    });
