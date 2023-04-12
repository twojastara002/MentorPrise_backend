var express=require('express');
var app=express();

app.get('/', (req,res) => {
    res.sendStatus(500)
    res.send('hi')
})
app.use(logger)


const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')
const preferenceRouter = require('./routes/preference')
const matchingAlgorithm = require('./routes/matching_algorithm')
const matchRouter = require('./routes/match')
const registerRouter = require('./routes/register')

app.use('/register', registerRouter)
app.use('/user', userRouter)
app.use('/login', loginRouter)
app.use('/preference', preferenceRouter)
app.use('/automatic_match', matchingAlgorithm)
app.use('/match', matchRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(5175)
// ;)