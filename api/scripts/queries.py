mainQuery = """
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
select DISTINCT  ?source ?type ?word ?label  ?word_label (COUNT(DISTINCT ?emission) as ?count)
FROM <http://www.ontotext.com/disable-sameAs>
 where {
	?emission od:F3_had_source / crm:P137_exemplifies ?source ;
                      od:F1_generated ?smell .
    ?assignment crm:P140_assigned_attribute_to ?smell ;
                crm:P2_has_type ?type ;
                crm:P141_assigned ?word .
    ?word skos:prefLabel ?word_label
    FILTER (lang(?word_label) = "en")
    ?source skos:prefLabel ?label
    FILTER (lang(?label) = "en")
} GROUP BY ?source ?type ?word ?word_label ?label


    """


getCountsQuery = """
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

# What smell sources have the highest number of documentation in the past?

SELECT DISTINCT ?source ?label (COUNT(DISTINCT ?experience) as ?count)
FROM <http://www.ontotext.com/disable-sameAs>
WHERE {
  ?emission od:F3_had_source / crm:P137_exemplifies ?source;
            od:F1_generated ?smell .

  ?experience od:F2_perceived ?smell.
  ?source skos:prefLabel ?label
  FILTER (lang(?label) = 'en')
}
GROUP BY ?source ?label
ORDER BY DESC(COUNT(DISTINCT ?experience))

"""

questionsDataQuery = """
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
select  DISTINCT ?word  ?word_label 
FROM <http://www.ontotext.com/disable-sameAs>

WHERE {
	?emission od:F3_had_source / crm:P137_exemplifies ?source ;
                      od:F1_generated ?smell .
    ?assignment crm:P140_assigned_attribute_to ?smell ;
                crm:P2_has_type ?type ;
                crm:P141_assigned ?word .
    ?word skos:prefLabel ?word_label
    FILTER (lang(?word_label) = "en")
    ?source skos:prefLabel ?label
    FILTER (lang(?label) = "en")
} GROUP BY ?source ?type ?word ?word_label ?label


"""

locationsDataQuery = """
PREFIX od: <http://data.odeuropa.eu/ontology/>
PREFIX crm: <http://erlangen-crm.org/current/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
select DISTINCT ?source ?place ?label (COUNT(DISTINCT ?emission) as ?count) 
FROM <http://www.ontotext.com/disable-sameAs>

WHERE { 
	?emission od:F3_had_source / crm:P137_exemplifies ?source ;
                         crm:P7_took_place_at / crm:P137_exemplifies ?place .
    
    ?place skos:prefLabel ?label
    FILTER (lang(?label) = "en")
} GROUP BY ?source ?place ?label

"""
