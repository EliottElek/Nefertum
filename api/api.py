from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@cross_origin()
@app.route('/')
def index():
    return 'Index Page'


@app.route('/hello')
def hello():
    return 'Hello, greetings from different endpoint'

# adding variables


@app.route('/user/<username>')
def show_user(username):
    # returns the username
    return 'Username: %s' % username


@app.route('/post/<int:post_id>')
def show_post(post_id):
    # returns the post, the post_id should be an int
    return str(post_id)


@app.route('/login/<email>', methods=['GET', 'POST'])
def login(email):
    if request.method == 'POST':
        # check user details from db
        return {"name": "Eliott", "email": email}
    elif request.method == 'GET':
        # serve login page
        return {"name": "Eliott", "email": email}
