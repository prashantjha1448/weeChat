import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength: [3, "First name must be at least 3 characters"],
        maxlength: [25, "First name cannot exceed 25 characters"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required "],
        minlength: 3,
        unique: true,
    },
    email: {
        type: String,
        required: [true," email is required "],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        lowercase: true,
        unique: true,
        trim: true,
    },
    mobile_Number : {
        type : String,
        match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"]
    },
    gender :{
        type : String ,
        required : [true , "gender is required ..."],
        enum : ["male", "female",'other']
    },
    dob :{
        type : Date,
        required : [true , "DOB is required "]
    },
    password : {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false 
    },
    refreshToken : {
        type : String
    }

},{
    timestamps : true
})


const UserModel = mongoose.model('users', UserSchema)
export default UserModel