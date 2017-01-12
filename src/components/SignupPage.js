import React, { Component } from 'react';


class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {  account:'',password: '' , username: ''}; 
  }
  updatestate() {
    this.setState({ 
      account: this.state.account,
      password: this.state.password,
      username: this.state.username,
    });
  }
  handleUsername(event) {
    this.setState({ username: event.target.value });
  }
  handlePassword(event) {
    this.setState({ password: event.target.value });
  }
  handleAccount(event) {
    this.setState({ account: event.target.value });
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
    if (this.state.username !== '' && this.state.password!== '' && this.state.account!== '') {
      console.log('do');
      fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: this.state.account,
          password: this.state.password,
          username: this.state.username
        })
      }).then(response => {
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
            <h3 className="title">Welcome</h3>
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
              <div>
                <input 
                  className="datainput"
                  value={this.state.username}
                  placeholder = 'username'
                  type="text"
                  onChange={this.handleUsername.bind(this)}
                  onKeyDown={this.handleEnter.bind(this)}
                />
              </div>
              <div className="submitbtn" onClick={this.handleSubmit.bind(this)}>Sign Up</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;
