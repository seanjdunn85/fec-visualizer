

const requestPromise = require('request-promise');


const getBills = function (req, res) {
  const congress = req.query.congress || '116';

  if (

    typeof req.query.congress !== 'undefined'

  ) {
    return res.send(req.query);
  } if (

    typeof req.query.congress_person !== 'undefined'

  ) {
    const request = getCongressPersonVotes(req.query.congress_person);

    Promise.all([request]).then((json) => res.send(json));
  } else {
    const billsOptions = {
		  uri: `https://api.propublica.org/congress/v1/${congress}/both/bills/introduced.json`,
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

    const billsRequest = requestPromise(billsOptions);

    Promise.all([billsRequest]).then((response) => res.send(
      response[0].results[0]
    ));
  }
};

const isValidBillFormat = (bill) => true;

const controller = {
  getBills,
  isValidBillFormat
};

module.exports = controller;
