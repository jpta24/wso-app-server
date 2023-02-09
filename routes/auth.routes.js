const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

router.post('/signup', (req, res, next) => {
	console.log(req.body);
	const saltRounds = 10;
	let rol = 'user';

	const { username, password, email } = req.body;

	if (username === '' || password === '' || email === '') {
		res.status(400).json({ message: 'Please provide all fields' });
		return;
	}
	if (password.length < 4) {
		res.status(400).json({ message: 'Password has to be 4  chars min' });
		return;
	}

	// Check the users collection if a user with the same email already exists
	User.find({ $or: [{ email }, { username }] })
		.then((foundUser) => {
			// If the user with the same email already exists, send an error response
			if (foundUser.length !== 0) {
				res.status(400).json({ message: 'User already exists.' });
				return;
			}

			// If email is unique, proceed to hash the password
			const salt = bcrypt.genSaltSync(saltRounds);
			const hashedPassword = bcrypt.hashSync(password, salt);

			// Create the new user in the database
			// We return a pending promise, which allows us to chain another `then`
			return User.create({ username, password: hashedPassword, email, rol });
		})
		.then((createdUser) => {
			// Deconstruct the newly created user object to omit the password
			// We should never expose passwords publicly
			const { username, email, rol, _id } = createdUser;

			// Create a new object that doesn't expose the password
			const user = { username, email, rol, _id };

			// Send email confirmation create an account
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSMAIL,
				},
			});
			let mailCreateAccount = {
				from: process.env.MAIL,
				to: user.email,
				subject: 'You successfully created a WSO Security-App account!',
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
                      <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                      <p>Welcome to WSO Security-App. </p>
                      <div>
                          <div>
                              <div>
                                  <hr/>
                                  <h3>Thanks for signing up.  You can now create a Business or you can add yourself to the Business you work for. </h3>
                                  <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                  
                                  <p>Thanks for using our service.</p>
                                  <h3>WSO Worldwide Security Options</h3>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `,
			};
			// transporter.sendMail(mailCreateAccount, function (error, info) {
			// 	if (error) {
			// 		console.log(error);
			// 	} else {
			// 		console.log('Email Create Account sent: ' + info.response);
			// 	}
			// });
			// Send a json response containing the user object
			console.log(user);
			res.status(201).json({ user: user });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Internal Server Error' });
		});
});

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	// Check if email or password are provided as empty string
	if (username === '' || password === '') {
		res.status(400).json({ message: 'Provide username and password.' });
		return;
	}

	// Check the users collection if a user with the same username exists
	User.findOne({ username })
		// .populate('business').populate('cart').populate('orders')
		.then((foundUser) => {
			if (!foundUser) {
				// If the user is not found, send an error response
				res
					.status(401)
					.json({ message: 'Please provide valid username and password' });
				return;
			}

			// Compare the provided password with the one saved in the database
			const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

			if (passwordCorrect) {
				// Deconstruct the user object to omit the password
				const {
					username,
					_id,
					rol,
					businessID
				} = foundUser;

				// Create an object that will be set as the token payload
				const payload = {
					username,
					_id,
					rol,
					businessID
				};

				// Create and sign the token
				const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
					algorithm: 'HS256',
					expiresIn: '15d',
				});

				// Send the token as the response
				res.status(200).json({ authToken: authToken });
			} else {
				res.status(401).json({ message: 'Unable to authenticate the user' });
			}
		})
		.catch((err) => res.status(500).json({ message: 'Internal Server Error' }));
});

router.get('/verify', isAuthenticated, (req, res, next) => {
	// If JWT token is valid the payload gets decoded by the
	// isAuthenticated middleware and made available on `req.payload`
	// console.log(`req.payload`, req.payload);

	// Send back the object with user data
	// previously set as the token payload
	res.status(200).json(req.payload);
});

module.exports = router;
