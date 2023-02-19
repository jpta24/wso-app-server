const router = require('express').Router();
const nodemailer = require("nodemailer");

const sendMail = require('../utils/send-mail');
const { newBusiness } = require('../utils/mails-content');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');
const Client = require('../models/Client.model');

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

router.post('/client/:businessID', (req, res, next) => {
  const businessID = req.params.businessID
	const {clientName,address,pictureUrl} = req.body;
  Business.findById(businessID).populate('clients')
  .then(business=>{
    if (business.clients && business.clients.includes(clientName)) {
      res.status(400).json({ message: 'Client already exists.' });
			return;
    }
    return Client.create({clientName,address,pictureUrl})
  })
  .then(client=>{
    return Business.findByIdAndUpdate(businessID,{$push: { 'clients': client._id }})
  })
  .then(() =>{
    res.status(201).json({ message: 'Client Created.' });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Could not create Client, check data and try again" })
  });
});

router.get('/clients/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  Business.findById(businessID).populate('clients')
  .then(businessFound =>{
    const {clients:clientsFound} = businessFound

    const clients = clientsFound.map(client=>{
      return {_id:client._id,clientName:client.clientName,pictureUrl:client.pictureUrl,address:client.address,saved:client.saved}
    })

    const clientInfo = {clients}
    res.status(200).json(clientInfo)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
} )

router.put('/client/:clientID',(req,res,next) => {
  const clientID = req.params.clientID
  const {saved,businessID} = req.body
  Client.findByIdAndUpdate(clientID,{$set:{saved}},{new:true})
  .then((client)=>{
    return   Business.findById(businessID).populate('clients')
  })
  .then(businessFound =>{
    const {clients:clientsFound} = businessFound

    const clients = clientsFound.map(client=>{
      return {_id:client._id,clientName:client.clientName,pictureUrl:client.pictureUrl,address:client.address,saved:client.saved}
    })

    const clientInfo = {clients}
    res.status(200).json(clientInfo)})
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
})


module.exports = router;
