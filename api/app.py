import glob
import os
from xmlrpc.client import Boolean
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
import json
import numpy as np

from termcolor import colored
from scripts.getLikelyResultsEmb import get_label
from scripts.getLikelyResultsEmb import formulate_question
from scripts.checkEmbedding import getAssociatedSources
from scripts.getRandQuestion import getRandQuestion
from scripts.getLikelyResults import getLikelyResults
from scripts.getLikelyResultsEmb import getLikelyResultsEmb, get_rand_question
from scripts.getSources import getSources
from scripts.getAttributes import getAttributes
from scripts.getTextFromSourceAttribute import getTextFromSourceAttribute
import shutil


app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api = Api(app)
app.config["SECRET_KEY"] = "oh_so_secret"

path = os.path.join("./app", "data")
pathMatrix = os.path.join("./app", "matrixes")
pathModels = os.path.join("./app", "models")

csv_file = os.path.join(path, "matrix.csv")
json_file = os.path.join(path,  "data.json")


class Questions(Resource):
    def get(self):
        input_file = open(os.path.join(path,  "questions.json"))
        json_array = json.load(input_file)
        # data = pd.read_json("questions.json")  # read JSON
        list = []

        for item in json_array:
            details = {"attribute": None, "label": None, "imageSupport": None}
            details["attribute"] = item["attribute"]
            details["label"] = item["label"]
            details["imageSupport"] = item["imageSupport"]

            list.append(details)
    # convert dataframe to dictionary
        return {"data": list}, 200  # return data and 200 OK code


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
        # return {"data": getNextQuestion(session_id)}, 200
        return {"data": getLikelyResults(session_id, attribute, answer)}, 200


class AnswerEmb(Resource):
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
        # return {"data": getNextQuestion(session_id)}, 200
        return {"data": getLikelyResultsEmb(session_id, answer)}, 200


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
                return {"data": False}, 200
            else:
                return {"data": foundRow}, 200


class StartEmb(Resource):
    def get(self, session_id):
        # We create a copy of matrix.csv called <session_id>.csv
        src_path = os.path.join(path,  "model.json")
        dst_path = os.path.join(pathModels, session_id + ".json")
        shutil.copy(src_path, dst_path)
        attr = get_rand_question()
        print("*************************")
        label = str(get_label(attr)["value"])
        question = formulate_question(attr, label)
        nextQuestion = {"attribute": label,
                        "label": question + "?", "imageSupport": ""}
        # Adding the first attribute to the used attributes
        list = np.append([], str(attr))
        new = {
            "radius": 100,
            "current_pos": 1,
            "used_attributes": list.tolist()
        }
        with open(os.path.join(pathModels, session_id + ".json"), "w") as jsonFile:
            json.dump(new, jsonFile)
        print(nextQuestion)
        return {"data": nextQuestion}, 200


class Start(Resource):
    def get(self, session_id):
        # We create a copy of matrix.csv called <session_id>.csv
        src_path = os.path.join(path,  "matrix.csv")
        dst_path = os.path.join(pathMatrix, session_id + ".csv")
        shutil.copy(src_path, dst_path)

        return {"data": getRandQuestion()}, 200


class Sources(Resource):
    def get(self):

        return {"data": getSources()}, 200


class Attributes(Resource):
    def get(self):

        return {"data": getAttributes()}, 200


class Embeddings(Resource):
    def get(self):
        try:
            url_id = request.args.get('url_id')
            topn = request.args.get('topn')
            labelsOnly = Boolean(request.args.get('labelsOnly'))
            if (url_id):
                return {"data": getAssociatedSources(url_id, int(topn) or 10, labelsOnly)}, 200
            else:
                return {"data": "null"}, 200
        except Exception:
            return {"error": "An error occured."}


class ClearMatrixes(Resource):
    def post(self):
        path = os.path.join("./app", "matrixes")

        filelist = glob.glob(os.path.join(path, "*.csv"))
        if (len(filelist) == 0):
            return {"success": True}, 200
        else:
            for f in filelist:
                os.remove(f)
            return {"success": True}, 200


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

        return {"data": getLikelyResults(session_id, attribute, answer)}, 200


class LikelyResultsEmb(Resource):
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

        return {"data": getLikelyResultsEmb(session_id, answer)}, 200


class AnswerJustifier(Resource):
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
                print("not foud")
                return False
            else:
                answers = []
                for answer in foundRow["answers"]:

                    if answer["answer"]["label"] == "Yes" or answer["answer"]["label"] == "I don't know" or answer["answer"]["label"] == "Probably":
                        answers.append(answer)

                list = getAttributes()
                ids = []
                for row in list:
                    for answer in answers:
                        attribute = answer["question"]["attribute"]
                        if row["value"] == attribute:
                            id = {"id": row["id"], "attribute": attribute}
                            ids.append(id)
                            print(id)
            print("called")
            text = getTextFromSourceAttribute(body["id"], ids)
        return {"data": text}, 200


api.add_resource(Questions, "/questions")
api.add_resource(StartEmb, "/startEmb/<session_id>")
api.add_resource(Start, "/start/<session_id>")
api.add_resource(Answer, "/answer/<session_id>")
api.add_resource(AnswerEmb, "/answerEmb/<session_id>")
api.add_resource(Answers, "/answers/<session_id>")
api.add_resource(Sources, "/sources")
api.add_resource(Attributes, "/attributes")
api.add_resource(ClearMatrixes, "/clear-matrixes")
api.add_resource(LikelyResultsEmb, "/likely_resultsEmb/<session_id>")
api.add_resource(LikelyResults, "/likely_results/<session_id>")
api.add_resource(AnswerJustifier, "/answer_justifier/<session_id>")
api.add_resource(Embeddings, "/embeddings")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
