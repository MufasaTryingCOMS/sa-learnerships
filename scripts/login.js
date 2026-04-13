const errorMessage = document.getElementById('error-message');
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const rememberMe = document.getElementById('remember-me');

const loginButton = document.getElementById('login-btn');
const googleBtn = document.getElementById('google-btn')
googleBtn.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/api/users/google';
});

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    errorMessage.style.display = "none";

    if(!email.value || !password.value){
        errorMessage.style.display = "block";
        errorMessage.textContent = "All fields are required";
        return;
    }
    
    loginButton.disabled = true;
    loginButton.textContent = "Logging in";

    try{
        const response = await fetch('http://localhost:3000/login',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                email : email.value,
                password : password.value,
                rememberMe : rememberMe.checked
            })
        })
    
        const data = await response.json();
        if (data.success){
                setTimeout(()=>{
                    window.location.href = "dashboard.html"; 
                }, 3000);
            
        }
        
        else{
            errorMessage.style.display = "block";
            errorMessage.textContent = data.error;
        }
    
    }
    catch(err){
            errorMessage.style.display = "block";
            errorMessage.textContent = "Server error";
            console.error("Login error:", err);

        }
    finally{
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});

