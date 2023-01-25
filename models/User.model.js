const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: String,
		password: String,
		email: String,
		avatarUrl: String,
		name: String,
		phone: Number || String,
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
  },
  {
    versionKey: false,
		timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
