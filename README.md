# Funny Money - U.S. Congress


Funny Money is an application to consume FEC disclosures, congressional voting records, and bills in the legislative process. 



### Tech

Funny Money uses a number of open source projects to work properly:
* [React-Redux] - HTML enhanced for web apps!
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework 

### Installation

Rename the .env.example file in the root directory to .env and add your ProPublica API key. If you don't have one, get one here: https://www.propublica.org/datastore/api/propublica-congress-api

```sh
$ PROPUBLICA_KEY=your_key_here
```

Install the dependencies and devDependencies and start the server.

```sh
$ cd fec-visualizer
$ npm install
$ npm run start
```

Site will run on localhost:3000 by default