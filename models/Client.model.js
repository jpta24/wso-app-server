const { Schema, model } = require('mongoose');

const clientSchema = new Schema(
	{
		clientName:String,
        address:{
            contactName:String,
            city:String,
            country:String,
			phone:String || Number,
			email:String
        },
		pictureUrl:String,
		// contactPerson:[{
		// 	name:String,
		// 	phone:String || Number,
		// 	email:String
        // }],
		services:[
			{
				type: Schema.Types.ObjectId,
				ref: 'Service',
			},
		],
        saved:Boolean
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Client = model('Client', clientSchema);

module.exports = Client;