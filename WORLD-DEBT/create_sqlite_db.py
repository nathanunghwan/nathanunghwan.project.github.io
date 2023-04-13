import csv
import sqlite3

#open the csv file
with open('imf_data.csv', 'r') as imfDataFile:
    # create the object of csv.reader()
    csv_file_reader = csv.reader(imfDataFile,delimiter=',')

    #skip the header
    next(csv_file_reader,None)

    #create the fields in the csv file
    id = ''
    country = ''
    gdp=''
    year=''
    
    #create table query
    create_table_query = '''CREATE TABLE if not Exists imf_data 
    (country TEXT, year TEXT, gdp TEXT)'''

    #create sqlite database
    connection=sqlite3.connect('sqlite2.db')
    cursor=connection.cursor()

    #execute query to create imf_data table
    cursor.execute(create_table_query)

    #pass data from csv
    for row in csv_file_reader:
        # skip the first row
        x=5
        y=2
        for i in range(len(row)):
            # assign each field its value
            id = row[0]
            country = row[1]
            if(i>1):
                gdp = row[y]
                y=y+1
            #save specific year
                year = 2000 + x
                x = x+1

                #insert query 
                InsertQuery=f"INSERT INTO imf_data VALUES ('{country}','{year}','{gdp}')"
                #execute insert query
                cursor.execute(InsertQuery)

    connection.commit()
    #close connection
    connection.close()