/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */
import fetch from 'cross-fetch';
import {
  REQUEST_CONGRESS,
  RECEIVE_CONGRESS,
  FETCH_CONGRESS_ERROR,
  GET_PAC_ERROR,
  GET_PAC_SUCCESS,
  INIT_APPLICATION,
  FETCH_MEMBER_ERROR,
  FETCH_MEMBER_START,
  FETCH_MEMBER_SUCCESS,
  MODAL_HIDE
} from './constants';


/**
 * Initialize the application's api calls
 */
export function initApplication() {
  return (dispatch) => {
    // dispatch(getPac(116));
    dispatch(fetchCongress(116));
  };
}

/**
 *
 * @param {int} congress The congress number being requested
 * @return {object} An action object of type REQUEST_CONGRESS
 */
function requestCongress(congress) {
  return {
    type: REQUEST_CONGRESS,
    congress
  };
}


export function getPac(PAC) {
  // eslint-disable-next-line func-names
  return function (dispatch) {
    const url = new URL('/api/pacs', window.location);
    return fetch(url).then((response) => response.json(),
      (error) => {
        console.error(error);
      }
    ).then((payload) => {
      console.error(payload);
      dispatch(getPACSuccess(payload, url, PAC));
    });
  };
}

function getPACError(payload) {
  return { type: GET_PAC_ERROR, payload };
}

function getPACSuccess(payload, query, PAC) {
  return {
    type: GET_PAC_SUCCESS, payload, query, PAC
  };
}


/**
 * Dispatched when a request for a particular congress has completed succesfully
 * @param {array} congress an array of congress members
 * @return {object} An action object of type RECEIVE_CONGRESS
 */
function receiveCongress(congress) {
  console.log('congress', congress);
  return {
    type: RECEIVE_CONGRESS,
    congress
  };
}
export function fetchMemberStart(memberId) {
  return {
    type: FETCH_MEMBER_START,
    payload: {
      memberId
    }
  };
}

export function fetchMemberError(memberId) {
  return {
    type: FETCH_MEMBER_ERROR,
    payload: {
      memberId
    }
  };
}

/**
 *
 * @param {object} payload
 * @returns {object} action object
 */
export function fetchMemberSuccess(payload) {
  return {
    type: FETCH_MEMBER_SUCCESS,
    payload
  };
}

/**
 *
 * @param {string} member The congress member id we are requesting more info about.
 */
export function selectCongressMember(memberId) {
  console.log('selecting congress member: ', memberId);
  return (dispatch) => {
    dispatch(fetchMemberStart(memberId));
    fetch(`/api/member/${memberId}`).then((response) => response.json()).then((payload) => {
      dispatch(fetchMemberSuccess(payload));
    }).catch((err) => {
      dispatch(fetchMemberError(err));
    });
  };
}

/**
 *
 * @param {int} congress The congress number
 */
export function fetchCongressError(congress) {
  return {
    type: FETCH_CONGRESS_ERROR,
    payload: {
      congress
    }
  };
}

/**
 *
 * @param {int} congressNumber The number of the relevant congress.
 *
 */
export function fetchCongress(congressNumber) {
  // the dispatch method is passed into to the function we create, so we can dispatch states from the API call

  return (dispatch) => {
    // requestPosts is dispatching a state to let the user know we started the request.

    dispatch(requestCongress(congressNumber));
    const url = new URL('/api/congress', window.location);
    const params = { congressNumber };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    return fetch(url)

      .then(

        (response) => response.json(),


        (error) => console.error('an error occured ', error)


      )

      .then(
        (json) => {
          const memberIds = [];
          /* check for duplicate entries */
          const members = json.filter((member) => {
            if (memberIds.indexOf(member.id) !== -1) {
              return false;
            }
            memberIds.push(member.id);
            return true;
          });

          dispatch(receiveCongress({ congressMembers: members, congressNumber }));
        });
  };
}


export function hideModal() {
  return {
    type: MODAL_HIDE,
  };
}
