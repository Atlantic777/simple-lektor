var user_list = [];
var current_user;

function loadUsers() {
  $.get('http://localhost:5000/user').done(function(response) {
    user_list = JSON.parse(response);
    $("#user-list").text("");

    for(var id in user_list) {
      var username = user_list[id].name;
      $("#user-list").append('<li class="user-entry">'+username + '</li>');
    }
  });
}

function loadDict(username) {
  $.get('http://localhost:5000/limbo/'+username)
    .done(function(response) {

      $("#word-list").text("");
      var words = JSON.parse(response);
      for(var id in words) {
        var html = "";
        html += "<li>" + words[id] + "</li>";
        $("#word-list").append(html);
      }
    });
}

function userClicked() {
  var user_elem = $(this);

  $(".selected").removeClass("selected");
  user_elem.addClass("selected");

  current_user = user_elem.text();
  loadDict(current_user);
}

function addUser() {
  var input = $("input#username").val();
  var params = {"username": input};
  $.post("http://localhost:5000/user", params);
  loadUsers();
}

function addWord() {
  var input = $("input#word").val();
  var params = {"words": JSON.stringify([input])};
  $.post("http://localhost:5000/limbo/"+current_user, params);

  loadDict(current_user);
}

$(document).on('ready', function() {
  loadUsers();
  $(document).on('click', '.user-entry', userClicked);
  $("button#add-user").on('click', addUser);
  $("button#add-word").on('click', addWord);
});
