// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0rLM1lrW8VgBbTLEMour4JAKmhBrl5m8",
    authDomain: "manga-poly.firebaseapp.com",
    databaseURL: "https://manga-poly.firebaseio.com",
    projectId: "manga-poly",
    storageBucket: "manga-poly.appspot.com",
    messagingSenderId: "1064797271581",
    appId: "1:1064797271581:web:a5f7a16105e89b946a38f4",
    measurementId: "G-PJ3GY1HLTC"
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
            window.location.href = "mangas.html";
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
