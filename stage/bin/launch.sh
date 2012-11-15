#!/bin/sh




forever app.js > output.log &
# nodemon --watch ../views --watch ../routes --watch ../public --watch ../admin.js --watch ../public/stylesheets/ --watch ../login.js --watch ../app.js ../app.js
