const User = require('../common/models/User');
const bcryptjs = require('bcryptjs');


function isStrong(password){
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let specialSymbols = ['!','@','#','$','%','&','*'];
    let hasSpecialSymbols = false;

    for (let x of password){
        if (x >= 'A' && x <= 'Z'){
            hasUppercase = true;
        }
        else if (x >= 'a' && x <= 'z'){
            hasLowercase = true;
        }
        else if ( x >='0' && x <= '9'){
            hasDigit = true;
        }
        else if (specialSymbols.includes(x)){
            hasSpecialSymbols = true;
        }
    }
    
    return hasUppercase && hasLowercase && hasDigit && hasSpecialSymbols;
}

async function hashPassword(password){
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password,salt);

    return hashedPassword;
}

exports.register = async (req,res) =>{
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const email = req.body.email;
        const confirmPassword = req.body.confirmPassword;

        const userExists = await User.findOne({email : req.body.email});
        if (userExists){
            return res.status(409).json({error:"User Already Exists!"});

        }

        if (firstName==="" || lastName==="" || email==="" || password==="" || confirmPassword===""){
            return res.status(400).json({error: "Please Fill All The Required Fields!"});
        }

        if (password != confirmPassword){
            return res.status(400).json({error: "Passwords do not match"});
        }

        if (password.length < 8){
            return res.status(400).json({error: "Password length must be at least 8 characters long"});
        }

        if (!isStrong(password)){
            return res.status(400).json({error: "Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol"});
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });
        res.status(201).json({
            success:true,
            user: {id:user._id, firstName: user.firstName, lastName: user.lastName, email:user.email}
        });

    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
}