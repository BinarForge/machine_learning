const synaptic = require('synaptic');
const read = require('read-file');

const Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;


function numericTransformer(min, max){
  const len = (max-min);

  return {
    to: function(value){
      if(len === 0)
        return 0;

      return (min/len + value/len);
    },
    from: function(value){
      return min*value + len*value;
    }
  }
}

function stringTransformer(min, mappings){
  const max = Object.keys(mappings).length;
  const len = (max-min);

  return {
    to: function(value){
      value = mappings[value.toLowerCase()];
      if(value === 0)
        return 0;

      return (min/len + value/len);
    },
    from: function(value){
      return min*value + len*value;
    }
  }
}

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
  'Price': new numericTransformer(0, 100000),
  'Make': new stringTransformer(0, makeMappings),
  'Age': new numericTransformer(0, 20),
  'Mileage': new numericTransformer(0, 400000),
  'Fuel': new stringTransformer(0, fuelMappings),
  'Colour': new stringTransformer(0, colourMappings)
}

let data = read.sync('car-prices-mock.csv', {encoding: 'utf8'});


data = data.split('\r\n');

const headers = data[0].split(',');
data.shift();


let training = [];

for(let r=0; r<data.length; r++){
  let dataRow = data[r].split(',');
  let trainingSet = [];

  for(let c=1; c<headers.length; c++){
    let columnName = headers[c];

    let mappedValue = MAPPINGS[columnName].to(dataRow[c]);
    
    trainingSet.push( mappedValue );
  }

  training.push({input: trainingSet, output: [MAPPINGS['Price'].to(parseFloat(dataRow[0]))]});
}

let network = new Architect.Perceptron(5, 3, 2, 1);
let trainer = new Trainer(network);

trainer.train(training, {
	rate: .25,
	iterations: 20000,
	error: .005,
	shuffle: true,
	log: 20000,
	cost: Trainer.cost.CROSS_ENTROPY
});



// = actual evaluation

let input = process.argv;
input.shift();
input.shift();

if(input.length < Object.keys(MAPPINGS).length - 1)
  throw('Not enough parameters!');


for(i=1; i<headers.length; i++){  
  let columnName = headers[i];
   input[i-1] = MAPPINGS[columnName].to(input[i-1]);
}

let result = network.activate(input);
result = MAPPINGS['Price'].from(result);

console.log('');
console.log('Your car is worth £' + parseInt(result));

// = end of actual evaluation