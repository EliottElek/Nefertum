# Python server

to run the server, make sure you have python installed and that you are in the same folder as `app.py`.

Then run : 

```
flask run
```

Steps to generate matrix : 

```bash
cd scrips
python3 fetcher.py
python3 addCounts.py
```

Steps to generate questions : 

```bash
cd scrips
python3 generateAttributesQuestions.py
python3 generatePlacesQuestions.py
```