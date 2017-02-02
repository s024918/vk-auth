var express = require('express')
var app = express()

app.use(express.static('www'))

app.all('/*', function(req, res, next) {
  res.sendFile('www/index.html', { root: __dirname });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})