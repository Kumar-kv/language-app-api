var dsConfig = require('../datasources.json');
var path = require('path');


module.exports = function(app) {
    app.get('/verified', function(req, res) {
        res.render('verified');
      });
}

