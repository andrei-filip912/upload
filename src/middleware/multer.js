const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('movie');

const parser = new DatauriParser();

// function that converts the buffer to data uri
const dataUri = (req) => {  //req conatians the file object
   return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer).content;
};

module.exports =  {multerUploads, dataUri};