import functions_and_constants as fc

def getpriority(formula):
    dicpriority = {'^':3,'*':2,'/':2,'+':1,'-':1, '>':0, '<':0}
    
    pmax = max(dicpriority.values())
    
    opr_priority = [dicpriority.get(element) if type(element) == str else None for element in formula]
    
    return  [index for p in range(pmax+1)
                        for index in range(len(opr_priority)) 
                            if opr_priority[index]==(pmax-p) ]

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

def split_list(sign, formula):

    nest = 0
    index = []
    
    for i in range(len(formula)):
        if type(formula[i])!=str: continue
        
        if formula[i]=='(': nest+=1
        if formula[i]==')': nest-=1
        
        if nest==0 and formula[i]==sign:
            index.append(i)
            
    sign_index = [-1] + index + [len(formula)]

    return [formula[sign_index[i]+1:sign_index[i+1]] for i in range(len(sign_index)-1)]

def expand_sum(formula):

    if 'sum' in formula:
        
        position = 0
        nest = 0
        bracket = [0,len(formula)]
        
        flag = False
        
        while position < len(formula):
        
            if formula[position]=='(':     
                nest+=1
                if nest==1:
                    bracket[0] = position + 1
                    if (position-1)>-1 and formula[position-1]=='sum':
                        flag = True
                            
            if formula[position]==')':
                if  nest==1: 
                    
                    bracket[1] = position
                    
                    inside = formula[bracket[0]: bracket[1]]
                    
                    #Process inside parentheses
                    
                    if flag==False:
                    
                        formula = formula[0:bracket[0]] + expand_sum(inside) + formula[bracket[1]:]
                       
                     
                    if flag==True:
                        
                        sum_args = split_list(',', inside)
                        
                        variable = sum_args[1][0]
                        
                        term = expand_sum(sum_args[0])
                        
                        sum_of_formula = []
                        
                        
                        for i in range(int(sum_args[2][0]), int(sum_args[3][0])+1):
                            sum_of_formula += subs(term, variable, i) + ['+']
                                
                        sum_of_formula = ['('] + sum_of_formula[0:len(sum_of_formula)-1] + [')']
                    

                        formula = formula[0:bracket[0]-2] + sum_of_formula + formula[bracket[1]+1:]
                            
                        position = (bracket[0]-2) + len(sum_of_formula) -1
                        
                            
                        flag=False
                    
                nest -= 1
            position+=1
            
    return formula


def calculate(formula):
    
    comma = [i for i in range(len(formula)) if (type(formula[i]) is str) and (formula[i]==',')]
    
    
    if comma!=[]:
        l = len(comma)
     
        comma = [-1]+comma+[len(formula)]
        
        return [calculate(formula[comma[i]+1:comma[i+1]]) for i in range(l+1)]

    
    priority = getpriority(formula)
    
    if len(priority)==0: return convert(formula[0])
     
    for i in range(len(priority)):
        
        opr_ind = priority[i]
        
        # neg
        if  opr_ind==0 and formula[opr_ind]=='-':
            result = -convert(formula[opr_ind+1])
            
            formula = formula[0:opr_ind] +[result] + formula[opr_ind+2:]
            
            priority = [index-1 if index>opr_ind else index for index in priority ]
            
        else:
            left =  convert(formula[opr_ind-1])
            right = convert(formula[opr_ind+1])
            
            result = fc.operater[formula[opr_ind]](left, right)
        
            formula = formula[0:opr_ind-1] +[result] + formula[opr_ind+2:]
            
            priority = [index-2 if index>opr_ind else index for index in priority ]

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

