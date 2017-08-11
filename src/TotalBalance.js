import React, { Component } from 'react';
import * as firebase from 'firebase';

class TotalBlance extends Component {
  
  constructor() {
    super();
    this.state = {
      balance: 0,
    }
  }
  
  componentDidMount() {
    this.calsTotalBalance();
  }

  calsTotalBalance() {
    const stocksRef = firebase.database().ref('/stocks');
    let list = [];
    stocksRef.on('value', snap => {
      list = snap.val();
      const stocks = Object.keys(list).map((key)=> {
        return Object.assign(list[key], {key});
      });
      const sum = stocks.map(stock => stock.currentPrice * stock.numberOfSharesHeld).reduce((a,b) => {return a + b},0)
      this.setState({
        balance: sum,
      });
    });
  }
  
  render(){
    return (
      <div className="TotalBlance">Total Balance: { String(this.state.balance).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</div>
    );
  }
}

export default TotalBlance;