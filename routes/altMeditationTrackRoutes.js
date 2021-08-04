const express = require('express');
const altMeditationTrackRoute = express.Router()


const altMeditationController=require('../controllers/altMeditationController')
const { title } = require('process');

// GET  /api/meditation/download/trackID  --fetching perticular audio file by replacing trackName in url with audio filename
altMeditationTrackRoute.get('/altDownload/:trackID',altMeditationController.download);


module.exports = altMeditationTrackRoute;