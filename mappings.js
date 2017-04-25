const tranformers = require('./transformers');


const makeMappings = {
  'audi': 0
};

const fuelMappings = {
  'd': 0,
  'p': 1,
  'c': 2
};

const colourMappings = {
  'blue': 0,
  'red': 1,
  'green': 2,
  'pink': 3
};

const MAPPINGS = {
  'Price': new tranformers.numericTransformer(0, 100000),
  'Make': new tranformers.stringTransformer(0, makeMappings),
  'Age': new tranformers.numericTransformer(0, 20),
  'Mileage': new tranformers.numericTransformer(0, 400000),
  'Fuel': new tranformers.stringTransformer(0, fuelMappings),
  'Colour': new tranformers.stringTransformer(0, colourMappings)
}


module.exports = MAPPINGS;