function signup(){
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(!email || !password || !username){
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(users.find(u => u.email === email)){
        alert("User already exists");
        return;
    }

    users.push({username,email,password});
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created!");
    window.location = "index.html";
}

function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if(!user){
        alert("Invalid login");
        return;
    }

    if(remember){
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }else{
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    window.location = "dashboard.html";
}

function logout(){
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    window.location = "index.html";
}

function loadDashboard(){
    const user = JSON.parse(localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser"));
    if(!user){
        window.location = "index.html";
        return;
    }
    document.getElementById("welcome").innerText = `Welcome, ${user.username}!`;
}

if(window.location.pathname.includes("dashboard")){
    loadDashboard();
}
