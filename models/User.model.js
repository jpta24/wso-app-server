const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
		password: String,
		email: String,
		pictureUrl: String,
		fullName: String,
		phone: Number || String,
    country:String,
		rol: {
			type: String,
			enum: ['developer', 'adminPending','admin', 'member', 'memberPending', 'user','rejected'],
		},
		businessID:{
      type: Schema.Types.ObjectId,
      ref: 'Business',
		},
    services:{
      type: Schema.Types.ObjectId,
      ref: 'Service',
		},
    position: String,
    change:[
      {
        by:{
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        date: Date,
        change:String
      }
    ]
  //   experience:{
  //     coordinator:Boolean,
  //     protectionOfficer:Boolean,
  //     driver:Boolean,
  //     intempreter:Boolean
  // },
  },
  {
    versionKey: false,
		timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
