const express = require('express'),
    Mongoose = require('mongoose'),
    Bcrypt = require('bcryptjs'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    User = require('./user'),
    dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json())

try{
	Mongoose.connect(process.env.MONGODB_CONNECTION_URL)
	console.log('Connected to database')
	}
catch(err)
{
	console.error(err);
}

// Handling get /send request
app.get('/send',async(req,res)=>{
	try{
		// Unpack the request query
		let { page, size, sort }=req.query
		
		if(!page){
			page=1
		}
		
		if(!size){
			size=10
		}
		
		// We have to make it an integer because query paramter passed is string
		const limit=parseInt(size);
		
		// We pass 1 for sorting data in ascending order using ids
		const user=await User.find().sort({votes:1,_id:-1}).limit(limit)
		res.send({
			page,
			size,
			Info:user,
		})
	}
	catch(error)
	{
		res.status(500).send(error)
	}
})

// Handling POST /send request
app.post('/send',(req,res)=>{
	req.body.password=Bcrypt.hashSync(req.body.password,10) // Create a 10 digit hash password
	var newUser=new User({
		username:req.body.username,
		password:req.body.password})
	newUser.save()
		.then(result=>console.log(result))
	res.send(newUser)
})

app.listen(3000,()=>{
	console.log('Server listening on Port:3000')
})