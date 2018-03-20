var eve = function() {
    function like(event) {
        var button = event.target;
        var id = button.closest('.post').id;
        dom.addLike(id);
    }

    function addMore(event) {
        dom.addMorePosts();
    }

    return {
        like: like,
        addMore: addMore
    }
}();

document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0].addEventListener('click', eve.addMore);