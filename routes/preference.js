const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()

//save files, overrides anything that is there
router.get('/add/:userEmail-:location-:minExperience-:department', (req, res) => {
    let user = req.params.userEmail
    let location = req.params.location
    let minExperience = req.params.minExperience
    let department = req.params.department

    //compose the write message
    let writeString = user + ',' + location + ',' + minExperience + ',' + department

    userID = user.substring(0, user.indexOf('@'))


    // write the file 
    fs.writeFile('./data/preferences/preferenceFor' + userID + '.txt', writeString, 'utf8', function(err) {
        if (err) { //something went wrong
            console.log('file NOT saved')
            res.send('Preference failed to save.')
        } else { // no error
            console.log('Preference saved successfully.')
            res.send('Preference saved successfully.')
        }
    })
})

//remove the file
router.get('/remove/:userEmail', (req, res) => {
    let user = req.params.userEmail
    userID = user.substring(0, user.indexOf('@'))
    let filepath = './data/preferences/preferenceFor' + userID + '.txt'

    if (fs.existsSync(filepath)) {
        // unlink(remove) the file 
        fs.unlink(filepath, (err) => {
            if (err) { //something went wrong
                console.log('file NOT removed')
                res.send('Preference failed to remove.')
            } else { // no error
                console.log('Preference removed successfully.')
                res.send('Preference removed successfully.')
            }
        })
    } else {
        //say that there are no preference files for user with ID @userID
        console.log('No file found.')
        res.send('No preference found for the user: ' + user)
    }
})

//reads file
router.get('/read/:userEmail', (req, res) => {
    let user = req.params.userEmail

    userID = user.substring(0, user.indexOf('@'))

    // check if the preference file exists
    if (fs.existsSync('./data/preferences/preferenceFor' + userID + '.txt')) {
        //read the file 
        fs.readFile('./data/preferences/preferenceFor' + userID + '.txt', 'utf8', (err,data) => {
            if (err) { //something went wrong
                res.send('internal server error')
                throw err
            } else { // no error
                let readData = data.split(',') //read the data from the file into an array
                let location = readData[1]
                let minExperience = readData[2]
                let department = readData[3]
                let writeString = user + ',' + location + ',' + minExperience + ',' + department //create a string to send to the client
                res.send(writeString) //send the string with the data
                console.log('sent preference ' + writeString)
            }
        })
    } else {
        //say that there are no preference files for user with ID @userID
        res.send('No preference found for the user: ' + user)
    }
})

module.exports = router