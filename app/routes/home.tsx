import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IO TECH - Innovate. Optimize. Connect." },
    { name: "description", content: "IO TECH: Where intelligent input meets exceptional output. We build high-performance software and stunning websites that grow your business." },
  ];
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<{ command: string; output: string[] }[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [snake, setSnake] = useState<[number, number][]>([[5, 5]]);
  const [food, setFood] = useState<[number, number]>([10, 10]);
  const [direction, setDirection] = useState<[number, number]>([1, 0]);
  const [nextDirection, setNextDirection] = useState<[number, number]>([1, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const terminalCommands: { [key: string]: string[] } = {
    help: [
      "Available commands:",
      "  help - Show this help message",
      "  about - Learn about IO TECH",
      "  services - View our services",
      "  contact - Get our contact info",
      "  clear - Clear terminal",
      ""
    ],
    about: [
      "IO TECH: Where Intelligent Input Meets Exceptional Output",
      "We build high-performance software and stunning websites.",
      "Established 2021 | Based in Sorsogon City, Philippines",
      ""
    ],
    services: [
      "Our Services:",
      "  • Web Development",
      "  • Custom Software Development",
      "  • UI/UX Design",
      "  • IT Consulting",
      "  • Logo Design",
      "  • Brochures & Flyers",
      "  • Graphic Design Services",
      ""
    ],
    contact: [
      "Get in touch with us:",
      "  Email: contact.iotechph@gmail.com",
      "  Phone: +63 991 732 1120",
      "  Website: io-tech.com",
      ""
    ],
    snake: [
      "Starting Snake Game...",
      "Use Arrow Keys to move",
      "Type 'exit' to quit",
      ""
    ],
    clear: [],
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = terminalInput.trim().toLowerCase();
      
      if (command === "clear") {
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      }

      if (command === "snake") {
        setCountdown(3);
        setSnake([[5, 5]]);
        setFood([10, 10]);
        setDirection([1, 0]);
        setNextDirection([1, 0]);
        setGameOver(false);
        setScore(0);
        setTerminalHistory([
          { command: terminalInput, output: ["Starting Snake Game...", "Use Arrow Keys to move", "", ""] }
        ]);
        setTerminalInput("");
        return;
      }

      if (command === "exit" && gameActive) {
        setGameActive(false);
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      }

      const output = terminalCommands[command] || [`Command not found: ${command}. Type 'help' for available commands.`, ""];
      
      setTerminalHistory([
        { command: terminalInput, output }
      ]);
      setTerminalInput("");
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setGameActive(true);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);
  useEffect(() => {
    if (!gameActive || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "ArrowUp" && direction[1] === 0) {
        setNextDirection([0, -1]);
        e.preventDefault();
      } else if (key === "ArrowDown" && direction[1] === 0) {
        setNextDirection([0, 1]);
        e.preventDefault();
      } else if (key === "ArrowLeft" && direction[0] === 0) {
        setNextDirection([-1, 0]);
        e.preventDefault();
      } else if (key === "ArrowRight" && direction[0] === 0) {
        setNextDirection([1, 0]);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameActive, gameOver, direction]);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newDirection = nextDirection;
        const head = prevSnake[0];
        const newHead: [number, number] = [
          (head[0] + newDirection[0] + 20) % 20,
          (head[1] + newDirection[1] + 20) % 20
        ];

        setDirection(newDirection);

        // Check if hit self
        if (prevSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(prev => prev + 10);
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameActive, gameOver, food, nextDirection]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white/30 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="group flex items-center gap-3">
              <img 
                src="/logo-only.png" 
                alt="IO TECH Logo" 
                className="h-20 w-auto group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">IO TECH</span>
                <span className="text-sm text-gray-600 group-hover:scale-110 transition-transform duration-300">Innovate. Optimize. Connect</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Get Started
              </a>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#about" className="block text-gray-700 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#services" className="block text-gray-700 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 transition" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-20 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white">
              <div className="inline-block mb-6">
                <span className="text-sm font-semibold text-blue-100 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  Transform Your Digital Future
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block">Where Intelligent</span>
                <span className="block text-green-300">Input Meets</span>
                <span className="block">Exceptional Output</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
                We build high-performance software, stunning websites, and innovative solutions that drive your business forward. 
                From concept to deployment, we turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href="#contact" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
                >
                  Get Started Today
                </a>
                <a 
                  href="#services" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 text-center"
                >
                  Explore Services
                </a>
              </div>
              <div className="flex items-center gap-8 text-blue-100">
                <div>
                  <div className="text-3xl font-bold text-white">20+</div>
                  <div className="text-sm">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-sm">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">4+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Terminal */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-xl h-96">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded-2xl blur-3xl"></div>
                
                {/* Terminal window */}
                <div className="relative bg-black/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-white/60 text-sm font-mono">io-tech@localhost</span>
                  </div>

                  {/* Terminal content */}
                  <div className="p-6 font-mono text-sm min-h-80 overflow-y-auto relative" onClick={(e) => {
                    const input = (e.currentTarget.querySelector('input') as HTMLInputElement);
                    if (input) input.focus();
                  }}>
                    {countdown !== null ? (
                      <div className="flex flex-col gap-6 items-center justify-center h-full">
                        <div className="text-green-400 text-center">
                          <div className="text-2xl font-bold mb-4">Starting Snake Game...</div>
                          <div className="mb-6 text-white/70">
                            <div>Use Arrow Keys to move</div>
                            <div>Eat the yellow food to grow</div>
                            <div>Don't hit yourself!</div>
                          </div>
                          <div className="text-5xl font-bold text-yellow-400">{countdown === 0 ? "GO!" : countdown}</div>
                        </div>
                      </div>
                    ) : gameActive ? (
                      <div className="flex flex-col gap-4">
                        <div className="text-green-400">Score: {score}</div>
                        <div className="border border-green-400 bg-black/50 p-2" style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(20, 1fr)',
                          gap: '2px',
                          width: 'fit-content'
                        }}>
                          {Array.from({ length: 20 }).map((_, y) =>
                            Array.from({ length: 20 }).map((_, x) => {
                              const isSnake = snake.some(s => s[0] === x && s[1] === y);
                              const isFood = food[0] === x && food[1] === y;
                              const isHead = snake[0][0] === x && snake[0][1] === y;
                              
                              return (
                                <div
                                  key={`${x}-${y}`}
                                  className={`w-2 h-2 ${
                                    isHead ? 'bg-red-500' : isSnake ? 'bg-green-500' : isFood ? 'bg-yellow-400' : 'bg-gray-800'
                                  }`}
                                />
                              );
                            })
                          )}
                        </div>
                        {gameOver && (
                          <div className="text-red-500">
                            <div>Game Over! Final Score: {score}</div>
                            <div className="text-green-400 mt-2">Type 'exit' to return to terminal</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-green-400">$ Welcome to IO TECH Terminal</div>
                        <div className="text-white/70">Type 'help' to see available commands</div>
                        <div className="text-yellow-500 text-xs italic mt-2">💡 Tip: Try typing 'snake' for a surprise!</div>
                        <div className="mt-4"></div>

                        {terminalHistory.length === 0 ? (
                          <>
                            <div className="text-green-400">$ npm create vite@latest project</div>
                            <div className="text-white/70">✓ Creating project...</div>
                            <div className="mt-4 text-green-400">$ cd project && npm install</div>
                            <div className="text-white/70">✓ Installing dependencies...</div>
                            
                            <div className="mt-6">
                              <div className="text-green-400">$ Building amazing solutions</div>
                              <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-400">&gt;</span>
                                  <span className="text-white">
                                    <span className="text-cyan-400">const</span>
                                    <span className="text-white"> solution </span>
                                    <span className="text-cyan-400">=</span>
                                    <span className="text-white"> </span>
                                    <span className="text-yellow-300">'web development'</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-400">&gt;</span>
                                  <span className="text-white">
                                    <span className="text-cyan-400">const</span>
                                    <span className="text-white"> expertise </span>
                                    <span className="text-cyan-400">=</span>
                                    <span className="text-white"> </span>
                                    <span className="text-yellow-300">'software & design'</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-400">&gt;</span>
                                  <span className="text-white">
                                    <span className="text-cyan-400">const</span>
                                    <span className="text-white"> result </span>
                                    <span className="text-cyan-400">=</span>
                                    <span className="text-white"> </span>
                                    <span className="text-yellow-300">'exceptional output'</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          terminalHistory.map((entry, idx) => (
                            <div key={idx}>
                              <div className="text-green-400">$ {entry.command}</div>
                              {entry.output.map((line, lineIdx) => (
                                <div key={lineIdx} className="text-white/70">
                                  {line}
                                </div>
                              ))}
                            </div>
                          ))
                        )}

                        {/* Input line */}
                        <div className="mt-4">
                          <div className="flex items-center gap-0">
                            <span className="text-green-400">$&nbsp;</span>
                            {terminalInput === "" && (
                              <span className="text-white/40 font-mono text-sm">Type command here...</span>
                            )}
                            <span className="text-white/90 font-mono text-sm">{terminalInput}</span>
                            <span className="inline-block w-2 h-5 bg-green-400 animate-blink-fast"></span>
                          </div>
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleTerminalKeyDown}
                      placeholder=""
                      className="absolute inset-0 bg-transparent text-transparent outline-none cursor-text"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">Who We Are</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-blue-600">ABOUT</span>
              <span className="text-green-500"> US</span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                IO TECH: WHERE INTELLIGENT INPUT MEETS EXCEPTIONAL OUTPUT
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                We build high-performance software and stunning websites that grow your business. 
                From strategy to execution, we bring your digital vision to life.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            {/* Logo Circle */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-80 h-80 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center p-8 transform group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/logo-only.png" 
                    alt="IO TECH Logo" 
                    className="w-45 h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Services Preview */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">What We Excel At</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/30 hover:border-blue-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 text-lg font-bold group-hover:text-blue-600 transition-colors block">Custom Software</span>
                    <span className="text-gray-600 text-sm">Tailored solutions for your needs</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/30 hover:border-blue-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 text-lg font-bold group-hover:text-cyan-600 transition-colors block">UI/UX Design</span>
                    <span className="text-gray-600 text-sm">Beautiful & intuitive interfaces</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/30 hover:border-blue-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 text-lg font-bold group-hover:text-green-600 transition-colors block">Web Development</span>
                    <span className="text-gray-600 text-sm">High-performance web solutions</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/30 hover:border-blue-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 text-lg font-bold group-hover:text-yellow-600 transition-colors block">Tech Consulting</span>
                    <span className="text-gray-600 text-sm">Strategic technology guidance</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/30 hover:border-blue-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 text-lg font-bold group-hover:text-purple-600 transition-colors block">Graphic Design</span>
                    <span className="text-gray-600 text-sm">Creative designs & branding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gradient-to-br from-blue-100 via-blue-50 to-green-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-full blur-3xl opacity-30"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full inline-block mb-4">What We Offer</span>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-blue-600">OUR</span>
              <span className="text-green-500"> SERVICES</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Web Development */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Web Development</h3>
              <p className="text-gray-600 leading-relaxed">
                We create responsive, high-performance websites that engage users and drive business growth. 
                From simple landing pages to complex web applications.
              </p>
            </div>

            {/* Custom Software Development */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Custom Software Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Tailored software solutions designed to meet your unique business needs. 
                Scalable, secure, and built for long-term success.
              </p>
            </div>

            {/* UI/UX Design */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">UI/UX Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful, intuitive interfaces that users love. We combine aesthetics with functionality 
                to create exceptional user experiences.
              </p>
            </div>

            {/* IT Consulting */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">IT Consulting</h3>
              <p className="text-gray-600 leading-relaxed">
                Strategic technology guidance to help you make informed decisions. 
                We help optimize your tech stack and digital strategy.
              </p>
            </div>

            {/* Logo Design */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Logo Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Memorable brand identities that make a lasting impression. 
                Professional logos that represent your company's values and vision.
              </p>
            </div>

            {/* Brochures & Flyers */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z M13 3v5a2 2 0 002 2h5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Brochures & Flyers</h3>
              <p className="text-gray-600 leading-relaxed">
                Eye-catching marketing materials that effectively communicate your message. 
                From brochures to flyers, we create designs that grab attention and drive results.
              </p>
            </div>

            {/* Graphic Design Services */}
            <div className="bg-white/40 backdrop-blur-md border-2 border-white/30 p-8 rounded-2xl hover:border-blue-200/50 hover:shadow-2xl hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Graphic Design Services</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive graphic design solutions including social media graphics, banners, posters, and more. 
                Creative designs that elevate your brand presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full inline-block mb-4">Get In Touch</span>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-blue-600">Let's Build</span>
              <span className="text-green-500"> Something Great</span>
              <span className="text-blue-600"> Together</span>
            </h2>
            <p className="text-xl text-gray-600 mt-6">
              Ready to transform your digital presence? Get in touch with us today.
            </p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-white/30">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h3>
              <p className="text-gray-600 mb-12 leading-relaxed text-lg">
                Have a project in mind? We'd love to hear from you. 
                Reach out using the information below and we'll respond as soon as possible.
              </p>
              <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-6">
                <a href="mailto:contact.iotechph@gmail.com" className="flex items-center gap-4 text-blue-600 group hover:text-blue-700 transition-all">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                    <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold">contact.iotechph@gmail.com</span>
                </a>
                <a href="tel:+63" className="flex items-center gap-4 text-green-600 group hover:text-green-700 transition-all">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:scale-110 transition-all">
                    <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold">+63 991 732 1120</span>
                </a>
                <a href="https://www.facebook.com/share/1CEsfFJac9/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-blue-700 group hover:text-blue-800 transition-all">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-700 group-hover:scale-110 transition-all">
                    <svg className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold">IO Tech Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <img 
                  src="/logo.png" 
                  alt="IO TECH Logo" 
                  className="h-12 w-auto mb-2"
                />
              </div>
              <p className="text-gray-500 text-sm">Transforming ideas into digital excellence.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Custom Software</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">UI/UX Design</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">IT Consulting</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Logo Design</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Brochures & Flyers</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Graphic Design</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Our Services</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact.iotech@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +63 991 732 1120
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} IO TECH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
