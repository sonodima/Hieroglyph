//
//  main.js
//  Hieroglyph
//
//  Written with love by sonodima
//


const FortniteAPI = require("fortnite-api-io");
const fortnite = new FortniteAPI("" /* Change this with your FortniteAPI key */);
const prompt = require('prompt-sync')();


var input_name = "";
var output_names = [ ];
var combination = [ ];


// Map from letters to greek letters
const character_map = {
    A: 'Α',
    B: 'Β',
    C: 'Ϲ',
    E: 'Ε',
    H: 'Η',
    I: 'Ι',
    K: 'Κ',
    M: 'Μ',
    N: 'Ν',
    O: 'Ο',
    P: 'Ρ',
    T: 'Τ',
    X: 'Χ',
    Y: 'Υ',
    Z: 'Ζ',

    a: 'α',
    o: 'ο',
    p: 'ρ',
    u: 'υ',
    v: 'ν',
};


function decimal_to_binary(decimal) {
    return (decimal >>> 0).toString(2);
}

function count_replaceable_letters(string) {
    var count = 0;

    string.split('').forEach(letter => {
        if (character_map[letter] !== undefined) count += 1;
    });

    return count;
}

function replace_letters(string) {
    var name = '';
    var i = 0;
    
    string.split('').forEach(letter => {
        if (character_map[letter] !== undefined) {
            if (combination[i]) name += character_map[letter];
            else name += letter;
            i++;
        } else name += letter;
    });

    return name;
}


console.log('Hieroglyph - Fortnite Name Generator\n')
input_name = prompt('Name > ');

// Count the amount of combinations possible and set the combination to all zeros
for (let i = 0; i < count_replaceable_letters(input_name); i++) {
    combination.push(0);
}

// Iterate each combination of character swap
for (let i = 0; i < Math.pow(2, combination.length); i++) {
    // Set the new combination
    const combination_binary = decimal_to_binary(i);
    for (let c = 0; c < combination_binary.length; c++) {
        combination[c] = combination_binary[c] * 1;
    }

    output_names.push(replace_letters(input_name));
}

console.log('\nAvailable Names:');

// Iterate each generated name
var name_count = 0;
output_names.forEach(name => {
    // Search if the username is already taken
    fortnite.getAccountIdByUsername(encodeURI(name), true, true)
    .then((res) => {
        if (res.result != true) {
            name_count += 1;
            console.log('[' + name_count + '] ' + name);
        }
    }).catch((err)=> {
        console.log(err)
    });
});