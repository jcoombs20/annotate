function load_page() {

  //******Initialize bootstrap tooltip
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(function () {
    $('[data-toggle="popover"]').popover()
  })

  //******Add header
  d3.select("body")
    .append("div")
    .attr("class", "header")
    .html('<a href="https://www.fws.gov/northeast/fisherycenter/" target="_blank"><img id="usfws" src="images/usfws.png" title="US Fish & Wildlife Service - Northeast Fishery Center" target="_blank"></img></a><div id="headerDiv"><h1>Mitogenome Annotation</h1><div class="headerLinks"><p id="intro" class="introLink" title="Click to initiate a walkthrough highlighting the features and functions of the app">Tutorial</p><p id="resources" class="introLink" title="Click to download protocols and access contact information for questions or comments about the app">Resources</p></div></div>');

  d3.select("#intro").on("click", function() { startIntro(); });
  d3.select("#resources")
    .attr("data-toggle", "modal")
    .attr("data-target", "#resourcesModal");


  d3.select("body")
    .append("div")
    .attr("id", "headerTabs")
    .html('<ul class="nav nav-tabs">'
        + '<li class="d-flex align-items-center active" id="clean" data-div="cleanDiv" onclick="changeDiv(this)" title="Edits a GenBank flat file for annotated mitogenome submission"><a href="#">Prepare GenBank File</a></li>'
        + '<li class="d-flex align-items-center" id="run" data-div="createDiv" onclick="changeDiv(this)" title="Creates a Sequin file for annotated mitogenome submission"><a href="#">Create Sequin File</a></li>'
      + '</ul>'
    );


  //******Add clean
  d3.select("body")
    .append("div")
    .attr("id", "cleanDiv")
    .attr("class", "input")
    .html('<h3>Prepare<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Performs the following on a GenBank flat file:</p><ul><li>Standardizes nomenclature</li><li>Removes unnecessary attributes</li><li>Adds locus_tag attributes</li><li>Correctly formats protein_id attributes</li><li>Summarizes findings for error detection</li></ul>"></span></h3>'
      + '<form id="cleanForm" action="javascript:;" onsubmit="annotate(this)">'
        + '<button type="reset" id="resetBut" class="formBut btn btn-primary" title="Click to reset the form"><span class="fa fa-repeat"></span> Reset</button>'
        + '<br>'
        + '<div class="labelDiv"><label for="gbFile">Select a GenBank flat file:</label></div><input type="file" id="gbFile" class="formInput" name="gbFile" accept=".gb" required></input><a class="fileExamp" id="gbFileExamp" href="files/NEFC_F16-005_before.gb" title="Example of a pre-edited GenBank flat file"><span class="fa fa-file"></span></a>'
        + '<br>'
        + '<div class="labelDiv"><label for="locus_tag">GenBank locus_tag prefix:</label></div><input type="text" id="locus_tag" class="formInput" name="locus_tag" placeholder="" title="Locus tag prefix (e.g. HUS31) received from GenBank after submittal of a BioSample to the NEFC BioProject" required></input><a class="appLink" id="bpLink" target="_blank" href="https://www.ncbi.nlm.nih.gov/bioproject/PRJNA633136" title="Link to the NEFC Freshwater Fish Mitochondrial Genome BioProject"><span class="fa fa-link"></span></a>'
        + '<br>'
        + '<button type="submit" id="annotateBut" class="formBut btn btn-primary" title="Click to clean up and annotate the file"><span class="fa fa-list"></span> Annotate</button>'
        + '<br>'
        + '<div id="summaryDiv" class="summaryDiv">'
          + '<label for="summary_text">Summary of annotations:</label>'
          + '<br>'
          + '<label class="txtLabel" id="summary_text_label">Features</label><label class="txtLabel" id="tRNA_text_label">Transfer RNA</label><label class="txtLabel" id="CDS_text_label">Coding Sequences</label><label class="txtLabel" id="except_text_label">Exceptions</label>'
          + '<br>'
          + '<textarea class="txtInput" id="summary_text" name="summary_text" title="List of features in the annotated file"></textarea>'
          + '<textarea class="txtInput" id="tRNA_text" name="tRNA_text" title="List of transfer RNAs in the annotated file"></textarea>'
          + '<textarea class="txtInput" id="CDS_text" name="CDS_text" title="List of coding sequences in the annotated file"></textarea>'
          + '<textarea class="txtInput" id="except_text" name="except_text" title="List of translation exceptions in the annotated file"></textarea>'
          + '<br>'
          + '<button type="button" id="downloadBut" class="formBut btn btn-primary" title="Click to download edited annotation file"><a id="downloadA" class="dlA stretched-link"><span class="fa fa-download"></span> Download</a></button>'
        + '</div>'
      + '</form>'
    );

  d3.select("#resetBut").on("click", function() { d3.select("#summaryDiv").style("display", "none"); });
  d3.select("#gbFile").on("change", function() { d3.select("#summaryDiv").style("display", "none"); });


  //******Add Create Sequin div
  d3.select("body")
    .append("div")
    .attr("id", "createDiv")
    .attr("class", "input")
    .html('<h3>Create<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Performs the following:</p><ul><li>Creates annotation table (.tbl)</li><li>Runs tbl2asn</li><li>Returns warning & error messages</li><li>Returns Sequin file (.asn)</li></ul>"></span></h3>'
      +'<form action="javascript:;" onsubmit="tbl2asn(this)">'
        + '<button type="reset" id="resetButCreate" class="formBut btn btn-primary" title="Click to reset the form"><span class="fa fa-repeat"></span> Reset</button>'
        + '<br>'
        + '<div class="labelDiv"><label for="gbTemplate">Select a GenBank template file:</label></div><input type="file" id="gbTemplate" class="fileInput formInput" name="gbTemplate" accept=".sbt" required></input><a class="fileExamp" id="gbTemplateExamp" href="files/template.sbt" title="Example of a GenBank template file"><span class="fa fa-file"></span></a><a class="appLink" id="templateLink" target="_blank" href="https://submit.ncbi.nlm.nih.gov/genbank/template/submission/" title="Link to GenBank template file creation app"><span class="fa fa-link"></span></a>'
        + '<br>'
        + '<div class="labelDiv"><label for="gbFasta">Select a FASTA file:</label></div><input type="file" id="gbFasta" class="fileInput formInput" name="gbFasta" accept=".fsa" required></input><a class="fileExamp" id="gbFastaExamp" href="files/NEFC_F16-005.fsa" title="Example of a FASTA file with definition line entries"><span class="fa fa-file"></span></a>'
        + '<br>'
        + '<div class="labelDiv"><label for="gbFileCreate">Select a GenBank flat file:</label></div><input type="file" id="gbFileCreate" class="fileInput formInput" name="gbFileCreate" accept=".gb" required></input><a class="fileExamp" id="gbFileCreateExamp" href="files/NEFC_F16-005_after.gb" title="Example of a post-edited GenBank flat file"><span class="fa fa-file"></span></a>'
        + '<br>'
        + '<button type="submit" id="createBut" class="formBut btn btn-primary" title="Click create a Sequin file for GenBank submittal"><span class="fa fa-arrow-circle-right"></span> Run</button>'
        + '<br>'
        + '<div id="summaryDivCreate" class="summaryDiv">'
          + '<label>Run results:</label>'
          + '<a id="SQN_warnings_a" href="#" target="_blank" title="Click to download warnings and errors"><span id="SQN_warnings" class="fa fa-exclamation-triangle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Warnings & Errors</p>"></span></a>'
          + '<br>'
          + '<button type="button" id="dl_TBL_but" class="formBut btn btn-primary" title="Click to download GenBank feature table (.tbl)"><a id="dl_TBL_a" class="dlA stretched-link"><span class="fa fa-download"></span> Feature Table</a></button>'
          + '<button type="button" id="dl_SQN_but" class="formBut btn btn-primary" title="Click to download GenBank Sequin File (.sqn)"><a id="dl_SQN_a" class="dlA stretched-link"><span class="fa fa-download"></span> Sequin File</a></button>'
          + '<br>'
          + '<label>GenBank submittal:</label><a class="appLink" id="submitLink" href="https://www.ncbi.nlm.nih.gov/LargeDirSubs/dir_submit.cgi" target="_blank" title="Link to GenBank Sequin submission app"><span class="fa fa-link"></span></a>'
        + '</div>'
      + '</form>'
    );

  d3.select("#resetButCreate").on("click", function() { 
    d3.select("#summaryDivCreate").style("display", "none"); 
    d3.select("#SQN_warnings").style("display", "none");
  });

  d3.selectAll(".fileInput").on("change", function() {     
    d3.select("#summaryDivCreate").style("display", "none"); 
    d3.select("#SQN_warnings").style("display", "none");
  });


  //******Add Resources
  d3.select("body")
    .append("div")
    .attr("class", "modal fade ui-draggable in ")
    .attr("id", "resourcesModal")
    .style("display", "none")
    .append("div")
    .attr("class", "modal-dialog modal-lg")
    .attr("id", "resourcesDiv")
    .html('<h3>Resources<span id="modalExit" class="fa fa-times-circle" title="Click to close resources window"></span></h3>'
      + '<hr>'
      + '<div id="resourceInternalDiv">'
        + '<h5>Protocols<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Links to PDF\'s containing protocols for assembly and annotation of mitogenomes from raw sequence reads and submitting them to GenBank.</p>"></span></h5>'
        + '<div id="docDiv" class="resLinkDiv">'
          + '<a class="resourceA" href="files/NEFC_Protocol-Mitogenome_Sequencing _Sept_2019.pdf" target="_blank" title="Click to download PDF"><span class="fa fa-file faResource"</span></a><p class="resourceP">Northeast Fishery Center mitogenome sequencing protocol</p>'
          + '<br>'
          + '<a class="resourceA" href="files/NEFC_Mitogenome_Genbank_Submittal_v2.pdf" target="_blank" title="Click to download PDF"><span class="fa fa-file faResource"</span></a><p class="resourceP">Northeast Fishery Center mitogenome annotation submittal protocol</p>'
        + '</div>'
        + '<br><br>'
        + '<h5>Contact Information<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Email addresses for questions and comments about protocols and the app .</p>"></span></h5>'
        + '<div id="emailDiv" class="resLinkDiv">'
          + '<a class="resourceA" href="mailto:aaron_maloy@fws.gov?subject=Mitogenome Construction" target="_blank" title="Click to send email"><span class="fa fa-envelope faResource"</span></a><p class="resourceP">Mitogenome assembly questions: <span class="emailSpan">Aaron Maloy - <a href="mailto:aaron_maloy@fws.gov?subject=Mitogenome Construction" target="_blank" title="Click to send email">aaron_maloy@fws.gov</a></span></p>'
          + '<br>' 
          + '<a class="resourceA" href="mailto:jason_coombs@fws.gov?subject=Mitogenome Submittal" target="_blank" title="Click to send email"><span class="fa fa-envelope faResource"</span></a><p class="resourceP">Annotation submittal questions: <span class="emailSpan">Jason Coombs - <a href="mailto:jason_coombs@fws.gov?subject=Mitogenome Submittal" target="_blank" title="Click to send email">jason_coombs@fws.gov</a></span></a></p>'
        + '</div>'
      + '</div>'
    );
  
  d3.select("#modalExit")
    .attr("data-toggle", "modal")
    .attr("data-target", "#resourcesModal");

}


function changeDiv(tmpTab) {
  d3.select("#headerTabs").selectAll("li").classed("active", false);
  d3.select(tmpTab).classed("active", true);
  d3.selectAll(".input").style("display", "none");
  d3.select("#" + d3.select(tmpTab).attr("data-div")).style("display", "block");
}




function tbl2asn(tmpForm) {
  d3.select("body").style("cursor", "progress");

  const tmpSBT = tmpForm.gbTemplate.files[0];
  const tmpFSA = tmpForm.gbFasta.files[0];
  const tmpGB = tmpForm.gbFileCreate.files[0];
  const tmpName = tmpGB.name;
  const SBTread = new FileReader();
  const FSAread = new FileReader();
  const GBread = new FileReader();
  var fileCnt = 0;
  var fileSBT = "";
  var fileFSA = "";
  var fileGB = "";
  var tmpID = "";

  //***Template file
  SBTread.onload = function(event) {
    fileSBT = event.target.result;
    fileProcessed();
  }

  SBTread.onerror = (event) => {
    alert(event.target.error.name);
  };


  //***FASTA file
  FSAread.onload = function(event) {
    fileFSA = event.target.result;
    fileProcessed();
  }

  FSAread.onerror = (event) => {
    alert(event.target.error.name);
  };


  //***GenBank flat file
  GBread.onload = function(event) {
    const file = event.target.result;
    const allLines = file.split(/\r?\n/);

    //*********Read text file array line by line
    for(z = 0; z < allLines.length; z++) {
      var line = allLines[z];

      //******Get seqID
      if(line.includes("LOCUS")) {
        var i = line.indexOf("LOCUS");
        for(j = i + 5; j < line.length; j++) {
          if(line[j] != " ") {
            i = j;
            break;
          }
        }

        for(j = j; j < line.length; j++) {
          if(line[j] == " ") {
            break;
          }
          tmpID += line[j];
        }
        fileGB = '>Feature ' + tmpID + '\r\n';
      }


      //******Add features
      else if(line.includes("tRNA ") || line.includes("rRNA ") || line.includes("CDS ") || line.includes("gene ") || line.includes("D-loop ")) {
        var BPstart = "";
        var BPend = "";
        var i = line.indexOf("..");
        for(j = i - 1; j >= 0; j--) {
          if(line[j] == " " || line[j] == "(") {
            if(line.includes("complement")) {
              BPend = line.slice(j + 1, i);
            }
            else {
              BPstart = line.slice(j + 1, i);
            }
            break;
          }
        }

        for(j = i + 2; j <= line.length; j++) {
          if(line[j] == " " || line[j] == ")" || j == line.length) {
            if(line.includes("complement")) {
              BPstart = line.slice(i + 2, j);
            }
            else {
              BPend = line.slice(i + 2, j);
            }
            break;
          }
        }

        if(line.includes("tRNA")) {
          fileGB += BPstart + '\t' + BPend + '\t' + 'tRNA\r\n';
        }
        else if(line.includes("rRNA")) {
          fileGB += BPstart + '\t' + BPend + '\t' + 'rRNA\r\n';
        }
        else if(line.includes("CDS")) {
          fileGB += BPstart + '\t' + BPend + '\t' + 'CDS\r\n';
        }
        else if(line.includes("gene")) {
          fileGB += BPstart + '\t' + BPend + '\t' + 'gene\r\n';
        }
        else if(line.includes("D-loop")) {
          fileGB += BPstart + '\t' + BPend + '\t' + 'D-loop\r\n';
        }

        //***Add associated feature attributes
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            z = j - 1;
            break;
          }
          else {
            var tmpLine = newLine.slice(newLine.indexOf('/') + 1, newLine.length).replace(/"/g, '').replace('=', '\t');
            fileGB += '\t\t\t' + tmpLine + '\r\n';
          }
        }
      }
    }

    //******Add table file link to download
    d3.select("#dl_TBL_a")
      .attr("href", "data:attachment/text, " + encodeURI(fileGB))
      .attr("target", "_blank")
      .attr("download", tmpName.replace(".gb", ".tbl"));


    fileProcessed();
  }

  GBread.onerror = (event) => {
    alert(event.target.error.name);
  };


  //******Read in files
  SBTread.readAsText(tmpSBT);
  FSAread.readAsText(tmpFSA);
  GBread.readAsText(tmpGB);


  //******Counts processed files and performs tbl2asn AJAX once all 3 have been loaded
  function fileProcessed() {
    fileCnt += 1;
    if(fileCnt == 3) {
      //***Check seqIDs in FSA and fileGB for match
      for(j = 0; j < fileFSA.length; j++) {
        if(fileFSA[j] == " ") {
          var seqID = fileFSA.slice(1,j);
          if(seqID != tmpID) {
            alert("The seqID's in the FASTA file (" + seqID + ") and GenBank flat file (" + tmpID + ") do not match.\n\nPlease check your files before running again.");
            d3.select("body").style("cursor", "default");
            return;
          }
          break;
        }
      }
  
      var tmpData = {"filename": tmpName.replace(".gb", ""), "tmpSBT": fileSBT, "tmpFSA": fileFSA, "tmpGB": fileGB};
      $.ajax({
        method: "POST",
        url: "http://174.55.94.160:3414/run",
        //url: "http://172.18.22.77:3414/run",
        //url: "http://174.55.94.160/tbl2asn/run",
        data: tmpData,
        error: function(e) { console.log("AJAX Error: " + e); },
        success: function(result) { 
          //******Add sequin file link to download
          d3.select("#dl_SQN_a")
            .attr("href", "data:attachment/text, " + encodeURI(result.tmpSQN))
            .attr("target", "_blank")
            .attr("download", tmpName.replace(".gb", ".sqn"));

          if(result.tmpVAL != "") {
            d3.select("#SQN_warnings_a")
              .attr("href", "data:attachment/text, " + encodeURI(result.tmpVAL))
              .attr("target", "_blank")
              .attr("download", tmpName.replace(".gb", ".val"));

            d3.select("#SQN_warnings")
              .attr("data-original-title", result.tmpVAL)
              .style("display", "inline-block");
          }
          else {
            d3.select("#SQN_warnings")
              .attr("data-original-title", "Errors & Warnings")
              .style("display", "none");
          }            

          d3.select("body").style("cursor", "default");
                    
          //******Show summary div
          d3.select("#summaryDivCreate").style("display", "inline-block");
        }
      });
    }
  }
}




function annotate(tmpForm) {
  const tmpLT = tmpForm.locus_tag.value;
  const tmpFile = tmpForm.gbFile.files[0];
  const tmpName = tmpFile.name;
  const reader = new FileReader();
  const locusTag = d3.select("#locus_tag").property("value");

  reader.onload = function(event) {
    var dlText = "";
    const file = event.target.result;
    const allLines = file.split(/\r?\n/);

    var tmpID = "";
    var tmpBP = "";
    var tmpOrg = "";
    var LTcnt = 0;
    var tRNAcnt = 0;
    var CDScnt = 0;
    var rRNAcnt = 0;
    var DloopCnt = 0;
    var stopCodon = [];
    var CDSproducts = [];
    var serCnt = 0;
    var leuCnt = 0;
    var tRNAarray = [];
    var tmpTRNA = "";
    var compTRNA = 0;
    var compCDS = 0;
    varDloopBP = "";


    //*********Read text file array line by line
    for(z = 0; z < allLines.length; z++) {
      var line = allLines[z];

      //******Get seqID and basepairs
      if(line.includes("LOCUS")) {
        var i = line.indexOf("LOCUS");
        for(j = i + 5; j < line.length; j++) {
          if(line[j] != " ") {
            i = j;
            break;
          }
        }

        for(j = j; j < line.length; j++) {
          if(line[j] == " ") {
            break;
          }
          tmpID += line[j];
        }

        var i = line.indexOf(" bp");
        for(j = i - 1; j >= 0; j--) {
          if(line[j] == " ") {
            j += 1;
            break;
          }
        }
        tmpBP = line.slice(j, i);
        dlText += line + '\r\n';
      }


      //******Get species
      else if(line.includes("ORGANISM")) {
        var i = line.indexOf("ORGANISM");
        for(j = i + 8; j < line.length; j++) {
          if(line[j] != " ") {
            i = j;
            break;
          }
        }

        for(j = j; j < line.length; j++) {
          if(line[j] != ".") {
            tmpOrg += line[j];
          }
        }
        dlText += line + '\r\n';
      }


      //******Add source info
      else if(line.includes("FEATURES")) {
        dlText += line + '\r\n';
        dlText += '     source          1..' + tmpBP + '\r\n';
        dlText += '                     /organism="' + tmpOrg + '"\r\n';
        dlText += '                     /mol_type="genomic DNA"\r\n';
        dlText += '                     /isolate="' + tmpID + '"\r\n';
      }


      //******Annotate tRNA
      else if(line.includes("tRNA ")) {
        tRNAcnt += 1;
        if(line.toUpperCase().includes("COMPLEMENT")) {
          compTRNA += 1;
        }
        dlText += line + '\r\n';
        var geneName = "";
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("/product")) {
            dlText += newLine + '\r\n';
            tmpTRNA = getTRNA(newLine);
            geneName = '                     /gene="' + tmpTRNA + '"';
          }
          else if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            z = j - 1;
            break;
          }
        }

        var tmpGene = line.replace("tRNA", "gene");
        LTcnt += 1;
        var tmpLT = get_locus_tag(locusTag, LTcnt);
        dlText += tmpGene + '\r\n';
        dlText += '                     /locus_tag="' + tmpLT + '"\r\n';
        dlText += geneName + '\r\n';
      }


      //******Annotate rRNA
      else if(line.includes("rRNA ")) {
        rRNAcnt += 1;
        dlText += line + '\r\n';
        var geneName = "";
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("/product")) {
            if(newLine.includes("12") || rRNAcnt == 1) {
              dlText += '                     /product="12S ribosomal RNA"\r\n';
              geneName = '                     /gene="12S rRNA"\r\n';
            }
            else if(newLine.includes("16") || rRNAcnt == 2) {
              dlText += '                     /product="16S ribosomal RNA"\r\n';
              geneName = '                     /gene="16S rRNA"\r\n';
            }
          }
          else if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            z = j - 1;
            break;
          }
        }

        var tmpGene = line.replace("rRNA", "gene");
        LTcnt += 1;
        var tmpLT = get_locus_tag(locusTag, LTcnt);
        dlText += tmpGene + '\r\n';
        dlText += '                     /locus_tag="' + tmpLT + '"\r\n';
        dlText += geneName;
      }


      //******Annotate CDS
      else if(line.includes("CDS ")) {
        LTcnt += 1;
        var tmpLT = get_locus_tag(locusTag, LTcnt);
        CDScnt += 1;
        if(line.toUpperCase().includes("COMPLEMENT")) {
          compCDS += 1;
        }
        dlText += line + '\r\n';
        var CDSlines = {};
        CDSlines.protein_id = '                     /protein_id="gnl|NEFC|'  + tmpLT + '"\r\n';
        CDSlines.locus_tag = '                     /locus_tag="' + tmpLT + '"\r\n';
        var tmpBi = 0;
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("/codon_start")) {
            CDSlines.codon_start = newLine + '\r\n';
          }
          else if(newLine.includes("/transl_table")) {
            CDSlines.transl_table = newLine + '\r\n';            
          }
          else if(newLine.includes("/transl_except")) {
            CDSlines.transl_except = newLine + '\r\n';
            CDSlines.note = '                     /note="TAA stop codon is completed by the addition of 3\' A residues to the mRNA"\r\n';
            stopCodon.push(newLine.slice(newLine.indexOf("pos:"), newLine.lastIndexOf(')')) + ", " + line.slice(line.indexOf("..") - 5, line.length));            
          }
          else if(newLine.includes("/product")) {
            getCDSproduct(newLine);
          }
/*
          else if(newLine.includes("gene ")) {
            addCDSlines();
            CDSlines.gene = newLine + '\r\n';
            tmpBi = 1;
            for(i = j + 1; i < allLines.length; i++) {
              var newLine = allLines[i];
              if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
                z = i - 1;
                break;
              }
            }
            break;
          }
*/
          else if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            addCDSlines();
            z = j - 1;
            break;
          }
        }
        
        if(tmpBi == 0) {
          var tmpGene = line.replace("CDS ", "gene");
          dlText += tmpGene + '\r\n';
        }
        else {
          dlText += CDSlines.gene;
        }
        
        dlText += CDSlines.locus_tag;        
        dlText += CDSlines.gene_gene;        
      }

      
      //******Annotate D-loop
      else if(line.includes("D-loop ")) {
        DloopCnt += 1;
        DloopBP = line.slice(line.indexOf("..") - 5, line.length);
        dlText += line + '\r\n';
        dlText += '                     /note="Control region"\r\n';
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            z = j - 1;
            break;
          }
        }

        var tmpGene = line.replace("D-loop", "gene  ");
        LTcnt += 1;
        var tmpLT = get_locus_tag(locusTag, LTcnt);
        dlText += tmpGene + '\r\n';
        dlText += '                     /locus_tag="' + tmpLT + '"\r\n';
        dlText += '                     /gene="D-loop"\r\n';
      }


      //******Remove random 'gene' lines
      else if(line.includes("gene ") || line.includes("source ")) {
        for(j = z + 1; j < allLines.length; j++) {
          var newLine = allLines[j];
          if(newLine.includes("tRNA ") || newLine.includes("rRNA ") || newLine.includes("CDS ") || newLine.includes("gene ") || newLine.includes("D-loop ") || newLine.includes("ORIGIN ")) {
            z = j - 1;
            break;
          }
        }
      }


      //******Add regular line
      else {
        dlText += line + '\r\n';
      }



      //******Get the tRNA
      function getTRNA(tmpLine) {
        var tmpTRNA = tmpLine.slice(tmpLine.indexOf("tRNA"), tmpLine.indexOf("tRNA") + 8);
        tRNAarray.push(tmpTRNA);
        if(tmpTRNA.toUpperCase().includes("SER")) {
          if(serCnt == 0) {
            serCnt += 1;
            return "tRNA-Ser1";
          }
          else {
            serCnt += 1;
            return "tRNA-Ser2";
          }
        }
        else if(tmpTRNA.toUpperCase().includes("LEU")) {
          if(leuCnt == 0) {
            leuCnt += 1;
            return "tRNA-Leu1";
          }
          else {
            leuCnt += 1;
            return "tRNA-Leu2";
          }
        }
        else {
          return tmpTRNA;
        }
      }



      //******Determine CDS product and standardize nomenclature 
      function getCDSproduct(tmpLine) {
        if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("1") || tmpLine.toUpperCase().includes(" I"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 1"\r\n';
          CDSlines.gene_gene = '                     /gene="ND1"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 1");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("2") || tmpLine.toUpperCase().includes(" II"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 2"\r\n';
          CDSlines.gene_gene = '                     /gene="ND2"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 2");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("3") || tmpLine.toUpperCase().includes(" III"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 3"\r\n';
          CDSlines.gene_gene = '                     /gene="ND3"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 3");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("4") || tmpLine.toUpperCase().includes(" IV")) && tmpLine.toUpperCase().includes("L") === false) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 4"\r\n';
          CDSlines.gene_gene = '                     /gene="ND4"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 4");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.toUpperCase().includes("4L") || tmpLine.toUpperCase().includes(" IVL"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 4L"\r\n';
          CDSlines.gene_gene = '                     /gene="ND4L"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 4L");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("5") || tmpLine.toUpperCase().includes(" V"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 5"\r\n';
          CDSlines.gene_gene = '                     /gene="ND5"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 5");
        }
        else if(tmpLine.toUpperCase().includes("NADH") && (tmpLine.includes("6") || tmpLine.toUpperCase().includes(" VI"))) {
          CDSlines.product = '                     /product="NADH dehydrogenase subunit 6"\r\n';
          CDSlines.gene_gene = '                     /gene="ND6"\r\n';
          CDSproducts.push("NADH dehydrogenase subunit 6");
        }
        else if(tmpLine.toUpperCase().includes("CYT") && (tmpLine.includes("1") || tmpLine.toUpperCase().includes(' I"'))) {
          CDSlines.product = '                     /product="cytochrome c oxidase subunit I"\r\n';
          CDSlines.gene_gene = '                     /gene="COI"\r\n';
          CDSproducts.push("cytochrome c oxidase subunit I");
        }
        else if(tmpLine.toUpperCase().includes("CYT") && (tmpLine.includes("2") || tmpLine.toUpperCase().includes(' II"'))) {
          CDSlines.product = '                     /product="cytochrome c oxidase subunit II"\r\n';
          CDSlines.gene_gene = '                     /gene="COII"\r\n';
          CDSproducts.push("cytochrome c oxidase subunit II");
        }
        else if(tmpLine.toUpperCase().includes("CYT") && (tmpLine.includes("3") || tmpLine.toUpperCase().includes(' III"'))) {
          CDSlines.product = '                     /product="cytochrome c oxidase subunit III"\r\n';
          CDSlines.gene_gene = '                     /gene="COIII"\r\n';
          CDSproducts.push("cytochrome c oxidase subunit III");
        }
        else if((tmpLine.toUpperCase().includes("CYT") && tmpLine.toUpperCase().includes(" B")) || tmpLine.toUpperCase().includes("CYTB")) {
          CDSlines.product = '                     /product="cytochrome b"\r\n';
          CDSlines.gene_gene = '                     /gene="CYTB"\r\n';
          CDSproducts.push("cytochrome b");
        }
        else if(tmpLine.toUpperCase().includes("ATP") && tmpLine.includes("8")) {
          CDSlines.product = '                     /product="ATP synthase subunit 8"\r\n';
          CDSlines.gene_gene = '                     /gene="ATP8"\r\n';
          CDSproducts.push("ATP synthase subunit 8");
        }
        else if(tmpLine.toUpperCase().includes("ATP") && tmpLine.includes("6")) {
          CDSlines.product = '                     /product="ATP synthase subunit 6"\r\n';
          CDSlines.gene_gene = '                     /gene="ATP6"\r\n';
          CDSproducts.push("ATP synthase subunit 6");
        }
        else {
          CDSlines.product = tmpLine + '\r\n';
          var tmpStr = tmpLine.slice(tmpLine.indexOf("/product") + 9, tmpLine.indexOf("/product") + 13);
          CDSlines.gene_gene = '                     /gene="' + tmpStr + '"\r\n';
          CDSproducts.push("UNKNOWN: " + tmpLine.indexOf("/product") + 9, tmpLine.length);
        }
      }



      //******Add additional lines to CDS feature 
      function addCDSlines() {
        dlText += CDSlines.protein_id;
        dlText += CDSlines.product;

        if(typeof(CDSlines.codon_start) !== "undefined") {
          dlText += CDSlines.codon_start;
        }
        else {
          dlText += '                     /codon_start=1\r\n';
        }

        if(typeof(CDSlines.transl_table) !== "undefined") {
          dlText += CDSlines.transl_table;
        }
        else {
          dlText += '                     /transl_table=2\r\n';
        }
        if(typeof(CDSlines.transl_except) !== "undefined") {
          dlText += CDSlines.transl_except;
          dlText += CDSlines.note;
        }
      }
    }



    //******Add file link to download
    d3.select("#downloadA")
      .attr("href", "data:attachment/text, " + encodeURI(dlText))
      .attr("target", "_blank")
      .attr("download", tmpName);

    //******Add summary stats
    var tmpSummary = 'Organism: ' + tmpOrg + '\n';
    tmpSummary += 'ID: ' + tmpID + '\n';
    tmpSummary += 'Base Pairs: ' + tmpBP + '\n';
    tmpSummary += 'Number of tRNAs: ' + tRNAcnt + '\n';
    tmpSummary += '     Complement: ' + compTRNA + '\n';
    var tRNAs = "";
    tRNAarray.forEach(function(tRNA) {
      tRNAs += tRNA + '\n';
    });
    //tmpSummary += tRNAs;
    d3.select("#tRNA_text").property("value", tRNAs);

    tmpSummary += 'Number of rRNAs: ' + rRNAcnt + '\n';
    tmpSummary += 'Number of D-loops: ' + DloopCnt + '\n';
    tmpSummary += '     ' + DloopBP + '\n';
    tmpSummary += 'Number of CDSs: ' + CDScnt + '\n';
    tmpSummary += '     Complement: ' + compCDS + '\n';
    var prods = "";
    CDSproducts.forEach(function(prod) {
      prods += prod + '\n';
    });
    //tmpSummary += prods;
    d3.select("#CDS_text").property("value", prods);

    var stops = "";
    stopCodon.forEach(function(stop) {
      stops += stop + '\n';
    });
    //tmpSummary += 'Translation Exceptions:\n' + stops;
    d3.select("#except_text").property("value", stops);

    d3.select("#summary_text").property("value", tmpSummary);

    //******Show summary div
    d3.select("#summaryDiv").style("display", "inline-block");

  };

  reader.onerror = (event) => {
    alert(event.target.error.name);
  };

  reader.readAsText(tmpFile);
}



//******Format the locus tag
function get_locus_tag(LT, LTcnt) {
  if(LTcnt < 10) {
    return LT + '_00' + LTcnt;
  }
  else if(LTcnt < 100) {
    return LT + '_0' + LTcnt;
  }
  else {
    return LT + '_' + LTcnt;
  }
}






//******Tutorial
function startIntro() {
  var intro = introJs();
  intro.setOptions({
    steps: [
      //0
      { intro: '<b>Welcome to the <span style="font-family:nebulous;color:orangered;font-weight:bold;">Mitogenome Annotation</span> app!</b><img src="images/dna.png" style="height:50px;display:block;margin:auto;"></img>This app is designed to assist with annotated mitogenome submissions to GenBank by standardizing annotation attribution and creating the final Sequin file.<br><br>This app builds upon annotation files created using the <a href="files/NEFC_Protocol-Mitogenome_Sequencing _Sept_2019.pdf" target="_blank">NEFC mitochondrial genome sequencing protocol</a>.' },
      //1
      { element: document.querySelector("#intro"), intro: "To access this guide at any time simply click on the 'Tutorial' link." },
      //2
      { element: document.querySelector("#resources"), intro: "Click here to download NEFC protocols for assembly, annotation, and submittal of mitogenomes, and to email questions or comments to NEFC researchers." },
      //3
      { element: document.querySelector("#clean"), intro: "The 'Prepare GenBank File' option enables the editing of an existing GenBank flat file. Use this option to: <ul><li>Standardize nomenclature</li><li>Remove unnecessary attributes</li><li>Append locus_tag attributes</li><li>Correctly format protein_id attributes<li>Summarize findings for error detections</li></ul>" },
      //4
      { element: document.querySelector("#gbFile"), intro: "Select your GenBank flat file here. Files should have a .gb extension." },
      //5
      { element: document.querySelector("#gbFileExamp"), intro: "Click this icon to download an example of a GenBank flat file prior to editing." },
      //6
      { element: document.querySelector("#locus_tag"), intro: 'Enter the <a href="https://www.ncbi.nlm.nih.gov/genbank/eukaryotic_genome_submission/#locus_tag" target="_blank">locus tag</a> identifier for the sample here. Locus tags are received from GenBank upon successful submission of a <a href="https://www.ncbi.nlm.nih.gov/biosample/docs/submission/faq/" target="_blank">Biosample</a> associated with a <a href="https://www.ncbi.nlm.nih.gov/bioproject/docs/faq/" target="_blank">Bioproject</a>.<br><br>This value, along with a sequential count attachment, is added as a locus_tag attribute to each annotated gene for tracking, searching, and linking purposes in NCBI.' },
      //7
      { element: document.querySelector("#bpLink"), intro: "Follow this link to visit the NEFC Freshwater Fish Mitochondrial Genome BioProject." },
      //8
      { element: document.querySelector("#annotateBut"), intro: "Clicking the \'Annotate\' button performs the following:<ul><li>Standardizes and edits the selected GenBank flat file</li><li>Provides a summary of the annotation results that can be used for error checking</li><li>Enables download of an edited version of the flat file</li></ul>" },
      //9
      { element: document.querySelector("#summary_text"), intro: "Upon run completion this box contains:<ul><li>Sample information</li><li>Gene counts by type</li><li>Strand location counts</li><li>D-loop location</li><ul>" },
      //10
      { element: document.querySelector("#tRNA_text"), intro: "This box contains all of the transfer RNAs (tRNA) annotated in the file." },
      //11
      { element: document.querySelector("#CDS_text"), intro: "This box contains all of the protein coding sequences (CDS) annotated in the file." },
      //12
      { element: document.querySelector("#except_text"), intro: "This box contains all of the translation exception attributes (transl_except) for CDS in the annotated file, along with the base pair range of the CDS to verify correct terminus position." },
      //13
      { element: document.querySelector("#downloadBut"), intro: "Click here to download the edited GenBank flat file for further hand editing or use in Sequin file creation." },
      //14
      { element: document.querySelector("#run"), intro: "The 'Create Sequin File' option enables the creation of a Sequin file used for annotated mitogenome submission to GenBank ." },
      //15
      { element: document.querySelector("#gbTemplate"), intro: "Select your GenBank template file here. Files should have a .sbt extension." },
      //16
      { element: document.querySelector("#gbTemplateExamp"), intro: "Click this icon to download an example of a GenBank template file." },
      //17
      { element: document.querySelector("#templateLink"), intro: "Follow this link to open GenBank's app for automated creation of a template file." },
      //18
      { element: document.querySelector("#gbFasta"), intro: "Select your FASTA file here. Files should have a .fsa extension and require specific attributes be present on the definition line for correct Sequin file creation." },
      //19
      { element: document.querySelector("#gbFastaExamp"), intro: "Click this icon to download an example of a FASTA file with required definition line attributes present." },
      //20
      { element: document.querySelector("#gbFileCreate"), intro: "Select your GenBank flat file here. Files should have a .gb extension." },
      //21
      { element: document.querySelector("#gbFileCreateExamp"), intro: "Click this icon to download an example of a properly formatted GenBank flat file." },
      //22
      { element: document.querySelector("#createBut"), intro: 'Clicking the \'Run\' button performs the following:<ul><li>Creation of a <a href="https://www.ncbi.nlm.nih.gov/projects/Sequin/table.html" target="_blank">feature table</a> (.tbl) formatted for use with <a href="https://www.ncbi.nlm.nih.gov/genbank/tbl2asn2/" target="_blank">tbl2asn</a></li><li>Creation of a Sequin file (.sqn) for GenBank submittal</li><li>Return of any warnings or errors encountered during the file creation process (.val file)</li><li>Options to download the .val, .tbl, and .sqn files.' },
      //23
      { element: document.querySelector("#SQN_warnings"), intro: "Once the run has completed, any errors or warnings encountered during the process will be conveyed by display of this icon.<br><br>Hovering your cursor over the icon displays the messages as a popup, while clicking on the cursor downloads the .val file produced by tbl2asn." },
      //24
      { element: document.querySelector("#dl_TBL_but"), intro: "Click here to download the formatted feature table (.tbl) which can be used if running tbl2asn on your own." },
      //25
      { element: document.querySelector("#dl_SQN_but"), intro: "Click here to download the Sequin file (.sqn) which is sent to GenBank during the submittal process." },
      //26
      { element: document.querySelector("#submitLink"), intro: "Follow this link to open GenBank's app for sequence submittal." },
      //27
      { intro: 'Thank you for touring the <span style="font-family:nebulous;color:orangered;font-weight:bold;">Mitogenome Annotation</span> app!<img src="images/dna.png" style="height:70px;display:block;margin:auto;"></img>Questions or comments can be directed to <a href="mailto:jason_coombs@fws.gov?subject=Mitogenome Annotation App" target="_blank">Jason Coombs</a>.' },
    ],
    tooltipPosition: 'auto',
    positionPrecedence: ['left', 'right', 'bottom', 'top'],
    showStepNumbers: false,
    hidePrev: true,
    hideNext: true,
    scrollToElement: true,
    disableInteraction: true,
  });

  intro.onchange(function() { 
    revertIntro();
    switch (this._currentStep) {
      case 1:
        d3.select("#intro").style("color","aqua");
        d3.select(".header").classed("highZ", true);
        break;
      case 2:
        d3.select("#resources").style("color","aqua");
        d3.select(".header").classed("highZ", true);
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        $("#clean").click();
        break;
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        $("#clean").click();
        d3.select("#locus_tag").property("value", "HUS31");
        addResults();
        break;
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
        $("#run").click();
        break;
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
        $("#run").click();
        addCreateResults();
        break;
    }
  });

  intro.onbeforechange(function() { 
    switch (this._currentStep) {
      case 0:                              
        break;
    }  
  });

  intro.oncomplete(function() { 
    //localStorage.setItem('doneTour', 'yeah!'); 
    $("#clean").click();
    revertIntro();
  });

  intro.onexit(function() {
    $("#clean").click();
    revertIntro();
    //disableTutorialSession = true;
  });            


  intro.start();



  function revertIntro() {
    d3.selectAll("#intro,#resources").style("color", "");
    d3.select(".header").classed("highZ", false);
    $("#resetBut").click();
    $("#resetButCreate").click();
  }

  function addResults() {
    d3.select("#summary_text").property("value", "Organism: Esox niger\nID: NEFC_F16-005\nBase Pairs: 16775\nNumber of tRNAs: 22\n     Complement: 8\nNumber of rRNAs: 2\nNumber of D-loops: 1\n     15619..16775\nNumber of CDSs: 13\n     Complement: 1");
    d3.select("#tRNA_text").property("value", "tRNA-Phe\ntRNA-Val\ntRNA-Leu\ntRNA-Ile\ntRNA-Gln\ntRNA-Met\ntRNA-Trp\ntRNA-Ala\ntRNA-Asn\ntRNA-Cys\ntRNA-Tyr\ntRNA-Ser\ntRNA-Asp\ntRNA-Lys\ntRNA-Gly\ntRNA-Arg\ntRNA-His\ntRNA-Ser\ntRNA-Leu\ntRNA-Glu\ntRNA-Thr\ntRNA-Pro");
    d3.select("#CDS_text").property("value", "NADH dehydrogenase subunit 1\nNADH dehydrogenase subunit 2\ncytochrome c oxidase subunit I\ncytochrome c oxidase subunit II\nATP synthase subunit 8\nATP synthase subunit 6\ncytochrome c oxidase subunit III\nNADH dehydrogenase subunit 3\nNADH dehydrogenase subunit 4L\nNADH dehydrogenase subunit 4\nNADH dehydrogenase subunit 5\nNADH dehydrogenase subunit 6\ncytochrome b");
    d3.select("#except_text").property("value", "pos:5048,aa:TERM,  4001..5048\npos:7830,aa:TERM,  7140..7830\npos:8745,aa:TERM,  8064..8745\npos:9951,aa:TERM,  9603..9951\npos:11692,aa:TERM, 10312..11692");
    d3.select("#summaryDiv").style("display", "inline-block");
  }

  function addCreateResults() {
    d3.select("#SQN_warnings_a").attr("data-original-title", "WARNING: valid [SEQ_INST.CompleteCircleProblem] Circular topology without complete flag set BIOSEQ: lcl|NEFC_F16-134: raw, dna len= 17424");
    d3.select("#SQN_warnings").style("display", "inline-block");
    d3.select("#summaryDivCreate").style("display", "inline-block");
  }
}

