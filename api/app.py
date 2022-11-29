from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import pandas as pd
import json
import random


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)


class Data(Resource):
    def get(self):
        data = pd.read_csv('query-results2.csv', sep=',',
                           header=None)  # read CSV
        data = data.to_dict()
        # list = []

        # for item in data:
        #     details = {"count": None, "label": None, "source": None}
        #     details['count'] = item['count']
        #     details['label'] = item['label']
        #     details['source'] = item['source']

        #     list.append(details)
        print(data.values)

        return {'data': data}, 200  # return data and 200 OK code


class Questions(Resource):
    def get(self):
        input_file = open('questions.json')
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


class Question(Resource):
    def get(self):
        input_file = open('questions.json')
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
        return {'data': list[random_number]}, 200


class WriteCSV(Resource):
    def get(self):
        write_to_csv([['1', 'IBM'], ['2', 'Cogni'], ['3', 'Toyota'], [
                     '4', 'tomtom']], ['Index', 'Name'], "output")
        return {'data': ""}, 200  # return data and 200 OK code


def write_to_csv(output, columns, name):
    df_output = pd.DataFrame(output, columns=columns, dtype=float)
    df_output.to_csv(name+".csv")
    df_output.to_json(name+".json")


api.add_resource(Data, '/data')
api.add_resource(Questions, '/questions')
api.add_resource(Question, '/question')
api.add_resource(WriteCSV, '/write')

if __name__ == '__main__':
    app.run()  # run our Flask app
