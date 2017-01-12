import 'isomorphic-fetch';
import React, { Component } from 'react';
class NewScorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      score: '',
      username: ''
    };
  }
  updateState() {
      this.setState({
        uid: this.state.uid, 
        score: this.state.score,
        username: this.state.username
      }
    )
  }
  handleSubmit() {
    fetch('/api/ranks/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: this.state.uid, 
        score: this.state.score,
        username: this.state.username
      })
    });
  }
  handleUid(event) {
    this.setState({ uid: event.target.value });
  }
  handleScore(event) {
    this.setState({ score: event.target.value });
  }
  handleUsername(event) {
    this.setState({ username: event.target.value });
  }


  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
            <div className="form">
            <h3 className="title">Welcome</h3>
              <div>
                <input 
                  className="datainput"
                  value={this.state.uid}
                  placeholder = 'uid'
                  type="text"
                  onChange={this.handleUid.bind(this)}
                />
              </div>
              <div>
                <input 
                  className="datainput"
                  type="text"
                  placeholder ='score'
                  value={this.state.score}
                  onChange={this.handleScore.bind(this)}
                />
              </div>
              <div>
                <input 
                  className="datainput"
                  value={this.state.username}
                  placeholder = 'username'
                  type="text"
                  onChange={this.handleUsername.bind(this)}
                />
              </div>
              <div className="submitbtn" onClick={this.handleSubmit.bind(this)}>New</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default NewScorePage;