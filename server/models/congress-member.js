const NodeCache = require('node-cache');

const nodeCacheService = new NodeCache();
const requestPromise = require('request-promise');

const cacheOrCall = require('./cache-or-call');

/* Get Neo4j dependencies */
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost:11001', neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

const neo4jsession = driver.session();


const getMember = null;

const defaultOptions = {
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

const getCongressPersonVotes = (memberId, offset) => {
  const congressPersonVotesOptions = {
    uri: `https://api.propublica.org/congress/v1/members/${memberId}/votes.json`,
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

  const congressPersonVotesRequest = requestPromise(congressPersonVotesOptions);

  return congressPersonVotesRequest;
};

const getCongressMember = (req, res) => {
  const { memberId } = req.params;
  const reqOptions = {
    uri: `https://api.propublica.org/congress/v1/members/${memberId}.json`,
    ...defaultOptions
  };

  cacheOrCall(reqOptions).then((payload) => {
    return res.send({ ...payload.results[0] });
  });
};

const getCongressMemberFinances = (req, res) => {
  const fecId = req.query.member_id;

  const resultPromise = neo4jsession.run(
    'MATCH p=((cand:Candidate{CAND_ID:$candidate_id})<-[cc:CANDIDATE_CONTRIBUTION]-(cmte:Committee)) RETURN p',
    { candidate_id: fecId }
  );

  resultPromise.then((result) => {
    neo4jsession.close();
    console.log(result);
    res.send(result);
    driver.close();
  }).catch((err) => {
    console.log(err);
  });
};

const getSomeCandidates = (req, res) => {
  const q = 'MATCH (n:Candidate) RETURN n LIMIT 25';
  console.log('running neo4j query', q);
  neo4jsession.run(q).then((result) => {
    console.log(result);
    res.send(result);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
};

/**
 * Get the members, unfiltered, of a given chamber and congressNumber
 * @param {string} chamber 'house' or 'senate'
 * @param {int} congressNumber e.g. 116 for the 116th congress
 * @returns {Promise} A promise that resolves with the JSON body of the request
 */
const getMembersByChamberAndCongressNumber = (chamber, congressNumber) => {
  if (['house', 'senate'].indexOf(chamber) === -1) {
    throw new Error('invalid chamber');
  }
  const requestOptions = {
    uri: `https://api.propublica.org/congress/v1/${congressNumber}/${chamber}/members.json`,
    ...defaultOptions
  };

  return cacheOrCall(requestOptions);
};

/**
 * Handle GET request to /api/congress
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {void} Handles request with parameters
 */
const getCongress = function getCongress(req, res) {
  const { congressNumber } = req.query;

  const senateRequest = getMembersByChamberAndCongressNumber('senate', congressNumber);

  const houseRequest = getMembersByChamberAndCongressNumber('house', congressNumber);

  Promise.all([senateRequest, houseRequest]).then((result) => {
    const congressMembers = result[0].results[0].members.concat(result[1].results[0].members);
    res.send(congressMembers);
  }).catch((err) => {
    res.status(500);
    res.send(err);
  });
};


const controller = {
  getCongress,
  getCongressPersonVotes,
  getCongressMemberFinances,
  getMember,
  isValidCongressNumber: (congress) => true,
  isValidCongressMemberId: (memberId) => true,
  getSomeCandidates,
  getCongressMember
};

module.exports = controller;
