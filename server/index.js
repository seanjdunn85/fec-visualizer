/* eslint consistent-return:0 */

const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const { resolve } = require('path');
const logger = require('./util//logger');
const argv = require('./util/argv');
const port = require('./util//port');
const setup = require('./middlewares/frontendMiddleware');

const congress_member = require('./models/congress-member.js');
const bills = require('./models/bills.js');
const votes = require('./models/votes.js');
const pacs = require('./models/pacs.js');

const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.get('/api/congress', congress_member.getCongress);

app.get('/api/member/:memberId', congress_member.getCongressMember);

app.get('/api/contributions', congress_member.getCongressMemberFinances);

app.get('/api/candidates', congress_member.getSomeCandidates);

app.get('/api/votes', votes.getVotes);

app.get('/api/bills', bills.getBills);

app.get('/api/pacs', pacs.getPacs);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';


// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
});
