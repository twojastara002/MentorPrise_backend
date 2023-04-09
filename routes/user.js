const express = require('express')
const router = express.Router()



//dynamics down:

router.get('/:id', (req, res) => {
    res.send('hello user number ' + req.params.id)
})

router.param('id', (req, res, next, id) => {
    next()
})




module.exports = router