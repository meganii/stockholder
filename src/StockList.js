import React, { Component } from 'react';
import Stock from './Stock';
import './StockList.css';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

import * as firebase from 'firebase';

class StockList extends Component {

  constructor(){
    super();
    this.state = {
      stocks: [],
    }
  }

  componentDidMount() {
    const stocksRef = firebase.database().ref('/stocks');
    let list = [];
    stocksRef.on('value', snap => {
      list = snap.val();
      const stocks = Object.keys(list).map((key)=> {
        return Object.assign(list[key], {key});
      });
      console.log(stocks);
      this.setState({
        stocks: stocks
      })
    });
  }

  render() {
    const stockList = this.state.stocks.map((stock,index) =>
      <div className="StockItem" key={'StockItem-' + index}>
        <Stock 
          index={'item-' + index} 
          stockKey={stock.key}
          name={stock.name}
          code={stock.code}
          avgBuyPrice={stock.avgBuyPrice}
          numberOfSharesHeld={stock.numberOfSharesHeld}
          currentPrice={stock.currentPrice}
          previousPrice={stock.previousPrice}
        />
        <Divider />
      </div>
    );

    return (
      <div className="view">
        <List className="StockList">
          {stockList}
        </List>
      </div>
    );
  }
}

export default StockList;
