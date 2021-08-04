const MeditationTrack=require('../models/MeditationTracksModel');
const fs = require('fs');
const path = require('path');
let staticFilesPath = path.join(__dirname, '../static');


exports.allMeditationTracks=(req, res)=>{
    
    MeditationTrack.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: "error", error: err});
        }
        return res.status(200).json(docs);
    })
}


exports.upload=async (req, res) => {
    const { title, artist, description, isPremium}=req.body;

    const newMeditationTrack = await MeditationTrack.create({
        title: title,
        artist: artist, 
        description: description,
        isPremium: isPremium
    })
    return res.json(newMeditationTrack);

};

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
    
        let positions = range.replace(/bytes=/, "").split("-");
        let start = parseInt(positions[0], 10);
        let total = fs.statSync(audioPath).size;
        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        let chunksize = (end - start) + 1;
    
        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": 'audio/mp3'
        });
    
        fs.createReadStream(audioPath, { start: start, end: end, autoClose: true })
        .on('end', function () {
            console.log('Stream Done');
        })
        .on("error", function (err) {
            res.end(err);
        })
        .pipe(res, { end: true });
    })
};