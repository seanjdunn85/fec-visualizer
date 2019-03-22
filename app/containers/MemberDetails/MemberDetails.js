import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './style.scss';

class MemberDetails extends React.Component {
    state = {
      open: true,
      scroll: 'paper'
    }

    handleClose = () => {
      this.props.hideModal();
    }

    render() {
      
        const { member } = this.props;
        if (!member) {
        return (<div></div>);
      }
      const fi = member.member_id.substring(0, 1);
      const imgSrc = `http://bioguide.congress.gov/bioguide/photo/${fi}/${member.member_id}.jpg`;
      const telSrc = `tel:+1-${member.roles[0].phone}`;

      return (
        <Dialog
          open={this.props.showMember}
          onClose={this.handleClose}
          scroll={this.state.scroll}
        >
          <DialogTitle id="scroll-dialog-title">{`${member.first_name} ${member.last_name}`} {`(${member.current_party} - ${member.roles[0].state})`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <img style={{float:"left", marginRight:'2em'}} src={imgSrc} alt={member.last_name}/>
              <Typography>{`In their most recent seat, this member voted with their party ${member.roles[0].votes_with_party_pct}% of the time.`}</Typography>
              <br/>
              <Typography>Twitter: <a href={`https://twitter.com/${member.twitter_account}`}>@{member.twitter_account}</a></Typography>
              <Typography>Website: <a target="_blank" href={member.url}>{member.url}</a></Typography>
              <Typography>Phone: <a href={telSrc}>{member.roles[0].phone}</a></Typography>
              {member.roles[0].committees.map((committee) => <Typography>{committee.name}</Typography>)}
              {/* <div><pre>{JSON.stringify(member, null, 2) }</pre></div> */}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      );
    }
}


export default MemberDetails;
