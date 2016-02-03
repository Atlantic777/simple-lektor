# simple-lektor

## How to start

If you are using a Debian based distribution, just run `start.sh`.
It will install dependencies and start the backend server.
When backend server is running, open `admin.html` and add a user.
When you have some users added, open `editor.html` and **choose a user** before you continue!

## How to use

After you have created a user in `admin.html` and chosed `editor.html` you can start checking your text.

 - Enter the text into the big input field and click the //check// button.
 - Bad words will be marked with red background.
 - List of bad words is available in the right sidebar
 - If a bad word isn't really bad, you can add it to you dict. It will show in the right, too.
 - When you want to //select// a bad word, you just click it. Don't select it. It will be available in //selection// field above the input. Also, suggested corrections will be availble above the input field, too.
 - You can't remove non-marked words from dictionary.
 
## How it works

 - Your text will be reduced to list of unique words. Control chars and marks will be stripped down.
 - That list of words is sent to the backend for checking, and as response you get back list of bad words with their suggestions.
 - When backend receives request for checking list of words, it will use system dictionary and users' personal dictionary. If it's not found in any of those, it's bad. System dictionary is hunspell (serbian, latin) and personal dict is just raw list of words.
 - Suggestions are fetched only from system dictionary.
 - When frontend receives the response, a list of bad words with suggestions, it will iterate through it and apply regex which will surround each match with `<span class="wrong">`. Bad words can be clicked and have red background.
 - User managament is done in `admin.html` and for now you can only add new users and check content of their personal dictionaries.

## Data persistence

 - List of users is currently stored only in memory, so restarting backend server is destroying it. On each restart, you need to re-add users you want to use.
 - Personal dictionaries are stored in `/tmp/<username>.txt` and they are safe until reboot or until they are deleted manually.

## Known bugs && Future
 - You can't mark some good word as bad
 - You can't remove a word from personal dictionary
 - You can't move word from personal dictionary to system dict
 - Checking is ruining formating
 - Don't extract unique words in frontend, do it in backend
