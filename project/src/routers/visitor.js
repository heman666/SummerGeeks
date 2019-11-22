const express = require('express')
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bodyparser=require('body-parser');
var Visitor = require('../models/visitor')
const validatePhoneNumber = require('validate-phone-number-node-js'); 

var urlencodedparser=bodyparser.urlencoded({extended:false});


router.get('/visiting_form',(req,res)=>{
    res.render('main')
})

router.post('/visiting_form', urlencodedparser,[check('host_name').not().isEmpty().withMessage('The field should not be empty'),                                                    
                                            check('host_email').not().isEmpty().withMessage('Please enter your Email')
                                                    .isEmail().withMessage('Enter valid email-ID'),
                                            check('host_phone_number').not().isEmpty().withMessage('phone number is required'),
                                            check('visitor_name').not().isEmpty().withMessage('The field should not be empty'),                                                    
                                            check('visitor_email').not().isEmpty().withMessage('Please enter your Email')
                                                    .isEmail().withMessage('Enter valid email-ID'),
                                            check('visitor_phone_number').not().isEmpty().withMessage('phone number is required'),],
async (req,res) =>{
    try{
        console.log(req.body)
        let errors = validationResult(req);
        console.log(errors)
          if(!errors.isEmpty()){
            console.log('Error found')
            return res.status(422).json(errors.array())
        }
    else{
        var date = new Date()
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var today = ((("".concat(`${day}-`)).concat(`${month}-`)).concat(`${year}`))
        var time = (("".concat(`${hours}:`)).concat(`${minutes}`))
        var visiting_detail = new Visitor()
            visiting_detail.host_name = req.body.host_name
            visiting_detail.host_email = req.body.host_email
            visiting_detail.host_phone_number = req.body.host_phone_number
            visiting_detail.visitor_name = req.body.visitor_name
            visiting_detail.visitor_email = req.body.visitor_email
            visiting_detail.visitor_phone_number = req.body.visitor_phone_number
            visiting_detail.date_of_visit = today
            visiting_detail.check_in = time
            console.log(visiting_detail)
            visiting_detail.host_address = req.body.host_address
            await visiting_detail.save()
            console.log('Success')
            return res.render('visiting_form')
        }                            
    }catch(e){
        return res.send(e)    
    }
})

router.get('/check-out/:id',async (req,res)=>{
    var id = req.params.id
    var detail = await Visitor.find({ _id:id })
    detail.checked_out = true
    var date = new Date()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var time = (("".concat(`${hours}-`)).concat(`${minutes}`))
    detail.check_out = time
    await detail.save()
})
module.exports = router
