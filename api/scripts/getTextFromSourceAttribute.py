import json
from SPARQLWrapper import SPARQLWrapper, JSON


sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa", "sameAs=false"
)
sparql.setReturnFormat(JSON)


def getTextFromSourceAttribute(source, attributes):
    string = ""
    for attr in attributes:
        string = string + "<" + attr["id"]+">"
    # source = "http://data.odeuropa.eu/vocabulary/olfactory-objects/408"
    # attribute = "http://data.odeuropa.eu/vocabulary/edwards/aromatic"
    query = """
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <https://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?text ?author ?title ?date WHERE {{
    VALUES ?smell_source {{ <{0}> }}
    VALUES ?quality {{ {1} }} 
    
	?emission od:F3_had_source / crm:P137_exemplifies ?smell_source ; 
    	od:F1_generated ?smell . 
    ?assignment crm:P140_assigned_attribute_to ?smell ; 
                crm:P141_assigned ?quality.
    
    ?textual_res crm:P67_refers_to ?smell ;
                 rdf:value ?text.
    ?book crm:P67_refers_to ?smell ;
          schema:author / rdfs:label ?author ;
          rdfs:label ?title ;
          schema:dateCreated / rdfs:label ?date .
    FILTER (lang(?text) = 'en')
}} limit 15
""".format(source, string).replace("\n", "")
    print(string)

    try:
        sparql.setQuery(query)

        ret = sparql.queryAndConvert()
        texts = ret["results"]["bindings"]

        return {"texts": texts,  "attributes": attributes}

    except Exception as e:
        print(e)
        return {"data": {"error": "an error occured."}}
