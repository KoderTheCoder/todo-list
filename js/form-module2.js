
//form module
var formmodule2 = (
  function () {
    var formobj = {};
    const formelm = document.getElementById('task-form');
    const inputelm = document.getElementById('task-quantity');

    formobj.getValue = function() {
      inputval = inputelm.value;
      formobj.val = inputval;
      return inputval;
    }
    return formobj;
  }()
);
