module.exports = {
    numericTransformer: function(min, max){
        const len = (max-min);

        return {
            toPercentage: function(value){
                if(len === 0)
                    return 0;

                return (min + value)/len;
            },
            fromPercentage: function(value){
                return (min + len)*value;
            }
        }
    },
    stringTransformer: function(min, mappings){
        const max = Object.keys(mappings).length;
        const len = (max-min);

        return {
            toPercentage: function(value){
                value = mappings[value.toLowerCase()];
                if(value === 0)
                    return 0;

                return (min + value)/len;
            },
            fromPercentage: function(value){
                return (min + len)*value;
            }
        }
    }
}