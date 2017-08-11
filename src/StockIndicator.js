import React, { Component } from 'react';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import './StockIndicator.css'

class StockIndicator extends Component {
  render() {
    if ((this.props.currentPrice - this.props.previousPrice) > 0) {
        return (
        <div className="StockIndicator">
            <TrendingUp color={red500} />
            <div>{this.props.currentPrice}(+{this.props.currentPrice - this.props.previousPrice})</div>
        </div>
        );        
    } else {
        return (
        <div className="StockIndicator">
            <TrendingDown color={greenA200} />
            <div>{this.props.currentPrice}({this.props.currentPrice - this.props.previousPrice})</div>
        </div>
        );
    }
  }
}

export default StockIndicator;
