var express=require('express');
var app=express();

app.get('/', (req,res) => {
    res.sendStatus(500)
    res.send('hi')
})
app.use(logger)


const userRouter = require('./routes/user')
const loginRouter = require('./routes/login')

app.use('/user', userRouter)
app.use('/login', loginRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

app.listen(3000)
// ;)