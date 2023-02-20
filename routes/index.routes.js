const router = require("express").Router();
const Business = require('../models/Bussiness.model');

const sendMail = require('../utils/send-mail');
const { newMember } = require('../utils/mails-content');

router.get("/test", (req, res, next) => {
  const _id='63e56d2fd7de176343cacfaa'
  const userUpdated2={fullName:'Maria',username:'maga',email:'prueba@gmail.com',_id:'01234567890'}

  Business.findById(_id).populate('members')
  .then(businessUpdated=>{
    const recipients = businessUpdated.members.filter(mem=>mem.rol==='admin').map(member=>member.email)
    // console.log({recipients});
    // console.log(userUpdated2);

    const mailOptions = {
      from: process.env.MAIL,
      to: recipients,
      subject: `New Member for ${businessUpdated.businessName}`,
      html: newMember(businessUpdated.businessName,userUpdated2)
    }

    sendMail(mailOptions);
    res.status(200).json(recipients);
  })
  
});

router.get("/test2", (req, res, next) => {
  res.redirect(`security-app://ViewProfileScreen?param=63efa5c34447d46fac7f4c34`);
  
});



module.exports = router;
