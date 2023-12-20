
import './Calculator.css';
import { useState } from 'react';

const isOperator = /[x/+-/]/;
const endsWithOperator = /[x/+-/]$/;
const equalsStyle = {
  background: '#004466',
  position: 'absolute',
  height: 120,
  bottom: 5,
  right:6
};


function Calculator() {

  const [currentVal,setCurrentVal] = useState('0');
  const [prevVal,setPrevVal] = useState('0');
  const [formula,setFormula] = useState('');
  const [evaluted,setEvaluated] = useState(false);


  const handleNumber = (e) => {
    if (evaluted === true){
      setCurrentVal(e.target.innerText);
      e.target.innerText !== '0' ? setFormula(e.target.innerText) : setFormula('');
      setEvaluated(false);
    }
    else if (currentVal.includes('.')){
      setCurrentVal(currentVal + e.target.innerText);
      setFormula(formula + e.target.innerText);
    }
    else {
      currentVal == '0' || isOperator.test(currentVal) ? setCurrentVal(e.target.innerText) : setCurrentVal(currentVal + e.target.innerText);
      currentVal == '0' && e.target.innerText == '0' ? setFormula(formula) : setFormula(formula + e.target.innerText)
    }
  }

  const handleOperators = (e) => {
    setCurrentVal(e.target.innerText);
    setEvaluated(false);
    if (formula.includes('=')){
      setFormula(prevVal + e.target.innerText);
    }
    else {
      if (!endsWithOperator.test(formula)){
        setPrevVal(formula);
        setFormula(formula + e.target.innerText);

      } else {
        if (/([x/+-/][-/])$/.test(formula)){
          setPrevVal(formula.slice(0,-2));
          setFormula(formula.slice(0,-2) + e.target.innerText);
        }
        else if (/[x/+-/]$/.test(formula) && e.target.innerText == "-" ){
          setPrevVal(formula);
          setFormula(formula + e.target.innerText);
        }
        else {
          setPrevVal(prevVal);
          setFormula(prevVal + e.target.innerText);
        }
      }  
    }
    // 2 ways of doing it, either this (setFormula(formula + e.target.innerText)) or the one bellow. The reason is because div doesn't have a "value" attribute so "value" is a custom attribute in this case
  }

  const reset = () => {
    setCurrentVal('0');
    setPrevVal('0');
    setFormula('');
    setEvaluated(false);
  } 

  const handleEvaluate = () => {
    let expression = formula;
    if (endsWithOperator.test(expression)) {
      expression = expression.slice(0,-1);
    }
    expression = expression.replace(/x/g, "*").replace(/-/g,"-");
    let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
    setCurrentVal(answer.toString());
    setPrevVal(answer);
    setFormula(formula + '=' + answer);
    setEvaluated(true);
  }

  const handelDecimal = (e) => {
    if (evaluted === true){
      setCurrentVal('0.');
      setFormula('0.');
      setEvaluated(false);
    }
    else if (currentVal.includes('.')){
      setEvaluated(false);
    }
    else {
      if (endsWithOperator.test(currentVal)){
        setCurrentVal('0.');
        setFormula(formula + '0.');
      }
      else {
        setPrevVal(currentVal);
        setCurrentVal(currentVal + '.');
        setFormula(formula + '.');
      }
    }
}



  return (
    <div>
      <div className="calculator">
        <Equation formula={formula.replace(/x/g,'⋅')}/>
        <Display currentVal={currentVal}/>
        <CalculatorBox operators={handleOperators} reset={reset} number={handleNumber} evaluate={handleEvaluate} decimal={handelDecimal}/>
      </div>
      <div className="author"> Coded By <br />
          <a target="_blank" href="https://github.com/hyah01"> 
            Hy Huynh
          </a>
        </div>

    </div>
  );
}

function CalculatorBox({operators, reset, number, evaluate, decimal}) {
  return (
    <div className='calBox'>
      <div className="calButton jumbo" style={{background:'#ac3939'}} id="clear" value="AC" onClick={reset}>AC</div>
      <div className="calButton" style={{background:'#f58216'}} id="divide" value="/" onClick={operators}>/</div>
      <div className="calButton" style={{background:'#f58216'}} id="multiply" value="x" onClick={operators}>x</div>
      <div className="calButton" id="seven" value="7" onClick={number}>7</div>
      <div className="calButton" id="eight" value="8" onClick={number}>8</div>
      <div className="calButton" id="nine" value="9" onClick={number}>9</div>
      <div className="calButton" style={{background:'#f58216'}} id="subtract" value="-" onClick={operators}>-</div>
      <div className="calButton" id="four" value="4" onClick={number}>4</div>
      <div className="calButton" id="five" value="5" onClick={number}>5</div>
      <div className="calButton" id="six" value="6" onClick={number}>6</div>
      <div className="calButton" style={{background:'#f58216'}} id="add" value="+" onClick={operators}>+</div>
      <div className="calButton" id="one" value="1" onClick={number}>1</div>
      <div className="calButton" id="two" value="2" onClick={number}>2</div>
      <div className="calButton" id="three" value="3" onClick={number}>3</div>
      <div className="calButton jumbo" id="zero" value="0" onClick={number}>0</div>
      <div className="calButton" id="decimal" value="." onClick={decimal}>.</div>
      <div className="calButton" style={equalsStyle} id="equals" value="=" onClick={evaluate}>=</div>

    </div>
  );
}

function Display({currentVal}) {
  return (
    <div>
      <div className='outputDisplay' id="display">{currentVal}</div>
    </div>
  );
}

function Equation({formula}) {
  return (
    <div>
      <div className='formulaDisplay'>{formula}</div>
    </div>
  );
}

export default Calculator;
