const router = require('express').Router();
const nodemailer = require("nodemailer");

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get('/', (req, res, next) => {
  Business.find()
  .then(businesses => res.status(200).json(businesses))
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });
})



router.post('/', isAuthenticated, (req, res, next) => {
	const {businessName,owner,address,pictureUrl} = req.body;

	Business.findOne({ businessName }).then((foundBusiness) => {
    if (foundBusiness) {
			res.status(400).json({ message: 'Business already exists.' });
			return;
		}
        
		return Business.create({businessName,owner,address,pictureUrl});
	})
    .then(business =>{
      console.log(business);
        User.findByIdAndUpdate(owner,{businessID:business._id,rol:'admin'},{new:true}).
        then((userUpdated) =>{
          const user = userUpdated
          // Send email confirmation create a Business
        const transporter = nodemailer.createTransport({
          service:'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSMAIL
          }
        });
        let mailCreateBusiness = {
          from: process.env.MAIL,
          to: userUpdated.email,
          subject: 'You successfully created a Business profile!',
          html: `
          <div style='width:85%; margin:auto'>
              <div>
                  <div style='padding:10px'>
                    <a href='https://wso-security.com/en/' style='display:flex; text-decoration: none; background-color: #000000'>
                      <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1674671880/secuApp-gallery/wso-white_djbovg.png' width="60px" height="60px" style='padding:10px'/>
                      <h2 style='margin-left:15px; color:#ffffff'>WSO Worldwide Security Options</h2>
                    </a>
                  </div>
                  <div style='padding:10px'>
                      <h1 style='margin-top:3px'>Hi ${userUpdated.username},</h1>
                      <p>Welcome to WSO Security-App. </p>
                      <h3>You have created a business named: <span style='padding-left:10px'>${businessName}</span></h3>
                      <div>
                          <div>
                              <div>
                                  <hr/>
                                  <h3>Congratulations you have a new Business account.  You can now start setting it up, bring your teamwork and clients. </h3>
                                  <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                  
                                  <p>Thanks for using our service.</p>
                                  <h3>WSO Worldwide Security Options</h3>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `
          };

          transporter.sendMail(mailCreateBusiness , function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email Create Business Account sent: ' + info.response);
              }
            });

            res.status(201).json({ business:business });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ message: "Could not Update the user Business" })
          });
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Could not create the Business, check data and try again" })
      });
});

router.get('/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  Business.findById(businessID).then(businessFound =>{
    res.status(200).json(businessFound)})

} )

router.put('/:businessID',(req,res,next) =>{
  const businessID = req.params.businessID
  
	const {businessName,address,pictureUrl} = req.body;

  Business.findByIdAndUpdate(businessID,{businessName,address,pictureUrl},{new:true})
  .then(business => res.status(200).json(business))
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: "Sorry internal error occurred" })
    });

})

// router.get('/:businessNameEncoded',(req,res,next) =>{
//     const name = req.params.businessNameEncoded.split('-').join(' ')

//     Business.findOne({name}).populate('products').populate('employees').populate('orders').populate(({
//         path: 'orders',
//         populate: {
//           path: "business"
//         }
//       })).populate(({
//         path: 'orders',
//         populate: {
//           path: "user"
//         }
//       })).populate(({
//         path: 'orders',
//         populate: {
//           path: "products",
//             populate: {
//                 path: "product"
//             }
//         }
//       }))
//     .then(business=>{
//         if (business) {
//             res.status(200).json({ business });
//         }else{
//             res.status(400).json({ message: 'Business does not exists.' });
//         }
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({ message: "Sorry internal error occurred" })
//       });

// })

// router.put('/edit/:businessNameEncoded', (req, res, next) => {
//   const buzName = req.params.businessNameEncoded.split('-').join(' ')
  
//   const {name,logoUrl,address,type,categories,bgUrl,pdfMenu,employees,owner,currency,payment,format} = req.body
  
//   Business.findOneAndUpdate(
//     {name:buzName},
//     {name,logoUrl,address,type,categories,bgUrl,pdfMenu,employees,owner,currency,payment,format},
//     {new:true}
//     )
//   .then((business)=>{
//       res.status(200).json(business)}) 
//   .catch(err => {
//       console.log(err)
//       res.status(500).json({ message: "Sorry internal error occurred" })
//       });
  
// });

// router.delete('/delete/:businessID', (req, res) => {
//   const { businessID } = req.params;

//   Business.findByIdAndRemove(businessID)
//   .then((business)=>{
//       return User.findByIdAndUpdate(business.owner._id,{ $unset: { business:''}})
//   .then((user)=>{res.json({message: `Business with the id ${business._id} was successfully deleted and updated the user`})}
//   )})
//   .catch(err => console.log(err))
// })

module.exports = router;