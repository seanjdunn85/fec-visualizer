/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import DrawerLeft from 'components/DrawerLeft';
import FECGraph from 'containers/FecGraph';
import MemberDetails from 'containers/MemberDetails';
import './style.scss';

const App = () => (
  <div className="pp-wrapper">
    <CssBaseline />
    <MemberDetails />
    <Helmet
      titleTemplate="%s - React.js Boilerplate"
      defaultTitle="Congress"
    >
      <meta name="description" content="A React.js Boilerplate application" />
    </Helmet>
    <DrawerLeft />
    <main>
      <Switch>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/" component={FECGraph} />
        <Route path="/features" component={FeaturePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
    </main>

  </div>
);

export default App;
