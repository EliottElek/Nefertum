import glob
import os
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
import json

from termcolor import colored
from scripts.getRandQuestion import getRandQuestion
from scripts.getLikelyResults import getLikelyResults
from scripts.getSources import getSources
from scripts.getAttributes import getAttributes
from scripts.getTextFromSourceAttribute import getTextFromSourceAttribute
import shutil


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)
app.config['SECRET_KEY'] = 'oh_so_secret'

path = os.path.join("app/", "data")
pathMatrix = os.path.join("app/", "matrixes")
csv_file = os.path.join(path, "matrix.csv")
json_file = os.path.join(path,  "data.json")


class Questions(Resource):
    def get(self):
        input_file = open(os.path.join(path,  "questions.json"))
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


class Answer(Resource):
    def post(self, session_id):
        # Store answer in json file

        body = request.json["data"]
        found = True
        # opening file
        with open(os.path.join(path,  "answers.json"), "r+") as outfile:
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

        with open(os.path.join(path,  "answers.json"), "w") as jsonFile:
            json.dump(data, jsonFile)

        # Compute the next question to send
            attribute = body["question"]["attribute"]
            answer = body["answer"]["label"]
        # return {'data': getNextQuestion(session_id)}, 200
        return {'data': getLikelyResults(session_id, attribute, answer)}, 200


class Answers(Resource):
    def get(self, session_id):
        # Store answer in json file
        # opening file
        found = False
        with open(os.path.join(path,  "answers.json"), "r") as outfile:
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
        src_path = os.path.join(path,  "matrix.csv")
        dst_path = os.path.join(pathMatrix, session_id + ".csv")
        shutil.copy(src_path, dst_path)

        return {'data': getRandQuestion()}, 200


class Sources(Resource):
    def get(self):

        return {'data': getSources()}, 200


class Attributes(Resource):
    def get(self):

        return {'data': getAttributes()}, 200


class ClearMatrixes(Resource):
    def post(self):
        path = os.path.join("app/", "matrixes")

        filelist = glob.glob(os.path.join(path, "*.csv"))
        if (len(filelist) == 0):
            return {'success': True}, 200
        else:
            for f in filelist:
                os.remove(f)
            return {'success': True}, 200


class LikelyResults(Resource):
    def get(self, session_id):
        # Get latest answer from session ID
        # opening file
        found = False
        with open(os.path.join(path,  "answers.json"), "r") as outfile:
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


class answerJustifier(Resource):
    def post(self, session_id):
        # Store answer in json file
        # opening file

        # getting answer from post request
        body = request.json["data"]
        # getting last answer
        # Get latest answer from session ID
        # opening file
        found = False
        with open(os.path.join(path,  "answers.json"), "r") as outfile:
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
                answer1 = 0
                answer2 = 0
                for answer in foundRow["answers"]:
                    if answer2 != 0:
                        break
                    if answer["answer"]["label"] == 'Yes' or answer["answer"]["label"] == "I don't know":
                        if answer1 == 0:
                            answer1 = answer
                        elif answer2 == 0:
                            answer2 = answer

                # print(colored(answer1, "green"))
                # print(colored(answer2, "green"))

                attribute1 = answer1["question"]["attribute"]
                attribute2 = answer2["question"]["attribute"]
                list = getAttributes()
                id1 = 0
                id2 = 0
                for row in list:
                    if row["value"] == attribute1:
                        id1 = {"id": row["id"], "attribute": attribute1}
                    elif row["value"] == attribute2:
                        id2 = {"id": row["id"], "attribute": attribute2}

            text = getTextFromSourceAttribute(body["id"], id1, id2)
        return {'data': text}, 200


api.add_resource(Questions, '/questions')
api.add_resource(Start, '/start/<session_id>')
api.add_resource(Answer, '/answer/<session_id>')
api.add_resource(Answers, '/answers/<session_id>')
api.add_resource(Sources, '/sources')
api.add_resource(Attributes, '/attributes')
api.add_resource(ClearMatrixes, '/clear-matrixes')
api.add_resource(LikelyResults, '/likely_results/<session_id>')
api.add_resource(answerJustifier, '/answer_justifier/<session_id>')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
