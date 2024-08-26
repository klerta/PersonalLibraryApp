// Login Form Connection
$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        console.log('Login form submitted');

        var username = $('#username').val();
        var password = $('#password').val();

        //Request orders data from the api endpoint
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://localhost:44320/api/Authentication/login-user',
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({ email: username, password: password })
        };

        $.ajax(settings).done(function (response) {
            
            //Save token to localstorage
            localStorage.setItem('token', response.token);

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

            //Redirect to orders page
            alert('Authorized: Redirecting to your profile');
           

            if(_userRole=="Admin")
            {
                window.location.href = 'admin.html';   
            }
            else{
                window.location.href = 'myprofile.html';
                
            }
            
            
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Error = ', errorThrown);
            console.log('Text Status = ', textStatus);
            console.log('jqXHR = ', jqXHR);

            // Check for a 401 Unauthorized response
            if (jqXHR.status === 401) {
                alert('Unauthorized: Redirecting to login');
                window.location.href = 'login.html';
            } else {
                alert('Error occurred while fetching orders');
            }
        });

    });
});

//Register form connection

$(document).ready(function() {
    $('#signupForm').on('submit', function(e) {
        e.preventDefault();

        console.log('SignUp form submitted');

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();

        //Request orders data from the api endpoint
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://localhost:44320/api/Authentication/register-user',
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({ userName:username, email: email, password: password })
        };

        $.ajax(settings).done(function (response) {
            
            //Save token to localstorage
            localStorage.setItem('token', response.token);
            window.location.href = 'myprofile.html';
    //         //decode the token to get the role
    
            
            
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Error = ', errorThrown);
            console.log('Text Status = ', textStatus);
            console.log('jqXHR = ', jqXHR);
        });
    });
});

   


