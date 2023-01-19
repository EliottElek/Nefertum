FROM python:3.12.0a4-bullseye
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip3 install numpy --upgrade
COPY . /code/app
CMD python3 app/matrixes/clearMatrixes.py && python3 app/scripts/fetcher.py && python3 app/scripts/addCountsLabels.py && python3 app/scripts/generateAttributesQuestions.py
CMD env FLASK_APP=app/app.py
CMD ["env","FLASK_APP=app/app.py", "flask", "run", "-h", "0.0.0.0", "-p", "5000"]
