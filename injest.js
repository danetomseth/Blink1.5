'use strict'
// injests texts to build a dictionary model

const fs = require('fs');
const source = "input.txt"; // where is this coming from. Used only for initial injestion
const store = "/dict/"; // folder where are we storing this

const clean = (text) => {
    let data = text.toLowerCase() // normalize to lower case
    data = data.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");  // remove all punctuation from the text
    return data.split(" ") // turn it into an array
}

const checkWord = (word, nextWord) =>{
    let wordModel = fs.readFileSync(store+word+".json") || {} // either we read an existing file, ore we create an object to write. Sync for ease
    console.log("wordModel before", wordModel);
    if (!wordModel[word]) { // if our wordModel doesn't have the word in it for some reason
        wordModel[word] = {f:1, n: {}}; // put the word in there, give it a frequency of 1 and an empty sub-dict
    } else {
        wordModel[word].f++; // if we do have the word, increase the number of times we found it
        if(!wordModel[word].n[nextWord]) { // if we haven't yet seen the word that comes after this one
            wordModel[word].n[nextWord] = {f: 1}; // create the word in the subdict with a frequency of one
        } else {
            wordModel[word].n[nextWord].f++; // if we have seen it before, increment the frequency
        }
    }
    console.log("wordModel after", wordModel);
}

const injest = (text) => {
    console.log("injesting");
    let data = clean(text);
    console.log(data.length, "words");
    for (let i in data) {
        let word = data[i]; // the word we're looking at
        let nextWord = data[i+1]; // the next word (which is the word this came after)
        let wordModel = checkWord(word, nextWord);
        fs.writeFileSync(store+word+".json", wordModel);
    }
    console.log("done injesting");
}

injest(source);
