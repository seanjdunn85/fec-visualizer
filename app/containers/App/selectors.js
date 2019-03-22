/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentUser')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectFEC = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('FEC')
);

const makeSelectGraph = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('graph')
);
const makeSelectParameter = (parameter) => createSelector(
  selectGlobal,
  (globalState) => globalState.get(parameter)
);
const makeSelectMember = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('member')
);
export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectFEC,
  makeSelectGraph,
  makeSelectParameter,
  makeSelectMember
};
