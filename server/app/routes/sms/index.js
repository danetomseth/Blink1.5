var twilio = require('twilio');
const twilioConfig = require('../../../env').TWILIO;
const router = require('express').Router();
module.exports = router;
const ensure = require('../../configure/authentication/ensure');


// Find your account sid and auth token in your Twilio account Console.
var client = twilio(twilioConfig.accountSID, twilioConfig.authToken);

// Outbound (From Twilio to phone number)
router.post('/', (req, res, next) => {
    // Send the text message.
    client.sendMessage({
        to: req.body.to,
        from: "+8182356602",
        body: req.body.message + "\n Sent from Blink."
        // statusCallback: 'https://60038625.ngrok.io/api/sms/status'
    })
    .then((conf) => {
        console.log(conf);
        res.cookie('myCookie', 'Make it a user id');
        res.send(conf);
    });
})

// Inbound (From cell to web application)
router.post('/incoming', (req, res, next) => {
    console.log("INCOMING MESSAGE COOKIES")

     res.cookie('myCookie', 'HI DANE');
      console.log(req.cookies.sid)

        res.send("Setting cookie");
})

// router.use('/status', (req,res,next) => {
//     console.log(req)
//     res.cookie('sid', req.body.MessageSid)
//     res.send("ya")
// })
