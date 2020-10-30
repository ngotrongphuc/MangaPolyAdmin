//Make the DIV element draggagle:
dragElement(document.getElementById("fdivAdd"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


//show/hide loader
function showLoader() {
    document.getElementById('loader').classList.add("show-loader");
}
function hideLoader() {
    document.getElementById('loader').classList.remove('show-loader');
}


//show posterthumbnail after selected
function loadPosterThumbnail(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#posterthumbnail')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//submit form || check whether adding or updating
function submitForm() {
    var modalTitle = document.querySelector("#modalTitle").textContent;
    if (modalTitle == 'Thêm truyện') {
        addManga();
    } else {
        var id = document.getElementById("btnSubmitForm").getAttribute("name");
        updateManga(id);
    }
}

//get file length
function getFileLength(input) {
    var fileLength = input.files.length;
    document.getElementById('imgsChapter').setAttribute("name", fileLength);
}

//add data into firebase
async function addManga() {
    showLoader();
    //init
    var firebaseRef = firebase.database().ref();

    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var category = document.getElementById('category').value;
    var description = document.getElementById('description').value;
    var statesbox = document.getElementById('state');
    var state = statesbox.options[statesbox.selectedIndex].text;
    var chapterTitle = document.getElementById('chapterTitle').value;
    var id = firebaseRef.child('mangas').push().getKey();
    var urlPoster;

    //add poster
    async function uploadPoster() {
        const ref = firebase.storage().ref('mangas/' + id);
        const file = document.querySelector("#poster").files[0];
        const name = +new Date() + "-" + file.name;
        const metadata = {
            contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        await task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                urlPoster = url;
            })
            .catch(console.error);
    }
    await uploadPoster();

    //add chapter
    async function uploadChapter() {
        var fileLength = document.getElementById("imgsChapter").getAttribute("name");
        if (fileLength > 0) {
            const ref = firebase.storage().ref('mangas/' + id + '/' + chapterTitle);
            for (i = 0; i < fileLength; i++) {
                const file = document.querySelector("#imgsChapter").files[i];
                const name = +new Date() + "-" + file.name;
                const metadata = {
                    contentType: file.type
                };
                const task = ref.child(name).put(file, metadata);
            }
        }
    }
    await uploadChapter();

    //add info
    var manga = {
        id: id,
        title: title,
        author: author,
        category: category,
        description: description,
        state: state,
        poster: urlPoster
    }

    firebaseRef.child('mangas').child(id).set(manga);
    document.getElementById("insertMangaForm").reset();
    document.querySelector('#posterthumbnail').removeAttribute('src');
    hideLoader();
}

//updateManga
async function updateManga(id) {
    showLoader();
    var firebaseRef = firebase.database().ref();
    var urlPoster;
    await firebase.database().ref('mangas/' + id).once('value').then(function (snapshot) {
        urlPoster = snapshot.val().poster;
    });
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var category = document.getElementById('category').value;
    var description = document.getElementById('description').value;
    var statesbox = document.getElementById('state');
    var state = statesbox.options[statesbox.selectedIndex].text;
    var chapterTitle = document.getElementById('chapterTitle').value;

    //add chapter
    async function uploadChapter() {
        var fileLength = document.getElementById("imgsChapter").getAttribute("name");
        if (fileLength > 0) {
            const ref = firebase.storage().ref('mangas/' + id + '/' + chapterTitle);
            for (i = 0; i < fileLength; i++) {
                const file = document.querySelector("#imgsChapter").files[i];
                const name = +new Date() + "-" + file.name;
                const metadata = {
                    contentType: file.type
                };
                const task = ref.child(name).put(file, metadata);
            }
        }
    }
    await uploadChapter();

    //update info
    var manga = {
        id: id,
        title: title,
        author: author,
        category: category,
        description: description,
        state: state,
        poster: urlPoster
    }
    firebaseRef.child('mangas').child(id).set(manga);
    alert("Cập nhật thành công!");
    hideLoader();
}

//deleteManga
function deleteManga(id) {
    var r = confirm('Bạn có chắc muốn xóa truyện này?');
    if (r == true) {
        firebase.database().ref('mangas').child(id).remove();
        location.reload();
    }
}

//load mangas from firebase
window.onload = async function getAllMangas() {
    showLoader();
    var i = 1;
    var content = '';
    await firebase.database().ref('mangas').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            // content += '<tr>';
            // content += '<td><img width="70px" height="100px" src="' + childData.poster + '"></td>';
            // content += '<td>'+childData.title+'</td>';
            // content += '<td>'+childData.author+'</td>';
            // content += '<td>'+childData.category+'</td>';
            // content += '<td>'+childData.state+'</td>';
            // content += '<td>'+childData.description+'</td>';
            // content += '</tr>';

            // var x = document.getElementById("dataTable").rows[i].cells;
            // x[0].innerHTML = '<img width="100px" height="150px" src="' + childData.poster + '">';
            // x[1].innerHTML = childData.title;
            // x[2].innerHTML = childData.author;
            // x[3].innerHTML = childData.category;
            // x[4].innerHTML = childData.state
            // x[5].innerHTML = childData.description;
            // a++;

            $('#dataTable').DataTable().row.add([
                '<img width="70px" height="100px" src="' + childData.poster + '">',
                childData.title,
                childData.author,
                childData.category,
                childData.state,
                childData.description,
                '<button onclick="deleteManga(' + "'" + childKey + "'" + ')">xóa</button><button onclick="showModalUpdateManga(' + "'" + childKey + "'" + ')">sửa/thêm chapter</button>'
            ]).draw(false);
        });
        // $('#dataTable').append(content);
        // $('#dataTable').DataTable();
    });
    hideLoader();
}

//show modal add manga
function showModalAddManga() {
    $("#exampleModal").modal({ backdrop: false });
    document.getElementById('modalTitle').innerHTML = 'Thêm truyện';
    document.getElementById('poster').disabled = false;
    document.getElementById('insertMangaForm').reset();
    document.querySelector('#posterthumbnail').removeAttribute('src');
}

//show modal update manga
function showModalUpdateManga(id) {
    $("#exampleModal").modal({ backdrop: false });
    document.getElementById('btnSubmitForm').setAttribute("name", id);
    document.getElementById('modalTitle').innerHTML = 'Cập nhật truyện';
    document.getElementById('poster').disabled = true;
    firebase.database().ref('mangas/' + id).once('value').then(function (snapshot) {
        $('#posterthumbnail').attr('src', snapshot.val().poster);
        document.getElementById("title").value = snapshot.val().title;
        document.getElementById("author").value = snapshot.val().author;
        document.getElementById("category").value = snapshot.val().category;
        $("#state").val(snapshot.val().state);
        document.getElementById("description").value = snapshot.val().description;
    });
}