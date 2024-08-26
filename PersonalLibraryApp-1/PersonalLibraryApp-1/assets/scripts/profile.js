$(document).ready(function () {

    $(".read").click(function () {
        window.location = "read.html";
    });
    $(".to-be-read").click(function () {
        window.location = "toBeRead.html";
    });
    
});

//update nav

function updateNavigation(userRole) {
    const adminProfileLink = document.getElementById('adminProfileLink');
    const userProfileLink = document.getElementById('userProfileLink');
    const homeLink = document.getElementById('homeLink');
    console.log("admin",adminProfileLink);
    console.log("user",userProfileLink);

    
        if (userRole === 'Admin') {
            // If the user is an admin, show the admin link
            adminProfileLink.parentElement.style.display = 'block';
            userProfileLink.style.display = 'none';
            homeLink.style.display = 'none';
        } else {
            // If the user is not an admin, hide the admin link
            adminProfileLink.style.display = 'none';
            userProfileLink.parentElement.style.display = 'block';
            homeLink.style.display = 'none';
        }
    
   
};

//get token

const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = parseJwt(token);
        var _userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log(_userRole);
    }
    // Function to decode a JWT token
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

updateNavigation(_userRole);

//show log out button

function ShowLogin(){
    const authLink = document.getElementById('authLink');
        console.log(authLink);
        
        
            if (localStorage.getItem('token')) {
                authLink.innerHTML = '<a href="#" id="logoutLink">Log Out</a>';
                $('#logoutLink').click(function() {
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                });
            } else {
                authLink.innerHTML = '<a href="login.html">Log In</a>';
            }
        
};

ShowLogin();