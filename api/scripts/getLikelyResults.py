import pandas as pd
import json


def getLikelyResults(session_id, attribute, answer):
    session_matrix = "./matrixes/" + session_id + ".csv"
    sources = []
    matrix = pd.read_csv(session_matrix)
    if(answer == "No"):
        matrix.drop(matrix[matrix[attribute] != 0].index, inplace=True)
    else:
        matrix.drop(matrix[matrix[attribute] == 0].index, inplace=True)
    matrix.to_csv(session_matrix)
    lists = list(matrix[matrix.columns[1]])
    for item in lists:
        sources.append({"label": item})

    if (len(matrix) < 10):
        return {"result": True, "length": type(len(matrix)), "sources": sources[0: 10]}

    return {"result": False, "length": len(matrix), "sources": sources[0: 10]}
