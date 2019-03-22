const NodeCache = require('node-cache');

const nodeCacheService = new NodeCache();
const requestPromise = require('request-promise');

/* Get Neo4j dependencies */
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost:11001', neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

const neo4jsession = driver.session();


const getPacs = (req, res) => {
  console.log('get pacs')
  // const {cmte_id, page, sort} = req.query;
  const cmte_id = 'C00142711';
  let cypher = `MATCH 
  path=(
      cmte:Committee{CMTE_ID:$CMTE_ID})-
      [cc:CANDIDATE_CONTRIBUTION]->
      (cand:Candidate) 
  RETURN 
    path
    LIMIT 100;`;
  const resultPromise = neo4jsession.run(cypher,
    { CMTE_ID: cmte_id }
  );

  resultPromise.then((result) => {
    console.log(result);
    neo4jsession.close();
	  res.send(result);
	  driver.close();
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500);
    res.send({ error });

    switch (error) {
      case 'Neo.ClientError.Security.Unauthorized':
        res.status(500);
        res.status({ error: 'Our bad' });
        break;
      default:
        break;
    }
  });
};
const pacs = {
  getPacs,
};

module.exports = pacs;
