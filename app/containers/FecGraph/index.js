import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Graph from 'react-graph-vis';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import CircularProgress from '@material-ui/core/CircularProgress';
import { initApplication, fetchCongress, selectCongressMember} from '../App/actions';
import { makeSelectFEC, makeSelectGraph, makeSelectParameter } from '../App/selectors';
const fecGraphOptions = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: '#000000'
  },
  height: '800px',
  overlap: false,
  configure: {
    enabled: false,
    showButton: false
  },
  improvedLayout: true,
  // physics: {
  //   enabled: true,
  //   barnesHut: {
  //     gravitationableConstant: -1000,
  //     centralGravity: 0,
  //     damping: 1,
  //     avoidOverlap: 1,
  //     springLength: 150
  //   }
  // }
};

const spinnerStyle = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});
 
console.log('spinnerStyle', typeof spinnerSyle);


class FECGraph extends Component {
  events = {
    doubleClick(event) {
      console.log(event);
      this.props.getMember(event);
    },
    select(event) {
        console.log(event);
    }
  };
  
  constructor() {
    super();
  }
  // eslint-disable-next-line class-methods-use-this
  
  onComponentDidMount() {
    console.log('component did mount');
  }
  // eslint-disable-next-line lines-between-class-members
  render() {
    console.log('rendering', this.props);
    const { FEC, graph, currentCongress, congress } = this.props;
    console.log('rendering', FEC, graph, currentCongress);
    let graphNodes = {
      nodes:congress,
      edges:[]
    }
    console.log('graph', graph);
    // return (<div>{JSON.stringify(FEC)}</div>);
    // let graphObj = {
    //   nodes:graph.get('nodes'),
    //   edges:graph.get('edges'),
    // };
    // if (graphObj.nodes.length !== undefined && graphObj.nodes.length !== 0) {
    if (currentCongress) {
      // console.log('rendering graph', graphObj)
      return (

        <Graph graph={graphNodes} options={fecGraphOptions} events={{doubleClick:(event)=>this.props.getMember(event.nodes[0])}}>

        </Graph>
      );
    } 
    console.error('not rendering')
    return (
      <CircularProgress styles={spinnerStyle.progress} color="secondary" />
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  getMember: (memberId) => dispatch(selectCongressMember(memberId)),
});


/* bind the fec graph state to properties */
const mapStateToProps = createStructuredSelector({
  FEC: makeSelectParameter('congress'),
  congress: makeSelectParameter('congress'),
  graph: makeSelectGraph(),
  currentCongress: makeSelectParameter('congress')
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FECGraph);
