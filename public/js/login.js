// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZzsSB--6BI-u1zE37tFymqbLXFkH6YfM",
    authDomain: "mangapoly-79931.firebaseapp.com",
    databaseURL: "https://mangapoly-79931-default-rtdb.firebaseio.com",
    projectId: "mangapoly-79931",
    storageBucket: "mangapoly-79931.appspot.com",
    messagingSenderId: "815405617474",
    appId: "1:815405617474:web:9990a0f632cb6c71d7f8db",
    measurementId: "G-MK2VS1B4JR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// function signUp() {
//     var email = document.getElementById("email");
//     var password = document.getElementById("password");

//     const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
//     promise.catch(e => alert(e.message));
//     alert("Signed Up");
// }

function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(function (firebaseUser) {
            // Success
            //set email into localStorage
            localStorage.setItem("emailAdminMangaPoly", email.value);
            //redirect to index
            window.location.href = "mangas.html";
            let user = firebase.auth().currentUser;
            console.log(user.email + " / " + user.metadata.lastSignInTime);
        })
        .catch(function (error) {
            // Error Handling
            alert("Đăng nhập thất bại!");
        });
}

function signOut() {
    auth.signOut();
    window.location.href = "login.html";
}

// Get the currently signed-in user
// auth.onAuthStateChanged(function (user) {
//     if (user) {
//         var email = user.email;
//         alert("user" + email);
//         alert("Active User" + email);
//         //is signed in 
//     } else {
//         alert("No Active User");
//         //no user is signed in
//     }
// });


//trigger onclick when press enter
window.onload = function () {
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    emailInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("btnSignin").click();
        }
    });
    passwordInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("btnSignin").click();
        }
    });
}


//remember login
$(document).ready(function () {
    var rememberCookie = $.cookie('remember');
    if (rememberCookie == 'true') {
        var email = $.cookie('email');
        var password = $.cookie('password');
        // autofill the fields
        $('#email').val(email);
        $('#password').val(password);
        $('#remember').prop('checked', true);
    }

    $("#btnSignin").click(function () {
        var remember = $('#remember:checked').is(":checked");
        if (remember) {
            var email = $('#email').val();
            var password = $('#password').val();

            // set cookies to expire in 14 days
            $.cookie('email', email, { expires: 14 });
            $.cookie('password', password, { expires: 14 });
            $.cookie('remember', true, { expires: 14 });
        } else {
            // reset cookies
            $.cookie('email', null);
            $.cookie('password', null);
            $.cookie('remember', null);
        }
    });

    $("#btnSendResetPassword").click(function () {
        var emailAddress = document.getElementById("emailReset").value;;

        auth.sendPasswordResetEmail(emailAddress).then(function () {
            // Email sent.
            document.getElementById('modalResetPassword').style.display = 'none';
            alert("Đã gửi một email lấy lại mật khẩu tới " + emailAddress + ". Vui lòng kiểm tra hộp thư!");
        }).catch(function (error) {
            // An error happened.
            alert("Gửi không thành công!");
        });
    });
});