from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import pandas as pd


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)

class Data(Resource):
    def get(self):
        data = pd.read_csv('query-result.csv')  # read CSV
        data = data.to_dict()  # convert dataframe to dictionary
        return {'data': data}, 200  # return data and 200 OK code
    
    
api.add_resource(Data, '/data')  # '/data' is our entry point for Data
if __name__ == '__main__':
    app.run()  # run our Flask app