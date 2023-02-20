const router = require('express').Router();

const sendMail = require('../utils/send-mail');
const { newMember,changeRol} = require('../utils/mails-content');


const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

router.get('/',(req, res, next) => {
    User.find().then(all =>
        res.json(all))
})

router.post('/updateUser/:userID', async (req, res, next) => {
    try {
      const { fullName, phone, country, pictureUrl, position, businessID:businessIDUser } = req.body;
      const userID = req.params.userID;
  
      const userUpdated = await User.findByIdAndUpdate(
        userID,
        { fullName, phone, country, pictureUrl, position, businessID:businessIDUser },
        { new: true }
      ).populate('businessID');
  
      const newRol = userUpdated.businessID.owner + '' === userUpdated._id + '' ? 'admin' : 'memberPending';
      const userUpdated2 = await User.findByIdAndUpdate(
        userID,
        { rol: newRol },
        { new: true }
      );
      
      const businessUpdated = await Business.findByIdAndUpdate(
        userUpdated2.businessID,
        { $push: { 'members': userUpdated2._id } },
        { new: true }
      ).populate('members');

      const recipients = businessUpdated.members.filter(mem=>mem.rol==='admin').map(member=>member.email)

      const mailOptions = {
        from: process.env.MAIL,
        to: recipients,
        subject: `New Member for ${businessUpdated.businessName}`,
        html: newMember(businessUpdated.businessName,userUpdated2)
      }
  
      sendMail(mailOptions);
  
      const { username, _id, rol, businessID } = userUpdated2;
      const user = { username, _id, rol, businessID };
      console.log('updateUser:', user);
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

router.get('/profiles/:userID',(req, res, next) => {
    const userID = req.params.userID
    User.findById(userID).populate('businessID')
    .then(userFound =>{
        let businessIDFound
        let businessID 
        if (userFound.businessID) {
            businessIDFound = userFound.businessID
            const {_id:businessID_id,pictureUrl:businessIDPictureUrl } = businessIDFound
            businessID = {
            _id:businessID_id,
            pictureUrl:businessIDPictureUrl
            }
        }
        const {fullName,pictureUrl,_id,rol} = userFound
        
        const userInfo = {businessID,fullName,pictureUrl,_id,rol}
        // console.log('profiles:',userInfo);
        res.status(200).json(userInfo)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });

})
router.get('/profile/:userID',(req,res,next) =>{
    const userID = req.params.userID
    // console.log(userID);
    User.findById(userID).populate('businessID')
    .then(userFound =>{
        const {fullName,pictureUrl,username,email,phone,country,position,businessID:businessIDFound,rol} = userFound
        const {businessName:businessIDName,_id:businessID_id} = businessIDFound
        const businessID = {
            businessName:businessIDName,_id:businessID_id
        }
        const userInfo = {fullName,pictureUrl,username,email,phone,country,position,businessID,rol}
        res.status(200).json(userInfo)})
    .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
} )

router.put('/profile/:userID',(req,res,next) =>{
    const userID = req.params.userID

    const {fullName,position,username,email,country,phone,businessID} = req.body;
  
    User.findByIdAndUpdate(userID,{fullName,position,username,email,country,phone,businessID},{new:true})
    .then(user => {
        res.status(200).json(user)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
    });
  
})

router.put('/updateRol/:userID',(req,res,next) =>{
    const userID = req.params.userID
    const {rol,change} = req.body
    User.findByIdAndUpdate(userID,{rol,$push:{change:change}},{new:true}).populate('businessID')
    .then((userUpdated)=>{
        const recipients = userUpdated.email

        const mailOptions = {
          from: process.env.MAIL,
          to: recipients,
          subject: `Change in your Role Status in ${userUpdated.businessID.businessName}`,
          html: changeRol(userUpdated)
        }
    
        sendMail(mailOptions);
        res.status(200).json(userUpdated)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
    });
})



module.exports = router;
