# Express and MongoDB
**Author**: Sarah Bixler
**Version**: 1.0.0 (increment the patch/fix version number up if you make more commits past your first submission)
## Overview
This is a storage app that uses mongoDB and express.js to save items, with 3 properties to a database.
## Getting Started
The client side is currently in developement-- 
1. once complete they woud need fork theis repo, npm i to download dependancies
2. start index.js using nodemon to run the server
3. start the database by typing npm run mongodb
4. then use httpie in the CLI to type api requests
http POST localhost:3000/api/v1/trees/ type= genus= height=
currently you can see the tests by doing steps 1-2 and typing npm run test in the CLI
## Architecture
This app uses the ES6 and the node.js framework, babel is the transpiler, express.js for routing, mondgoDB for our database... Jest is the testing suite.
## Change Log
5-1-2018 -- testing suite is passing POST, GET, GET ALL and DELETE routes