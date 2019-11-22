require('./db/db')
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const passport = require('passport')
const VisitingRouter = require('./routers/visitor')

const static_path = path.join(__dirname,'../public')
const views_path = path.join(__dirname,'../templates/views')

const app = express()
app.use(express.json())
app.use(express.static(static_path))
app.set('views',views_path)
app.set("view engine",'ejs')

app.use(VisitingRouter)
const port = 3000

app.listen(3000,() => {
    console.log("Running on port:",port)
})