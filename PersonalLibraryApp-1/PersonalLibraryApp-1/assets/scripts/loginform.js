

function validateAndSubmit(event){
    event.preventDefault();

    var isValidated = true;

    console.log('isValidated [initial] = ', isValidated);

    //Reset all errors
    $("#usernameSpn").html("");
    $("#passwordSpn").html("");

    const username = $("#username").val();
    if(username.length < 3){
        $("#usernameSpn").html("Full name must be a minimum of 3 characters");
        isValidated = false;
    }

    const password = $("#password").val();
        if(password.length < 8){
            $("#passwordSpn").html("Password must be a minimum of 8 characters or numbers");
            isValidated = false;
        }
    const cpassword = $("#cpassword").val();
        if(password != cpassword){
            $("#cpasswordSpn").html("Password doesn't match");
            isValidated = false;
        }

    //Validate input values

    if(isValidated == false)
    {
        return
    }

    //Call method
    handleSubmit(username,password);

}

function handleSubmit(_username, _password){
    // Create Object
    var newUser = {
       username: _username,
       password: _password,
    }
    window.location.href = 'myprofile.html';

    console.log('newUser Object = ', newUser);
}

$(document).ready(function(){
    $("#submitBtn").click(validateAndSubmit)
   
})