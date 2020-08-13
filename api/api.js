const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user');
mongoose.connect('mongodb+srv://satviksharma:sharma123@cluster0.bbaoc.mongodb.net', {useNewUrlParser: true, useUnifiedTopology: true });



const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

/**
 * @api {get} /api/devices AllDevices An array of all devices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 * [
 * {
 * "_id": "dsohsdohsdofhsofhosfhsofh",
 * "name": "Mary's iPhone",
 * "user": "mary",
 * "sensorData": [
 * {
 * "ts": "1529542230",
 * "temp": 12,
 * "loc": {
 * "lat": -37.84674,
 * "lon": 145.115113
 * }
 * },
 * {
 * "ts": "1529572230",
 * "temp": 17,
 * "loc": {
 * "lat": -37.850026,
 * "lon": 145.117683
 * }
 * }
 * ]
 * }
 * ]
 * @apiErrorExample {json} Error-Response:
 * {
 * "User does not exist"
 * }
 */

app.get('/api/test', (req, res) => {
 res.send('The API is working!');
});
/**
 * @api {get} /api/devices AllDevices An array of all devices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 * [
 * {
 * "_id": "dsohsdohsdofhsofhosfhsofh",
 * "name": "Mary's iPhone",
 * "user": "mary",
 * "sensorData": [
 * {
 * "ts": "1529542230",
 * "temp": 12,
 * "loc": {
 * "lat": -37.84674,
 * "lon": 145.115113
 * }
 * },
 * {
 * "ts": "1529572230",
 * "temp": 17,
 * "loc": {
 * "lat": -37.850026,
 * "lon": 145.117683
 * }
 * }
 * ]
 * }
 * ]
 * @apiErrorExample {json} Error-Response:
 * {
 * "User does not exist"
 * }
 */
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
    return res.send(err);
    } else {
    return res.send(devices);
    }
});
});   

app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
    name,
    user,
    sensorData
    });
    newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
});
});

app.post('/api/send-command', (req, res) => {
   console.log(req.body);
});
      
app.post('/api/authenticate', (req, res) => {
    const {user, password} = req.body;
    console.log(req.body);
    User.findOne({name:user},(err,found) => {
    if( err )
    {
        return res.send(err);
    }
    else if(!found)
    {
        return res.send('Sorry. We cant find any such username');
    }
    else if(found.password != password)
    {
        return res.send('The password is invalid');
    }
    else
    {
        return res.json({
            success: true,
            message: 'Authenticated successfully',
            isAdmin: found.isAdmin
           });
    }
});
});  

app.post('/api/registration', (req, res) => {
    const {user, password,isAdmin} = req.body;
    console.log(req.body);
User.findOne({name:user},(err,found) => {
if( err )
{
    return res.send(err);
}
else if(found)
{
    return res.send('User already exists');
}
else{
const newUser = new User({
    name: user,
    password,
    isAdmin
   });
   newUser.save(err => {
    return err
    ? res.send(err)
    : res.json({
    success: true,
    message: 'Created new user'
    });
   });
}
});
});

/**
 * @api {get} /api/devices AllDevices An array of all devices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 * [
 * {
 * "_id": "dsohsdohsdofhsofhosfhsofh",
 * "name": "Mary's iPhone",
 * "user": "mary",
 * "sensorData": [
 * {
 * "ts": "1529542230",
 * "temp": 12,
 * "loc": {
 * "lat": -37.84674,
 * "lon": 145.115113
 * }
 * },
 * {
 * "ts": "1529572230",
 * "temp": 17,
 * "loc": {
 * "lat": -37.850026,
 * "lon": 145.117683
 * }
 * }
 * ]
 * }
 * ]
 * @apiErrorExample {json} Error-Response:
 * {
 * "User does not exist"
 * }
 */
app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const {sensorData} = devices;
    return err
    ? res.send(err)
    : res.send(sensorData);
    });
});
/**
 * @api {get} /api/devices AllDevices An array of all devices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 * [
 * {
 * "_id": "dsohsdohsdofhsofhosfhsofh",
 * "name": "Mary's iPhone",
 * "user": "mary",
 * "sensorData": [
 * {
 * "ts": "1529542230",
 * "temp": 12,
 * "loc": {
 * "lat": -37.84674,
 * "lon": 145.115113
 * }
 * },
 * {
 * "ts": "1529572230",
 * "temp": 17,
 * "loc": {
 * "lat": -37.850026,
 * "lon": 145.117683
 * }
 * }
 * ]
 * }
 * ]
 * @apiErrorExample {json} Error-Response:
 * {
 * "User does not exist"
 * }
 */
app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
    });
   });
   
   
app.listen(port, () => {
 console.log(`listening on port ${port}`);
});
