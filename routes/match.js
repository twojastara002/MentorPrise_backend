const express = require('express')
//file reader
const fs = require('fs')
//sorting out file paths
const path = require('path')
const router = express.Router()

const preferenceRouter = require('../routes/preference')
const filePath = './data/matches/matches.txt'


//add a match
function addMatch (req, res, u1, u2) {
    //if file is empty or doesn't exist then create it
    if (!fs.existsSync(filePath)) {
        let writeString = '1,' + u1 + ',' + u2
        fs.writeFile(filePath, writeString, 'utf8', function(err) {
            if (err) { //something went wrong
                throw err
            } else { // no error
                console.log('Match created successfully.')
                res.send('Match created successfully.')
            }
        })

    } else { //read all of the matches to ensure no duplicates and find the highest id of a match
        let highestMatchID = -1
        let matchExists = false
        let writeString = ''
        fs.readFile('./data/matches/matches.txt', 'utf8', (err, data) => {
            matches = data.split(';')
            matches.forEach(match => {
                matchArray = match.split(',')
                if ((matchArray[1] == u1 && matchArray[2] == u2) || (matchArray[1] == u2 && matchArray[2] == u1)) {
                    res.send('Match already exists.')
                    matchExists = true
                } 
                else {
                    //find highest index of match
                    if (highestMatchID < matchArray[0]) highestMatchID = matchArray[0]
                }
            });
            if (!matchExists) {
                //compose file name
                let matchID = Number(highestMatchID) + 1
                writeString = ';' + matchID + ',' + u1 + ',' + u2

                fs.appendFile(filePath, writeString, 'utf8', function(err) {
                    res.send(u1 + ' ' + u2 + ' matched')
                })
            }
        })
    }
}


router.get('/create/:u1-:u2', (req, res) => {
    addMatch(req, res, req.params.u1, req.params.u2)
})

router.get('/remove/:u1-:u2', (req, res) => {
    let u1 = req.params.u1
    let u2 = req.params.u2

    //if file is empty or doesn't exist then don't do anything
    if (!fs.existsSync(filePath)) {
        res.send('no matches exist')
    } else {
        //read in the whole file
        fs.readFile('./data/matches/matches.txt', 'utf8', (err, data) => {
            let x = -1
            let matches = data.split(';')
            //create a string and copy over all matches up to the one with the marked index
            let matchesTMP = ''
            matches.forEach(match => { //iterate all matches
                matchArray = match.split(',')
                //find which one to remove
                if ((matchArray[1] == u1 && matchArray[2] == u2) || (matchArray[1] == u2 && matchArray[2] == u1)) {
                    x = matchArray[0]
                } else { //copy over all others
                    matchesTMP = matchesTMP + match + ';'
                }
            });
            if (x == -1) {
                res.send('not found')
            } else {
                //override the old file with the new one
                //remove last semicolon
                matchesTMP = matchesTMP.substring(0,matchesTMP.length-1)
                fs.writeFile(filePath, matchesTMP, 'utf8', function(err) {
                    if (err) { //something went wrong
                        res.send('Match failed to remove.')
                    } else { // no error
                        res.send('Match removed successfully.')
                    }
                })
            }
        })   
    }
})

module.exports = router