

import json
import os
path = os.path.join("app/", "data")
json_file = os.path.join(path,  "questions.json")


def getAttributes():

    jsonFile = open(json_file, "r")
    data = json.load(jsonFile)  # Read the JSON into the buffer
    jsonFile.close()  # Close the JSON file

    sources_list = []
    for row in data:
        attribute = row["attribute"]
        id = row["word"]["value"]
        if attribute not in sources_list:
            sources_list.append(
                {"value": attribute, "label": attribute, "id": id})
    return sources_list
