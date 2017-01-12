import React, { Component } from 'react';


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '' ,password: '' }; 
  }
  updatestate() {
    this.setState({ 
      account: this.state.username,
      password: this.state.password,
    });
  }
  handleAccount(event) {
    this.setState({ account: event.target.value });
  }
  handlePassword(event) {
    this.setState({ password: event.target.value });
  }
  
  handleEnter(event) {
    if (event.keyCode == 13 ){
      this.submit();
    }
  }
  handleSubmit(event) {
    this.submit();
  }
  submit(){
    if (this.state.account !== '' && this.state.password!== '') {
      fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: this.state.account,
          password: this.state.password
        })
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json !== "error"){
            sessionStorage.setItem('user', JSON.stringify(json));
            this.props.setUserInfo(json);
          }
        else{
          alert(json);
        }
      });
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
              <div className="form">
              <h3 className="title">Hello</h3>
                <div>
                  <input 
                    className="datainput"
                    value={this.state.account}
                    placeholder = 'account'
                    type="text"
                    onChange={this.handleAccount.bind(this)}
                    onKeyDown={this.handleEnter.bind(this)}
                  />
                </div>
                <div>
                  <input 
                    className="datainput"
                    type="password"
                    placeholder = 'password'
                    value={this.state.password}
                    onChange={this.handlePassword.bind(this)}
                    onKeyDown={this.handleEnter.bind(this)}
                  />
                </div>
                <div className="submitbtn" onClick={this.handleSubmit.bind(this)}>Log In</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
