
// DOESN'T WORK
/*
requirejs.config({
    paths: {
      IPFS: "node_modules/ipfs/src/index.js"
    }
  });
*/


define([
    'require',
    //'ipfs',
    'jquery',
    'base/js/namespace',
], function (
    requirejs,
    //IPFS,
    $,
    Jupyter
) {
    "use strict";

    //const IPFS = requirejs('ipfs')

    const ipfs = new IPFS({
      EXPERIMENTAL: {
        pubsub: true
      }
    });


    // store function from WDL explorer
    function store () {

      var selected_cell = Jupyter.notebook.get_selected_cell();


      /*
      var obj = {};

      obj["id"] = id;
      obj["data"] = toStore;
      console.log(obj.id)
      console.log(obj.data)
      console.log(JSON.stringify(obj))
      */

      // add object to ipfs
      //ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, res) => {
      ipfs.files.add(Buffer.from(selected_cell.get_text()), (err, res) => {
        if (err || !res) {
          return console.error('ipfs add error', err, res)
        }

        res.forEach((file) => {
          if (file && file.hash) {
            console.log('successfully stored', file.hash)
            display(file.hash)
          }
        });
      });
    }

    // display function from WDL simple-explorer
    function display (hash) {
      ipfs.object.get(hash, (err, data) => {
        if (err) { return console.error('ipfs cat error', err) }

        dialog.modal({
          title: 'Added Code Cell to IPFS',
          body: hash
        });

      })
    }


    var initialize = function () {

      Jupyter.toolbar.add_buttons_group([{
        'label': 'Add',
        'icon': 'fa-arrow-circle-up',
        'callback': store,
        'id': 'add-cell-to-snippet-manager',
        'class': 'ipfs-add'
      }]);

    };

    // The specially-named function load_ipython_extension will be called
    // by the notebook when the nbextension is to be loaded.
    // It mustn't take too long to execute however, or the notebook will
    // assume an error has occurred.
    var load_ipython_extension = function () {
        // Once the config has been loaded, do everything else.
        // The loaded object is a javascript Promise object, so the then
        // call return immediately. See
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
        // for details.
        return Jupyter.notebook.config.loaded.then(initialize);
    };

    // return object to export public methods
    return {
        load_ipython_extension : load_ipython_extension
    };
});
