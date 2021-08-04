const fs = require('fs');
const client = require('../redis');
const MeditationTrack=require('../models/MeditationTracksModel');
const path = require('path');
let staticFilesPath = path.join(__dirname, '../static');
const { Readable } = require('stream');

exports.download = (req, res) => {
    console.log("got downloading request")

    const trackID= req.params.trackID;

    MeditationTrack.findById(trackID, (err, docs)=>{
        if(!docs){
            return res.status(404).json({message: "Track not found"})
        }else if(err){
            return res.status(400).json({message: "some thing went wrong"});
        }

        // range headers are requested from frontend
        const range = req.headers.range;
        if (!range) {
            return res.status(400).json({ status: "400", message: "Require range header" });
        }
    
        const audioPath=staticFilesPath + `/meditationTracks/${docs.title}.mp3`;

        storeMp3(audioPath, docs.title);
    
        const audioSize=fs.statSync(audioPath).size;
    
        const CHUNK_SIZE = (10**6)/2; //512kb
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, audioSize-1);
    
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${audioSize}`,
            "Accept-Range": `bytes`,
            "Content-Length": contentLength,
            "Content-Type": "audio/mp3"
        };
    
        res.writeHead(206, headers);
        
        client.getrange(docs.title, start, end, (err, data) => {
            if(err) throw err;
            else {
                let stream = new Readable();
                stream.push(data);
                stream.push(null);

                return stream.pipe(res, {end: true});
            }
        });
    })
};


//store the audio file in redis database for faster streaming.
//Changes to the key is to be done so that the files are stored in memory as the hashmap of userid and playlist
//Once the user closes the app, the audio files in the memory is flushed.
const storeMp3 = (filePath, key) => {
    let audioFile = fs.readFileSync(filePath);
    client.set(key, audioFile, function() {
        client.get(key, err => {
            if(err) throw err;
        })
    });
};