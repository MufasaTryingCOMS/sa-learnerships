const errorMessage = document.getElementById('error-message');
const form = document.getElementById('registration-form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');



google.accounts.id.initialize({
    client_id: "540897393879-so4uoeddh7jvu1delkd6ear8t7t9v0dt.apps.googleusercontent.com",
    callback: receiveGoogleToken
});

function isStrong(password){
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let SpecialSymbols = ['!','@','#','$','%','&','*'];
    let HasSpecialSymbols = false;

    for (let x of password){
        if (x >= 'A' && x <= 'Z'){
            hasUppercase = true;
        }
        else if(x >= 'a' && x <= 'z'){
            hasLowercase = true;
        }
        else if (x >='0' && x <= '9'){
            hasDigit = true;
        }
        else if (SpecialSymbols.includes(x)){
            HasSpecialSymbols = true;
        }
    }

    return hasLowercase && hasUppercase && hasDigit && HasSpecialSymbols;   
}

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
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = "Registered successfully";
            successMessage.style.display = "block";
            
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


async function receiveGoogleToken(res){
    const google_token = res.credential;

    try{
        const response = await fetch('http://localhost:3000/registerGoogle', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({token : google_token})
        });

        const data = await response.json();
        errorMessage.style.display = "none";
       

        if (data.success){

            const successMessage = document.getElementById('success-message');
            successMessage.textContent = data.message;
            successMessage.style.display = "block";
            
            setTimeout(()=>{
                window.location.href = ""; //I will handle navigation once the required page has been created:)
            }, 3000);
            
        }
        else{
            errorMessage.textContent = data.message || "Google register failed!";
            errorMessage.style.display = "block";
        }

    }catch(err){
        errorMessage.style.display = "block";
        errorMessage.textContent = err.message;
    }



}

google.accounts.id.renderButton(
    document.getElementById("google-btn-container"),
    { theme: "outline", size: "medium" , text :"Register With Google"}
);
