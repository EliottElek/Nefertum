import json
from gensim.models import KeyedVectors
import random
import os
import numpy
from prompt_toolkit import prompt
from gensim.models import KeyedVectors
from SPARQLWrapper import SPARQLWrapper, JSON
sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa", "sameAs=false"
)
sparql.setReturnFormat(JSON)

path = os.path.join("./", "data")
emb_path = os.path.join(path, 'voc.kv')
pathModels = os.path.join("./", "models")

emb = KeyedVectors.load(emb_path)


def get_rand_question():
    # Random vector selection
    rand = emb.vectors[random.randint(0, len(emb.vectors)-1)]
    attribute = emb.most_similar(rand, topn=100)
    return attribute[0][0]


def get_next_question(current, radius, used_attributes):
    cond = False
    quest = ""
    while cond == False:
        cond = True
        random_point = numpy.random.randn(100)
        # Normalize the random vector and scale it by a random radius
        random_dist = random.uniform(0, radius)
        random_point = current + random_dist * \
            random_point / numpy.linalg.norm(random_point)
        quest = emb.most_similar(random_point, topn=1)[0][0]
        if get_label(quest)["xml:lang"] != "en":
            cond = False
        for attr in used_attributes:
            if quest == attr:
                cond = False
        print(get_label(quest)["value"])
        print(random_point)
    return quest


def get_next_position(answer, current_pos, attr_pos):
    next_pos = numpy.zeros(100)
    # takes current_pos, depending on answer, move closer or further from attr_pos
    match answer:
        case "Yes":
            # Move cursor halfway towards attr_pos
            next_pos = translate_towards(attr_pos, current_pos, 0.5)
        case "Probably yes":
            # Move cursor halfway towards attr_pos
            next_pos = translate_towards(attr_pos, current_pos, 0.3)
        case "Probably not":
            # Move cursor halfway away from attr_pos
            next_pos = translate_towards(attr_pos, current_pos, -0.3)
        case "No":
            # Move cursor halfway away from attr_pos
            next_pos = translate_towards(attr_pos, current_pos, -0.5)

    return next_pos


def getLikelyResultsEmb(session_id, attribute, answer):
    session_model = os.path.join(pathModels, session_id + ".json")
    nextQuestion = {}
    with open(session_model) as outfile:
        model = json.load(outfile)
        # load radius from session file
        radius = model["radius"]
        # load current position from session file
        if (model["current_pos"] == 1):
            current_pos = numpy.zeros(100)
        else:
            current_pos = numpy.array(model["current_pos"])

        # if we still did not get a "yes" yet
        if answer != "Yes" and radius == 2:
            attr = get_rand_question()
            current_pos = emb.get_vector(attr)
            get_label(attr)["value"]
            question = str("Can your smell be considered as " +
                           str(get_label(attr)["value"]))
            nextQuestion = {"attribute": str(
                get_label(attr)["value"]), "label": question + "?", "imageSupport": ""}
            most_similar = emb.most_similar(current_pos, topn=10)
            labels = []
            for source in most_similar:
                labels.append({"label": get_label(source[0])["value"]})
            return {"result": False, "sources": labels, "question": nextQuestion}

        while radius > 0.1:
            # http://data.odeuropa.eu/smell/82dffab9-dd1d-5e27-a3db-ff7f26cd9469
            used_attributes = numpy.array(
                model["used_attributes"]).tolist()

            attr = get_next_question(current_pos, radius, used_attributes)
            question = str("Can your smell be considered as " +
                           # Expect something like "Can your smell be considered as sweet ?"
                           str(get_label(attr)["value"]))
            current_pos = get_next_position(
                answer, current_pos, emb.get_vector(attr))
            radius -= 0.2

            list = numpy.append(used_attributes, str(attr))
            new = {
                "radius": radius,
                "current_pos": current_pos.tolist(),
                "used_attributes": list.tolist()
            }
            with open(os.path.join(pathModels, session_id + ".json"), "w") as jsonFile:
                json.dump(new, jsonFile)

            nextQuestion = {"attribute": str(
                get_label(attr)["value"]), "label": question + "?", "imageSupport": ""}

            most_similar = emb.most_similar(current_pos, topn=10)
            labels = []
            for source in most_similar:
                labels.append({"label": get_label(source[0])["value"]})
            return {"result": False, "sources": labels, "question": nextQuestion}
        most_similar = emb.most_similar(current_pos, topn=10)
        labels = []
        for source in most_similar:
            labels.append({"label": get_label(source[0])["value"]})
        return {"result": True, "sources": labels}


# distance for yes, -distance for no
def translate_towards(target, initial, distance):
    direction = target - initial
    # direction /= numpy.linalg.norm(direction)
    translation = distance * direction
    return initial + translation


def get_label(source):
    string = ""
    print(source)
    string = string + "<" + source + ">"
    string = string.replace("\n", " ")
    query = """
    PREFIX od: <http://data.odeuropa.eu/ontology/>
    PREFIX crm: <http://erlangen-crm.org/current/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT DISTINCT ?source ?label ?scheme
    FROM <http://www.ontotext.com/disable-sameAs>
    WHERE {{
	    VALUES ?source {{ {0} }}
        ?source skos:prefLabel ?label;
        skos:inScheme ?scheme.
    }}
    """.format(string)

    try:
        sparql.setQuery(query)

        ret = sparql.queryAndConvert()
        src = ret["results"]["bindings"]
        print(src[0])
        return src[0]["label"]

    except Exception as e:
        print(e)
