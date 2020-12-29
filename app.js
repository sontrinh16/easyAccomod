const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer  = require('multer');
const fs = require('fs');
const axios = require('axios');
const upload = multer();
const FormData = require('form-data')
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const adminRouter = require('./routers/adminRouter');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandler');

dotenv.config({path: path.join(__dirname, 'config.env')})

// MONGODB CONNECT
const db = mongoose.connection;

mongoose.connect(process.env.MONGO_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connected!'));

db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})

//MIDDLEWARE
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
// app.use(upload.array()); 
app.use(cookieParser());
app.use(cors());

//ROUTERS
//user routes
app.use('/api/user', userRouter);

//post routes
app.use('/api/post', postRouter);

//admin routes
app.use('/api/admin', adminRouter);

app.post('/api/test',upload.single('image') , async (req, res, next) => {
    try{
            //console.log(req.file.buffer)
            let data = new FormData();
            data.append('image', req.file.buffer.toString('base64'));
            console.log(data)
            const imgurData = await axios.post(
                'https://api.imgur.com/3/upload',
                data,
                {
                    headers: {
                        'Authorization': 'Client-ID 546c25a59c58ad7',
                        'content-type': 'multipart/form-data'
                    }
                }
            ) 
            console.log(imgurData)
            res.status(200).json({
                status: 'success'
            });
        }
        catch(err){
            console.log(err.response ? err.response.data.data : err)
        }
})

//invalid routes
app.all('*', (req, res, next) => {
    next(new appError(404, 'invalid URL'));
});

//global error handler
app.use(globalErrorHandler);




//PORT
app.listen(process.env.PORT, () => {
    console.log(`connect to port ${process.env.PORT}`);
})