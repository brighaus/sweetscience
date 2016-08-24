# sweetscience
### Javascript based work-out application.
- You can see the basic API use in js/init\_trainer.js
  - the 'comboLists' variable defines the audio content for each training combination
    - the items in comboList nested lists are strings that directly reference files in media/audio minus the file extension (mp3 by default)
    - this means that you dan easily update the exercises the trainer calls out by adding the files to media/audio anbd referencing them in the comboLists variable.
- You can run the app by running index.html in a modern, standards compliant web browser. No server needed.
- The app has many more configurations than exposed in the UI. You can see them in the init code in js/BoxingTrainer.js
