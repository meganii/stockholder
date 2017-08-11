import React, { Component } from 'react';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import './StockIndicator.css'

class StockIndicator extends Component {
  render() {
    const currentPrice = Number(this.props.currentPrice).toFixed(0);
    const profitAndLoss = Number(this.props.currentPrice - this.props.previousPrice).toFixed(0);

    if ((this.props.currentPrice - this.props.previousPrice) > 0) {
        return (
        <div className="StockIndicator">
            <TrendingUp color={red500} />
            <div>{currentPrice}(+{profitAndLoss})</div>
        </div>
        );        
    } else {
        return (
        <div className="StockIndicator">
            <TrendingDown color={greenA200} />
            <div>{currentPrice}({profitAndLoss})</div>
        </div>
        );
    }
  }
}

export default StockIndicator;
