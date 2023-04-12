const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Not implemented.')
})

module.exports = router