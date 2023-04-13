from flask import Flask, render_template, request
import pandas as pd
import json
import plotly
import plotly.express as px
import sqlite3

app = Flask(__name__)

@app.route('/callback', methods=['POST', 'GET'])
def cb():
    return getCountryGDP(request.args.get('data'))

@app.route('/')
def root():
    return render_template('home.html', graphJSON=getCountryGDP(), data=getPieChartData())

def getCountryGDP(country='United States'):
    #connect and read from sqlite db
    conn = sqlite3.connect('sqlite2.db')
    query = "SELECT * FROM imf_data"
    df = pd.read_sql_query(query , conn)
    fig = px.line(df
    [df ['country'] == country],
    x='year',
    y='gdp'
    ).update_layout(
    xaxis_title="Year", yaxis_title="Percent of GDP")

    graphJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    return graphJson

def getPieChartData(year="2021"):
    #connect and read from sqlite db
    conn = sqlite3.connect('sqlite.db')
    query = "SELECT * FROM imf_data WHERE year=" + year
    df = pd.read_sql_query(query , conn)
    data={}
    for index, row in df.iterrows():
        if(row['gdp'] == "no data"):
            data[row['country']] = ""
        else:
            data[row['country']] = float(row['gdp'])
        json_dump = json.dumps(data)
    return data



