const express = require('express');
const router = express.Router();

/*----- /test/ routes -----*/

router.get('/', (req,res) => {
    res.send(req.originalUrl);
});

router.get('/pagecount', (req, res) => {
    if(req.session.count) req.session.count += 1;
    else req.session.count =1;
    res.send(`You have visited ${req.session.count} times`);
});

router.delete('/', (req, res) => {
    res.send('successfully arrived');
});


module.exports = router;