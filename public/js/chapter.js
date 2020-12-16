window.onload = async function () {
    var queryString = location.search.substring(1);
    var arr = queryString.split("|");
    var uri_nameChapter = decodeURIComponent(arr[1]);
    var uri_titleManga = decodeURIComponent(arr[2]);;
    for (i = 3; i < arr.length; i++) {
        uri_titleManga += '|' + decodeURIComponent(arr[i]);
    }

    document.title = uri_titleManga + ' | ' + uri_nameChapter;

    await firebase.database().ref('Chapters/' + arr[0] + '/' + uri_nameChapter+'/images').once('value', function (snapshot) {
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