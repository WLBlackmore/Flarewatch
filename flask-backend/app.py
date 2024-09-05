from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return jsonify({'message': 'Welcome to the Wildfire Dashboard API'})

if __name__ == '__main__':
    app.run(debug=True)