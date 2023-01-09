

import json
import os


path = os.path.join("./", "data")
json_file = os.path.join(path,  "data.json")


def getSources():

    jsonFile = open(json_file, "r")
    data = json.load(jsonFile)  # Read the JSON into the buffer
    jsonFile.close()  # Close the JSON file
    sources_list = []
    unique = {each["label"]["value"]: each for each in data}.values()

    for row in unique:
        source = row["source"]["value"]
        label = row["label"]["value"]
        if label not in sources_list:
            sources_list.append(
                {"value": label, "label": label, "source": source})

    return sources_list
