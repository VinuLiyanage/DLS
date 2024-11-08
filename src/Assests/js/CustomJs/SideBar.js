import M from 'materialize-css';

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, {});
});


document.addEventListener('DOMContentLoaded', function(){
  var elems = document.querySelectorAll('.button-collapse');
  M.Sidenav.init(elems, {menuWidth: 275});

  var elems2 = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems2, {});
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(elems, {});
});

// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('select');
//   M.FormSelect.init(elems, {});
// });