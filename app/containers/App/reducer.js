/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  RECEIVE_CONGRESS,
  GET_PAC_ERROR,
  GET_PAC_SUCCESS,
  FETCH_MEMBER_START,
  FETCH_MEMBER_SUCCESS,
  FETCH_MEMBER_ERROR,
  MODAL_HIDE
} from './constants';
import { red } from '@material-ui/core/colors';



const formatCongressMemberForGraph = (member, index) => {
  const fi = member.id.substring(0, 1);
  member.image = `http://bioguide.congress.gov/bioguide/photo/${fi}/${member.id}.jpg`;
  member.shape = 'circularImage';
  member.shape = 'circle';
  member.label = `${member.first_name} ${member.last_name}`;
  member.size = 30;
  member.color = (member.party === 'R' ? 'red' : 'blue');
  return member;
};

function reduceNodes(accumulator, record) {
  const end = record._fields[0].end.properties;
  const start = record._fields[0].start.properties;
  end.id = (end.CMTE_ID) ? end.CMTE_ID : end.CAND_ID;
  end.label = end.CMTE_NM ? end.CMTE_NM : end.CAND_NAME;

  start.id = (start.CMTE_ID) ? start.CMTE_ID : start.CAND_ID;
  start.label = start.CMTE_NM ? start.CMTE_NM : start.CAND_NAME;
  start.group = 'start';
  end.groups = 'end';
  accumulator.push(start);
  accumulator.push(end);
  start.shape = 'dot';
  end.shape = 'dot';
  return accumulator;
}

function reduceEdges(accumulator, record) {
  // eslint-disable-next-line no-underscore-dangle
  record._fields[0].segments.forEach((segment) => {
    const from = segment.start.properties.CMTE_ID;
    const to = segment.end.properties.CAND_ID;
    accumulator.push({
      ...segment.relationship.properties,
      from,
      to,
      label:segment.relationship.properties.TRANSACTION_AMT
    });
  });
  return accumulator;
}
function getUniqueFilter() {
  const uniqueIds = [];
  /* check for duplicate entries */
  return function newFilterFunction(element) {
    if (uniqueIds.indexOf(element.id) !== -1) {
      return false;
    }
    uniqueIds.push(element.id);
    return true;
  };
}

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  currentCongress: false,
  congresses: {},
  candidates: {},
  congress: false,
  FEC: false,
  PACs: false,
  graph: {
    nodes: [],
    edges: []
  },
  showMember:false,
  fetchingMember:false,
});


function appReducer(state = initialState, action) {
  console.log('action received', action);
  switch (action.type) {
    case RECEIVE_CONGRESS:
      console.log('received congress', RECEIVE_CONGRESS);
      return state
        .set('congress', action.congress.congressMembers.map(formatCongressMemberForGraph))
        .setIn(['congresses', action.congress.congressNumber], action.congress.congressMembers)
        .set('currentCongress', action.congress.congressNumber);
    case GET_PAC_ERROR:
      return state.set('ajaxError', true);
    case GET_PAC_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let nodes = action.payload.records.reduce(reduceNodes, []);
      nodes = nodes.filter(getUniqueFilter());
      let edges = action.payload.records.reduce(reduceEdges, []);
      console.log(nodes);
      return state
        .set('PACs', action.payload)
        .setIn(['graph', 'nodes'], nodes)
        .setIn(['graph', 'edges'], edges);
    case FETCH_MEMBER_START:
      return state.set('fetchingMember', true);
    case FETCH_MEMBER_ERROR:
      return state.set('fetchingMember', false);
    case FETCH_MEMBER_SUCCESS:
      return state.set('fetchingMember', false).set('member', action.payload)
        .set('showMember', true);
    case MODAL_HIDE:
      return state.set('showMember', false);
    default:
      return state;
  }
}

export default appReducer;
