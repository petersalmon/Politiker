
// Show loading screen on page load

window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    loader.className += " hidden";
}); 

// Call route to remove user upon button click
var removeUserBtns = document.getElementsByClassName('remove-user');

for (var i = 0; i < removeUserBtns.length; i++) {

    removeUserBtns[i].addEventListener('click', function() {

        var userId = this.getAttribute("data-id");

        $.ajax({
            "url": "/Politiker/account/remove-user/" + userId + "?_method=DELETE",
            "method": "POST",
            "data": {
                userId: userId
            },
            "content-type": "application/json",
            success: function(response){
                console.log(response);
                window.location.reload(false);
            },
            error: function(response){
                console.log(response);
                window.location.reload(false);
            }
        });
    });

    // removeUserBtns[i].addEventListener('click', function() {
    //     var currentUrl = window.location.href;
    //     var userId = this.getAttribute("data-id");
    //     var url = currentUrl + 'remove-user/' + userId //+ '?_method=DELETE';
    //     // location.assign(url);
    //     console.log(currentUrl);
    //     console.log(userId);
    //     console.log(url);

    // });
}
