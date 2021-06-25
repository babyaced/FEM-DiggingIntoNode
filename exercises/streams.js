#!/usr/bin/env node

"use strict";

var util = require("util");
var fs = require("fs");
var path = require("path");

var getStdin = require("get-stdin")

var args = require("minimist")(process.argv.slice(2),{
    boolean: ["help", "in"],
    string: ["file"]
});

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

if(args.help){
    printHelp();
}
else if (
    args.in ||
    args._.includes("-")
    ){
    //TODO: handle stdin
    getStdin().then(processFile).catch(error);
}
else if(args.file){
    fs.readFile(path.join(BASE_PATH, args.file),function onContents(err, contents){
        if(err){
            error(err.toString());
        }
        else{
            processFile(contents.toString());
        }
    });
}
else{
    error("Incorrect usage.", true)
}

// My first Node.js program
// process.stdout.write("Hello world")
// process.stdin.read()
// console.log("Hello world")

// //process.stderr.write("Oops")
// console.error("Oops")

//***************************

function processFile(contents){
    contents = contents.toUpperCase();
    process.stdout.write(contents)
}

function error(msg, includeHelp=false){
    console.error(msg);
    if(includeHelp){
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex1 usage:")
    console.log(" ex1.js --file={FILENAME}");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={filename}  process the file");
    console.log("--in, -            process stdin");
    console.log("");
}



