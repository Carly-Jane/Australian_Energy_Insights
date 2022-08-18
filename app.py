from flask import Flask, render_template, jsonify

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo
from pymongo import MongoClient
import json

from bson.json_util import ObjectId

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(MyEncoder, self).default(obj)

# Create an instance of our Flask app.
app = Flask(__name__)
app.json_encoder = MyEncoder

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.energy_db

# Set route
@app.route('/aus_income')
def index_income():
    # Store the each collection in a list
    aus_income = db.Aus_Income.find()
    
    list_cur = list(aus_income)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/aus_population')
def index_population():
    # Store the each collection in a list
    aus_population = db.Aus_Population.find()
    
    list_cur = list(aus_population)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/energy_production_per_capita')
def index_per_capita():
    # Store the each collection in a list
    energy_production_per_capita = db.Energy_Production_Per_Capita.find()
    
    list_cur = list(energy_production_per_capita)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/energy_production')
def index_energy_production():
    # Store the each collection in a list
    energy_production = db.Energy_Progression.find()
    
    list_cur = list(energy_production)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/income_renewable_energy')
def index_renewable_energy():
    # Store the each collection in a list
    income_renewable_energy = db.Income_Renewable_Energy.find()    
    
    list_cur = list(income_renewable_energy)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/fourteen_fifteen')
def index_four_five():
    # Store the each collection in a list
    fourteen_fifteen = db.Fourteen_Fifteen_Energy_Production.find()
    
    list_cur = list(fourteen_fifteen)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/seventeen_eighteen')
def index_seven_eight():
    # Store the each collection in a list
    seventeen_eighteen = db.Seventeen_Eighteen_Energy_Production.find()
    
    list_cur = list(seventeen_eighteen)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/twenty_twentyone')
def index_tw_two():
    # Store the each collection in a list
    twenty_twentyone = db.Twenty_Twentyone_Energy_Production.find()
    
    list_cur = list(twenty_twentyone)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)

# Set route
@app.route('/population_renewable_energy')
def index_pop_renewable_energy():
    # Store the each collection in a list
    population_renewable_energy = db.Population_Renewable_Energy.find()
    
    list_cur = list(population_renewable_energy)
    
    # Return the template with the teams list passed in
    return jsonify(list_cur)


if __name__ == "__main__":
    app.run(debug=True)
