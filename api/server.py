from flask import Flask, render_template, request, jsonify,url_for

from formula_parser import execute

import json
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))

static_path = os.path.join(parent_dir, "static")

app = Flask(__name__, static_folder=static_path)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(static_path, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_script', methods=['POST'])
def run_script():
    
    data = request.get_data()
    
    pydata = json.loads(data.decode('utf-8'))['values']
    
    wavefloat, jsonfile = execute(pydata[0], int(pydata[1]), 'test_wave', 'vitaltable')
    
    return jsonify({'result': wavefloat, "wavetable": jsonfile})
    

if __name__ == '__main__':
    app.run(debug=True)
    
    