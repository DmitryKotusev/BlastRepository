const controller = (function () {
  async function like(event) {
    try {
      let button = event.target;
      let idx = button.closest('.post').id;
      if (currentName === null) {
        return;
      }
      if (typeof (idx) !== 'string') {
        return;
      }
      let post = await model.getPhotoPost(idx);

      if (!post.likes.every(function (plus, index) {
        if (plus === currentName) {
          post.likes.splice(index, 1);

          return false;
        }
        return true;
      })) {
        let photoEdit = {};
        photoEdit.likes = post.likes;

        await model.editPhotoPost(idx, photoEdit);

        view.addLike(post);
        return;
      }

      post.likes.push(currentName);

      view.addLike(post);

      let photoEdit = {};
      photoEdit.likes = post.likes;
      await model.editPhotoPost(idx, photoEdit);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function validhash(item) {
    if (typeof (item) !== 'string') {
      return false;
    }
    if (item.charAt(0) !== '#') {
      return false;
    }
    for (let index = 1; index < item.length; index += 1) {
      if (item.charAt(index) === ' ' || item.charAt(index) === '#' || item.charAt(index) === ',' || item.charAt(index) === '.') {
        return false;
      }
    }
    return true;
  }

  async function likeLookAt(event) {
    let button = event.target;
    let idx = button.closest('.lookatphoto').id;
    if (currentName === null) {
      return;
    }
    if (typeof (idx) !== 'string') {
      return;
    }

    try {
      let post = await model.getPhotoPost(idx);


      if (post === undefined) {
        return;
      }
      if (!post.likes.every(function (plus, index) {
        if (plus === currentName) {
          post.likes.splice(index, 1);

          return false;
        }
        return true;
      })) {
        let photoEdit = {};
        photoEdit.likes = post.likes;

        await model.editPhotoPost(idx, photoEdit);
        view.addLike(post);
        return;
      }

      post.likes.push(currentName);

      view.addLike(post);

      let photoEdit = {};
      photoEdit.likes = post.likes;

      await model.editPhotoPost(idx, photoEdit);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function addMore(event) {
    try {
      view.addMorePosts();
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function backButtonEvent(event) {
    try {
      view.loadMainPage();
      currentState = statesMassive.mainState;
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function login(event) {
    view.loginRestructure(event);
  }

  async function exit(params) {
    try {
      if (confirm('Are you sure you want to exit?')) {
        let result = await model.logOut();
        if (result === 'true') {
          if (currentState === statesMassive.editPostState) {
            view.loadMainPage();
            view.checkLogin();
            currentState = statesMassive.mainState;
            return;
          }
          if (currentState === statesMassive.lookAtPhotoState) {
            view.loadMainPage();
            view.checkLogin();
            currentState = statesMassive.mainState;
            return;
          }
          if (currentState === statesMassive.uploadPostState) {
            view.loadMainPage();
            view.checkLogin();
            currentState = statesMassive.mainState;
            return;
          }
          await view.checkLogin();
          return;
        }
      }
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  async function lookAtPhoto(event) {
    try {
      await view.lookAtPhotoRestructure(event);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function isValidDate(y, m, d) {
    let dt = new Date(y, m, d);
    let isValid = (y === dt.getFullYear()) && ((m) === dt.getMonth()) && (d === dt.getDate());
    return isValid;
  }

  async function filter(params) {
    try {
      let filt = document.getElementsByTagName('aside')[0];
      let authorCheck = document.getElementsByName('authorcheck')[0]; // Чекбокс
      let hashCheck = document.getElementsByName('hashtagcheck')[0]; // Чекбокс
      let dateCheck = document.getElementsByName('datecheck')[0]; // Чекбокс
      let author = document.getElementsByName('author')[0]; // input поле
      let hashtag = document.getElementsByName('hashtag')[0]; // input поле
      let day = document.getElementsByName('day')[0]; // input поле
      let month = document.getElementsByName('month')[0]; // input поле
      let year = document.getElementsByName('year')[0]; // input поле
      let filterConfig = {};

      if (authorCheck.checked) {
        if (author.value !== '') {
          filterConfig.author = author.value;
        }
      }

      if (hashCheck.checked) {
        if (hashtag.value !== '') {
          let tags = hashtag.value.split(' ');
          filterConfig.hashtags = [];
          tags.forEach((element) => {
            if (validhash(element)) {
              filterConfig.hashtags.push(element);
            }
          });
        }
      }

      if (dateCheck.checked) {
        if (day.value !== '' && month.value !== '' && year.value !== '') {
          let daynum = +day.value;
          let daymonth = +month.value - 1;
          let dayyear = +year.value;
          if (isValidDate(dayyear, daymonth, daynum)) {
            filterConfig.createdAt = new Date(dayyear, daymonth, daynum);
          }
        }
      }
      await view.showPosts(0, 10, filterConfig);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  async function deletePost(event) {
    try {
      if (confirm('Are you sure you want to delete this post?')) {
        let button = event.target;
        let idx = button.closest('.post').id;
        await view.deletephotopost(idx);
      }
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  async function deletePostLookAtPhoto(event) {
    try {
      if (confirm('Are you sure you want to delete this post?')) {
        await model.removePhotoPost(event.target.closest('.lookatphoto').id);
        await view.deletePostLookAtPhotoRestructure(event);
      }
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function updateImageDisplay(event) {
    let photoWrapper = event.target.closest('.lookatphoto');
    let image = photoWrapper.getElementsByClassName('imgstyle')[0];
    let reader = new FileReader();
    if (event.target.files[0] !== undefined) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = function () {
        image.src = reader.result;
      };
    } else {
      image.src = '';
    }
  }

  async function editPostLookAtPhoto(event) {
    try {
      await view.editPostLookAtPhotoRestructure(event);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  async function editPost(event) {
    try {
      await view.editPostRestructure(event);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function uploadPost(event) {
    if (currentState === statesMassive.uploadPostState) {
      return;
    }
    currentState = statesMassive.uploadPostState;

    view.uploadPostRestructure(event);
  }

  async function authorise(event) {
    let loginInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[0];
    let passwordInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[1];

    if (loginInfo.value === '' || passwordInfo.value === '') {
      view.showLoginErrorText('Some fields are empty');
      return;
    }

    try {
      let result = await model.logIn(loginInfo.value, passwordInfo.value);
      if (result === 'false') {
        view.showLoginErrorText('Invalid login or password');
        return;
      }

      await view.pressLoginRestructure(event, loginInfo.value);
    } catch (error) {
      view.loadErrorPage(new Error('Ooops, something went wrong'));
    }
  }

  function mainPlacingClickEvent(event) {
    if (event.target.className === 'buttonlogin') {
      authorise(event);
      return;
    }

    if (event.target.closest('button') !== null) {
      let button = event.target.closest('button');

      if (button.className === 'buttonsetdelete') {
        deletePost(event);
        return;
      }

      if (button.className === 'buttonsetedit') {
        editPost(event);
        return;
      }

      if (button.className === 'buttonsetlook') {
        lookAtPhoto(event);
        return;
      }

      if (button.className === 'buttonsetlike') {
        like(event);
        return;
      }

      if (button.className === 'buttonsetspeclike') {
        likeLookAt(event);
        return;
      }

      if (button.className === 'buttonsetspecedit') {
        editPostLookAtPhoto(event);
        return;
      }

      if (button.className === 'buttonsetspecdelete') {
        deletePostLookAtPhoto(event);
      }
    }
  }

  function mainPlacingChangeEvent(event) {
    if (event.target.className === 'imagefileinput') {
      updateImageDisplay(event);
    }
  }

  function mainPlacingForButtonsEvent(event) {
    if (event.target.className === 'buttonusualadd') {
      addMore(event);
      return;
    }

    if (event.target.className === 'buttonusualedit') {
      view.saveEditButtonRestructure(event);
      return;
    }

    if (event.target.className === 'buttonusualupload') {
      view.uploadButtonRestucture(event);
      return;
    }

    if (event.target.className === 'buttonerrorcomeback') {
      view.loadMainPage();
    }
  }

  function headerEvent(event) {
    if (event.target.className === 'buttonusualexit') {
      exit(event);
      return;
    }

    if (event.target.className === 'buttonusualaddphoto') {
      uploadPost(event);
      return;
    }

    if (event.target.className === 'buttonusuallogin') {
      login(event);
    }
  }

  return {
    like,
    addMore,
    login,
    exit,
    lookAtPhoto,
    filter,
    deletePost,
    editPost,
    uploadPost,
    backButtonEvent,
    headerEvent,
    mainPlacingClickEvent,
    mainPlacingChangeEvent,
    mainPlacingForButtonsEvent,
  };
}());
