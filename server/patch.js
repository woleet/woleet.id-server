const fs = require('fs')
const f = 'node_modules/pg/lib/connection-parameters.js'

fs.readFile(f, 'utf8', function(err, data) {
  if (err) {
    return console.log(err)
  }

  var result = data.replace('if (this.host) {', 'if (this.host) {\n      if (this.host === \'envvars\' ) return cb(null, "")')

  fs.writeFile(f, result, 'utf8', function(err) {
    if (err) return console.log(err)
  })
})
