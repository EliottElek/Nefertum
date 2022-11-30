from flask import Flask, session, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import pandas as pd
import json
import random


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)
app.config['SECRET_KEY'] = 'oh_so_secret'


class Questions(Resource):
    def get(self):
        input_file = open('./scripts/questions.json')
        json_array = json.load(input_file)
        # data = pd.read_json('questions.json')  # read JSON
        list = []

        for item in json_array:
            details = {"attribute": None, "label": None, "imageSupport": None}
            details['attribute'] = item['attribute']
            details['label'] = item['label']
            details['imageSupport'] = item['imageSupport']

            list.append(details)
    # convert dataframe to dictionary
        return {'data': list}, 200  # return data and 200 OK code


def getNextQuestion():
    input_file = open('./scripts/questions.json')
    json_array = json.load(input_file)
    list = []

    for item in json_array:
        details = {"attribute": None, "label": None}
        details['attribute'] = item['attribute']
        details['label'] = item['label']
        details['imageSupport'] = item['imageSupport']

        list.append(details)
        random_number = random.randint(0, len(json_array)-1)

    # return data and 200 OK code
    return list[random_number]


class Answer(Resource):
    def post(self, session_id):
        # Store answer in json file

        body = request.json["data"]
        found = True
        # opening file
        with open("answers.json", "r+") as outfile:
            data = json.load(outfile)
            print(data)
            for row in data:
                print(row["session_id"])

                if row["session_id"] == session_id:
                    found = True
                    list = row["answers"]
                    list.append(body)
                    row["answers"] = list
                else:
                    found = False
            if found == False:
                new_row = {
                    "session_id": session_id,
                    "answers": [body]
                }
                data.append(new_row)
        with open("answers.json", "w") as jsonFile:
            json.dump(data, jsonFile)

        # Compute the next question to send

        return {'data': getNextQuestion()}, 200


class Answers(Resource):
    def get(self):
        if "answers" not in session:
            return {'data': "No answer yet."}, 200
        return {'data': session['answers']}, 200


class Start(Resource):
    def get(self):
        return {'data': getNextQuestion()}, 200


api.add_resource(Questions, '/questions')
api.add_resource(Start, '/start')
api.add_resource(Answer, '/answer/<session_id>')
api.add_resource(Answers, '/answers')

if __name__ == '__main__':
    app.run()  # run our Flask app
