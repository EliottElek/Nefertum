import json
from gensim.models import KeyedVectors
import random
import os
import numpy as np
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
    attributes = emb.most_similar(rand, topn=100)
    cond = False
    count = 0
    attr = ""
    invalid_urlTypes = {"olfactory-objects", "noses"}
    while cond == False :
        if count >= len(attributes):
            print('Error: no attributes in the start')
            print('table : ', attributes)
            attr = get_rand_question()
            break
        url = attributes[count][0] # keeping only the URL and not the cosine similarity score
        if "vocabulary" in url :
            urlType = url.split("vocabulary/")[1].split("/")[0] # parsing the URI to retrieve only what is after the type of the object
            if urlType not in invalid_urlTypes and "odorants" not in url :
                cond = True
                attr = url # returning the valid attribute to ask the first question(s)
        count += 1
    return attr


def get_next_question(current, radius, used_attributes):

    quest = ""
    print('radius', radius)

    most_similar = emb.most_similar(current, topn=30)
    
    # Removing all the attributes that are not in the radius and keeping only qualities
    inside_attr = []
    invalid_urlTypes = {"olfactory-objects", "noses"}
    for el in most_similar:
        url = el[0]
        if "vocabulary/" in url :
            urlType = url.split("vocabulary/")[1].split("/")[0]
                
            # OPTION 1
            if urlType not in invalid_urlTypes and "odorants" not in url:
                if np.linalg.norm(emb.get_vector(url) - current) < radius :
                    inside_attr.append(url)
                else:
                    print('unvalid distance : ', np.linalg.norm(emb.get_vector(url) - current))
                    print('radius : ', radius)
                    break
        else :
            print('Error URI')

    # Deleting all the attributes have been used already
    attributes_left = np.setdiff1d(inside_attr, used_attributes)
    print('inside_attr : ', inside_attr)
    print('used_attr : ', used_attributes)
    print('attr_left : ', attributes_left)

    # Selecting a random attribute between the ones we have left
    quest = "**no_attr_left**"
    if len(attributes_left)!=0:
        quest = np.random.choice(attributes_left)
    return quest


def get_next_position(answer, current_pos, attr_pos):
    next_pos = np.zeros(100)
    # takes current_pos, depending on answer, move closer or further from attr_pos
    match answer:
        case "Yes":
            # Move cursor halfway towards attr_pos
            next_pos = translate_towards(attr_pos, current_pos, 0.5)
        case "Probably yes":
            # Move cursor less than halfway towards attr_pos
            next_pos = translate_towards(attr_pos, current_pos, 0.3)
        case "I don't know":
            # Don't move the cursor
            next_pos = translate_towards(attr_pos, current_pos, 0)
        case "Probably not":
            # Move cursor less than halfway away from attr_pos
            next_pos = translate_towards(attr_pos, current_pos, -0.3)
        case "No":
            # Move cursor halfway away from attr_pos
            next_pos = translate_towards(attr_pos, current_pos, -0.5)

    return next_pos


def getLikelyResultsEmb(session_id, answer):
    session_model = os.path.join(pathModels, session_id + ".json")
    nextQuestion = {}
    with open(session_model) as outfile:
        model = json.load(outfile)
        # load radius from session file
        radius = model["radius"]
        # load current position from session file
        if (model["current_pos"] == 1):
            current_pos = np.zeros(100)
        else:
            current_pos = np.array(model["current_pos"])

        # if we still did not get a "yes" yet
        if answer != "Yes" and radius == 100:
            used_attributes = np.array(
                model["used_attributes"]).tolist()
            attr = get_rand_question()
            current_pos = emb.get_vector(attr)
            # Adding the used attributes in the array "used_attributes"
            list = np.append(used_attributes, str(attr))
            new = {
                "radius": radius,
                "current_pos": current_pos.tolist(),
                "used_attributes": list.tolist()
            }
            with open(os.path.join(pathModels, session_id + ".json"), "w") as jsonFile:
                json.dump(new, jsonFile)
            label = str(get_label(attr)["value"])
            question = formulate_question(attr, label)
            nextQuestion = {"attribute": label, "label": question + "?", "imageSupport": ""}
            most_similar = emb.most_similar(current_pos, topn=10)
            labels = []
            for source in most_similar:
                labels.append({"label": get_label(source[0])["value"]})
            return {"result": False, "sources": labels, "question": nextQuestion}

        while radius > 25:
            # http://data.odeuropa.eu/smell/82dffab9-dd1d-5e27-a3db-ff7f26cd9469
            used_attributes = np.array(
                model["used_attributes"]).tolist()

            attr = get_next_question(current_pos, radius, used_attributes)
            label = str(get_label(attr)["value"])
            question = formulate_question(attr, label) # Expect something like "Can your smell be considered as sweet ?"
            current_pos = get_next_position(
                answer, current_pos, emb.get_vector(attr))
            radius -= 5

            list = np.append(used_attributes, str(attr))
            new = {
                "radius": radius,
                "current_pos": current_pos.tolist(),
                "used_attributes": list.tolist()
            }
            with open(os.path.join(pathModels, session_id + ".json"), "w") as jsonFile:
                json.dump(new, jsonFile)

            nextQuestion = {"attribute": label, "label": question + "?", "imageSupport": ""}

            most_similar = emb.most_similar(current_pos, topn=10)
            labels = []
            for source in most_similar:
                labels.append({"label": get_label(source[0])["value"]})
            return {"result": False, "sources": labels, "question": nextQuestion}
        
        # Finding the 10 most appropriate sources
        most_similar = emb.most_similar(current_pos, topn=500) # The 500 is not optimal but allows to ensure to have 10 final sources.
        sources = []
        for el in most_similar:
            if "vocabulary/" in el[0] :
                urlType = el[0].split("vocabulary/")[1].split("/")[0]
                if urlType == "olfactory-objects" :
                    sources.append(el[0])
            else :
                print('Error URI')
            
        sources = sources[:10]
        labels = []
        for source in sources:
            labels.append({"label": get_label(source)["value"]})
        return {"result": True, "sources": labels}


# distance for yes, -distance for no
def translate_towards(target, initial, distance):
    direction = target - initial
    # direction /= np.linalg.norm(direction)
    translation = distance * direction
    return initial + translation


def get_label(source):
    if source == "**no_attr_left**" :
        return {"value" : source}
    else :
        string = ""
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
            FILTER (lang(?label) = "en")
        }}
        """.format(string)

        try:
            sparql.setQuery(query)

            ret = sparql.queryAndConvert()
            src = ret["results"]["bindings"]
            # print('query answer : ', src[0])
            return src[0]["label"]

        except Exception as e:
            print(e)

def formulate_question(attribute, label):
    quest = ""
    templates = [
        "Can you describe your smell as ",
        "Does your smell make you feel ",
        "Can it be found in ",
        "Do you smell it when you are "
    ]
    if "vocabulary/" in attribute :
        urlType = attribute.split("vocabulary/")[1].split("/")[0]
        match urlType:
            case "plutchik":
                quest = templates[1] + label
            case "fragrant-spaces":
                quest = templates[2] + label
            case "olfactory-gestures":
                quest = templates[3] + label
            case other:
                quest = templates[0] + label
    return quest