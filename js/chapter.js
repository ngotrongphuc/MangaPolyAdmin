window.onload = async function () {
    var queryString = location.search.substring(1);
    var arr = queryString.split("|");
    var uri_dec = decodeURIComponent(arr[1]);

    await firebase.database().ref('chapters/' + arr[0] + '/' + uri_dec).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var content = '<img src="' + childData + '" ></br>';
            $('#body').append(content);
        });
    });
}

function darkmode() {
    var element = document.body;
    element.classList.toggle("dark-mode");

}