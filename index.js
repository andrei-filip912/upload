require('dotenv').config();

const express = require('express');
const { urlencoded, json } = require('body-parser');
const cloudinary = require('./config/cloudinaryConfig');
const {multerUploads, dataUri} = require('./middleware/multer');
const mongodb = require('./config/mongodbConfig');
const { jwtCheck } = require('./auth/checkJwt');
const jwt_decode = require('jwt-decode');
// const { checkJwt } = require('../client/src/api/auth0-express-js-sample-main/src/authz/check-jwt');
// const apiRoute = express.Router();


const app = express();
const port = process.env.PORT || 4000;


// app.use(apiRoute);
app.use(urlencoded({ extended: false}));
app.use(json());
// app.use(jwtCheck);


// app.get('/*', (req, res) => res.sendFile(__dirname));
// mongodb.getQuery();
function getUserId(req) {
	var rawToken = req.header('Authorization').split(" ");
	var token = rawToken[1];

	return jwt_decode(token);
}

app.post('/upload',[jwtCheck, multerUploads], function (req, res) {
	if(req.file){
		const file = dataUri(req);
		cloudinary.config();

		return cloudinary.uploader.upload(file).then((result) => {
			const image = result.url;
			
			//jwt decoding
			console.log(jwtDecoding(req));

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

