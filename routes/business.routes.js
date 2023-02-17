const router = require('express').Router();
const nodemailer = require("nodemailer");

const sendMail = require('../utils/send-mail');
const { newBusiness } = require('../utils/mails-content');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

router.get('/profile', (req, res, next) => {
  Business.find()
  .then(businessesFound => {
    const businesses = businessesFound.map(buz=>{
      return {key:buz._id,value:buz.businessName}
    })
    res.status(200).json(businesses)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
  });
})

router.post('/', (req, res, next) => {
	const {businessName,owner,address,pictureUrl} = req.body;

	Business.findOne({ businessName }).then((foundBusiness) => {
    if (foundBusiness) {
			res.status(400).json({ message: 'Business already exists.' });
			return;
		}    
		return Business.create({businessName,owner,address,pictureUrl});
	})
  .then(business =>{
    User.findById(owner).
    then((userFound) =>{
      const recipients = [userFound.email]

      const mailOptions = {
        from: process.env.MAIL,
        to: recipients,
        subject: 'You successfully created a Business profile!',
        html: newBusiness(userFound, businessName)
      }

      sendMail(mailOptions);

      res.status(201).json({ business:business });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Could not Update the user Business" })
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Could not create the Business, check data and try again" })
  });
});

router.get('/profile/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  Business.findById(businessID)
  .then(businessFound =>{
    const {businessName,address,pictureUrl} = businessFound
    const businessInfo = {businessName,address,pictureUrl}
    res.status(200).json(businessInfo)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
} )

router.put('/profile/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  
	const {businessName,address,pictureUrl} = req.body;

  Business.findByIdAndUpdate(businessID,{businessName,address,pictureUrl},{new:true})
  .then(business => {
    res.status(200).json(business)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
})

router.get('/members/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  Business.findById(businessID).populate('members')
  .then(businessFound =>{
    const {members:membersFound} = businessFound

    const members = membersFound.map(buz=>{
      return {_id:buz._id,fullName:buz.fullName,position:buz.position,pictureUrl:buz.pictureUrl,rol:buz.rol}
    })

    const businessInfo = {members}
    res.status(200).json(businessInfo)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
} )


module.exports = router;
