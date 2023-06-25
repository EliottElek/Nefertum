FROM python:3.12.0a4-bullseye
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install numpy --upgrade
COPY . /code/app
CMD python app/matrixes/clearMatrixes.py && python app/scripts/fetcher.py && python app/scripts/addCountsLabels.py && python app/scripts/generateAttributesQuestions.py
CMD env FLASK_APP=app/app.py
CMD cd code
CMD cd app
CMD ["env","FLASK_APP=app/app.py", "flask", "run", "-h", "0.0.0.0", "-p", "5000"]
