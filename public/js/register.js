function registerUser(){
    //get the username and password from page
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    let user = {username: u, password: p};

    //send to server
    fetch('http://localhost:3000/registerUser', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    })
    .then((response) => {
        if(response.status == 400){
            window.alert("Username is already taken. Account was not created");
            location.href='http://localhost:3000/register';
        } else{
            window.alert("Your account has successfully been created. You can now log-in");
            location.href='http://localhost:3000/register';
        }
    })
    .catch((error) => console.log(err));
}

function loginUser(){
    //get the username and password from page
    let u = document.getElementById("loginUsername").value;
    let p = document.getElementById("loginPassword").value;

    let user = {username: u, password: p};

    //send to server
    fetch('http://localhost:3000/loginUser', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    })
    .then((response) => {
        if(response.status == 401){
            window.alert("Unsuccessful log-in");
            location.href='http://localhost:3000/register';
        } else{
            window.alert("Now logged in!");
            location.href='http://localhost:3000/register';
        }
    })
    .catch((error) => console.log(err));
}

document.getElementById("submitRegister").addEventListener("click", registerUser);
document.getElementById("submitLogin").addEventListener("click", loginUser);

