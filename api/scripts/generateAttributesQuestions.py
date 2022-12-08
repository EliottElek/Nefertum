import json
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd
from queries import questionsDataQuery

sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa"
)
sparql.setReturnFormat(JSON)

sparql.setQuery(questionsDataQuery)

attr_list = ["Sources/Attributes", "count"]
source_list = []
csv_file = "matrix.csv"
json_file = "questions.json"
try:
    with open(json_file, 'w', encoding="UTF8") as file:
        ret = sparql.queryAndConvert()
        json_object = json.dumps(ret, indent=4)
        file.write(json_object)
        # Open the JSON file for reading
        jsonFile = open(json_file, "r")
        data = json.load(jsonFile)  # Read the JSON into the buffer
        jsonFile.close()  # Close the JSON file

        tmp = data["results"]["bindings"]
        # Save our changes to JSON file

        for row in tmp:
            word = row["word_label"]["value"]
            question = "Can your smell be considered as " + word + " ?"
            row["attribute"] = word
            row["label"] = question
            row["imageSupport"] = ""

        jsonFile = open(json_file, "w+")
        jsonFile.write(json.dumps(tmp))
        jsonFile.close()

except Exception as e:
    print(e)
