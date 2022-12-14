from flask import Flask, request, session
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import pandas as pd
import numpy as np
import json
import random
from scripts.getLikelyResults import getLikelyResults
from scripts.getSources import getSources
from scripts.getAttributes import getAttributes
import shutil


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)
app.config['SECRET_KEY'] = 'oh_so_secret'


class Questions(Resource):
    def get(self):
        input_file = open('./data/questions.json')
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


def getNextQuestion(session_id):

    ########    CURRENT WAY OF CHOOSING NEXT QUESTION (RANDOMLY)     ########
    input_file = open('./data/questions.json')
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
        with open("./data/answers.json", "r+") as outfile:
            data = json.load(outfile)
            for row in data:
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

        with open("./data/answers.json", "w") as jsonFile:
            json.dump(data, jsonFile)

        # Compute the next question to send
            attribute = body["question"]["attribute"]
            answer = body["answer"]["label"]
        return {'data': getLikelyResults(session_id, attribute, answer)}, 200


class Answers(Resource):
    def get(self, session_id):
        # Store answer in json file
        # opening file
        found = False
        with open("./data/answers.json", "r") as outfile:
            data = json.load(outfile)
            foundRow = []
            for row in data:
                if row["session_id"] == session_id:
                    found = True
                    foundRow = row
                else:
                    found = False
            if found == False:
                return {'data': False}, 200
            else:
                return {'data': foundRow}, 200


class Start(Resource):
    def get(self, session_id):
        # We create a copy of matrix.csv called <session_id>.csv
        src_path = "./data/matrix.csv"
        dst_path = "./matrixes/" + session_id + ".csv"
        shutil.copy(src_path, dst_path)

        return {'data': getNextQuestion(session_id)}, 200


class Sources(Resource):
    def get(self):

        return {'data': getSources()}, 200


class Attributes(Resource):
    def get(self):

        return {'data': getAttributes()}, 200


class LikelyResults(Resource):
    def get(self, session_id):
        # Get latest answer from session ID
        # opening file
        found = False
        with open("answers.json", "r") as outfile:
            data = json.load(outfile)
            foundRow = []
            for row in data:
                if row["session_id"] == session_id:
                    found = True
                    foundRow = row
                else:
                    found = False
            if found == False:
                return False
            else:
                latest_answer = foundRow["answers"][len(foundRow["answers"])-1]
                attribute = latest_answer["question"]["attribute"]
                answer = latest_answer["answer"]["label"]

        return {'data': getLikelyResults(session_id, attribute, answer)}, 200


api.add_resource(Questions, '/questions')
api.add_resource(Start, '/start/<session_id>')
api.add_resource(Answer, '/answer/<session_id>')
api.add_resource(Answers, '/answers/<session_id>')
api.add_resource(Sources, '/sources')
api.add_resource(Attributes, '/attributes')
api.add_resource(LikelyResults, '/likely_results/<session_id>')

if __name__ == '__main__':
    app.run()  # run our Flask app
