#!/usr/bin/python
from flask import Flask
from flask import request
from flask.ext.cors import CORS
import logging
import enchant
import json

d = enchant.Dict("en")

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app)

personal_dict = []


@app.route("/check", methods=['GET', 'POST'])
def hello():
    if request.method == 'GET':
        return "Hello world"
    elif request.method == 'POST':
        data = request.form['wordlist']
        print data

        wordlist = json.loads(data)
        print wordlist

        response = []
        for word in [w for w in wordlist if len(w)]:
            if d.check(word) is False:
                response.append(word)

        return json.dumps(response)


@app.route("/limbo", methods=['GET', 'POST'])
def limbo():
    if request.method == 'GET':
        return json.dumps(personal_dict)
    elif request.method == 'POST':
        data = request.form['words']
        words = json.loads(data)
        print words
        print words[0]

        for word in words:
            if word not in personal_dict:
                personal_dict.append(word)

        return json.dumps(personal_dict)


if __name__ == "__main__":
    app.run(debug=True)
