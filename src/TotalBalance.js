import React, { Component } from 'react';
import * as firebase from 'firebase';
import './TotalBalance.css';

class TotalBlance extends Component {
  
  constructor() {
    super();
    this.state = {
      total: 0,
      balance: 0,
      percentage: 0,
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
      const current_sum = stocks.map(stock => stock.currentPrice * stock.numberOfSharesHeld).reduce((a,b) => {return a + b},0)
      const purchace_sum = stocks.map(stock => stock.avgBuyPrice * stock.numberOfSharesHeld).reduce((a,b) => {return a + b},0)

      this.setState({
        total: current_sum,
        balance: current_sum - purchace_sum,
        percentage: Number( (((current_sum - purchace_sum)/purchace_sum) * 100).toFixed(2)),
      });
    });
  }
  
  render(){

    const balanceComponent = (total, balance) => {
      const balanceStr = String(balance).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      const sign = balance < 0 ? '-' : '+';
      const signName = balance < 0 ? 'minus' : 'plus';
      return <span className={signName}>{sign}{balanceStr}({sign}{this.state.percentage}%)</span>;
    }

    return (
      <div className="TotalBlance">
        <div>Total: {String(this.state.total).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</div>
        <div>Balance: {balanceComponent(this.state.total, this.state.balance)}</div>
      </div>
    );
  }
}

export default TotalBlance;