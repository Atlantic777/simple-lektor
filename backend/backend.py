#!/usr/bin/python
from flask import Flask
from flask import request
from flask.ext.cors import CORS
import logging
import enchant
import json

d = enchant.DictWithPWL("sh", "/tmp/personal.txt")

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app)

personal_dicts = {}
user_list = []


def get_pwl_name(username):
    return "/tmp/{}.dic".format(username)


def get_personal_dict(username):
    path = get_pwl_name(username)
    f = open(path, "r")
    data = f.readlines()
    f.close()
    return data


@app.route("/limbo/<username>/check", methods=['GET', 'POST'])
def check(username):
    if request.method == 'GET':
        return "Hello world"
    elif request.method == 'POST':
        data = request.form['wordlist']
        print data

        wordlist = json.loads(data)
        print wordlist

        response = []
        for word in [w for w in wordlist if len(w)]:
            if not (d.check(word) or personal_dicts[username].check(word)):
                sug = d.suggest(word)
                response.append({'word': word, 'suggestions': sug})

        return json.dumps(response)


@app.route("/limbo/<username>", methods=['GET', 'POST'])
def limbo(username):
    if request.method == 'GET':
        personal_dict = get_personal_dict(username)
        return json.dumps(personal_dict)
    elif request.method == 'POST':
        data = request.form['words']
        words = json.loads(data)
        print words
        print words[0]

        for word in words:
            if personal_dicts[username].check(word) is False:
                personal_dicts[username].add(word)

        return json.dumps(get_personal_dict(username))


@app.route("/user", methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        return json.dumps([{'name': username} for username in user_list])
    elif request.method == 'POST':
        name = request.form['username']

        if name not in user_list:
            user_list.append(name)
            personal_dicts[name] = enchant.DictWithPWL("sh", get_pwl_name(name))

        return ('', 204)


if __name__ == "__main__":
    app.run(debug=True)
