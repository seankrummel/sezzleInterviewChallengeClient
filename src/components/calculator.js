import React from 'react';
import {connect} from 'react-redux';
import {postEquation, fetchLogs} from '../actions/log';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: ''
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchLogs());
  }
  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(this.props.dispatch(fetchLogs), 1000) // check for updates every second
  }
  stopPeriodicRefresh() {
    if (!this.refreshInterval) return;
    clearInterval(this.refreshInterval);
  }

  updateDisplay(str) {
    this.setState(state => {
      if (state.display === 'evaluating' || state.display === 'invalid expression') {
        return {display: str};
      }
      return {display: state.display += str};
    })
  }

  evalExpression() {
    const exp = this.state.display;
    this.setState(state => ({display: 'evaluating'}));
    
    // seperate operands and operators
    let operands = exp.split(/[+\-*/]+/);
    let operators = [];
    // exp.forEach(char => {
    //   if (char in '+-*/') operators.push(char);
    // });
    for(let i=0; i<exp.length; i++) {
      if ('+-*/'.includes(exp[i])) operators.push(exp[i]);
    }

    // verify that expression is valid
    if (operands.length !== operators.length+1 || isNaN(operands[0]) || operands[0] === '' || operands[operands.length-1] === '') {
      this.setState(() => ({display: 'invalid expression'}));
      return;
    }

    // evaluate expression
    let equals = Number(operands.shift());
    while(operands.length !== 0 && operators.length!== 0) {
      if (isNaN(operands[0]) || operands.length === 0 || operators.length === 0) {
        this.setState(() => ({display: 'invalid expression'}));
        return;
      }

      // eslint-disable-next-line default-case
      switch(operators.shift()) {
        case '+':
          equals += Number(operands.shift());
          break;
        case '-':
          equals -= Number(operands.shift());
          break;
        case '*':
          equals *= Number(operands.shift());
          break;
        case '/':
          equals /= Number(operands.shift());
          break;
      }
    }
    
    this.setState(() => ({display: ''}));
    this.props.dispatch(postEquation(exp + ' = ' + equals));
  }

  render() {
    console.log(this.props.log);
    let logDisplay = this.props.log.map((equ, i) => <div key={i}>{equ}</div>);
    return (
      <div className='calculator'>
        <input className='display' value={this.state.display} readOnly />
        {this.state.message}
        <div className='row'>
          <button onClick={() => this.updateDisplay('7')}>7</button>
          <button onClick={() => this.updateDisplay('8')}>8</button>
          <button onClick={() => this.updateDisplay('9')}>9</button>
          <button onClick={() => this.updateDisplay('+')}>+</button>
        </div>
        <div className='row'>
          <button onClick={() => this.updateDisplay('4')}>4</button>
          <button onClick={() => this.updateDisplay('5')}>5</button>
          <button onClick={() => this.updateDisplay('6')}>6</button>
          <button onClick={() => this.updateDisplay('-')}>-</button>
        </div>
        <div className='row'>
          <button onClick={() => this.updateDisplay('1')}>1</button>
          <button onClick={() => this.updateDisplay('2')}>2</button>
          <button onClick={() => this.updateDisplay('3')}>3</button>
          <button onClick={() => this.updateDisplay('*')}>*</button>
        </div>
        <div className='row'>
          <button onClick={() => this.updateDisplay('.')}>.</button>
          <button onClick={() => this.updateDisplay('0')}>0</button>
          <button onClick={() => this.evalExpression()}>=</button>
          <button onClick={() => this.updateDisplay('/')}>/</button>
        </div>
        <button onClick={() => this.setState(state => ({display: ''}))}>clear</button>
        {logDisplay}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  log: state.log
});
export default connect(mapStateToProps)(Calculator);
