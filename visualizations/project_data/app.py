# import dependencies
from flask import Flask, render_template, redirect, jsonify
import pandas as pd
import csv
import sqlite3
from sqlalchemy import create_engine


app = Flask(__name__)


# create home route
@app.route('/')
def home():
    return render_template("index.html")


# create api route
@app.route("/api/route")
def route():
    # Path to SQLite file
    database_path = "csv_data/imf.sqlite"

    # Creating the SQL database
    engine = create_engine(f"sqlite:///{database_path}")

    # Establisting a connection to our database
    conn = engine.connect()

    imf_df = pd.read_sql('SELECT * FROM imf_data', conn)

    response = [row.to_dict() for _, row in imf_df.iterrows()]


    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
