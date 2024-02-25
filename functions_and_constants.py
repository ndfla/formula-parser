import numpy as np
import operator


def case(args):
    return args[0]*args[1] + np.logical_not(args[0])*args[2]
    
def avg(args):
    return sum(args)/len(args)

func_set = {'sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','exp', 'log','log2','sign','abs','avg','case'}

function = {
    'sin':np.sin,
    'cos':np.cos,
    'tan':np.tan,
    'asin':np.arcsin,
    'acos':np.arccos,
    'atan':np.arctan,
    'sinh':np.sinh,
    'cosh':np.cosh,
    'tanh':np.tanh,
    'exp':np.exp, 
    'log':np.log,
    'log2':np.log2,
    'sign':np.sign,
    'abs':np.abs,
    'avg':avg,
    'case':case
}

operater = {
    '-': operator.sub,
    '+': operator.add,
    '*': operator.mul,
    '/': operator.truediv,
    '^': operator.pow,
    '>': operator.gt,
    '<': operator.lt,
}

const = {
    'pi': np.pi,
    'e': np.e,
    'x': np.arange(2048)/2048
}