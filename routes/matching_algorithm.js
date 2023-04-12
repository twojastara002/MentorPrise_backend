const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()

const preferenceRouter = require('./preference')
const matchRouter = require('./match')

router.get('/match_for_:user', (req, res) => {

    //pull the preferences of a user first, if not any then abort
    let user = req.params.user
    let userType = ''
    let currentUserPreferences = []

    userID = user.substring(0, user.indexOf('@'))

    //get the type of user
    fs.readFile('./data/users/users.txt', 'utf8', (err, data) => {
        let rows = data.split(';') //file into array 
        let rows2 = [[]] //create second array

        rows.forEach(row => { //create 2 dim array with all records
            for (let x = 0; x < rows.length; x++) {
                rows2[x] = rows[x].split(',')
            }
        });

        rows2.forEach(row => { //look through users
            if (user == row[0]) {
                userType = row[5]
            }
        });
    })

    // check if the preference file exists
    if (fs.existsSync('./data/preferences/preferenceFor' + userID + '.txt')) {
        //read the file 
        fs.readFile('./data/preferences/preferenceFor' + userID + '.txt', 'utf8', (err,data) => {
            if (err) { //something went wrong
                res.send('internal server error')
                throw err
            } else { // no error
                currentUserPreferences = data.split(',') //read the data from the file into an array
            }
        })
    } else {
        //say that there are no preference files for user with ID @userID
        res.send('No preference found for the user: ' + user)
        return
    }

    if (!res.headersSent) {
    //pull the preferences of all users with opposite type
        let availablePreferences = []
        let availableUser = []
        fs.readdir('./data/preferences', (err,files) => {
            files.forEach(file => {
                if (file != '.DS_Store') {
                    fs.readFile('./data/preferences/' + file, 'utf8', function (err, data) {
                        let tmpArray = data.split(',')

                        //check the types of users assigned to the preference records
                        fs.readFile('./data/users/users.txt', 'utf8', (err, data) => {
                            let rows = data.split(';') //file into array 
                            let rows2 = [[]] //create second array

                            rows.forEach(row => { //create 2 dim array with all records
                                for (let x = 0; x < rows.length; x++) {
                                    rows2[x] = rows[x].split(',')
                                }
                            });
    
                            rows2.forEach(row => { //look through users
                                if ((tmpArray[0] == row[0]) && (userType != row[5])) {
                                    //users that are opposite types and have a preference profile
                                    availableUser.push(row)
                                    availablePreferences.push(tmpArray)

                                    // console.log(availablePreferences)
                                    // console.log(availableUser)
                                }
                            });
                            console.log(availablePreferences)
                            console.log(availableUser)
                        })
                    })
                }
            })

            console.log('w ' + availablePreferences)
            console.log('w ' + availableUser)
            
            //when a mentor is looking the year exp is reversed 


        //look for the best match based on all metrics: dept -> city -> exp

        //return the name and email of the chosen user
        })
        // console.log(availablePreferences)
        // console.log(availableUser)
        res.send('i hate this ')

    }
})   

module.exports = router