import json
from SPARQLWrapper import SPARQLWrapper, JSON
from attr import attr, attributes


sparql = SPARQLWrapper(
    "https://data.odeuropa.eu/repositories/odeuropa", "sameAs=false"
)
sparql.setReturnFormat(JSON)


def getTextFromSourceAttribute(source, attribute1, attribute2):
    # source = "http://data.odeuropa.eu/vocabulary/olfactory-objects/408"
    # attribute = "http://data.odeuropa.eu/vocabulary/edwards/aromatic"
    query = """
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?text WHERE {{
    VALUES ?smell_source {{ <{0}> }}
    VALUES ?quality {{ <{1}> <{2}> }} 
    
	?emission od:F3_had_source / crm:P137_exemplifies ?smell_source ; 
    	od:F1_generated ?smell . 
    ?assignment crm:P140_assigned_attribute_to ?smell ; 
                crm:P141_assigned ?quality.
    
    ?textual_res crm:P67_refers_to ?smell ;
                 rdf:value ?text.
    FILTER (lang(?text) = 'en')
}} limit 3
""".format(source, attribute1, attribute2).replace("\n", "")
    print(query)

    try:
        sparql.setQuery(query)

        ret = sparql.queryAndConvert()
        texts = ret["results"]["bindings"]
        results = []
        for text in texts:
            results.append(text["text"])

        return {"data": results}

    except Exception as e:
        print(e)
        return {"data": {"error": "an error occured."}}
