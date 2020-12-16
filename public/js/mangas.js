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
        firebaseRef.child('Chapters').child(id).child(chapterTitle.value.trim()).set(
            {
                info: {
                    id: chapterTitle.value.trim(),
                    dateCreated: dateTime,
                    dateUpdated: dateTime
                },
                images: arrayImgs
            }
        );
    }

    //add info
    async function uploadInfo() {
        var manga = {
            id: id,
            name: name.value.trim(),
            author: author.value.trim(),
            genres: stringSelectedCate,
            description: description.value.trim(),
            state: state,
            poster: urlPoster,
            totalReads: 0,
            totalLikes: 0,
            created: dateTime,
            updated: dateTime
        }

        // for(var i = 0; i <arrSelectedCate.length;i++){
        //     manga[arrSelectedCate[i]]=arrSelectedCate[i];
        // }
        firebaseRef.child('Mangas').child(id).set(manga);
        for (var i = 0; i < arrSelectedCate.length; i++) {
            var genre = arrSelectedCate[i];
            firebaseRef.child('Mangas').child(id).child(genre).set(genre);
        }
    }

    //update info
    async function updateInfo() {
        var totalReads;
        var totalLikes;
        var created;
        await firebase.database().ref('Mangas/' + id).once('value').then(function (snapshot) {
            totalReads = snapshot.val().totalReads;
            totalLikes = snapshot.val().totalLikes;
            created = snapshot.val().created;
        });
        var manga = {
            id: id,
            name: name.value.trim(),
            author: author.value.trim(),
            genres: stringSelectedCate,
            description: description.value.trim(),
            state: state,
            poster: urlPoster,
            totalReads: totalReads,
            totalLikes: totalLikes,
            created: created,
            updated: dateTime
        }
        firebaseRef.child('Mangas').child(id).set(manga);
        for (var i = 0; i < arrSelectedCate.length; i++) {
            var genre = arrSelectedCate[i];
            firebaseRef.child('Mangas').child(id).child(genre).set(genre);
        }
    }

    //global init
    //init firebase ref FIRST to getKey
    const firebaseRef = firebase.database().ref();
    //init form
    var name = document.getElementById('title');
    var author = document.getElementById('author');
    var genres = $('#category');
    var arrSelectedCate = genres.multipleSelect('getSelects');
    var stringSelectedCate = arrSelectedCate.join(', ');
    var description = document.getElementById('description');
    var statesbox = document.getElementById('state');
    var state = statesbox.options[statesbox.selectedIndex].text;
    var chapterTitle = document.getElementById('chapterTitle');
    var urlPoster;
    var poster = document.getElementById("poster").files[0];
    var chapterInput = document.getElementById("imgsChapter");
    //init date time
    // var today = new Date();
    // var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = Date.now();

    const terms = [".", "#", "$", "/", "[", "]"];

    var modalTitle = document.getElementById("modalTitle").textContent;
    if (modalTitle == 'Thêm truyện') {
        //ADD A NEW MANGA
        //generate Key
        var id = firebaseRef.child('Mangas').push().getKey();
        //MUST init posterRef and chapterRef AFTER the Key is generated
        var posterRef = firebase.storage().ref('Mangas/' + id);
        var chapterRef = firebase.storage().ref('Mangas/' + id + '/' + chapterTitle.value);

        //validation
        if (!name.value.trim()) {
            alert('Vui lòng nhập tên truyện!');
            name.focus();
            hideLoader();
            return;
        } else if (!author.value.trim()) {
            alert('Vui lòng nhập tên tác giả!');
            author.focus();
            hideLoader();
            return;
        } else if (!stringSelectedCate) {
            alert('Vui lòng chọn tối thiểu 1 thể loại!');
            genres.focus();
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
            genres.multipleSelect('uncheckAll');
            hideLoader();
            showSnackbar('Đăng truyện thành công');
        }
    } else {
        //UPDATE MANGA
        var id = document.getElementById("btnSubmitForm").getAttribute("name");
        var posterRef = firebase.storage().ref('Mangas/' + id);
        var chapterRef = firebase.storage().ref('Mangas/' + id + '/' + chapterTitle.value);
        await firebase.database().ref('Mangas/' + id).once('value').then(function (snapshot) {
            urlPoster = snapshot.val().poster;
        });

        //validation
        if (!name.value.trim()) {
            alert('Vui lòng nhập tên truyện!');
            name.focus();
            hideLoader();
            return;
        } else if (!author.value.trim()) {
            alert('Vui lòng nhập tên tác giả!');
            author.focus();
            hideLoader();
            return;
        } else if (!stringSelectedCate) {
            alert('Vui lòng chọn tối thiểu 1 thể loại!');
            genres.focus();
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
        firebase.database().ref('Mangas').child(id).remove();
        location.reload();
    }
}

//load Mangas from firebase
window.onload = async function getAllMangas() {
    showLoader();
    //set email from localStorage
    document.getElementById("emailAdminMangaPoly").innerHTML = localStorage.getItem("emailAdminMangaPoly");

    //load all Mangas
    var totalManga;
    var totalUser;
    var listManga = [];
    await firebase.database().ref('Mangas').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            //count total manga
            totalManga = snapshot.numChildren();

            firebase.database().ref('Chapters/' + childKey).once('value', function (snapshot) {
                var totalChapters = snapshot.numChildren();
                var listCategory = childData.genres.split(",");
                var strCategory = listCategory[0] + '<br>';
                for (i = 1; i < listCategory.length; i++) {
                    strCategory += listCategory[i] + '<br>';
                }
                listManga.push([
                    '<img width="70px" height="100px" src="' + childData.poster + '">',
                    '<div style="height:100px;display:flex;justify-content:center;overflow:auto;">' + childData.name + '</div>',
                    '<div style="height:100px;display:flex;justify-content:center;"><a href="javascript: void(0)" onclick="showModalListChapter(' + "'" + childKey + "'" + "," + "'" + childData.name + "'" + ')">' + totalChapters + '</a></div>',
                    '<div style="height:100px;display:flex;justify-content:center;overflow:auto;">' + childData.author + '</div>',
                    '<div style="width:100px;height:100px;display:flex;justify-content:center;overflow:auto;">' + strCategory + '</div>',
                    '<div style="height:100px;display:flex;justify-content:center;">' + childData.state + '</div>',
                    '<div style="width:400px;height:100px;display:flex;justify-content:center;overflow:auto;">' + childData.description + '</div>',
                    '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + childData.totalReads + '</div>',
                    '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + childData.totalLikes + '</div>',
                    '<button class="btn btn-danger" style="margin-bottom:20px" onclick="deleteManga(' + "'" + childKey + "'" + ')">xóa</button>' +
                    '<button class="btn btn-warning" onclick="showModalUpdateManga(' + "'" + childKey + "'" + ')">sửa</button>',
                    '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + new Date(childData.created).toLocaleString() + '</div>',
                    '<div style="height:100px;display:flex;justify-content:center;align-items:center;">' + new Date(childData.updated).toLocaleString() + '</div>',
                ]);
                //do code không đồng bộ và datatable chỉ đăng ký được 1 lần nên phải check nếu đã add xong hết manga vào listManga mới set datatable
                if (listManga.length == totalManga) {
                    $('#dataTable').DataTable({
                        dom: 'Bfrtip',
                        buttons: ['colvis', 'pageLength'],
                        data: listManga,
                        pageLength: 50,
                    });
                }
            });
        });
    });

    //count total user
    await firebase.database().ref('Users').once('value', function (snapshot) {
        totalUser = snapshot.numChildren();
    });
    //set total manga and total user
    document.getElementById('totalManga').innerHTML = totalManga;
    document.getElementById('totalUser').innerHTML = totalUser;
    setupMultipleSelect();
    hideLoader();
}

//get all genres and setup multiple select
var arrCategory = [];
async function setupMultipleSelect() {
    arrCategory = [];
    //get all categories
    await firebase.database().ref('Genres').once('value', function (snapshot) {
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
    await firebase.database().ref('Mangas/' + id).once('value').then(function (snapshot) {
        $('#posterthumbnail').attr('src', snapshot.val().poster);
        document.getElementById("title").value = snapshot.val().name;
        document.getElementById("author").value = snapshot.val().author;
        arrSelectedCateGet = snapshot.val().genres.split(", ");
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
    firebase.database().ref('Chapters/' + id).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var chapterTitle = childSnapshot.key;
            content = '<i class="fas fa-trash-alt" onclick="deleteChapter(' + "'" + id + "'" + "," + "'" + chapterTitle + "'" + ')"></i><i class="fas fa-edit" onclick="showModalUpdateChapter(' + "'" + id + "'" + "," + "'" + mangaTitle + "'" + "," + "'" + chapterTitle + "'" + ')"></i><a href="chapter.html?' + id + '|' + chapterTitle + '|' + mangaTitle + '" target="_blank">' + chapterTitle + '</a></br>';
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
        firebase.database().ref('Chapters').child(idManga).child(idChapter).remove();
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
        var chapterRef = firebase.storage().ref('Mangas/' + idManga + '/' + chapterTitle);
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
        firebaseRef.child('Chapters').child(idManga).child(chapterTitle).set(arrayImgs);
    }
    var r = confirm('Cập nhật sẽ cập nhật lại toàn bộ ảnh của chapter này, bạn có muốn tiếp tục?');
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
    firebase.database().ref('Genres').once('value', function (snapshot) {
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
        await firebase.database().ref('Genres').once('value', function (snapshot) {
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
            await firebaseRef.child('Genres').push(newCategory.value.trim());
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
        await firebase.database().ref('Genres').child(idCategory).remove();
        removeListCategory();
        getAllListCategory();
        setupMultipleSelect();
    }
}