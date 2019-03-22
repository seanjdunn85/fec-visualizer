import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MemberDetails from './MemberDetails';
import {  hideModal } from '../App/actions';
import {  makeSelectParameter } from '../App/selectors';

const mapDispatchToProps = (dispatch) => ({
  hideModal: (memberId) => dispatch(hideModal(memberId)),
});


/* bind the fec graph state to properties */
const mapStateToProps = createStructuredSelector({
  member: makeSelectParameter('member'),
  showMember: makeSelectParameter('showMember')
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MemberDetails);
