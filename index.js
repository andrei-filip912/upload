require('dotenv').config();

const express = require('express');
const { urlencoded, json } = require('body-parser');
// const { resolve } =  require('path');
const cloudinary = require('./config/cloudinaryConfig');
const {multerUploads, dataUri} = require('./middleware/multer');
const mongodb = require('./config/mongodbConfig');


const app = express();
const port = process.env.PORT || 4000;

app.use(urlencoded({ extended: false}));
app.use(json());


// app.get('/*', (req, res) => res.sendFile(__dirname));

mongodb.getQuery();


app.post('/upload', multerUploads, function (req, res) {
	if(req.file){
		const file = dataUri(req);
		cloudinary.config();

		return cloudinary.uploader.upload(file).then((result) => {
			const image = result.url;
			return res.status(200).json({
				messge: 'Your image has been uploded successfully to cloudinary',
				data: {
					image
				},
			});
		}).catch((error) => res.status(400).json({
			messge: 'someting went wrong while processing your request',
			data: {
				err
			},
		}));
	}
});

app.listen(port, () => console.log(`Listening to port ${port}`));

