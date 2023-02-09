const { Schema, model } = require('mongoose');

const businessSchema = new Schema(
	{
		businessName:String,
		owner:{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
        address:{
            city:String,
            street:String,
            country:String,
			phone:String || Number,
			email:String
        },
		pictureUrl:String,
		// branch:String,
		// contactPerson:[{
		// 	name:String,
		// 	phone:String || Number,
		// 	email:String
		//   }],
		clients:[{
			type: Schema.Types.ObjectId,
			ref: 'Client',
		}],
		services:[
			{
				type: Schema.Types.ObjectId,
				ref: 'Service',
			},
		],
        members:[
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Business = model('Business', businessSchema);

module.exports = Business;