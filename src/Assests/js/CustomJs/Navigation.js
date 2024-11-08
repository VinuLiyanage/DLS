import M from 'materialize-css';

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(elems, {    
      direction: 'left',
      hoverEnabled: false
    });
  });