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
    //set email from localStorage
    document.getElementById("emailAdminMangaPoly").innerHTML = localStorage.getItem("emailAdminMangaPoly");

    var totalUser;
    var totalManga;
    var listUser = [];
    await firebase.database().ref('Users').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            //count total user
            totalUser = snapshot.numChildren();

            listUser.push([
                '<img width="70px" height="100px" src="' + childData.ava + '">',
                '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + childData.fullName + '</div>',
                '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + childData.email + '</div>',
                '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + new Date(childData.created).toLocaleString() + '</div>',
                '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + childData.type + '</div>'
            ]);
            //do code không đồng bộ và datatable chỉ đăng ký được 1 lần nên phải check nếu đã add xong hết manga vào listUser mới set datatable
            if (listUser.length == totalUser) {
                $('#dataTable').DataTable({
                    dom: 'Bfrtip',
                    buttons: ['colvis', 'pageLength'],
                    data: listUser,
                    pageLength: 50,
                    columnDefs: [
                        { "width": "70px", "targets": 0 }
                    ]
                });
            }
        });
    });

    //count total manga
    await firebase.database().ref('Mangas').once('value', function (snapshot) {
        totalManga = snapshot.numChildren();
    });
    //set total manga and total user
    document.getElementById('totalManga').innerHTML = totalManga;
    document.getElementById('totalUser').innerHTML = totalUser;
    hideLoader();
}