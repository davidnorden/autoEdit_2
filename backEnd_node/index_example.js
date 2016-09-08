	
var interactiveTranscriptionGenerator = require('./interactive_transcription_generator/index.js')

var keys = require("/Users/pietropassarelli/Dropbox/CODE/Vox/TBVE/Lotus_v11/wttskeys.json")

interactiveTranscriptionGenerator.generate({
	videoUrl: "/Users/pietropassarelli/Dropbox/CODE/Vox/transcriber_project/stt_gentle_component/norman_door_trimmed2.mp4",
	// videoUrl: "/Users/pietropassarelli/Movies/VideoNow/Video\ Now\ Report\ \(2014\)-\ \ An\ interview\ with\ Brian\ Storm\ Founder\ \&\ Executive\ Producer\ MediaStorm\ -\ MediaStorm-HD.mp4",
	title: "Normna Door Trimmed",
	description: "Testing out this module ", 
	tmpWorkFolder: "/",
	destFolder:"/" ,
	keys: keys,
	cbTranscription: function(resp){
		console.log(JSON.stringify(resp))
	}, 

	cbMetadata:function(resp){
		console.log(resp)
	},
	cbVideo: function(resp){
		console.log(resp)
	}
})