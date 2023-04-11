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

app.use('/user', userRouter)
app.use('/login', loginRouter)
app.use('/preference', preferenceRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(5175)
// ;)