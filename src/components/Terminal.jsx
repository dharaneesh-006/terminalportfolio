import React, { useState, useRef, useEffect } from 'react';
import '@fontsource/jetbrains-mono';
import '../styles/terminal.css';

const Terminal = () => {
  const [lines, setLines] = useState([{ type: 'input', value: '' }]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [theme, setTheme] = useState('dark'); // light | dark

  const inputRefs = useRef([]);

  const light = 'bg-pink-950';
  const dark = 'bg-gray-900';

  useEffect(() => {
    const lastInput = inputRefs.current[lines.length - 1];
    if (lastInput) lastInput.focus();
  }, [lines]);

  const handleCommand = (cmd) => {
    switch (cmd.toLowerCase()) {
      case 'help':
        return `Available commands:
  help    --  Show all commands
  about   --  About this terminal
  clear / cls  --  Clear the screen
  date    --  Show current date/time
  echo ".." -- Print your message
  github  --  Link to your GitHub
  theme   --  Toggle light/dark mode`;

      case 'about':
        return '🚀 This terminal was built by Dharaneesh using React and Tailwind CSS.';
      case 'clear':
      case 'cls':
        return 'CLEAR_SCREEN';
      case 'date':
        return new Date().toString();
      case 'github':
        return '🔗 https://github.com/dharaneesh-006';
      case 'theme':
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        return `Theme changed to ${newTheme}`;
      default:
        if (cmd.startsWith('echo ')) {
          return cmd.slice(5);
        }
        return `Unknown command: ${cmd}. Type 'help' to see available commands.`;
    }
  };

  const handleKeyDown = (e, index) => {
    const currentInput = lines[index].value;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      const newLines = [...lines];
      newLines[index].value = history[newIndex];
      setLines(newLines);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === null) return;
      const newIndex = Math.min(history.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      const newLines = [...lines];
      newLines[index].value = history[newIndex];
      setLines(newLines);
      return;
    }

    if (e.key === 'Enter') {
      const input = currentInput;
      const output = handleCommand(input);

      if (output === 'CLEAR_SCREEN') {
        setLines([{ type: 'input', value: '' }]);
        setHistory([]);
        setHistoryIndex(null);
        return;
      }

      const newLines = [...lines];
      newLines[index] = { type: 'input', value: input };

      if (output) {
        output.split('\n').forEach(line => {
          newLines.push({ type: 'output', value: line });
        });
      }

      newLines.push({ type: 'input', value: '' });
      setLines(newLines);
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(null);
    }
  };

  const handleChange = (e, index) => {
    const updated = [...lines];
    updated[index].value = e.target.value;
    setLines(updated);
  };

  return (
    <div className={`${theme === 'light' ? light : dark} text-white p-5 border-4 border-black font-jetbrains min-h-screen`}>
      <h1>Terminal 1.0.0</h1>
      <h2 className="text-base text-gray-400">© 2025 Dharaneesh Corporation</h2>
      <a
        href="https://github.com/dharaneesh-006"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-gray-400 hover:text-blue-300"
      >
        https://github.com/dharaneesh-006
      </a>

      <h1 className="mt-4">Type 'help' to get help</h1>
      <br />

      {lines.map((line, index) =>
        line.type === 'input' ? (
          <div key={index} className="flex text-green-500">
            <span className="mr-2">
              $ <span className="text-orange-400">dharaneesh</span>@<span className="text-orange-600">root</span>:
            </span>
            <input
              type="text"
              className="flex-1 bg-transparent text-white border-0 outline-none"
              value={line.value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              autoFocus={index === lines.length - 1}
            />
          </div>
        ) : (
          <div key={index} className="text-white pl-6">
            {line.value.split(' ').map((word, i) =>
              word.startsWith('http') ? (
                <a
                  key={i}
                  href={word}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-400 hover:text-blue-300"
                >
                  {word}
                </a>
              ) : (
                <span key={i}> {word} </span>
              )
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Terminal;
