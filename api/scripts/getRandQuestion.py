import json
import os
import random

path = os.path.join("./", "data")
json_file = os.path.join(path, "questions.json")


def getRandQuestion():
    ########    CURRENT WAY OF CHOOSING NEXT QUESTION (RANDOMLY)     ########
    input_file = open(json_file)
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
    print(list[random_number])
    return list[random_number]
