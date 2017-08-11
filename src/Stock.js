import React, { Component } from 'react';
import './Stock.css';
import {ListItem} from 'material-ui/List';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import StockIndicator from './StockIndicator';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import * as firebase from 'firebase';

class Stock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemOpen: false,
      data: [],
      code: props.code,
      name: props.name,
      avgBuyPrice: props.avgBuyPrice,
      numberOfSharesHeld: props.numberOfSharesHeld,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOpen = () => {
    this.setState({itemOpen: true});
  };

  handleClose = () => {
    this.setState({itemOpen: false});
  };

  handleDelete = () => {
    this.setState({itemOpen: false});
    var stocksRef = firebase.database().ref('stocks');
    var query = stocksRef.orderByChild('code').equalTo(this.props.code);
    query.on('child_added', (snap) => {
        snap.ref.remove();
    })
  };

  handleUpdate = () => {
    this.setState({itemOpen: false});
    var stocksRef = firebase.database().ref('stocks');
    let updates = {};
    var query = stocksRef.orderByChild('code').equalTo(this.props.code);
    query.once('value').then(snap => {
      const list = snap.val();
      const stocks = Object.keys(list).map(key=> Object.assign(list[key], {key}));
      stocks.map(stock => {
        updates['/stocks/' + stock.key] = {
          avgBuyPrice: this.state.avgBuyPrice,
          code: stock.code,
          currentPrice: stock.currentPrice,
          name: this.state.name,
          numberOfSharesHeld: this.state.numberOfSharesHeld,
          previousPrice: stock.previousPrice,
        };
      });
      firebase.database().ref().update(updates);
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Delete"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleDelete}
        />,
        <FlatButton
          label="Update"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleUpdate}
        />
      ];

    const currentPrice = this.props.currentPrice;
    const previousPrice = this.props.previousPrice;
    const profitAndLoss = (currentPrice - this.props.avgBuyPrice) * this.props.numberOfSharesHeld;
    return (
      <div className="ListItem">
        <ListItem
          key={'stockitem-' + this.props.index}
          className="Stock"
          primaryText={this.props.name}
          secondaryText={this.props.code + "\n 損益: " + String(profitAndLoss).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
          secondaryTextLines={2}
          leftIcon={<div className="rightIcon">A</div>}
          rightAvatar={
            <div className="rightAvator">
              <StockIndicator
                currentPrice={currentPrice}
                previousPrice={previousPrice}
                avgBuyPrice={this.props.avgBuyPrice}
                numberOfSharesHeld={this.props.numberOfSharesHeld}
              />
            </div>
          }
          onTouchTap={this.handleOpen}
        >
        </ListItem>
        <Dialog
          title="Detail"
          actions={actions}
          modal={false}
          open={this.state.itemOpen}
          onRequestClose={this.handleClose}
        >
            <TextField name="code" floatingLabelText="株コード" value={this.state.code} onChange={this.handleInputChange} />
            <TextField name="name" floatingLabelText="名称" value={this.state.name} onChange={this.handleInputChange} />
            <TextField name="avgBuyPrice" floatingLabelText="購入金額" value={this.state.avgBuyPrice} onChange={this.handleInputChange} />
            <TextField name="numberOfSharesHeld" floatingLabelText="購入株数" value={this.state.numberOfSharesHeld} onChange={this.handleInputChange}/>
        </Dialog>
      </div>
    );
  }
}

export default Stock;
