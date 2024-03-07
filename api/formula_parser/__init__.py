import re
import numpy as np

from .parser_functions  import expand_sum, expand, subs
from .encode_vitaltable import create_vitaltable

def execute(formula, num_of_waves, filename, out):
    
    formula = formula.replace(' ', '')

    pattern = re.compile('[^a-zA-Z0-9\._]')
    result = pattern.finditer(formula)
    
    splited_formula = []
    p = 0
    for i in result:
            if p!=i.start():
                splited_formula.append(formula[p:i.start()])
            p = i.start()+1
            splited_formula.append(i[0])
            
    splited_formula.append(formula[p:])
    
    splited_formula = [word for word in splited_formula if word]
        
    splited_formula = expand_sum(splited_formula)
    
    wave_list = []
    
    w = np.arange(num_of_waves)+1
    
    if num_of_waves==1:
        y = [0]
        positions = [0]
    else:
        y = np.arange(num_of_waves)/(num_of_waves-1)
        positions = np.floor(y*256)
     
    for i in range(num_of_waves):
        formula = subs(splited_formula,'y', y[i])
        formula = subs(formula,'w', w[i])
        formula = subs(formula,'rand', np.random.rand(2048)-0.5)
   
        wave_list.append(formula)
        
    waves = [expand(i) for i in wave_list]
    
    if type(waves[0])!=np.ndarray:
        print(waves)
    else:
        m = max([np.max(np.abs(i)) for i in waves])
            
        waves = [i/m for i in waves]

        jsonfile = create_vitaltable(positions, waves, filename, out)
        
        waves = [i.tolist() for i in waves if type(i)==np.ndarray]
    return waves, jsonfile
