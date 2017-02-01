import React, { Component } from 'react';
class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = { user: '' }; 
  }
  handleSingle(event) {
     document.location.href = "#/singleplayer";
  }
  handleDouble(event) {
     document.location.href = "#/doubleplayer";
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
              <div className="form">
                <div className="gamebtn" onClick={this.handleSingle.bind(this)}>Single Player</div>
                <div className="gamebtn" onClick={this.handleDouble.bind(this)}>Double Player</div>
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

