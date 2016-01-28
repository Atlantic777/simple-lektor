var sorted = [];
var dict = [];

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
    var word = this;
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
  $.post("http://localhost:5000/check", { wordlist: JSON.stringify(sorted) })
    .done(markBadWords);
}

function showSuggestions() {
  console.log(this.innerHTML);
}

$(document).ready(function() {
  $("#foo").on("click", check);
  $(document).on("click", ".wrong", showSuggestions);
});
