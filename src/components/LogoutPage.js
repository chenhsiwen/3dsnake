import React, { Component } from 'react';


class LogoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = { logout: '' }; 
  }
  updatestate() {
    this.setState({ 
      logout: this.state.logout,
    });
  }
  handleSubmit(event) {
     this.submit();
  }
  submit(){
    fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logout: true
      })
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json !== "error"){
        sessionStorage.removeItem('user');
        this.props.setUserInfo(null);
      }
      else{
        alert(json);
      }
    });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
            <div className="form">
              <div className="submitbtn" onClick={this.handleSubmit.bind(this)}>Log Out</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LogoutPage;
