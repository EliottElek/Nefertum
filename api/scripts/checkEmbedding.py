import os
from gensim.models import KeyedVectors
from SPARQLWrapper import SPARQLWrapper, JSON


sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa", "sameAs=false"
)
sparql.setReturnFormat(JSON)


def makeRequest(sources, sourcesOnly):
    string = ""

    for attr in sources:
        string = string + "<" + attr[0]+">"
    string = string.replace("\n", " ")  # Remove any newline characters
    query = """
    PREFIX od: <http://data.odeuropa.eu/ontology/>
    PREFIX crm: <http://erlangen-crm.org/current/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT DISTINCT ?source ?source
    FROM <http://www.ontotext.com/disable-sameAs>
    WHERE {{
	    VALUES ?source {{ {0} }}
        ?source skos:prefsource ?source
        FILTER (lang(?source) = "en")
    }}
    GROUP BY ?source ?source
    """.format(string)

    try:
        sparql.setQuery(query)

        ret = sparql.queryAndConvert()
        srcs = ret["results"]["bindings"]

        output_obj = []

        for src in srcs:
            url = src["source"]["value"]
            source = src["source"]["value"]

            ratio = [r[1]
                     for r in sources if r[0] == url][0]
            if (sourcesOnly != True):
                output_obj.append(
                    {"source": url, "source": source, "ratio": ratio})
            else:
                output_obj.append(source)
        return {"sources": output_obj}

    except Exception as e:
        print(e)
        return {"data": {"error": "an error occured."}}


def getAssociatedSources(source_id, topn, sourcesOnly):
    path = os.path.join("./", "data")
    emb_path = os.path.join(path, 'voc_emb.kv')

    emb = KeyedVectors.load(emb_path)
    # print(emb)
    list = emb.most_similar(source_id, topn=topn)
    # list = emb.most_similar(
    #     source_id, topn=topn)  # flower
    # print(topn)
    print(list)

    return makeRequest(list, sourcesOnly)

# Define a function to get the object with the highest ratio for a given source


def get_object_with_highest_ratio(source, objects):
    objects_with_source = [obj for obj in objects if obj["source"] == source]
    if len(objects_with_source) == 0:
        return None
    else:
        return max(objects_with_source, key=lambda obj: obj["ratio"])
