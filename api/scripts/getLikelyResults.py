from cmath import nan
from ctypes import resize
import os
import pandas as pd
import numpy as np
from scripts.getRandQuestion import getRandQuestion

path = os.path.join("./", "data")
pathMatrix = os.path.join("./", "matrixes")


def getLikelyResults(session_id, attribute, answer):
    session_matrix = os.path.join(pathMatrix, session_id + ".csv")
    sources = []
    results = []
    matrix = pd.read_csv(session_matrix)
    # matrix = matrix[matrix["Aromatic"].notna()]

    # if (answer == "No"):
    #     matrix.drop(matrix[matrix[attribute] != 0].index, inplace=True)
    # else:
    #     matrix.drop(matrix[matrix[attribute] == 0].index, inplace=True)

    match answer:
        case "Yes":
            matrix.loc[matrix[attribute] != 0, ["score"]] += 3
            matrix.loc[matrix[attribute] == 0, ["score"]] -= 3

        case "Probably yes":
            matrix.loc[matrix[attribute] != 0, ["score"]] += 1
            matrix.loc[matrix[attribute] == 0, ["score"]] -= 1

        case "Probably not":
            matrix.loc[matrix[attribute] == 0, ["score"]] += 1
            matrix.loc[matrix[attribute] != 0, ["score"]] -= 1

        case "No":
            matrix.loc[matrix[attribute] == 0, ["score"]] += 3
            matrix.loc[matrix[attribute] != 0, ["score"]] -= 3

    matrix.drop(columns=attribute, inplace=True)
    matrix.drop(matrix[matrix["score"] < -4].index, inplace=True)
    matrix.sort_values(by="score", ascending=False, inplace=True)

    # matrix = matrix[matrix["Aromatic"].notna()]
    matrix.to_csv(session_matrix)

    ########    FINDING MOST DISCRIMINANT QUESTION (RESULTS IN CONSOLE)     ########
    nMatrix = matrix.drop(matrix[matrix["score"] < 0].index).drop(
        columns=["Sources/Attributes", "label", "score", "count"]).to_numpy()
    questionScores = np.empty(len(nMatrix[0]), dtype=[
        ("columnIndex", int), ("questionScore", float)])
    for j in range(len(nMatrix[0])):
        col = nMatrix[:, j]
        count = 0
        for i in range(len(col)):
            if (col[i] == 0):
                count += 1
        questionScore = np.abs(len(nMatrix)/2 - count)
        questionScores[j] = (j, questionScore)
    results = np.sort(questionScores, order="questionScore")

    # qBases = ["Can your smell be defined as "]
    qBases = ["Can your smell be defined as ",
              "Would you qualify your smell as ", "Is your smell "]

    # Adding 4 to compensate the ignored columns during the question selection
    nextQuestion = {"attribute": matrix.columns[int(
        results[0][0])+4], "label": qBases[0] + matrix.columns[int(results[0][0])+4].lower() + "?", "imageSupport": ""}
    lists = matrix["label"].to_list()
    ids = matrix["Sources/Attributes"].tolist()
    for i in range(len(lists)):
        sources.append({"label": lists[i], "id": ids[i]})

    if (len(matrix) < 10) or (matrix.iloc[[0]]["score"].values[0] > 15):
        return {"result": True, "length": len(matrix), "sources": sources[0: 10], "question": nextQuestion}

    return {"result": False, "length": len(matrix), "sources": sources[0: 10], "question": nextQuestion}
