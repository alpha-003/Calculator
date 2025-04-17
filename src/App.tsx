import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, X, Divide, Percent, RotateCcw,
  PlusSquare, MinusSquare, XSquare, DivideSquare,
  Square, Power, FunctionSquare as Function, Pi,
  ChevronRight
} from 'lucide-react';

type Operation = '+' | '-' | '×' | '÷' | '%' | null;

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [isScientificMode, setIsScientificMode] = useState(true);
  const [memory, setMemory] = useState<number | null>(null);

  const handleNumberClick = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperationClick = (op: Operation) => {
    setOperation(op);
    setPreviousValue(parseFloat(display));
    setIsNewNumber(true);
  };

  const handleDecimalClick = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setIsNewNumber(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;

    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '×':
        result = previousValue * current;
        break;
      case '÷':
        result = previousValue / current;
        break;
      case '%':
        result = (previousValue / 100) * current;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const handleScientificOperation = (operation: string) => {
    const num = parseFloat(display);
    let result = 0;

    switch (operation) {
      case 'sin':
        result = Math.sin((num * Math.PI) / 180);
        break;
      case 'cos':
        result = Math.cos((num * Math.PI) / 180);
        break;
      case 'tan':
        result = Math.tan((num * Math.PI) / 180);
        break;
      case 'sqrt':
        result = Math.sqrt(num);
        break;
      case 'square':
        result = num * num;
        break;
      case 'cube':
        result = Math.pow(num, 3);
        break;
      case 'log':
        result = Math.log10(num);
        break;
      case 'ln':
        result = Math.log(num);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      case '1/x':
        result = 1 / num;
        break;
    }

    setDisplay(result.toString());
    setIsNewNumber(true);
  };

  const handleMemory = (operation: 'M+' | 'M-' | 'MR' | 'MC') => {
    const currentValue = parseFloat(display);
    
    switch (operation) {
      case 'M+':
        setMemory((prev) => (prev || 0) + currentValue);
        break;
      case 'M-':
        setMemory((prev) => (prev || 0) - currentValue);
        break;
      case 'MR':
        if (memory !== null) {
          setDisplay(memory.toString());
          setIsNewNumber(true);
        }
        break;
      case 'MC':
        setMemory(null);
        break;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for calculator keys
      if (
        /[\d\+\-\*\/\.\=\%]/.test(e.key) ||
        e.key === 'Enter' ||
        e.key === 'Escape' ||
        e.key === 'Backspace'
      ) {
        e.preventDefault();
      }

      // Numbers
      if (/\d/.test(e.key)) {
        handleNumberClick(e.key);
      }
      // Operations
      else if (e.key === '+') handleOperationClick('+');
      else if (e.key === '-') handleOperationClick('-');
      else if (e.key === '*') handleOperationClick('×');
      else if (e.key === '/') handleOperationClick('÷');
      else if (e.key === '%') handleOperationClick('%');
      // Equals
      else if (e.key === '=' || e.key === 'Enter') handleEquals();
      // Decimal
      else if (e.key === '.') handleDecimalClick();
      // Clear
      else if (e.key === 'Escape') handleClear();
      // Backspace
      else if (e.key === 'Backspace') {
        if (!isNewNumber && display !== '0') {
          setDisplay(prev => 
            prev.length > 1 ? prev.slice(0, -1) : '0'
          );
        }
      }
      // Scientific operations
      else if (e.key.toLowerCase() === 's') handleScientificOperation('sin');
      else if (e.key.toLowerCase() === 'c') handleScientificOperation('cos');
      else if (e.key.toLowerCase() === 't') handleScientificOperation('tan');
      else if (e.key.toLowerCase() === 'l') handleScientificOperation('log');
      else if (e.key.toLowerCase() === 'n') handleScientificOperation('ln');
      else if (e.key.toLowerCase() === 'p') handleScientificOperation('pi');
      else if (e.key.toLowerCase() === 'e') handleScientificOperation('e');
      // Memory operations
      else if (e.key === 'm') handleMemory('MR');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, isNewNumber, previousValue, operation]);

  const buttonClass = "transition-all duration-100 rounded-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:translate-y-[1px] text-gray-800 font-medium text-sm flex items-center justify-center h-10 shadow-sm";
  const operatorClass = "bg-gray-300 hover:bg-gray-400 text-gray-900";
  const scientificClass = "bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs";
  const memoryClass = "bg-blue-100 hover:bg-blue-200 text-blue-800";
  const equalsClass = "bg-orange-500 hover:bg-orange-600 text-white";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-[320px] bg-gray-800 rounded-lg p-4 shadow-2xl border-t-4 border-gray-700">
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-1">CASIO fx-991ES PLUS</div>
          <div className="bg-[#c3d4c5] p-3 rounded-sm shadow-inner mb-2">
            <div className="text-gray-800/50 text-right text-xs h-4 font-lcd">
              {memory !== null && 'M'} {previousValue !== null && `${previousValue} ${operation}`}
            </div>
            <div className="text-gray-800 text-right text-2xl font-lcd tracking-wider">
              {display}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {['MC', 'MR', 'M-', 'M+'].map((op) => (
              <button
                key={op}
                onClick={() => handleMemory(op as 'M+' | 'M-' | 'MR' | 'MC')}
                className={`${buttonClass} ${memoryClass}`}
              >
                {op}
              </button>
            ))}
            <button onClick={handleClear} className={`${buttonClass} ${operatorClass}`}>
              AC
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1">
          <div className="col-span-2 grid grid-cols-2 gap-1">
            <button onClick={() => handleScientificOperation('sin')} className={`${buttonClass} ${scientificClass}`}>sin</button>
            <button onClick={() => handleScientificOperation('cos')} className={`${buttonClass} ${scientificClass}`}>cos</button>
            <button onClick={() => handleScientificOperation('tan')} className={`${buttonClass} ${scientificClass}`}>tan</button>
            <button onClick={() => handleScientificOperation('log')} className={`${buttonClass} ${scientificClass}`}>log</button>
            <button onClick={() => handleScientificOperation('ln')} className={`${buttonClass} ${scientificClass}`}>ln</button>
            <button onClick={() => handleScientificOperation('1/x')} className={`${buttonClass} ${scientificClass}`}>1/x</button>
            <button onClick={() => handleScientificOperation('square')} className={`${buttonClass} ${scientificClass}`}>x²</button>
            <button onClick={() => handleScientificOperation('cube')} className={`${buttonClass} ${scientificClass}`}>x³</button>
            <button onClick={() => handleScientificOperation('sqrt')} className={`${buttonClass} ${scientificClass}`}>√</button>
            <button onClick={() => handleScientificOperation('pi')} className={`${buttonClass} ${scientificClass}`}>π</button>
          </div>

          <div className="col-span-3 grid grid-cols-4 gap-1">
            <button onClick={() => handleOperationClick('%')} className={`${buttonClass} ${operatorClass}`}>%</button>
            <button onClick={() => setDisplay((prev) => (parseFloat(prev) * -1).toString())} className={`${buttonClass} ${operatorClass}`}>±</button>
            <button onClick={() => handleOperationClick('÷')} className={`${buttonClass} ${operatorClass}`}>÷</button>
            <button onClick={() => handleOperationClick('×')} className={`${buttonClass} ${operatorClass}`}>×</button>

            {[7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num.toString())} className={buttonClass}>
                {num}
              </button>
            ))}
            <button onClick={() => handleOperationClick('-')} className={`${buttonClass} ${operatorClass}`}>−</button>

            {[4, 5, 6].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num.toString())} className={buttonClass}>
                {num}
              </button>
            ))}
            <button onClick={() => handleOperationClick('+')} className={`${buttonClass} ${operatorClass}`}>+</button>

            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num.toString())} className={buttonClass}>
                {num}
              </button>
            ))}
            <button onClick={handleEquals} className={`${buttonClass} ${equalsClass} row-span-2`}>=</button>

            <button onClick={() => handleNumberClick('0')} className={`${buttonClass} col-span-2`}>0</button>
            <button onClick={handleDecimalClick} className={buttonClass}>.</button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-gray-500 text-[10px]">NATURAL-V.P.A.M.</div>
          <div className="text-gray-400 text-[8px]">TWO WAY POWER</div>
        </div>
      </div>
    </div>
  );
}

export default App;