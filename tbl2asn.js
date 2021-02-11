const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cp = require("child_process");
const fs = require('fs');
const crypto = require('crypto');

app.listen(3414);

console.log("Running on 3414...");

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', function(req, res) { 
  res.send("Listening for calls"); 
});

app.get('/run', function(req, res) {
  res.send("Ready to run");
});

app.post('/run', function(req, res) {
  console.log(Object.keys(req.body));
  var tmpDir = crypto.randomBytes(8).toString('hex');

  cp.execSync("mkdir " + tmpDir);

  var fileCnt = 0;
  //***SBT File
  fs.writeFile(tmpDir + "/template.sbt", req.body.tmpSBT, function(err) {
    if(err) return console.log(err);
    console.log("SBT file saved");
    fileProcessed();
  });

  //***FSA file
  fs.writeFile(tmpDir + "/" + req.body.filename + ".fsa", req.body.tmpFSA, function(err) {
    if(err) return console.log(err);
    console.log("FSA file saved");
    fileProcessed();
  });

  //***TBL file
  fs.writeFile(tmpDir + "/" + req.body.filename + ".tbl", req.body.tmpGB, function(err) {
    if(err) return console.log(err);
    console.log("TBL file saved");
    fileProcessed();
  });


  function fileProcessed() {
    fileCnt += 1;
    if(fileCnt == 3) {
      console.log("All files written to " + tmpDir);
      var run = cp.execSync("tbl2asn -t " + tmpDir + "/template.sbt -p " + tmpDir + "/ -V vb").toString();
      console.log(run);

      var fileSQN = "";
      var fileVAL = "";
      fileCnt = 0;
      
      //******Read in sequin file
      fs.readFile(tmpDir + "/" + req.body.filename + ".sqn", "utf8", function(err, data) {
        if(err) return console.log(err);
        fileSQN = data;
        fileProcessed2();
      });

      //******Read in validation file
      fs.readFile(tmpDir + "/" + req.body.filename + ".val", "utf8", function(err, data) {
        if(err) return console.log(err);
        fileVAL = data;
        fileProcessed2();
      });


      function fileProcessed2() {
        fileCnt += 1;
        if(fileCnt == 2) {
          var tmpData = { "tmpSQN": fileSQN, "tmpVAL": fileVAL };
          cp.execSync("rm -r " + tmpDir + "/")
          res.send(tmpData);
        } 
      }
    }
  }
});
