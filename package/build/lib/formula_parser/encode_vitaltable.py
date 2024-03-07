import json
import os
import struct

dir = os.path.dirname(__file__)

with open( os.path.join(dir,"base64_table.json") ) as f:
    table = json.load(f)  
inv_table = {v:k for k,v in table.items()}


def vitalwave_to_float(wave_data):

    bit_data = [ inv_table[i] for i in wave_data if i!='=']
    
    bit_string = ''.join(bit_data)[0:2**16]
    
    byte_float  = [ int(bit_string[i*32:(i+1)*32],2).to_bytes(4,'big') for i in range(len(bit_string)//32) ]

    data_iter = struct.iter_unpack('<f', b''.join(byte_float))
    
    return [i[0] for i in data_iter]


def float_to_vitalwave(float_data):
    
    byte_float = [ struct.pack('<f', i) for i in float_data]
    
    bit_float = [ bin(byte)[2:]  for bytes in byte_float for byte in bytes ]
    
    bit_float = ['0'*(8-len(i)) + i  for i in bit_float  ]
    
    bit_string = ''.join(bit_float)
     
    bit_string += '0'*(6 - len(bit_float)%6)
    
    base64_data = [table[bit_string[6*i:6*(i+1)]] for i in range(len(bit_string)//6)]
    
    base64_data += '='*(4 - len(base64_data)%4)
    
    return ''.join(base64_data)


def create_keyframe(position, float_wave):
    
    keyframe_list = [ {"position":position[i], "wave_data":float_to_vitalwave(float_wave[i])} 
                     for i in range(len(position))]
    
    return keyframe_list

    
def create_vitaltable(position, float_wave, filename, out):
    
    js = {"author":"",
        "full_normalize":True,
        "groups":[{"components":
            [{"interpolation":1,
                "interpolation_style":1,
                "keyframes": create_keyframe(position, float_wave),
                
                "type":"Wave Source"}]}], 
        "name":"Init",
        "remove_all_dc":True,
        "version":"1.0.7"}
    
    # save_file_at_dir(out, filename + '.vitaltable', json.dumps(js))
    
    return json.dumps(js)


def save_file_at_dir(dir_path, filename, file_content, mode='w'):
    os.makedirs(dir_path, exist_ok=True)
    with open(os.path.join(dir_path, filename), mode) as f:
        f.write(file_content)

