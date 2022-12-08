import json
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd
from queries import getCountsQuery
import os
from termcolor import colored

sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa"
)
sparql.setReturnFormat(JSON)

sparql.setQuery(getCountsQuery)
path = os.path.join("./", "data")
csv_file = os.path.join(path, "matrix.csv")
json_file = os.path.join(path,  "counts.json")
print('Adding labels and counts to generated matrix...')

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
        jsonFile = open(json_file, "w+")

        jsonFile.write(json.dumps(tmp))
        jsonFile.close()
        df = pd.read_csv(csv_file, index_col="Sources/Attributes")
        for row in tmp:
            if row in tmp:
                source = row["source"]["value"]
                count = row["count"]["value"]
                label = row["label"]["value"]
                df.loc[source, "count"] = float(count)
                df.loc[source, "label"] = label
        # Write DataFrame to CSV file
        df.to_csv(csv_file)
    print(colored('Labels and counts added with success.✅', 'green'))


except Exception as e:
    print(colored('An error occured generating the matrix.', 'red'))
    print(e)
