// $(document).ready(function(){



var app = app || {};

app.TranscriptionView = Backbone.View.extend({
  tagName: 'div',
  className: 'container-fluid',
  //TODO: change this so that id is interpolated from model this.el.id or this.el.ciud
  id: "transcription-n",//+this.model.id+"",

  initialize: function() {
    //connect to changes in the model to update the view
     // this.listenTo(this.model, "change", this.render);
     // console.log("initializing transcription")

     this.editable = false;
     /**
     * Show previously saved hilights  
     */
      // var tmpHighlights =  this.model.get("highlights")

        // [{
        //     "startTime": "88.52",
        //     "endTime": "97.14",
        //     "reelName": "NA",
        //     "clipName": "Video Now Report (2014)-  An interview with Kainaz Amaria Multimedia Producer - NPR-HD.mp4"
        //   },#
        // ...
        // ]

       // console.log(this.$el.$('.words'))
       // console.log(this.$el.find('.words'))
  // this.render();
  //  console.log(this.$(".words"))
       // this.render();

       //   $(this.$el)

      var tmpHighlights =  this.model.get("highlights")

      for(var i =0; i < tmpHighlights.length; i++ ){
       var min =  tmpHighlights[i].startTime ;
       var max = tmpHighlights[i].endTime ;

       //needs to grab the words of the element of the view not in the dom        
         this.$(".words").filter(function(){
            return $(this).data('start-time') >= min && $(this).data('end-time') <= max;
          }).addClass("highlight");
      } 
      // this.render();

      //
   },

  events:{
    "click span.words": "playWord",
    "click .timecodes": "playWord",
    "keyup #searchCurrentTranscription" :"search",
    "mouseup .transcription": "selectingWords",
    "click #clearHighlights": "clearHighlights",

     "click #editWords": "makeEditable",
     "click #highlightWords": "makeHilightable",

     "click #save": "save",

     "click #playPreviewChrono": "playPreviewChrono",

    "click #playPreviewSelOrd": "playPreviewSelOrd",
    
    "click #exportEdlChronological": "exportEdlChronological",
    "click #exportEdlSelectionOrder": "exportEdlSelectionOrder",

    "click #exportPlainText": "exportPlainText",

    "click #exportTimecodedTranscription": "exportTimecodedTranscription",
    
    "click #exportJsonEDL": "exportJsonEDL",
    "click #exportJsonEDLSelOrder": "exportJsonEDLSelOrder",
    "click #exportJsonTranscription": "exportJsonTranscription",
   

    "click #exportPlainTextEDL": "exportPlainTextEDL",
    "click #exportPlainTextEDLSelOrder": "exportPlainTextEDLSelOrder",
    "click #exportPlainTimecodedTextEDL": "exportPlainTimecodedTextEDL",
    "click #exportPlainTimecodedTextEDLSelOrder": "exportPlainTimecodedTextEDLSelOrder",

    "click #expoertCaptionsSrt": "expoertCaptionsSrt",
    "click #expoertCaptionsSrtEDL": "expoertCaptionsSrtEDL",

    "click #exporthtml5Video": "exporthtml5Video",

    "click #exportAudio": "exportAudio"

  },


save: function(){
  // alert("Saving...")
  var start = Date.now()
  console.log('started')

  this.model.save({wait: true},{ success: function(model, response, options){ 
    console.log("1-TRANSCRIPTION SHOW - SAVE CB")
    console.log('FFFFFinished', Date.now() - start) 
    console.log(model, response, options)
    console.log("2-TRANSCRIPTION SHOW - SAVE CB")

  }},{
    error: function (model, xhr, options) {
        console.log("error");
    }})


// this.model.save();


// this.model.save(null, {foo: 'bar'}).then(function(data) {
//     var model = data.model,
//         response = data.response,
//         options = data.options;

//     console.log('Model with ID', model.id, 'saved');

//     console.log("1-TRANSCRIPTION SHOW - SAVE CB")
//     console.log('FFFFFinished', Date.now() - start) 
//     console.log("2-TRANSCRIPTION SHOW - SAVE CB")

// }).catch(function(data) {
//     if (_.isError(data)) {
//         console.error(data)
//     } else {
//         console.log('Failed to save contact:', data.response.statusText);
//     }
// });




},

makeHilightable: function(){

 var status = false;
  if( $("#highlightWords").hasClass("btn-primary")){
    status = true;
  }else{
    status = false
  }

  if(status){

  //disable editing
  $("#highlightWords").removeClass("active")
  $("#highlightWords").removeClass("btn-primary")
  $("#highlightWords").addClass("btn-default")

  $("#editWords").removeClass("btn-default")
  $("#editWords").addClass("btn-primary")
  $("#editWords").addClass("active")

  //enable content editable
  $('.words').attr('contenteditable','true');


}else{
  //Editing active 
  $("#editWords").removeClass("active")
  $("#editWords").removeClass("btn-primary")
  $("#editWords").addClass("btn-default")

  $("#highlightWords").removeClass("btn-default")
  $("#highlightWords").addClass("btn-primary")
  $("#highlightWords").addClass("active")

  //disable editable on words 
  $('.words').attr('contenteditable','false');
}


},


makeEditable: function(){

  var status = false;
  if( $("#editWords").hasClass("btn-primary")){
    status = true;
  }else{
    status = false
  }

  if(status){
    //Editing active 
   $("#editWords").removeClass("active")
   $("#editWords").removeClass("btn-primary")
   $("#editWords").addClass("btn-default")


 $("#highlightWords").removeClass("btn-default")
 $("#highlightWords").addClass("btn-primary")
 $("#highlightWords").addClass("active")

 //disable editable on words 
$('.words').attr('contenteditable','false');



}else{
  //disable editing
  $("#highlightWords").removeClass("active")
  $("#highlightWords").removeClass("btn-primary")
  $("#highlightWords").addClass("btn-default")

 $("#editWords").removeClass("btn-default")
 $("#editWords").addClass("btn-primary")
 $("#editWords").addClass("active")

 //enable content editable
 $('.words').attr('contenteditable','true');

 // listener on word changed 

var contents = $('.words').html();

//TODO: input change to event that detect when focus out or somehting else so that i doesn't auto save as typing coz that is super slow...
$( ".words" ).on( "focusout", { model: this.model }, function(event) {
  //pause word 
 var model = event.data.model;
 // console.log("model")
 // console.log(model)
 //   $("#videoId_10")[0].pause();
 //  // $("#videoId_"+ model.attributes.id)[0];

 //  console.log("video")
 //  // console.log(video)
  

// console.log("CALLED")


  var tmpWordId  =  $( this )[0].dataset.wordId;
  var tmpWordText = $( this ).text();
   // _.each(app.TranscriptionsList.get(6).attributes.text, function(paragraphs){

    _.each(model.attributes.text, function(paragraphs){
    _.each(paragraphs, function(paragraph){
      _.each(paragraph, function(lines){
         _.each(lines.line, function(word){

            if(word.id == tmpWordId){
              word.text = tmpWordText
              // console.log("found it")

              model.save({wait: false})
            }        
          })
        })
      })
    })


  });

  }
 
},

playVideoSequenceHelper(seq, model){



   var counterVar = 0;
    
    function playVideoSegments(sequence,counter ){

      //TODO: change video to media, so that it can be video or audio 

      // console.log("calling playVideoSegments "+ counter)
    // initialised counter to play video segments in the array    
    var video =  $("#"+ sequence[counter].videoId)[0]
// console.log("SEQ")
// console.log(sequence[counter])
// console.log("OGG")
// console.log(sequence[counter].videoOgg)
    //base case, playing first video segment in sequence

    var videoSrc = sequence[counter].videoOgg;

    if(window.userAgentSafari){
       videoSrc = sequence[counter].audioFile;
    }else{
       // videoSrc = sequence[counter].videoOgg;
         if(model.attributes.processedVideo){
          videoSrc = sequence[counter].videoOgg;
        }else{
            videoSrc = sequence[counter].audioFile;
        }

    }



    var inPoint  = sequence[counter].startTime;
    var outPoint = sequence[counter].endTime;
    // helper function to play one video segment
    // console.log(sequence[counter])
          video.src = videoSrc + "#t="+inPoint+","+outPoint;
          // console.log(video.src);
          video.load;
          video.play();
            // console.log("yo");
         
    

           video.addEventListener("timeupdate", function() {

          if (video.currentTime > outPoint) {
            // console.log("counter")
            //   console.log(counter)
            //   console.log("sequence.length")
            //   console.log(sequence.length)
            if(counter < sequence.length-1){
              // console.log("go in here?")
              counter += 1;

                playVideoSegments(sequence,counter);
            }
             
                         // videoSrc = sequence[i].videoOgg;
             // inPoint  = sequence[i].startTime;
             // outPoint = sequence[i].endTime;
      //    counter += 1;
            
          }}, false);


      }
    ///////////////

  playVideoSegments(seq,counterVar)

},

playPreviewChrono: function(){
  //https://jsfiddle.net/pietrops/dyxpws41/ 

  //TODO: This should work also when is audio only
  //use boolean of processed audio/video check db etc..
  //and if video use code to play video sq
  //if audio use code to play audio sq
  // alert("playPreviewChrono")

  // config  = { 
  var  seq = this.model.get("highlights")

 this.playVideoSequenceHelper(seq, this.model)


},


//play preview selection order 
playPreviewSelOrd: function(){

   var selections = this.model.get("highlights");

   var   selectionsSorted =  _.sortBy(selections, function(o) { return o.paperCutOrder; })
  
   this.playVideoSequenceHelper(selectionsSorted, this.model)

},




exportHelper(config){

if(config.fileContent == ""){
  alert("File "+config.fileName+" seems to be empty")
}

  var fileName    =  config.fileName; //this.title _ + append time of day to name
  var fileContent =  config.fileContent;
  var urlId       = config.urlId;

   if(window.frontEndEnviromentNWJS){
       var fs = require("fs");
      fs.writeFileSync(process.env.HOME+"/Desktop/"+fileName, fileContent );
       alert(fileName+" Saved on the desktop");
    }else{
      //if client side not running inside NWJS then 
      //creates a blob on the client size 
      var formBlob = new Blob([fileContent], { type: 'text/plain' });
      //replaces link for EDL button with link to blob
      $(urlId).attr("href",  window.URL.createObjectURL(formBlob));
      //make link downloadable and set file name for downloaded file
      $(urlId).attr("download", fileName);
      // someLink.href = window.URL.createObjectURL(formBlob);
      $(urlId).click()
     // document.getElementById('test').click();
     // alert("export EDL client side");
    } 

  },

  nameFileHelper(name, ext){
    return ""+name.replace(" ", "_") +"_"+ timeNowFileName() +"."+ext;
  },


  //EDL - Chronological

  exportEdlChronological: function(e){

    var edlSq = {  "title": this.model.get("title"), offset: this.model.get("metadata").timecode}
    edlSq.events = [];
    //ad line number to paper-cuts
    //NOTE: here you can decide to sort them chronologically(ie by startTime)
     //TODO: this could probably be moved in the model . eg return chrone order hiligths 
    for(var k = 0; k<  this.model.attributes.highlights.length; k++){
      var event =  this.model.attributes.highlights[k]
      event.id = k+1;
      edlSq.events.push(event)
    }
    //end move in model

    var edl = new EDL(edlSq)
   
    var edlFileName = this.nameFileHelper(this.model.get("title")+"_chronological","edl"); 
  
    this.exportHelper({fileName: edlFileName, fileContent: edl.compose(), urlId: "#exportEdlChronological"})
  
  },



  //EDL - Selection order


  exportEdlSelectionOrder: function(e){
  
      var edlSq = {  "title": this.model.get("title"), offset: this.model.get("metadata").timecode}

      edlSq.events = [];

      //TODO: this could probably be moved in the model . eg return selection order hiligths 
    var selections = this.model.get("highlights");

    var   selectionsSorted =  _.sortBy(selections, function(o) { return o.paperCutOrder; })

    for(var k = 0; k<  selectionsSorted.length; k++){
      var event =  selectionsSorted[k]
      event.id = k+1;
      edlSq.events.push(event)
    }
    // end of move in the model 

    // console.log(process.env.HOME )

    var edl = new EDL(edlSq)

    var edlFileName = this.nameFileHelper(this.model.get("title")+"_selection_order","edl"); 

    //if client side running inside NWJS then do this 

    this.exportHelper({fileName: edlFileName, fileContent: edl.compose(), urlId: "#exportEdlSelectionOrder"})

  },


   // var tpl =  _.template($('#transcriptionTimecodedPlainTextTemplate').html());
    
   //   tmp = tpl(this.model.attributes);
     
   //   tmp = tmp.replace(/\s+/g, ' ').trim().replace(/%SEPARATOR%/g,"\n")


  // Captions 
  expoertCaptionsSrt: function(){
    //ISSUE: not working client side only.

    // var tpl =  _.template($('#transcriptionSrtTemplate').html());
     // var srtFileContent = tpl(this.model.attributes);
     // srtFileContent = srtFileContent.replace(/\s+/g, ' ').trim().replace(/%SEPARATOR%/g,"\n")
    var fileName = this.nameFileHelper(this.model.get("title"),"srt"); 
    //this.exportHelper({fileName: fileName, fileContent: srtFileContent, urlId: "#expoertCaptionsSrt"});

 var srtFileContent =  this.model.constructor.returnSrtContent(this.model.get("text"));

this.exportHelper({fileName: fileName, fileContent: srtFileContent, urlId: "#expoertCaptionsSrt"});

    

  },

  expoertCaptionsSrtEDL: function(){
    //ISSUE: not working client side only.
    //ISSUE: papercuts selections, ammount of text per seelection might not be the optimal ammount for srt displaying on screen.

    var srtFileContent =  this.model.constructor.returnEDLSrtJson(this.model.get("highlights"));

    var fileName = this.nameFileHelper(this.model.get("title")+"_EDL","srt"); 

    this.exportHelper({fileName: fileName, fileContent: srtFileContent, urlId: "#expoertCaptionsSrtEDL"});

  },

  // Plain Text - Transcription 
  exportPlainText: function(){
    //NOTE: temporary patch 
    //Better implementation is to fetch this from db, or have model function that 
    //organises and formats the text properly 

    //TODO: if want to add speaker names, before paragraph, get this from backend.

    var tmp = $(".words").text().replace(/%HESITATION /g, "\n\n");

    var plainTextFileName = this.nameFileHelper(this.model.get("title"),"txt"); 
 

    this.exportHelper({fileName: plainTextFileName, fileContent: tmp, urlId: "#exportPlainText"})
  },


  //Timecoded - Transcription
  exportTimecodedTranscription: function(){
    //TODO in model, make timecoded plain text demo
    var tmp =  "Timecoded text demo"

    // var tpl =  _.template($('#transcriptionTimecodedPlainTextTemplate').html());
    
     // tmp = tpl(this.model.attributes);
     
     // tmp = tmp.replace(/\s+/g, ' ').trim().replace(/%SEPARATOR%/g,"\n")



    var plainTextTimecoded =  this.model.constructor.returnPlainTextTimecoded(this.model.attributes);

    var textFileName = this.nameFileHelper(this.model.get("title"),"txt"); 

    this.exportHelper({fileName: textFileName, fileContent: plainTextTimecoded, urlId: "#exportTimecodedTranscription"})
  },

  //EDL - Plain Text 

  exportPlainTextEDL: function(){
    // ISSUE: it doesn't work in client side browser only mode

     var paperCuts = this.model.get("highlights");

     var tmp =makePlainText(paperCuts);

     var textFileName = this.nameFileHelper(this.model.get("title")+"_EDL","txt"); 

   
    this.exportHelper({fileName: textFileName,fileContent: tmp, urlId: "#exportPlainTextEDL"})


        function makePlainText(paperCuts){
          var result ="";
          for(var i =0; i< paperCuts.length; i++){
            result += "["+paperCuts[i].speaker+"]" +"\n";
            result += paperCuts[i].text +"\n\n";
          }
          return result;
        }

  },

  exportPlainTextEDLSelOrder: function(){

      var paperCuts = this.model.get("highlights");
      var   selectionsSorted =  _.sortBy(paperCuts, function(o) { return o.paperCutOrder; })

     var selections =makePlainText(selectionsSorted);

     var textFileName = this.nameFileHelper(this.model.get("title")+"_EDL","txt"); 

   
    this.exportHelper({fileName: textFileName,fileContent: selections, urlId: "#exportPlainTextEDLSelOrder"})


        function makePlainText(paperCuts){
          var result ="";
          for(var i =0; i< paperCuts.length; i++){
             result += "["+paperCuts[i].speaker+"]" +"\n";
            result += paperCuts[i].text +"\n\n";
          }
          return result;
        }


  },

  //EDL - Timecoded  Plain Text
  exportPlainTimecodedTextEDL: function(){

    //ISSUE: in browser client side mode, doesn't seem to be making the paper-cuts it just returns the words, why?

      function makeTimecodedPlainText(paperCuts){
          var result ="";
          for(var i =0; i< paperCuts.length; i++){
            //convert with timecode function
            result += "["+fromSeconds(paperCuts[i].startTime) +"\t";
            result += fromSeconds(paperCuts[i].endTime) +"\t";
            result += paperCuts[i].speaker+"]" +"\n";
            result += paperCuts[i].text +"\n\n";
          }
          return result;
        }

    // alert("export plain text")
    //TODO: make funciton to add heard with transcriptions details
    //metadata, file name, etc..

    var paperCuts = this.model.get("highlights");

    var tmp =makeTimecodedPlainText(paperCuts);

    var textFileName = this.nameFileHelper(this.model.get("title")+"_EDL","txt"); 
   
    this.exportHelper({fileName: textFileName,fileContent: tmp, urlId: "#exportPlainTimecodedTextEDL"})
      

  },


  exportPlainTimecodedTextEDLSelOrder: function(){

      function makeTimecodedPlainText(paperCuts){
          var result ="";
          for(var i =0; i< paperCuts.length; i++){
            //convert with timecode function
            result += "["+fromSeconds(paperCuts[i].startTime) +"\t";
            result += fromSeconds(paperCuts[i].endTime) +"\t";
            result += paperCuts[i].speaker+"]" +"\n";
            result += paperCuts[i].text +"\n\n";
          }
          return result;
        }

    // alert("export plain text")
    //TODO: make funciton to add heard with transcriptions details
    //metadata, file name, etc..

    var paperCuts = this.model.get("highlights");

    var   selectionsSorted =  _.sortBy(paperCuts, function(o) { return o.paperCutOrder; })

    var tmp =makeTimecodedPlainText(selectionsSorted);

    var textFileName = this.nameFileHelper(this.model.get("title")+"_EDL","txt"); 
   
    this.exportHelper({fileName: textFileName,fileContent: tmp, urlId: "#exportPlainTimecodedTextEDL"})
      

  },

  //JSON - Transcription 
  exportJsonTranscription: function(){

    var transcription = this.model.attributes;
    var tmpTranscription = JSON.stringify(transcription);

    var jsonFileName = this.nameFileHelper(this.model.get("title"),"json");  
// JSON.stringify(tmpTranscription, null, 4) 
    this.exportHelper({fileName: jsonFileName,fileContent: tmpTranscription, urlId: "#exportJsonTranscription"})
      
  },


  //JSON - EDL 

   exportJsonEDL: function(){

    var paperCuts = this.model.get("highlights");
    var tmpPaperCuts = JSON.stringify(paperCuts);

    var jsonFileName = this.nameFileHelper(this.model.get("title")+"_EDL","json");  

    this.exportHelper({fileName: jsonFileName,fileContent: tmpPaperCuts, urlId: "#exportJsonEDL"})

   },


   exportJsonEDLSelOrder: function(){


      var paperCuts = this.model.get("highlights");
      var   selectionsSorted =  _.sortBy(paperCuts, function(o) { return o.paperCutOrder; })
    var tmpPaperCuts = JSON.stringify(selectionsSorted);

    var jsonFileName = this.nameFileHelper(this.model.get("title")+"_EDL","json");  

    this.exportHelper({fileName: jsonFileName,fileContent: tmpPaperCuts, urlId: "#exportJsonEDLSelOrder"})

   },


  //HTML5 Video Web m 

//var fs = require('fs');
// fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'))?
//only available in nwjs>

exporthtml5Video: function(){
  if(window.frontEndEnviromentNWJS){
    if(this.model.attributes.processedVideo){
      var fs = require('fs');
      
      var path = require("path")
      var input = path.resolve(this.model.attributes.videoOgg)

      var output = process.env.HOME+"/Desktop/"+ 
      path.parse(this.model.attributes.videoOgg).base

      fs.createReadStream(input).pipe(fs.createWriteStream(output));
      alert("File saved on desktop")
     }else{
        alert("Video is still being converted, try again later")
     }
   }else{
    alert("Feature not availeble in this context ")
  }
},

  //Audio Wav 


exportAudio: function(){
  
  if(window.frontEndEnviromentNWJS){
     if(this.model.attributes.processedAudio){
        var fs = require('fs');
        
        var path = require("path")
        var input = path.resolve(this.model.attributes.audioFile)

        var output = process.env.HOME+"/Desktop/"+ 
        path.parse(this.model.attributes.audioFile).base

        fs.createReadStream(input).pipe(fs.createWriteStream(output));
        alert("File saved on desktop")
     }else{
        alert("Audio is still being converted, try again later")
     }
  }else{
    alert("Feature not availeble in this context ")
  }
},

//export/copy file helper

// exportCopyFile(filePath){
//     if(window.frontEndEnviromentNWJS){
//       // if(processedAudio){
//         var fs = require('fs');
//         var path = require("path")
//         var input = path.resolve(filePath)
//         var output = process.env.HOME+"/Desktop/"+ 
//         path.parse(filePath).base
//         fs.createReadStream(input).pipe(fs.createWriteStream(output));
//       // }else{
//       //   alert(" is still being converted, try again later")
//       // }
        
//     }else{
//       alert("Feature not availeble in this context ")
//   }
// },



//HTML5 Web page 
//TODO see if can use script template from show page, or if need to make custom one, with 
//link to remote bootstrap, and adding json of transcription exporting in the page as var, so that it's all self
//contained
//linking to video as if video was in same folder, same as for audio 

  // exportTimecodedTranscription: function(){
  //   //TODO in model, make timecoded plain text demo
  //   var tmp =  "Timecoded text demo"

  //   var template =  _.template($('#transcriptionPlainTextTemplate').html());
    
  //      var timecodedTranscription = template(this.model.attributes);
     


  //   var textFileName = this.nameFileHelper(this.model.get("title"),"txt"); 

  //   this.exportHelper({fileName: textFileName, fileContent: timecodedTranscription, urlId: "#exportTimecodedTranscription"})
  // },


  selectingWords: function(e){
    /*
    *
    * https://stackoverflow.com/questions/11300590/how-to-captured-selected-text-range-in-ios-after-text-selection-expansion
    * 
    *  https://jsfiddle.net/JasonMore/gWZfb/
    */
    var selectedRange = null;
   
     if (window.getSelection) {
       selectedRange = window.getSelection().getRangeAt(0).cloneContents();
       // console.log("window")
      } else {
        selectedRange = document.getSelection().getRangeAt(0).cloneContents();
        // console.log("document")
      }


    var selectedElements = $(selectedRange).find('span');
    //first element of selection
    var firstElement = $(selectedRange).find('span')[0];

    var elemCount = $(selectedRange).find('span').length ;
    //last element
    var lastElIndex =elemCount - 1;
    //last element of selection
    var lastElement = $(selectedRange).find('span')[lastElIndex]

       
       var tmpCounter = this.model.get("counterForPaperCuts")
      

    for(var i = 0; i < elemCount; i++){
      var element = $(".words[data-start-time='"+selectedElements[i].dataset.startTime.toString()+"']");

      if(element.hasClass( "highlight" )){
        element.removeClass("highlight");
        //remove addedCounter from element
        //decrease counter of addedCounter in transcription
        var tmpCounter = this.model.get("counterForPaperCuts")
        // this.model.set({counterForPaperCuts: tmpCounter-1 })
        element.removeData( "counterForPaperCuts" );

      }else {
        element.addClass("highlight");
        // elemt.add addedCounter

        //increment added counter in transcription
        this.model.set({counterForPaperCuts: tmpCounter+1 })
        element.data( "paper-cut-order", tmpCounter+1 );

      }
    }

   var m =  this.model;
      //overwright/set the highlights
      this.model.set({highlights:  this.makePaperEdit($(".words").filter(".highlight"), m) })
      //save the model
      this.model.save({wait: false})
  },


  search:function(e){
    // alert("searching")
    var searchedText = $(e.currentTarget).val();
    searchTextArray = searchedText.split(" ");

    //TODO: need to resest the search
    //make search as a
    $(".words").removeClass("searched")
    // $( 'p:contains('+searchedText+')' ).css( "text-decoration", "underline" );

    if(searchTextArray.length > 0){
      for(var i = 0; i < searchTextArray.length; i++){
       
      $('.words[data-text='+searchTextArray[i]+']').addClass("searched")
      }

    }
  },

  playWord: function(e){

    var wordStartTime = e.currentTarget.dataset.startTime;
    var videoIdElem="#"+e.currentTarget.dataset.videoId;
    var videoElem = $(videoIdElem)[0];
    videoElem.currentTime = wordStartTime;
    videoElem.play();

    var vid = document.getElementById(e.currentTarget.dataset.videoId);

    vid.ontimeupdate = function() {
      $("span.words").filter(function() {
        if($(this).data("start-time") < $(videoIdElem)[0].currentTime){
          $(this).removeClass( "text-muted" )
        }else{
          $(this).addClass("text-muted")
        }
      })
    };


  },

  clearHighlights: function(){

    var r = confirm("You are about to clear all of the highlights selections from this transcription. Press Ok to continue or Cancel to abort");

      if (r == true) {
          // txt = "You pressed OK!";
            $(".words").filter(".highlight").removeClass("highlight");
            // .removeData( "counterForPaperCuts" );
            //  this.model.set({counterForPaperCuts: 0 })
            this.model.set({highlights:  [] });
            // this.model.save({wait: false});
      } else {
          // txt = "You pressed Cancel!";
          alert("relax, nothing was cancelled")
      }

  },

/**
* gets a a papercut sequence from hilighted words
*/

 makePaperEdit: function (selection, model){

  /**
  * Groups words from selection into array of contiguos words
  * uuses modified version of this code to divide contiguos numbers 
  https://stackoverflow.com/questions/22627125/grouping-consecutive-elements-together-using-javascript
  */

  //   console.info("this.model")
  // console.info(this.model)

  function groupContiguosWordsInPapercuts(selectedWords){
    var result = [], temp = [], difference;
  // console.log("$(selectedWords)")
  // console.log($(selectedWords))
    for (var i = 0; i < selectedWords.length; i += 1) {
      // console.log("$(selectedWords[i])")
      // console.log($(selectedWords[i]))

      $(  $(".words")[1]  )

      var wordId = $($(selectedWords[i]) ).data("word-id") 
      // console.log("wordId")
      // console.log(wordId)
      
        if (difference !== ( wordId- i)) {
            if (difference !== undefined) {
                result.push(temp);
                temp = [];
            }
            difference = wordId - i;
        }
        temp.push(selectedWords[i]);
    }

    if (temp.length) {
        result.push(temp);
    }
    // console.log("CONTIGUOS")
    // console.log(result)
    return result;
  }

  /**
  * Makes papercuts of group of words.
  * by taking start of first word and end of last word.
  */

  function makeSection(arrayOfPapercuts){
    var result=[]
    for(var i = 0; i< arrayOfPapercuts.length; i++){
      var firstWord = arrayOfPapercuts[i][0];
      var lastWord = arrayOfPapercuts[i][arrayOfPapercuts[i].length -1];

      // get text 
      //TODO: iterate from first word to last word 
      //use  0 as starting point 
      //arrayOfPapercuts[i].length -1 as end point 
      //iterate over arrayOfPapercuts[i] 
      var words = [];
      var selectionText = "";
      for(var j =0; j< (arrayOfPapercuts[i].length -1 ); j++){
      // 
      // console.log($(arrayOfPapercuts[i][j]).data("text"))
        var wordText = $(arrayOfPapercuts[i][j]).data("text");

        //TODO:recreate word from data attributes
        var word =   {
                    "id": $(arrayOfPapercuts[i][j]).data("word-id"),
                    "text":  $(arrayOfPapercuts[i][j]).data("text"),
                    "startTime":  $(arrayOfPapercuts[i][j]).data("start-time"),
                    "endTime": $(arrayOfPapercuts[i][j]).data("end-time")

                    //Add other 
                      //reel name
                      //clip name
                      //video id
                      //transcription id
                      //paragraph id
                      //line id 
                      //speaker

                      //video url ogg 

                      //audio url 

                  };
        //TODO: add the word to the words array 
        words.push(word)

        selectionText+=wordText+" ";
      }

           model.attributes.counterForPaperCuts +=1;

      var paperCut = {
          id: i,
          paperCutOrder: model.attributes.counterForPaperCuts ,
     
          
          startTime: $(firstWord).data("start-time") ,
          endTime:  $(lastWord).data("end-time"),
          reelName: $(firstWord).data("reel-name"),
          clipName: $(firstWord).data("clip-name"),
            
          speaker: $(firstWord).data("speaker"),
          // wordId: $(firstWord).data("word-id"),
          // lineId: $(firstWord).data("line-id"),
          // paragraphId: $(firstWord).data("paragaph-id"),
          transcriptionId: $(firstWord).data("transcription-id"),
          videoId: $(firstWord).data("video-id"),
          videoOgg: $(firstWord).data("src"),
          audioFile: $(firstWord).data("audioFile"),
          text: selectionText,
          words: words


          //TODO: Add the word array of selection to the papercut
             
        } 

        result.push(paperCut)

    }
    // console.log("makeSelection")
    // console.log(result)
    return result;
  }

  return makeSection(groupContiguosWordsInPapercuts(selection));


},

  template: _.template($('#transcriptionShow').html()),

  render: function(){    
    // temporary patch
    console.log("this.model.attributes._id")
    console.log(this.model.attributes._id) 
     console.log(this.model.attributes.id)
      console.log(this.model.toJSON())  
    this.model.attributes._id;
    this.model.attributes.id = this.model.attributes._id;
    //end of temporary patch

    var sectionTemplate = this.template(this.model.attributes);
    this.$el.html(sectionTemplate);


      //modify compiled template to update hilights. 
      var tmpHighlights =  this.model.get("highlights")

      for(var i = 0; i < tmpHighlights.length; i++ ){
        var min =  tmpHighlights[i].startTime ;
        var max = tmpHighlights[i].endTime ;

        //needs to grab the words of the element of the view not in the dom        
        this.$(".words").filter(function(){
            return $(this).data('start-time') >= min && $(this).data('end-time') <= max;
        }).addClass("highlight");
      } 
      ///end of modify compiled template to update hilights. 

    return this;
  }

 });

