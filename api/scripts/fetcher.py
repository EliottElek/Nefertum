import csv
import json
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd
from queries import mainQuery
import os
from termcolor import colored

sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa", "sameAs=false"
)
sparql.setReturnFormat(JSON)

sparql.setQuery(mainQuery)

attr_list = ["Sources/Attributes", "label", "count"]
source_list = []

path = os.path.join("./", "data")
csv_file = os.path.join(path, "matrix.csv")
json_file = os.path.join(path,  "data.json")
print('Generating matrix from odeuropa endpoint...')
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
        # Creating header of csv file with all attributes
        for source in tmp:
            for key, value in source.items():
                if (key == "word_label"):
                    # Add attribute to source of attribute
                    attr_list.append(value["value"])
                    # Remove duplicates
                    attr_list = list(dict.fromkeys(attr_list))

        for source in tmp:
            for key, value in source.items():
                if (key == "source"):
                    # Add source to list of sources
                    source_list.append([value["value"]])

        with open(csv_file, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(attr_list)
            writer.writerows(source_list)

        # Filling void spaces
        df = pd.read_csv(csv_file)
        # a Pandas method that fills any NaN value with 0, you can change 0 to any value you
        # want, you can use mean or median, etc
        # df.replace(r'^\s*$', 0, regex=True)
        df.fillna(0, inplace=True)
        df.to_csv(csv_file)
        df = pd.read_csv(csv_file, index_col="Sources/Attributes")
        for row in tmp:
            attribute = row["word_label"]["value"]
            source = row["source"]["value"]
            count = row["count"]["value"]
            df.loc[source, attribute] = float(count)
        # Delete unused column
        df.drop('Unnamed: 0', inplace=True, axis=1)
        # Write DataFrame to CSV file
        df.to_csv(csv_file)

    print(colored('Matrix generated with success.✅', 'green'))

except Exception as e:

    print(colored('An error occured generating the matrix.', 'red'))
    print(e)
