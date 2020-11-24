//show/hide loader
function showLoader() {
    document.getElementById('loader').classList.add("show-loader");
}
function hideLoader() {
    document.getElementById('loader').classList.remove('show-loader');
}

//load users from firebase
window.onload = async function getAllUsers() {
    showLoader();
    var totalUser;
    var totalManga;
    await firebase.database().ref('users').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            //count total user
            totalUser = snapshot.numChildren();

            $('#dataTable').DataTable().row.add([
                '<img width="70px" height="100px" src="' + childData.avatar + '">',
                childData.username,
                childData.email,
                childData.password,
                childData.createdDate,
                childData.type
            ]).draw(false);
        });
    });

    //count total manga
    await firebase.database().ref('mangas').once('value', function (snapshot) {
        totalManga = snapshot.numChildren();
    });
    //set total manga and total user
    document.getElementById('totalManga').innerHTML = totalManga;
    document.getElementById('totalUser').innerHTML = totalUser;
    hideLoader();
}