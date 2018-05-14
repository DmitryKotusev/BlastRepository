let currentName;// Хранит текущий ник пользователя
let currentState = 0;// Отражает текущее состояние страницы

const statesMassive = {
  mainState: 0, // Главная страница
  loginState: 1, // Страница в формой для логина
  lookAtPhotoState: 2, // Страница для просмотра фота
  editPostState: 3, // Страница редактирования фотопоста
  uploadPostState: 4, // Страница добавления нового фото
  errorPostState: 5, // Страница ошибки
};

let latestSkip = 0;
let latestTop = 10;
let latestFilterConfig;

const view = (function () {
  let editSelectedID;

  function makeBackButton() {
    let backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'buttonback';
    backButton.id = 'Back';
    backButton.innerHTML = 'Back';
    backButton.addEventListener('click', controller.backButtonEvent);
    return backButton;
  }

  function loadErrorPage(error) {
    let nicknamePlace = document.getElementsByClassName('nicknamealign')[0];
    let headerButtonsPlace = document.getElementsByClassName('headeralign')[0];
    let mainPlacing = document.getElementsByClassName('mainplacing')[0];
    let mainPlacingForButtons = document.getElementsByClassName('mainplacing')[1];
    let main = document.getElementsByTagName('main')[0];
    let body = document.getElementsByTagName('body')[0];

    nicknamePlace.innerHTML = '';
    headerButtonsPlace.innerHTML = '';
    mainPlacing.innerHTML = '';
    mainPlacingForButtons.innerHTML = '';

    if (body.getElementsByClassName('buttonback')[0] !== undefined) {
      body.removeChild(body.getElementsByClassName('buttonback')[0]);
    }

    if (body.getElementsByTagName('aside')[0] !== undefined) {
      body.removeChild(body.getElementsByTagName('aside')[0]);
    }

    mainPlacing.innerHTML =
      `<div class="errorplacing">
            <div>
                <img class="imageerror" src="./ImagesAndIcons/error-803716_960_720.png">
            </div>
            <div class="error-block">
                <p class="error-text">${error.message}</p>
            </div>
        </div>`;

    mainPlacingForButtons.innerHTML = '<button type="button" class="buttonerrorcomeback">Get back to main page</button>';
  }

  function makeFilter() {
    let filt = document.createElement('aside');
    filt.innerHTML =
      `<div class="filterelements">
            <div class="filtermainbutton">
                <button type="button" class="buttonusual">Filter</button>
            </div>

            <form class="asideform">
                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="authorcheck" class="inputcheckbox" type="checkbox" checked>Author</p>
                    <input type="text" name="author" list="authorselectors">
                    <datalist id="authorselectors">
                        <option>VasiaPupkin</option>
                        <option>Kolia</option>
                    </datalist>

                </div>

                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="hashtagcheck" class="inputcheckbox" type="checkbox" checked>Hashtags</p>
                    <input type="text" name="hashtag" list="filterselectors">
                    <datalist id="filterselectors">
                        <option>#2K18</option>
                        <option>#Luka</option>
                        <option>#VR</option>
                        <option>#Olypmics</option>
                    </datalist>
                

                </div>
                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="datecheck" class="inputcheckbox" type="checkbox" checked>Date</p>
                    <input type="text" name="day" maxlength="2" class="inputdate" placeholder="dd">
                    <span>/</span>
                    <input type="text" name="month" maxlength="2" class="inputdate" placeholder="mm">
                    <span>/</span>
                    <input type="text" name="year" maxlength="4" class="inputyear" placeholder="yyyy">
                </div>
            </form>
        </div>`;
    filt.getElementsByClassName('buttonusual')[0].addEventListener('click', controller.filter);
    return filt;
  }

  let filterElement = makeFilter();
  let backButtonElement = makeBackButton();

  async function backButtonRestructure(event) {
    let main = document.getElementsByClassName('mainplacing')[0];
    main.innerHTML = '';
    document.getElementsByTagName('body')[0].replaceChild(filterElement, event.target);
    await view.showPosts(0, 10);
    if (currentName !== null && currentName !== '') {
      await view.checkLogin(currentName);
    } else {
      await view.checkLogin();
    }
    await view.showAuthors();
    await view.showHashtags();
    currentState = statesMassive.mainState;
  }

  function loginRestructure(event) {
    currentState = statesMassive.loginState;
    document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
    document.getElementsByClassName('headeralign')[0].innerHTML = '';
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    document.getElementsByClassName('mainplacing')[1].innerHTML = '';
    let body = document.getElementsByTagName('body')[0];
    let filt = body.getElementsByTagName('aside')[0];

    if (filt !== undefined) {
      body.replaceChild(backButtonElement, filt);
    }
    let main = document.getElementsByClassName('mainplacing')[0];
    main.innerHTML =
      `<div id="form_login_container">
            <p class="login-text">Enter your login and password</p>
            <p class="error-text"></p>
            <form method='POST'>
            <input type="text" placeholder="Login" class="text_input" />
            <input type="text" placeholder="Password" class="text_input" />
            <button type="button" class="buttonlogin">Login</button>
            </form>
        </div>`;
  }

  async function pressLoginRestructure(event) {
    try {
      let loginInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[0];
      let passwordInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[1];
      for (let index = 0; index < users.length; index += 1) {
        if (users[index].login === loginInfo.value && users[index].password === passwordInfo.value) {
          let main = document.getElementsByClassName('mainplacing')[0];
          main.innerHTML = '';
          document.getElementsByTagName('body')[0].replaceChild(filterElement, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
          await view.checkLogin(users[index].login);
          await view.showPosts(0, 10);
          await view.showAuthors();
          await view.showHashtags();
          currentState = statesMassive.mainState;
          return;
        }
      }

      let errorText = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('p')[1];
      errorText.innerHTML = 'Error, invalid login or password';
    } catch (error) {
      loadErrorPage(error);
    }
  }

  async function lookAtPhotoRestructure(event) {
    currentState = statesMassive.lookAtPhotoState;
    let post = await model.getPhotoPost(event.target.closest('.post').id);
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    document.getElementsByClassName('mainplacing')[1].innerHTML = '';
    let main = document.getElementsByTagName('main')[0];

    let body = document.getElementsByTagName('body')[0];
    let filt = body.getElementsByTagName('aside')[0];

    body.replaceChild(backButtonElement, filt);

    let mainPlacing = document.getElementsByClassName('mainplacing')[0];

    if (currentName === (await model.getPhotoPost(event.target.closest('.post').id)).author) {
      mainPlacing.innerHTML =
        `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" readonly name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" readonly name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                    <div class="nickandiconsspec">
                        <button type="button" class="buttonsetspecdelete"><img class="iconstyles" src="./ImagesAndIcons/delete-512.png" alt="Bin"></button>
                        <button type="button" class="buttonsetspecedit"><img class="iconstyles" src="./ImagesAndIcons/221649.png" alt="Edit"></button>
                        <button type="button" class="buttonsetspeclike"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin">
                        <span class="likesamount">${post.likes.length}</span></button>
                    </div>
                </div>
            </div>`;

      return true;
    }

    mainPlacing.innerHTML =
      `<div class="lookatphoto" id="${post.id}">
            <div class="bigphoto">
                <img class="imgstyle" src="${post.photolink}" alt="Mat">
            </div>
            <p class="lookatphototext">Description</p>
            <textarea class="texttoread" readonly name="description" id="" cols="35" rows="5">${post.description}</textarea>
            <p class="lookatphototext">Hashtags</p>
            <textarea class="hashtagstoread" readonly name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
            <p class="lookatphototext">Author: ${post.author}</p>
            <div class="lookatphotoicons">
                <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                <div class="nickandiconsspec">
                    <button type="button" class="buttonsetspeclike"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin">
                    <span class="likesamount">${post.likes.length}</span></button>
                </div>
            </div>
        </div>`;

    return false;
  }

  function makeButton(params, className) {
    let button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.innerHTML = params;
    return button;
  }

  function addLike(post) {
    let postDom = document.getElementById(post.id);
    if (postDom !== null) {
      let amountOfLikes = postDom.getElementsByClassName('likesamount')[0];
      amountOfLikes.innerHTML = post.likes.length;
    }
  }

  async function editPostLookAtPhotoRestructure(event) {
    currentState = statesMassive.editPostState;
    let post = await model.getPhotoPost(event.target.closest('.lookatphoto').id);
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    let placeForButton = document.getElementsByClassName('mainplacing')[1];
    let main = document.getElementsByTagName('main')[0];

    let body = document.getElementsByTagName('body')[0];

    let mainPlacing = document.getElementsByClassName('mainplacing')[0];

    mainPlacing.innerHTML =
      `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;
    let saveButton = view.makeButton('Save and upload', 'buttonusualedit');
    placeForButton.appendChild(saveButton);
  }

  async function saveEditButtonRestructure(params) {
    try {
      let mainPlacing = document.getElementsByClassName('mainplacing')[0];
      let photoPost = {};

      let img = mainPlacing.getElementsByTagName('img')[0];

      let description = mainPlacing.getElementsByTagName('textarea')[0];

      let hash = mainPlacing.getElementsByTagName('textarea')[1];

      let selectedFile = document.getElementById('files');

      if (confirm('Are you sure you want to save changes?')) {
        let imageDOM = document.getElementsByClassName('bigphoto')[0].getElementsByTagName('img')[0].src;
        if (imageDOM.substring(21) === (await model.getPhotoPost(editSelectedID)).photolink.substring(1) || selectedFile.files[0] === undefined) {
          photoPost.description = description.value;
          photoPost.hashtags = hash.value.split(' ');
          if (await model.editPhotoPost(editSelectedID, photoPost)) {
            mainPlacing.innerHTML = '';
            document.getElementsByTagName('body')[0].replaceChild(filterElement, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            await view.showPosts(0, 10);
            await view.showAuthors();
            await view.showHashtags();
            currentState = statesMassive.mainState;
          } else {
            let error = mainPlacing.getElementsByClassName('error-text')[0];
            error.innerHTML = 'Sorry, there are some errors in what you have edit';
          }
          return;
        }

        let filePath = await model.downloadFile(selectedFile.files[0]);

        if (filePath !== null) {
          photoPost.photolink = filePath;
          photoPost.description = description.value;
          photoPost.hashtags = hash.value.split(' ');
          if (await model.editPhotoPost(editSelectedID, photoPost)) {
            mainPlacing.innerHTML = '';
            document.getElementsByTagName('body')[0].replaceChild(filterElement, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            await view.showPosts(0, 10);
            await view.showAuthors();
            await view.showHashtags();
            currentState = statesMassive.mainState;
          } else {
            let error = mainPlacing.getElementsByClassName('error-text')[0];
            error.innerHTML = 'Sorry, there are some errors in what you have edit';
          }
        } else {
          let error = mainPlacing.getElementsByClassName('error-text')[0];
          error.innerHTML = 'Error when downloading file on server';
        }
      }
    } catch (error) {
      loadErrorPage(error);
    }
  }

  async function editPostRestructure(event) {
    currentState = statesMassive.editPostState;
    let post = await model.getPhotoPost(event.target.closest('.post').id);
    editSelectedID = event.target.closest('.post').id;
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    let placeForButton = document.getElementsByClassName('mainplacing')[1];
    let main = document.getElementsByTagName('main')[0];

    let body = document.getElementsByTagName('body')[0];
    let filt = body.getElementsByTagName('aside')[0];

    body.replaceChild(backButtonElement, filt);

    let mainPlacing = document.getElementsByClassName('mainplacing')[0];

    mainPlacing.innerHTML =
      `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;
    let saveButton = view.makeButton('Save and upload', 'buttonusualedit');

    if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
      placeForButton.replaceChild(saveButton, placeForButton.getElementsByTagName('button')[0]);
    } else {
      placeForButton.appendChild(saveButton);
    }
  }

  async function uploadButtonRestucture(params) {
    try {
      let mainPlacing = document.getElementsByClassName('mainplacing')[0];
      let ID = '0';
      let img = mainPlacing.getElementsByTagName('img')[0];

      let description = mainPlacing.getElementsByTagName('textarea')[0];

      let hash = mainPlacing.getElementsByTagName('textarea')[1];
      let hashTags = hash.value.split(' ');
      for (let index = 0; index < hashTags.length; index += 1) {
        if (hashTags[index] === '') {
          hashTags.splice(index, 1);
        }
      }

      let photoPost = new Photopost(ID, description.value, new Date(), currentName, img.src, [], hashTags);

      if (confirm('Are you sure you want to save changes and upload new photopost?')) {
        let selectedFile = document.getElementById('files');

        let filePath = await model.downloadFile(selectedFile.files[0]);
        if (filePath !== null) {
          photoPost.photolink = filePath;
          photoPost.description = description.value;
          photoPost.hashtags = hash.value.split(' ');
          await model.addPhotoPost(photoPost);
          mainPlacing.innerHTML = '';
          document.getElementsByTagName('body')[0].replaceChild(filterElement, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
          await view.showPosts(0, 10);
          await view.showAuthors();
          await view.showHashtags();
          currentState = statesMassive.mainState;
        }
      } else {
        let error = mainPlacing.getElementsByClassName('error-text')[0];
        error.innerHTML = 'Error when downloading file on server';
      }
    } catch (error) {
      loadErrorPage(error);
    }
  }

  function uploadPostRestructure(event) {
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    let placeForButton = document.getElementsByClassName('mainplacing')[1];
    let main = document.getElementsByTagName('main')[0];

    let body = document.getElementsByTagName('body')[0];
    let filt = body.getElementsByTagName('aside')[0];

    if (filt !== undefined) {
      body.replaceChild(backButtonElement, filt);
    }

    let mainPlacing = document.getElementsByClassName('mainplacing')[0];

    mainPlacing.innerHTML =
      `<div class="lookatphoto">
                <div class="bigphoto">
                    <img class="imgstyle">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5"></textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5"></textarea>
                <p class="lookatphototext">Author: ${currentName}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${(new Date()).toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;

    let uploadButton = view.makeButton('Save and upload', 'buttonusualupload');

    if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
      placeForButton.replaceChild(uploadButton, placeForButton.getElementsByTagName('button')[0]);
    } else {
      placeForButton.appendChild(uploadButton);
    }
  }

  let hashtags = [];
  async function findUniqueHashtags() {
    hashtags = await model.findUniqueHashtags();
  }

  let authorNames = [];
  async function findUniqueNames() {
    authorNames = await model.findUniqueNames();
  }

  async function showHashtags() {
    try {
      let elem = document.getElementById('filterselectors');
      elem.innerHTML = '';
      await findUniqueHashtags();
      for (let i = 0; i < hashtags.length && i < 10; i += 1) {
        let option = document.createElement('option');
        option.innerHTML = hashtags[i];
        elem.appendChild(option);
      }
    } catch (error) {
      loadErrorPage(error);
    }
  }

  async function showAuthors() {
    try {
      let elem = document.getElementById('authorselectors');
      elem.innerHTML = '';
      await findUniqueNames();
      for (let i = 0; i < authorNames.length && i < 10; i += 1) {
        let option = document.createElement('option');
        option.innerHTML = authorNames[i];
        elem.appendChild(option);
      }
    } catch (error) {
      loadErrorPage(error);
    }
  }

  function createDOMPhotoPost(photopost) {
    let temp = document.createElement('template');

    let post = document.createElement('div');
    post.className = 'post';
    post.id = photopost.id;

    let photo = document.createElement('div');
    photo.className = 'photo';
    photo.innerHTML = `<img class="imgstyle" src="${photopost.photolink}" alt="Mat">`;

    let nick = document.createElement('div');
    nick.className = 'nickandicons';
    nick.innerHTML = photopost.author;

    let icons = document.createElement('div');
    icons.className = 'nickandicons';
    if (currentName === photopost.author) {
      icons.innerHTML =
        `<button type="button" class="buttonsetdelete"><img class="iconstyles" src="./ImagesAndIcons/delete-512.png" alt="Bin"></button>
            <button type="button" class="buttonsetedit"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/221649.png" alt="Edit"></a></button>
            <button type="button" class="buttonsetlook"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonsetlike"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin"> 
            <span class="likesamount">${photopost.likes.length}</span></button>`;
    } else {
      icons.innerHTML =
        `<button type="button" class="buttonsetlook"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonsetlike"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin"> 
            <span class="likesamount">${photopost.likes.length}</span></button>`;
    }

    let date = document.createElement('div');
    date.className = 'date';
    date.innerHTML = photopost.createdAt.toLocaleDateString();

    post.appendChild(photo);
    post.appendChild(nick);
    post.appendChild(icons);
    post.appendChild(date);

    temp.content.appendChild(post);

    return temp.content;
  }

  function showPhotopost(photopost) {
    let main = document.getElementsByClassName('mainplacing')[0];

    let post = createDOMPhotoPost(photopost);

    main.appendChild(post);
  }

  async function showPosts(skip, top, filterConfig) {
    document.getElementsByClassName('mainplacing')[0].innerHTML = '';
    document.getElementsByClassName('mainplacing')[1].innerHTML = `<button type="button" 
        class="buttonusualadd">Load more</button>`;

    let photoPosts = await model.getPhotoPosts(skip, top, filterConfig);

    if (photoPosts === undefined) {
      return;
    }

    photoPosts.forEach(function (photopost) {
      showPhotopost(photopost);
    });

    latestSkip = skip;
    latestTop = top;
    latestFilterConfig = filterConfig;
    if (await model.getPhotoPosts(skip, top, filterConfig).length === 0) {
      document.getElementsByClassName('mainplacing')[1].innerHTML = '';
      return;
    }

    if ((await model.getPhotoPosts(latestSkip + latestTop, 10, latestFilterConfig)).length === 0) {
      document.getElementsByClassName('mainplacing')[1].innerHTML = '';
    }
  }

  async function checkLogin(username) {
    if (username === '' || username === null) {
      username = undefined;
    }
    let islogined = (username !== undefined);
    if (islogined) {
      document.getElementsByClassName('nicknamealign')[0].innerHTML = `<p> ${username} </p>`;
      document.getElementsByClassName('headeralign')[0].innerHTML =
        `<a href = "#top">
            <button type="button" class="buttonusualaddphoto">
            Add photo</button>
            </a>
            <button type="button" class="buttonusualexit">Exit</button>`;
      currentName = username;

      localStorage.setItem('currentName', JSON.stringify(currentName));
    } else {
      document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
      document.getElementsByClassName('headeralign')[0].innerHTML = '<button type="button" class="buttonusuallogin">Login</button>';
      currentName = null;

      localStorage.setItem('currentName', JSON.stringify(currentName));
    }
    if (currentState === statesMassive.mainState) {
      await showPosts(0, latestTop + latestSkip, latestFilterConfig);
    }
    if (currentState === statesMassive.editPostState) {
      await showPosts(0, 10);
      if (document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0] !== undefined) {
        document.getElementsByTagName('body')[0].replaceChild(filterElement, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
      }
    }
  }

  async function addPhotopost(photopost) {
    await model.addPhotoPost(photopost);
    await showPosts(0, 10);
  }

  async function deletephotopost(id) {
    if (await model.removePhotoPost(id)) {
      await showPosts(0, latestSkip + latestTop, latestFilterConfig);
    }
  }

  async function editPost(id, photoPost) {
    await model.editPhotoPost(id, photoPost);
    await showPosts(0, 10);
    return true;
  }

  async function addMorePosts() {
    let photoPosts = await model.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig);

    if (photoPosts === undefined) {
      return;
    }

    photoPosts.forEach(function (photopost) {
      showPhotopost(photopost);
    });

    latestTop += 10;

    if ((await model.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig)).length === 0) {
      document.getElementsByClassName('mainplacing')[1].innerHTML = '';
    }
  }

  async function startPageDownload(params) {
    try {
      currentName = JSON.parse(localStorage.getItem('currentName'));

      await view.showPosts(0, 10);

      await view.checkLogin(currentName);

      let main = document.getElementsByTagName('main')[0];
      let mainPlacing = main.getElementsByClassName('mainplacing')[0];
      let mainPlacingForButtons = main.getElementsByClassName('mainplacing')[1];

      let body = document.getElementsByTagName('body')[0];

      body.insertBefore(filterElement, main);

      let header = document.getElementsByTagName('header')[0];

      header.addEventListener('click', controller.headerEvent);
      mainPlacing.addEventListener('click', controller.mainPlacingClickEvent);
      mainPlacing.addEventListener('change', controller.mainPlacingChangeEvent);
      mainPlacingForButtons.addEventListener('click', controller.mainPlacingForButtonsEvent);

      await view.showHashtags();
      await view.showAuthors();
    } catch (error) {
      loadErrorPage(error);
    }
  }

  function isSatisfyingFilter(post) {
    if (post.isDeleted) {
      return false;
    }

    if (latestFilterConfig !== undefined) {
      if (latestFilterConfig.author !== undefined) {
        if (typeof (latestFilterConfig.author) === 'string') {
          if (latestFilterConfig.author !== post.author) {
            return false;
          }
        }
      }
      if (latestFilterConfig.createdAt !== undefined) {
        if (typeof (latestFilterConfig.createdAt) === 'object') {
          if (latestFilterConfig.createdAt.getFullYear() !== post.createdAt.getFullYear() || latestFilterConfig.createdAt.getMonth() !== post.createdAt.getMonth() || latestFilterConfig.createdAt.getDate() !== post.createdAt.getDate()) {
            return false;
          }
        }
      }
      if (latestFilterConfig.hashtags !== undefined) {
        if (typeof (latestFilterConfig.hashtags) === 'object') {
          for (let index = 0; index < latestFilterConfig.hashtags.length; index += 1) {
            let flag = false;
            for (let index2 = 0; index2 < post.hashtags.length; index2 += 1) {
              if (post.hashtags[index2] === latestFilterConfig.hashtags[index]) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  function addPostToDom(post) {
    let mainPlacing = document.getElementsByClassName('mainplacing')[0];
    mainPlacing.removeChild(mainPlacing.lastChild);
    mainPlacing.insertBefore(createDOMPhotoPost(post), mainPlacing.firstChild);
  }

  function drawErrorPage() {
    let mainPlacing = document.getElementsByClassName('mainplacing')[0];
    let buttonSpace = document.getElementsByClassName('mainplacing')[1];
    mainPlacing.innerHTML =
      `<div class="errorplacing">
            <div>
                <img class="imageerror" src="./ImagesAndIcons/error-803716_960_720.png">
            </div>
            <div>
                <p class="error-text"></p>
                <p class="error-text">Text</p>
            </div>
        </div>`;
    buttonSpace.innerHTML = '<button type="button" class="buttonerrorcomeback">Get back to main page</button>';
  }

  async function loadMainPage() {
    try {
      let nicknamePlace = document.getElementsByClassName('nicknamealign')[0];
      let headerButtonsPlace = document.getElementsByClassName('headeralign')[0];
      let mainPlacing = document.getElementsByClassName('mainplacing')[0];
      let mainPlacingForButtons = document.getElementsByClassName('mainplacing')[1];
      let main = document.getElementsByTagName('main')[0];
      let body = document.getElementsByTagName('body')[0];

      nicknamePlace.innerHTML = '';
      headerButtonsPlace.innerHTML = '';
      mainPlacing.innerHTML = '';
      mainPlacingForButtons.innerHTML = '';

      if (body.getElementsByClassName('buttonback')[0] !== undefined) {
        body.removeChild(body.getElementsByClassName('buttonback')[0]);
      }

      if (body.getElementsByTagName('aside')[0] !== undefined) {
        body.removeChild(body.getElementsByTagName('aside')[0]);
      }

      body.insertBefore(filterElement, main);

      currentName = JSON.parse(localStorage.getItem('currentName'));

      await view.showPosts(0, 10);

      await view.checkLogin(currentName);

      await view.showHashtags();

      await view.showAuthors();
    } catch (error) {
      loadErrorPage(error);
    }
  }

  return {
    showPhotopost,
    checkLogin,
    addPhotopost,
    deletephotopost,
    editPost,
    showHashtags,
    showPosts,
    showAuthors,
    addLike,
    addMorePosts,
    makeFilter,
    makeButton,
    startPageDownload,
    backButtonRestructure,
    loginRestructure,
    pressLoginRestructure,
    lookAtPhotoRestructure,
    editPostLookAtPhotoRestructure,
    saveEditButtonRestructure,
    editPostRestructure,
    uploadPostRestructure,
    uploadButtonRestucture,
    isSatisfyingFilter,
    addPostToDom,
    loadMainPage,
    loadErrorPage,
  };
}());

view.startPageDownload();
