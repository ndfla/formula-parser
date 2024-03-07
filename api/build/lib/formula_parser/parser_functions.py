from . import functions_and_constants as fc

def getorder(formula):
    
    dic_order = fc.order
    
    omax = max(dic_order.values())
    
    order = [[] for i in range(omax+1)]

    for (ind ,element) in enumerate(formula):
        if (type(element)==str) and (dic_order.get(element)!=None):
            order[omax-dic_order.get(element)] += [ind]
    
    return sum(order,[])


def is_num(s):
    try:
        float(s)
    except ValueError:
        return False
    else:
        return True
    

def convert(variable):
    if type(variable) is str:
        if is_num(variable): return float(variable)
        
        else: return fc.const[variable]
         
    return variable


def subs(formula, variable, number):
    return [number if element==variable else element for element in formula  ]


def index_of_comma(formula):
    nest = 0                   
    comma = []                    
    for i in range(len(formula)):
                            
        if formula[i]=='(': nest+=1
        elif formula[i]==')': nest-=1

        elif (formula[i]==',') and (nest==0):
            comma+=[i]
    
    return comma

def expand_sum(formula):
    p=0
    
    while p<len(formula):
        
        if formula[p]=='sum':
            bracket = 0
            
            for k in range(len(formula[p+1:])):
                
                if formula[p+k+1]=='(': 
                    bracket+=1

                elif formula[p+k+1]==')':
                
                    if bracket==1: 
            
                        inside = formula[p+2:p+1+k]
                        
                        comma = [-1] + index_of_comma(inside) + [len(inside)]
                                
                        section = [inside[comma[i]+1:comma[i+1]] for i in range(4)]
                        
                        first = int(section[2][0])                      
                        last = int(section[3][0])                    
                        variable = section[1][0]
                        
                        expanded = []
                        
                        for n in range(first,last+1):
                            expanded += [str(n) if c==variable else c  
                                           for c in expand_sum(section[0])] + ['+']
                            
                        l = len(expanded)
                                            
                        formula = formula[:p] + ['(']+  expanded[:l-1] + [')'] + formula[p+k+2:] 
                                           
                        p = p+1+l
                        break
                    
                    bracket-=1                
            continue
        
        if p>=len(formula): break       
        p+=1
    
    return formula

def calculate(formula):
    
    comma = [i for (i,value) in enumerate(formula) if (type(value) is str) and (value==',')]
    
    if comma!=[]:
        l = len(comma)
     
        comma = [-1]+comma+[len(formula)]
        
        return [calculate(formula[comma[i]+1:comma[i+1]]) for i in range(l+1)]

    
    order = getorder(formula)
    
    if order==[]: return convert(formula[0])
     
    for i in range(len(order)):
            
        opr_ind = order[i]
         
        # neg
        if  opr_ind==0 and formula[opr_ind]=='-':
            result = -convert(formula[opr_ind+1])
            
            formula = formula[0:opr_ind] +[result] + formula[opr_ind+2:]
            
            order = [index-1 if index>opr_ind else index for index in order ]
            
        else:
            left =  convert(formula[opr_ind-1])
            right = convert(formula[opr_ind+1])
            
            result = fc.operater[formula[opr_ind]](left, right)
        
            formula = formula[0:opr_ind-1] + [result] + formula[opr_ind+2:]
            
            order = [index-2 if index>opr_ind else index for index in order ]

    return formula[0]

def expand(formula):
    p=0
 
    while p<len(formula):
        
        if (formula[p]=='('):
            
            if (p!=0) and (formula[p-1] in fc.func_set):
                function_flag = True
                f = fc.function[formula[p-1]]
            else:
                function_flag = False
                

            bracket = 1
            
            for k in range(len(formula[p+1:])):
                
                
                if formula[p+k+1]=='(': 
                    bracket+=1

                elif formula[p+k+1]==')':
                
                    if bracket==1: 
            
                        result = expand(formula[p+1:p+1+k])
                        
                        if function_flag:
                            formula = formula[:p-1] + [f(result)] + formula[p+k+2:]
                        else:
                            formula = formula[:p] + [result] + formula[p+k+2:]
                                               
                        p = p+1
  
                        break
                    
                    bracket-=1                    
            continue
        
        if p>=len(formula): break
            
        p+=1  
    return calculate(formula)
                 
                 
expand(["1","+","3","*","5"])