var sorted = [];
var dict = [];
var limbo = [];
var user_list = [];
var current_user;
var user_selected = false;

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function showWord(idx, word) {
  if (this !== " " && this !== "") {
    $("#unique").append("<li>" + this + "</li>");
  }
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function prepare(textBlob) {
  textBlob = textBlob.replace(/\/\//g, '');
  textBlob = textBlob.replace(/\*\*/g, '');
  textBlob = textBlob.replace(/=+/g, '');
  textBlob = textBlob.replace(/\(|\)|,|\./g, '');
  textBlob = textBlob.replace(/\[|\]/g, '');
  textBlob = textBlob.replace(/\n/g, '');

  var list = textBlob.split(' ');
  var uniq = list.filter(onlyUnique);

  return uniq.sort();
}

function mark(word) {
  var original = $("#editor").html();

  var re = "(" + word + ")";
  var exp = RegExp(re);
  var marked = original.replace(exp, '<span class="wrong">$1</span>');

  $("#editor").html(marked);
}

function markBadWords(data) {
  dict = JSON.parse(data);

  $("#badWords").text("");

  $(dict).each(function() {
    var word = this.word;
    mark(word);
    $("#badWords").append("<li>"+word+"</li>");
  });
}

function check() {
  unique = [];
  $("#unique").text("");

  var orig = $("#editor").text();
  var stripped = strip(orig);

  $("#editor").text(stripped);

  var raw = stripped;

  sorted = prepare(raw);
  // $(sorted).each(showWord);
  $.post("http://localhost:5000/limbo/"+current_user+"/check",
         { wordlist: JSON.stringify(sorted) })
      .done(markBadWords);
}

function showSuggestions() {
  var word = this.innerHTML;
  $("#selection").text(word);

  for(var word_id in dict) {
    var entry = dict[word_id];

    if(entry.word === word) {
      var html = '';

      for(var id in entry.suggestions) {
        html += '<em>' + entry.suggestions[id] + '</em>, ';
      }
      $("#sugestions").html(html);

      break;
    }
  }
}

function setLimboDict(data) {
  $("#dict").text("");
  limbo = JSON.parse(data);

  $(limbo).each(function(i, word) {
    $("#dict").append("<li>" + word + "</li>");
  });
}

function addToLimbo() {
  var selection = $("#selection").text();

  // post new word to limbo dict
  $.post("http://localhost:5000/limbo/"+current_user,
         { words: JSON.stringify([selection])})
         .done(setLimboDict);

  check();
}

function clearSelection() {
  $("#selection").text("");
}

function fetchLimbo() {
  if(user_selected) {
    $.get("http://localhost:5000/limbo/"+current_user).done(setLimboDict);
  }
}

function changeUser() {
  var username = $(this).text();
  current_user = username;
  $("#user-chooser").text(current_user);
  user_selected = true;

  fetchLimbo();
}

function fetchUsers() {
  $.get("http://localhost:5000/user").done(function(response) {
    user_list = JSON.parse(response);

    $("#user-list").text("");

    for(var id in user_list) {
      var html = "";
      html += '<li><a class="user-entry" href="#">';
      html += user_list[id].name;
      html += '</a></li>';

      $("#user-list").append(html);
    }
  });
}

$(document).ready(function() {
  $("#foo").on("click", check);
  $(document).on("click", ".wrong", showSuggestions);
  $("#editor").on("click", clearSelection );
  $("#add").on("click", addToLimbo);
  $(document).on('click', '.user-entry', changeUser);

  fetchLimbo();
  fetchUsers();
});
