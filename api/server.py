from flask import Flask, render_template, request, jsonify,url_for

import sys

sys.path.append('api/util')

import main
import json
import os

app = Flask(__name__)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                 endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_script', methods=['POST'])
def run_script():
    
    data = request.get_data()
    
    pydata = json.loads(data.decode('utf-8'))['values']
    
    wavefloat, jsonfile = main.execute(pydata[0], int(pydata[1]), 'test_wave', 'vitaltable')
    
    return jsonify({'result': wavefloat, "wavetable": jsonfile})
    

if __name__ == '__main__':
    app.run(debug=True)
    