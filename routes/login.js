const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()

router.get('/:user-:password', (req, res) => {
    fs.readFile('./data/users/users.txt', 'utf8', (err, data) => {
        let rows = data.split(';')
        let rows2 = [[]]
        rows.forEach(row => {
            for (let x = 0; x < rows.length; x++) {
                rows2[x] = rows[x].split(',')
            }
        });

        let loggedin = false

        rows2.forEach(row => {
            if (row[0] == req.params.user && row[2] == req.params.password) {
                //login successful
                res.send(row)
                loggedin = true
                // res.send(row[0] + ',' + row[1] + ',' + row[2] + ',' + row[3])
            }
        });

        //login unsuccessful
        if (!loggedin) {
            res.send('Incorrect login.')
            console.log('i get here')
            res.end
        }
      });
})

// router.param('password', (req, res, next, password) => {

//     next()
// })

module.exports = router