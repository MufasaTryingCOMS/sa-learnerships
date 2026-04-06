const errorMessage = document.getElementById('error-message');
const form = document.getElementById('registration-form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');



import {isStrong} from '../scripts/common_functions.js';

form.addEventListener('submit', async(event)=>{
    event.preventDefault();
     errorMessage.style.display = "none";

    if (password.value !== confirmPassword.value){
        confirmPassword.style.border = "2px solid red";
        errorMessage.style.display = "block";
        errorMessage.textContent = "Passwords Do Not Match!";
        return;
    }

    const p = password.value;
    if (p.length < 8){
        errorMessage.style.display = "block";
        errorMessage.textContent = "Password must be at least 8 characters long!";
        return;
    }
    if (!isStrong(p)){
        errorMessage.style.display = "block";
        errorMessage.textContent = "Password is too weak. It must include at least one uppercase letter, one lowercase letter, one digit and one special symbol {'!','@','#','$','%','&','*'}";
        return;
    }

    try{
        const response = await fetch('http://localhost:3000/register', {
            method : 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value, 
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value
            })
        });

        const data = await response.json();
        if (data.success){
            const successMesaage = document.getElementById('success-message');
            successMesaage.textContent = "Registered successfully";
            successMesaage.style.display = "block";
            
            setTimeout(()=>{
                window.location.href = ""; //I will handle navigation once the required page has been created:)
            }, 3000);
            
        }
        else{
            errorMessage.style.display="block";
            errorMessage.textContent = data.error;
        }
        
    }catch(err){
            errorMessage.style.display = "block";
            errorMessage.textContent = err.message;
    }


    
})