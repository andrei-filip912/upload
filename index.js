const express = require('express');
const app = express();
const port = 4000;

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => res.json({ message: 'Hello world!'}));

app.post('/movies/upload', upload.single('movie'), function (req, res, next) {
	console.log('Movie', req.file);  
});


app.listen(port, () => console.log('Listening to port 4000'));

