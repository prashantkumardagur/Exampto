const express = require('express');
const router = express.Router();

/* ----- /dashbaord/ routes ----- */

router.get('/', (req, res) => {
    res.send('Welcome to dashboard');
})

module.exports = router;