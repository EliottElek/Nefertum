from cmath import nan
from ctypes import resize
import pandas as pd
import numpy as np
from scripts.getRandQuestion import getRandQuestion


def getLikelyResults(session_id, attribute, answer):
    session_matrix = "./matrixes/" + session_id + ".csv"
    notDecisive = False
    sources = []
    results = []
    matrix = pd.read_csv(session_matrix)
    matrix = matrix[matrix['Aromatic'].notna()]

    if(answer == "No"):
        matrix.drop(matrix[matrix[attribute] != 0].index, inplace=True)
    elif(answer == "Yes"):
        matrix.drop(matrix[matrix[attribute] == 0].index, inplace=True)
    else:
        notDecisive = True

    matrix = matrix[matrix['Aromatic'].notna()]
    matrix.to_csv(session_matrix)

    ########    FINDING MOST DISCRIMINANT QUESTION (RESULTS IN CONSOLE)     ########

    nMatrix = matrix.to_numpy()
    scores = np.empty(len(nMatrix[0]), dtype=[
                      ('columnIndex', int), ('score', float)])
    for j in range(len(nMatrix[0])):
        col = nMatrix[:, j]
        count = 0
        for i in range(len(col)):
            if(col[i] == 0):
                count += 1
        score = np.abs(len(nMatrix)/2 - count)
        scores[j] = (j, score)
    results = np.sort(scores, order='score')

    qBases = ["Can your smell be defined as "]
    # qBases = ["Can your smell be defined as ", "Would you qualify your smell as ", "Is your smell "]

    nextQuestion = {"attribute": matrix.columns[int(
        results[0][0])], "label": qBases[0] + matrix.columns[int(results[0][0])] + "?", "imageSupport": ""}
    lists = matrix['label'].tolist()
    for item in lists:
        sources.append({"label": item})

    if(notDecisive == True):
        return {"result": False, "length": len(matrix), "sources": sources[0: 10], "question": getRandQuestion()}

    if (len(matrix) == 1) or np.array_equal(results, scores):
        return {"result": True, "length": len(matrix), "sources": sources[0: 10], "question": nextQuestion}

    return {"result": False, "length": len(matrix), "sources": sources[0: 10], "question": nextQuestion}
