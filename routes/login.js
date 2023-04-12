const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()

router.get('/:user-:password', (req, res) => {
    fs.readFile('./data/users/users.txt', 'utf8', (err, data) => {
        let rows = data.split(';') //file into array 
        let rows2 = [[]] //create second array

        rows.forEach(row => { //create 2 dim array with all records
            for (let x = 0; x < rows.length; x++) {
                rows2[x] = rows[x].split(',')
            }
        });

        let loggedIn = false //set login value

        rows2.forEach(row => { //check if any of the records match the values passed by the user
            tmpPassword = row[4]
            tmpLogin = row[0]
            if (tmpLogin == req.params.user && tmpPassword == req.params.password) {
                //login successful
                let returnString = row[0] + ',' + row[1] + ',' + row[4] + ',' + row[5]
                res.send(returnString)
                console.log('Correct login.')
                console.log(returnString)
                loggedIn = true
            }
        });

        //login unsuccessful
        if (!loggedIn) {
            res.send('Incorrect login.')
            console.log('Incorrect login.')
            res.end
        }
      });
})

module.exports = router