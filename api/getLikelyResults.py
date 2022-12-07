import json
from random import choice, randrange


json_file = "./scripts/data.json"


def getLikelyResults():
    winners = []
    with open(json_file, "r") as outfile:
        data = json.load(outfile)
        results_length = randrange(1, 10)
        for i in range(results_length):
            winners.append(choice(data))

    return winners
