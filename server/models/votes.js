

const requestPromise = require('request-promise');


const buildVotesQuery = function (chamber, offset) {
  const votesOptions = {
	  uri: `https://api.propublica.org/congress/v1/${chamber}/votes/recent.json?offset=${offset}`,
	  protocol: 'https:',
	  hostname: 'api.propublica.org',
	  port: 443,
	  method: 'GET',
	  headers: {
	    'X-API-Key': process.env.PROPUBLICA_KEY
	  },
	  transform(body, response, resolveWithFullResponse) {
	  	return JSON.parse(body);
	  }
  };

  return votesOptions;
};

const getVotes = function (req, res) {
  const houseRequest = requestPromise(this.buildVotesQuery('house', 0));
  const senateRequest = requestPromise(this.buildVotesQuery('senate', 0));
  Promise.all([houseRequest, senateRequest]).then((response) => {
    res.send(response);
  });
};

const controller = {
  buildVotesQuery,
  getVotes
};

module.exports = controller;
