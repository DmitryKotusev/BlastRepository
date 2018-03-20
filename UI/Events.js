var eve = function() {
    function like(event) {
        var button = event.target;
        var id = button.closest('.post').id;
        dom.addLike(id);
    }

    return {
        like: like
    }
}();