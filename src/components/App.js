import React, { Component } from 'react';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import LogoutPage from './LogoutPage';
import SignupPage from './SignupPage';
import RankPage from './RankPage';
import NewScorePage from './NewScorePage';
class App extends Component {
  constructor(props) {
    super(props);
    let user = sessionStorage.getItem('user');
      if (user)
        user = JSON.parse(user);
    this.state = {
      user : user
    }
  }
  updateState() {
    this.setState({ 
      user: this.state.user, 
    });
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1),
      });
    });
  }
  renderRoute() {
    if (!this.state.user){
      if (this.state.route === '/signup') {
          return <SignupPage setUserInfo={user => { this.setState({ user }); }}  />;
      }
      if (this.state.route === '/login') {
        return <LoginPage setUserInfo={user => { this.setState({ user }); }} />;
      }
      if (this.state.route === '/newscore') {
        return <NewScorePage/>;
      }
    }
    else {
      if (this.state.route === '/logout') {
        return <LogoutPage setUserInfo={user => { this.setState({ user }); }} />;
      }
      if (this.state.route === '/rank') {
        return <RankPage user={this.state.user} />;
      }
    }
    return <HomePage />;
  }
  rendernavbaritems(){
    if (!this.state.user)
      return(
        <ul className="nav navbar-nav navbar-right">
          <li><a href='#/newscore'>newscore</a></li>
          <li><a href='#/login'>log in</a></li>
          <li><a href='#/signup'>sign up</a></li>
        </ul>
      )
    else 
      return(
        <ul className="nav navbar-nav navbar-right">
          <li><a href='#/user'>Hi~ {this.state.user.username}</a></li>
           <li><a href='#/rank'>rank</a></li>
          <li><a href='#/logout'>log out</a></li>
        </ul>
      )
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#/">3D snake</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              {this.rendernavbaritems()}
            </div>
          </div>
        </nav>
          {this.renderRoute()}
      </div>
    );
  }
}


export default App;
