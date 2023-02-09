const router = require("express").Router();
const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

router.get("/test", (req, res, next) => {

  User.findById('63e56c65d7de176343cacfa3')
    .populate('businessID')
    .then((userUpdated)=>{
        console.log(userUpdated.businessID.owner+'');
        console.log(userUpdated._id);
        const newRol = userUpdated.businessID.owner + '' === userUpdated._id + '' ? 'admin' : 'memberPending'

        res.json(newRol);
    })
  
});

module.exports = router;
