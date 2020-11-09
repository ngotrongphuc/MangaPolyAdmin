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

//show snackbar
function showSnackbar(message) {
    var x = document.getElementById("snackbar");
    document.getElementById("messageSnackbar").innerHTML = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
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
async function submitForm() {
    showLoader();
    //ALL FUNCTION HERE
    //add poster
    async function uploadPoster() {
        const name = 'poster';
        const metadata = {
            contentType: poster.type
        };
        const task = posterRef.child(name).put(poster, metadata);
        await task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                urlPoster = url;
            })
            .catch(console.error);
    }

    //add/update chapter
    async function uploadChapter() {
        var arrayImgs = []
        for (i = 0; i < chapterInput.files.length; i++) {
            const file = document.querySelector("#imgsChapter").files[i];
            const name = file.name;
            const metadata = {
                contentType: file.type
            };
            const task = chapterRef.child(name).put(file, metadata);
            await task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                    arrayImgs.push(url);
                })
                .catch(console.error);
        }
        firebaseRef.child('chapters').child(id).child(chapterTitle.value.trim()).set(arrayImgs);
    }

    //add info
    async function uploadInfo() {
        var manga = {
            id: id,
            title: title.value.trim(),
            author: author.value.trim(),
            category: stringSelectedCate,
            description: description.value.trim(),
            state: state,
            poster: urlPoster,
            totalViews: 0,
            totalLikes: 0,
            createdDate: dateTime,
            updatedDate: ""
        }
        firebaseRef.child('mangas').child(id).set(manga);
    }

    //update info
    async function updateInfo() {
        var manga = {
            title: title.value.trim(),
            author: author.value.trim(),
            category: stringSelectedCate,
            description: description.value.trim(),
            state: state,
            poster: urlPoster,
            updatedDate: dateTime
        }
        firebaseRef.child('mangas').child(id).update(manga);
    }

    //global init
    //init firebase ref FIRST to getKey
    const firebaseRef = firebase.database().ref();
    //init form
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var category = $('#category');
    var arrSelectedCate = category.multipleSelect('getSelects');
    var stringSelectedCate = arrSelectedCate.join(', ');
    var description = document.getElementById('description');
    var statesbox = document.getElementById('state');
    var state = statesbox.options[statesbox.selectedIndex].text;
    var chapterTitle = document.getElementById('chapterTitle');
    var urlPoster;
    var poster = document.getElementById("poster").files[0];
    var chapterInput = document.getElementById("imgsChapter");
    //init date time
    var today = new Date();
    var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' - ' + time;

    const terms = [".", "#", "$", "/", "[", "]"];

    var modalTitle = document.getElementById("modalTitle").textContent;
    if (modalTitle == 'Thêm truyện') {
        //ADD A NEW MANGA
        //generate Key
        var id = firebaseRef.child('mangas').push().getKey();
        //MUST init posterRef and chapterRef AFTER the Key is generated
        var posterRef = firebase.storage().ref('mangas/' + id);
        var chapterRef = firebase.storage().ref('mangas/' + id + '/' + chapterTitle.value);

        //validation
        if (!title.value.trim()) {
            alert('Vui lòng nhập tên truyện!');
            title.focus();
            hideLoader();
            return;
        } else if (!author.value.trim()) {
            alert('Vui lòng nhập tên tác giả!');
            author.focus();
            hideLoader();
            return;
        } else if (!stringSelectedCate) {
            alert('Vui lòng chọn tối thiểu 1 thể loại!');
            category.focus();
            hideLoader();
            return;
        } else if (!description.value.trim()) {
            alert('Vui lòng nhập mô tả!');
            description.focus();
            hideLoader();
            return;
        } else if (!poster) {
            alert('Vui lòng chọn poster!');
            hideLoader();
            return;
        } else if (!chapterTitle.value.trim() && chapterInput.files.length == 0) {
            alert('Vui lòng thêm tối thiểu 1 chapter!');
            hideLoader();
            return;
        } else if (!chapterTitle.value.trim()) {
            alert('Vui lòng nhập tên chapter!');
            chapterTitle.focus();
            hideLoader();
            return;
        } else if (terms.some(term => chapterTitle.value.includes(term))) {
            alert('Tên chapter không được chứa các ký tự ".", "#", "$", "/", "[", "]"!');
            chapterTitle.focus();
            hideLoader();
            return;
        } else if (chapterInput.files.length == 0) {
            alert('Vui lòng chọn ảnh cho chapter!');
            hideLoader();
            return;
        } else {
            await uploadPoster();
            await uploadChapter();
            await uploadInfo();
            //reset form
            document.getElementById("insertMangaForm").reset();
            document.querySelector('#posterthumbnail').removeAttribute('src');
            category.multipleSelect('uncheckAll');
            hideLoader();
            showSnackbar('Đăng truyện thành công');
        }
    } else {
        //UPDATE MANGA
        var id = document.getElementById("btnSubmitForm").getAttribute("name");
        var posterRef = firebase.storage().ref('mangas/' + id);
        var chapterRef = firebase.storage().ref('mangas/' + id + '/' + chapterTitle.value);
        await firebase.database().ref('mangas/' + id).once('value').then(function (snapshot) {
            urlPoster = snapshot.val().poster;
        });

        //validation
        if (!title.value.trim()) {
            alert('Vui lòng nhập tên truyện!');
            title.focus();
            hideLoader();
            return;
        } else if (!author.value.trim()) {
            alert('Vui lòng nhập tên tác giả!');
            author.focus();
            hideLoader();
            return;
        } else if (!stringSelectedCate) {
            alert('Vui lòng chọn tối thiểu 1 thể loại!');
            category.focus();
            hideLoader();
            return;
        } else if (!description.value.trim()) {
            alert('Vui lòng nhập mô tả!');
            description.focus();
            hideLoader();
            return;
        } else if (!chapterTitle.value.trim() && chapterInput.files.length > 0) {
            alert('Vui lòng nhập tên chapter!');
            chapterTitle.focus();
            hideLoader();
            return;
        } else if (terms.some(term => chapterTitle.value.includes(term))) {
            alert('Tên chapter không được chứa các ký tự ".", "#", "$", "/", "[", "]"!');
            chapterTitle.focus();
            hideLoader();
            return;
        } else if (chapterTitle.value.trim() && chapterInput.files.length == 0) {
            alert('Vui lòng chọn ảnh cho chapter!');
            hideLoader();
            return;
        } else {
            if (poster) {
                await uploadPoster();
            }
            if (chapterInput.files.length > 0) {
                await uploadChapter();
            }
            await updateInfo();
            //reset chapterTitle and chapterInput
            chapterTitle.value = '';
            chapterInput.value = null;
            hideLoader();
            showSnackbar('Cập nhật thành công');
        }
    }
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
    var totalManga;
    var totalUser;
    await firebase.database().ref('mangas').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            //count total manga
            totalManga = snapshot.numChildren();

            firebase.database().ref('chapters/' + childKey).once('value', function (snapshot) {
                var totalChapters = snapshot.numChildren();
                $('#dataTable').DataTable().row.add([
                    '<img width="70px" height="100px" src="' + childData.poster + '">',
                    '<p style="height:100px;overflow:auto">' + childData.title + '</p>',
                    '<a href="javascript: void(0)" onclick="showModalListChapter(' + "'" + childKey + "'" + "," + "'" + childData.title + "'" + ')">' + totalChapters + '</a>',
                    '<p style="height:100px;overflow:auto">' + childData.author + '</p>',
                    '<p style="width:100px;height:100px;overflow:auto">' + childData.category + '</p>',
                    childData.state,
                    '<p style="width:300px;height:100px;overflow:auto">' + childData.description + '</p>',
                    childData.totalViews,
                    childData.totalLikes,
                    '<button style="background-color: red" onclick="deleteManga(' + "'" + childKey + "'" + ')">xóa</button>' +
                    '<button style="background-color: yellow" onclick="showModalUpdateManga(' + "'" + childKey + "'" + ')">sửa/thêm chapter</button>',
                    childData.createdDate,
                    childData.updatedDate
                ]).draw(false);
            });
        });
    });

    //count total user
    await firebase.database().ref('users').once('value', function (snapshot) {
        totalUser = snapshot.numChildren();
    });
    //set total manga and total user
    document.getElementById('totalManga').innerHTML = totalManga;
    document.getElementById('totalUser').innerHTML = totalUser;
    setupMultipleSelect();
    hideLoader();
}

//get all and setup multiple select
var arrCategory = [];
async function setupMultipleSelect() {
    arrCategory = [];
    //get all categories
    await firebase.database().ref('categories').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            arrCategory.push(childData);
        });
    });
    //setup multiple select
    $(function () {
        $('#category').multipleSelect('refreshOptions', {
            filter: true,
            multiple: true,
            multipleWidth: 150,
            data: arrCategory,
            onFilter: function (text) {
                if (text.length == 0) {
                    $('#category').multipleSelect('refreshOptions', {
                        multipleWidth: 150,
                    });
                }
            },
        })
    });
}

//show modal add manga
function showModalAddManga() {
    $("#exampleModal").modal({ backdrop: false });
    document.getElementById('modalTitle').innerHTML = 'Thêm truyện';
    document.getElementById('poster').disabled = false;
    document.getElementById('insertMangaForm').reset();
    document.querySelector('#posterthumbnail').removeAttribute('src');
    $('#category').multipleSelect('uncheckAll');
}

//show modal update manga
var arrSelectedCateGet = [];
async function showModalUpdateManga(id) {
    arrSelectedCateGet = [];
    $("#exampleModal").modal({ backdrop: false });
    document.getElementById('btnSubmitForm').setAttribute("name", id);
    document.getElementById('modalTitle').innerHTML = 'Cập nhật truyện';
    // var arrSelectedCate;
    await firebase.database().ref('mangas/' + id).once('value').then(function (snapshot) {
        $('#posterthumbnail').attr('src', snapshot.val().poster);
        document.getElementById("title").value = snapshot.val().title;
        document.getElementById("author").value = snapshot.val().author;
        arrSelectedCateGet = snapshot.val().category.split(", ");
        $("#state").val(snapshot.val().state);
        document.getElementById("description").value = snapshot.val().description;
    });
    $('#category').multipleSelect('setSelects', arrSelectedCateGet);
}

//show modal list chapter
function showModalListChapter(id, mangaTitle) {
    $("#modalListChapter").modal({ backdrop: false });
    document.getElementById('modalListChapterTitle').innerHTML = mangaTitle;
    var content = '<div id="listChapter"></div>';
    $('#modalBody').append(content);
    firebase.database().ref('chapters/' + id).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var chapterTitle = childSnapshot.key;
            content = '<i class="fas fa-trash-alt" onclick="deleteChapter(' + "'" + id + "'" + "," + "'" + chapterTitle + "'" + ')"></i><i class="fas fa-edit" onclick="showModalUpdateChapter(' + "'" + id + "'" + "," + "'" + mangaTitle + "'" + "," + "'" + chapterTitle + "'" + ')"></i><a href="chapter.html?' + id + '|' + chapterTitle + '" target="_blank">' + chapterTitle + '</a></br>';
            $('#listChapter').append(content);
        });
    });
}

//remove list chapter when close modal
function removeListChapter() {
    $('#listChapter').remove();
}

//deleteChapter
function deleteChapter(idManga, idChapter) {
    var r = confirm('Bạn có chắc muốn xóa chapter này?');
    if (r == true) {
        firebase.database().ref('chapters').child(idManga).child(idChapter).remove();
    }
}

//show modal update chapter
function showModalUpdateChapter(idManga, mangaTitle, chapterTitle) {
    $("#modalUpdateChapters").modal({ backdrop: false });
    document.getElementById('modalUpdateChapterTitle').innerHTML = mangaTitle + '/' + chapterTitle;
    document.getElementById('btnCloseFormUpdateChapter').setAttribute("name", idManga);
    document.getElementById('btnSubmitFormUpdateChapter').setAttribute("name", chapterTitle);
}

//updateChapter
async function updateChapter() {
    async function uploadChapter() {
        const firebaseRef = firebase.database().ref();
        var chapterUpdateInput = document.getElementById("imgsUpdateChapter");
        var idManga = document.getElementById("btnCloseFormUpdateChapter").getAttribute("name");
        var chapterTitle = document.getElementById("btnSubmitFormUpdateChapter").getAttribute("name");
        var chapterRef = firebase.storage().ref('mangas/' + idManga + '/' + chapterTitle);
        var arrayImgs = [];
        for (i = 0; i < chapterUpdateInput.files.length; i++) {
            const file = document.querySelector("#imgsUpdateChapter").files[i];
            const name = file.name;
            const metadata = {
                contentType: file.type
            };
            const task = chapterRef.child(name).put(file, metadata);
            await task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                    arrayImgs.push(url);
                })
                .catch(console.error);
        }
        firebaseRef.child('chapters').child(idManga).child(chapterTitle).set(arrayImgs);
    }
    var r = confirm('Cập nhật sẽ ghi đè toàn bộ ảnh của chapter này, bạn có muốn tiếp tục?');
    if (r == true) {
        await uploadChapter();
        showSnackbar("Cập nhật chapter thành công!");
    }
}

//show modal list Category
function showModalListCategory() {
    $("#modalListCategory").modal({ backdrop: false });
    getAllListCategory();
    arrSelectedCateGet = $('#category').multipleSelect('getSelects');
}

//get all list Category from firebase
function getAllListCategory() {
    var content = '<div id="listCategory"></div>';
    $('#modalBodyListCategory').append(content);
    firebase.database().ref('categories').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            content = '<i class="fas fa-trash-alt" onclick="deleteCategory(' + "'" + childKey + "'" + ')"></i>' + childData + '</br>';
            $('#listCategory').append(content);
        });
    });
}

//add Category
async function addCategory() {
    var newCategory = document.getElementById("newCategory");
    if (!newCategory.value.trim()) {
        alert('Vui lòng nhập tên thể loại!');
    } else {
        var isDuplicated = false;
        await firebase.database().ref('categories').once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (newCategory.value.trim() == childData) {
                    isDuplicated = true;
                    alert("Thể loại này đã tồn tại!");
                }
            });
        });

        if (!isDuplicated) {
            const firebaseRef = firebase.database().ref();
            await firebaseRef.child('categories').push(newCategory.value.trim());
            removeListCategory();
            getAllListCategory();
            setupMultipleSelect();
            newCategory.value = '';
            newCategory.focus();
        }
    }
}

//remove list Category when close modal
function removeListCategory() {
    $('#listCategory').remove();
    $('#category').multipleSelect('setSelects', arrSelectedCateGet);
}

//delete Category
async function deleteCategory(idCategory) {
    var r = confirm('Bạn có chắc muốn xóa thể loại này?');
    if (r == true) {
        await firebase.database().ref('categories').child(idCategory).remove();
        removeListCategory();
        getAllListCategory();
        setupMultipleSelect();
    }
}