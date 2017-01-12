import React, { Component } from 'react';


class HomePage extends Component {
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
              <h3 className="title">HomePage</h3>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
