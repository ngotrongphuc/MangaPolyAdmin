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
    await firebase.database().ref('users').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            $('#dataTable').DataTable().row.add([
                '<img width="70px" height="100px" src="' + childData.avatar + '">',
                childData.username,
                childData.email,
                childData.password,
                childData.type
            ]).draw(false);
        });
    });
    hideLoader();
}