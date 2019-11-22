const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const Nexmo = require('nexmo')

const VisitorSchema = new mongoose.Schema({
    host_name:{
        type:String,
        trim:true,
        lowercase:true,
        required:true
    },
    visitor_name:{
        type:String,
        trim:true,
        lowercase:true
    },
    host_email:{
        type:String,
        trim:true,
        lowercase:true
    },
    visitor_email:{
        type:String,
        trim:true,
        lowercase:true
    },
    check_in:{
        type:String,
        default:Date.now        
    },
    checked_out:{
        type:Boolean,
        default:false
    },
    check_out:{
        type:String,       
    },
    visitor_phone_number:{
        type:String,
        trim:true,
        required:true
    },
    host_phone_number:{
        type:String,
        trim:true,
        required:true
    },
    date_of_visit:{
        type:String,
        trim:true
    },
    host_address:{
        type:String,
        trim:true
    }
})

VisitorSchema.pre('save', async function(next){
    const nexmo = new Nexmo({
        apiKey: 'bfb73f3d',
        apiSecret: 'KPPWXrQ2thK5Kt7i',
      });
    console.log('entered')
        if(this.checked_out){
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'wandermate.help@gmail.com',
                    pass: 'wandermate123'
                    }
                });
                var mailOptions1 = {
                    to: this.host_email,
                    from: 'wandermate.help@gmail.com',
                    subject: 'Host details',
                    text: '',
                    html:'<h2>Host Details:</h2><br>'+
                        `<h3>Name-${this.visitor_name}</h3><br>`+  
                        `<h3>Phone-${this.visitor_phone_number}</h3><br>`+  
                        `<h3>Check-in-${this.check_in}</h3><br>`+
                        `<h3>Check-out-${this.check_out}</h3><br>`+
                        `<h3>Host name-${this.host_name}</h3><br>`+
                        `<h3>Host address-${this.host_address}</h3><br>`  
                };
                smtpTransport.sendMail(mailOptions1, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    var text="name:".concat(this.visitor_phone_number)   
                    console.log('Email sent: ' + info.response);
                    }
                });
                const from = 'Innovaccer';
                const to = '91'+this.visitor_phone_number;
                const text = `Host Details:\n Name-${this.visitor_name},Phone-${this.visitor_phone_number},Check-in-${this.check_in},Check-out-${this.check_out},Host name-${this.host_name},Host address-${this.host_address}`;                
                nexmo.message.sendSms(from, to, text);  
                next()    
        }
        else{
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'wandermate.help@gmail.com',
                    pass: 'wandermate123'
                    }
                });
                var mailOptions1 = {
                    to: this.host_email,
                    from: 'wandermate.help@gmail.com',
                    subject: 'Visitor details',
                    text: '',
                    html:'<h2>Visitor Details:</h2><br>'+
                        `<h3>Name-${this.visitor_name}</h3><br>`+  
                        `<h3>Email-${this.visitor_email}</h3><br>`+  
                        `<h3>Phone-${this.visitor_phone_number}</h3><br>`+  
                        `<h3>Check-in-${this.check_in}</h3><br>`  
                };
                var mailOptions2 = {
                    to: this.visitor_email,
                    from: 'wandermate.help@gmail.com',
                    subject: 'Check Out Here!',
                    text: '',
                    html:'<h2>Please click the link to check out:</h2><br>'+
                    `<h3>http://127.0.0.1:3000/check-out/${this._id}</h3><br>`+
                    'If already checked out, Please ignore the mail'  
                };
                smtpTransport.sendMail(mailOptions1, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    var text="name:".concat(this.visitor_phone_number)   
                    console.log('Email sent: ' + info.response);
                    }
                });
                const from = 'Innovaccer';
                const to = '91'+this.host_phone_number;
                const text = `Visiting Details:\n Name-${this.visitor_name},Phone-${this.visitor_phone_number},Check-in-${this.check_in}`
                
                nexmo.message.sendSms(from, to, text);
                smtpTransport.sendMail(mailOptions2, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    var text="name:".concat(this.visitor_phone_number)   
                    console.log('Email sent: ' + info.response);
                    }
                });
        }
        next()    
})

const Visitor = mongoose.model('Visitor',VisitorSchema)
module.exports = Visitor