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
    let currentUser = req.params.user
    let userType = ''
    let currentUserPreference = []

    userID = currentUser.substring(0, currentUser.indexOf('@'))

    //get the type of user
    let userFile = fs.readFileSync('./data/users/users.txt', 'utf8')
    let rows = userFile.split(';') //file into array 
    let rows2 = [[]] //create second array

    rows.forEach(row => { //create 2 dim array with all records
        for (let x = 0; x < rows.length; x++) {
            rows2[x] = rows[x].split(',')
        }
    });
    rows2.forEach(row => { //look through users
        if (currentUser == row[0]) {
            userType = row[5]
        }
    });
    

    // check if the preference file exists
    if (fs.existsSync('./data/preferences/preferenceFor' + userID + '.txt')) {
        //read the file 
        let preferenceFile = fs.readFileSync('./data/preferences/preferenceFor' + userID + '.txt', 'utf8')
        currentUserPreference = preferenceFile.split(',') //read the data from the file into an array
    } else {
        //say that there are no preference files for user with ID @userID
        res.send('No preference found for the user: ' + currentUser)
        return
    }

    if (!res.headersSent) {
    //pull the preferences of all users with opposite type
        let availablePreferences = []
        let availableUsers = []

        fs.readdir('./data/preferences', (err,files) => {
            files.forEach(file => {
                if (file != '.DS_Store') {
                    let preferenceFile = fs.readFileSync('./data/preferences/' + file, 'utf8')
                    let tmpArray = preferenceFile.split(',')

                    //check the types of users assigned to the preference records
                    userFile = fs.readFileSync('./data/users/users.txt', 'utf8')
                    let rows = userFile.split(';') //file into array 
                    let rows2 = [[]] //create second array

                    rows.forEach(row => { //create 2 dim array with all records
                        for (let x = 0; x < rows.length; x++) {
                            rows2[x] = rows[x].split(',')
                        }
                    });

                    rows2.forEach(row => { //look through users
                        if ((tmpArray[0] == row[0]) && (userType != row[5]) && (tmpArray[0] != currentUser)) {
                            //users that are opposite types, are not the current user and have a preference profile
                            availableUsers.push(row)
                            availablePreferences.push(tmpArray)
                        }
                    });                   
                }
            })

            //look for the best match based on all metrics: dept -> city -> exp
            let highestScore = -1
            let highestAtIndex = -1
            for (let x = 0; x < availablePreferences.length; x++) 
            {
                let score = 0;
                if (currentUserPreference[3] == (availablePreferences[x])[3]) score += 40
                if (currentUserPreference[1] == (availablePreferences[x])[1]) score += 15
                if (currentUser[5] == 'mentor') score += Number(-((availableUsers[x])[3])) //when a mentor is looking the year exp is reversed
                else score += Number((availableUsers[x])[3])
                if (score > highestScore) {
                    highestScore = score
                    highestAtIndex = x
                }
            }
            if (highestAtIndex != -1) {
                //return the name and email of the chosen user
                res.send((availableUsers[highestAtIndex])[0] + ',' + (availableUsers[highestAtIndex])[1])
            } else {
                res.send('No match found for you')
            }
        })
    }
})   

module.exports = router