import React, { Component } from 'react';
import Stock from './Stock';
import './StockList.css';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AutoComplete from 'material-ui/AutoComplete';

import * as firebase from 'firebase';

class StockList extends Component {

  constructor(){
    super();
    this.state = {
      stocks: [],
      dataSource: [],
    }
    this.handleOnNewRequest = this.handleOnNewRequest.bind(this);
  }

  handleOnNewRequest(e) {
    console.log(e.id);
    // e.id以外のviewableをfalseにする
    let newStocks = [];
    this.state.stocks.map((stock,index) => {
      let s = stock;
      if (e.id === index) {
        s.viewable = true;
      } else {
        s.viewable = false;
      }
      newStocks.push(s);
    });
    this.setState({
      stocks: newStocks
    });
  }

  handleOnUpdateInput(e) {
    if (e != '') { return; }
    
    let newStocks = [];
    this.state.stocks.map((stock,index) => {
      let s = stock;
      s.viewable = true;
      newStocks.push(s);
    });
    this.setState({
      stocks: newStocks
    });
  }

  componentDidMount() {
    const stocksRef = firebase.database().ref('/stocks');
    let list = [];
    stocksRef.on('value', snap => {
      list = snap.val();
      const stocks = Object.keys(list).map((key)=> {
        return Object.assign(list[key], {key}, {viewable: true});
      });
      const dataSource = stocks.map((stock,index) => {
        return { 'id': index, 'name': stock.name };
      });
      console.log(stocks);
      this.setState({
        stocks: stocks,
        dataSource: dataSource
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
          viewable={stock.viewable}
        />
        <Divider />
      </div>
    );

    return (
      <div className="view">
        <AutoComplete dataSource={this.state.dataSource} filter={AutoComplete.fuzzyFilter} 
          onNewRequest={this.handleOnNewRequest}
          dataSourceConfig={{text: 'name', value: 'id'}}
          onClose={ _ => console.log()}
          onUpdateInput={this.handleOnUpdateInput.bind(this)}
        />
        <List className="StockList">
          {stockList}
        </List>
      </div>
    );
  }
}

export default StockList;
