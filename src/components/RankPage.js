import React, { Component } from 'react';




class RankItem extends Component {
 render() {
    const {rank, username, score,type } = this.props;
    return (
      <div className= "rankitem col-md-12">
        <div className="col-md-3">
        </div>
        <div className={"col-md-6 "+type}>
          <div className="col-md-2 ">
            <span>{rank}</span>
          </div>
          <div className="col-md-6 ">
            <span>{username}</span>
          </div>
          <div className="col-md-4 ">
            <span>{score}</span>
          </div>
        </div>
        <div className="col-md-3">
        </div>
      </div>
    );
  }
}

class ScorePage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      publicScore:[
        {username:"WayneChen",score:"58855"},
        {username:"Kevin",score:"55668"},
        {username:"Chris",score:"5568"}], 
      privateScore:[
        {username:"David",score:"6968"},
        {username:"David",score:"6152"},
        {username:"David",score:"1152"}],
      table : 'public',
      publictable : ' clicked',
      privatetable : ''
     } 
  }
  componentWillMount(){
    fetch ('/api/ranks/'+this.props.user.uid)
      .then(response => {
        console.log('do');
        return response.json();
      })
      .then(json => {
        this.setState({ 
          publicScore : json.publicScore,
          privateScore : json.privateScore
        }); 
    });
    
  }
  renderRankItem(item, i) {
    return (
      <RankItem
        rank={i+1}
        username= {item.username}
        score = {item.score}
        type = "rankdata"
      />
    )
  }
  handleClick(table){
    if(table === 'public'){
      this.setState({ 
        table: table,
        publictable : ' clicked',
        privatetable : '' 
      });
    }
    else if(table === 'private'){
      this.setState({ 
        table: table,
        publictable : '',
        privatetable : ' clicked' 
      });
    }
  }
  renderTableBtn() {
    return (
      <div className="col-md-12">
        <div className="col-md-3">
        </div>
        <div className={"col-md-3 tablebtn" +this.state.publictable } onClick={this.handleClick.bind(this,"public")}>
          <span>Public Rank</span>
        </div>
        <div className={"col-md-3 tablebtn" +this.state.privatetable} onClick={this.handleClick.bind(this,"private")}>
          <span>Private Rank</span>
        </div>
        <div className="col-md-3" >
        </div>
      </div>
    )
  }
  renderTable() {
    if (this.state.table === 'public')
      return (
        <div>
          {Object.values(this.state.publicScore).map(this.renderRankItem, this)}
        </div>
    );
    else if(this.state.table === 'private')
      return (
        <div>
          {Object.values(this.state.privateScore).map(this.renderRankItem, this)}
        </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="user page">
            <div className="scoreform">
              {this.renderTableBtn()}
              <RankItem rank="Rank" username= "Username" score = "Score" type = "rankbar"/>
              {this.renderTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScorePage;
