var user_list = [];

function loadUsers() {
  console.log("loading users");

  $.get('http://localhost:5000/user').done(function(response) {
    user_list = JSON.parse(response);
    $("#user-list").text("");

    for(var id in user_list) {
      var username = user_list[id].name;
      console.log(username);

      $("#user-list").append('<li class="user-entry">'+username + '</li>');
    }
  });
}

function userClicked() {
  var user_elem = $(this);

  user_elem.addClass("selected");

  $.get('http://localhost:5000/user/'+user_elem.text())
    .done(function(response) {
      console.log(response);
    });
}

function addUser() {
  $.post("http://localhost:5000/user", data=JSON.stringify())
}

$(document).on('ready', function() {
  loadUsers();
  $(document).on('click', '.user-entry', userClicked);
  $("button#add-user").on('click', addUser);
});
