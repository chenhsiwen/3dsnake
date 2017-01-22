import React, { Component } from 'react';


class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = { user: '' }; 
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
              <div className="form">
              <h3 className="title"><a href="#/simple">Simple</a></h3>
              <h3 className="title"><a href="#/snake">Snake</a></h3>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GamePage;

