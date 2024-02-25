import numpy as np
import plotly.graph_objects as go

def createfigure(num_of_waves, wave_float):
    fig = go.Figure()
    
    fig.update_layout(
    xaxis = dict(tickmode = 'array', 
                tickvals = [0, 512, 1023], ticktext = [0,1024,2048]),
    yaxis = dict(tickmode = 'linear', tick0=-1, dtick = 0.5, range=[-1,1])
    )
    
    # Add traces, one for each slider step
    for step in np.arange(num_of_waves):
        fig.add_trace(
            go.Scatter(
                visible=False,
                line=dict(color="#00CED1", width=3),
                name="wave: "+str(step),
                x=np.arange(0,1024),
                y=wave_float[step][0::2])
        )   
    fig.data[0].visible = True
    
    # Create and add slider
    steps = []
    for i in range(len(fig.data)):
        step = dict(
            method="update",
            args=[{"visible": [False]*len(fig.data)}],  # layout attribute
            label = i+1
        )
        step["args"][0]["visible"][i] = True  # Toggle i'th trace to "visible"
        steps.append(step)

    sliders = [dict(
        active=0,
        currentvalue={"prefix": "wave: "},
        pad={"t": num_of_waves},
        steps=steps
    )]

    fig.update_layout(
        sliders=sliders
    )
    
    fig.show()
