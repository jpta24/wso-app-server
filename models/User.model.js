const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
		password: String,
		email: String,
		pictureUrl: String,
		fullname: String,
		phone: Number || String,
    country:String,
		rol: {
			type: String,
			enum: ['developer', 'adminPending','admin', 'operator', 'operatorPending', 'user'],
		},
		business:{
      type: Schema.Types.ObjectId,
      ref: 'Business',
		},
    services:{
      type: Schema.Types.ObjectId,
      ref: 'Service',
		},
    experience:{
      coordinator:Boolean,
      protectionOfficer:Boolean,
      driver:Boolean,
      intempreter:Boolean
  },
  },
  {
    versionKey: false,
		timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
