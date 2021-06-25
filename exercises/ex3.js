#!/usr/bin/env node

"use strict";

var util = require("util");
var fs = require("fs");
var path = require("path");

var Transform = require("stream").Transform;
var zlib = require("zlib")

var CAF = require("caf")



// var getStdin = require("get-stdin")

var args = require("minimist")(process.argv.slice(2),{
    boolean: ["help", "in", "out", "compress", "uncompress"],
    string: ["file"]
});

processFile = CAF(processFile)

function streamComplete(stream){
    return new Promise(function c(res){
        stream.on("end", res);
    });
}

var BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

var OUTFILE = path.join(BASE_PATH, "out.txt");

if(args.help){
    printHelp();
}
else if (
    args.in ||
    args._.includes("-")
    ){
    //TODO: handle stdin
    let tooLong = CAF.timeout(20, "Took to long!");
    processFile(tooLong,process.stdin)
    .catch(error);
}
else if(args.file){
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file))

    let tooLong = CAF.timeout(20, "Took too long!");

    processFile(tooLong,stream)
    .then(function(){
        console.log("Complete!");
    })
    .catch(error);
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

function *processFile(signal,inStream){
    var outStream = inStream

    if(args.uncompress){
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }

    var upperStream = new Transform({
        transform(chunk, enc, cb){
            this.push(chunk.toString().toUpperCase());
            cb();
        }
    })

    outStream = outStream.pipe(upperStream)

    if(args.compress){
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream)
        OUTFILE = `${OUTFILE}.gz`
    }
    var targetStream;

    if(args.out){
        targetStream = process.stdout
    }
    else{
        targetStream = fs.createWriteStream(OUTFILE);

    }
    
    outStream.pipe(targetStream);

    signal.pr.catch(function f(){
        outStream.unpipe(targetStream);
        outStream.destroy();
    })

    yield streamComplete(outStream);
}

function error(msg, includeHelp=false){
    console.error(msg);
    if(includeHelp){
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex2 usage:")
    console.log(" ex2.js --file={FILENAME}");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={filename}  process the file");
    console.log("--in, -            process stdin");
    console.log("--out,             print to stdout");
    console.log("--compress,        gzip the output");
    console.log("--uncompress,      uncompress the output");
    console.log("");
}



