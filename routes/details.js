const express = require('express')
var router = express.Router()

const jwt = require('jsonwebtoken');


router.get('/', (req, res)  => {
    jwt.verify(req.token, 'secret', function (err, decoded) {
        if (err) {
            //Unauthorized
            res.sendStatus(401)
        } else {
            console.log(decoded)
            //authorized 
            res.json({
                details: decoded.user
            })
        }
    })

})

module.exports = router
