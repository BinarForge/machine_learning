module.exports = {
    numericTransformer: function(min, max){
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
    },
    stringTransformer: function(min, mappings){
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
}