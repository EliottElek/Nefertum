FROM python:latest
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY . /code/app
CMD ["python", "./matrixes/clearMatrixes.py", "&&", "python", "./scripts/fetcher.py","&&", "python", "./scripts/addCountsLabels.py",,"&&", "python","./scripts/generateAttributesQuestions.py","&&","flask run"]
