const synaptic = require('synaptic');
const read = require('read-file');

const mappings = require('./mappings');

const Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;



// = training using 'real' data transformed into Neural Network friendly values

let data = read.sync('car-prices-mock.csv', {encoding: 'utf8'});
data = data.split('\r\n');

const headers = data.shift().split(',');
let training = [];

for(let r=0; r<data.length; r++){
  let dataRow = data[r].split(',');
  let trainingSet = [];

  for(let c=1; c<headers.length; c++){
    let columnName = headers[c];

    let mappedValue = mappings[columnName].toPercentage(dataRow[c]);
    
    trainingSet.push( mappedValue );
  }

  training.push({input: trainingSet, output: [mappings['Price'].toPercentage(parseFloat(dataRow[0]))]});
}

// = end of training using 'real' data transformed into Neural Network friendly values

// = machine learning using synaptic

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

// = end of machine learning using synaptic

// = actual evaluation

let input = process.argv;
input.shift(); // remove process name from the list

if(input.length < Object.keys(mappings).length - 1)
  throw('Not enough parameters to match the data!');


for(i=1; i<headers.length; i++){  
  let columnName = headers[i];
  input[i] = mappings[columnName].toPercentage(input[i]);
}

input.shift(); // get rid off remaining command line argument

let result = network.activate(input);
result = mappings['Price'].fromPercentage(result);

console.log('');
console.log('Your car is worth £' + parseInt(result));

// = end of actual evaluation