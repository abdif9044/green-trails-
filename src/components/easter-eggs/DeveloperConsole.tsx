
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Terminal } from 'lucide-react';
import { useEasterEggs } from '@/contexts/easter-eggs-context';
import { useToast } from '@/hooks/use-toast';

interface ConsoleMessage {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const DeveloperConsole: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to GreenTrails Developer Console! Type "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const { toggleCatMode, unlockSecretTrails, isCatMode, secretTrailsUnlocked } = useEasterEggs();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addMessage = (type: ConsoleMessage['type'], content: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const executeCommand = (command: string) => {
    addMessage('command', `> ${command}`);

    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case 'help':
        addMessage('output', 'Available commands:');
        addMessage('output', '  help - Show this help message');
        addMessage('output', '  cat - Toggle cat mode');
        addMessage('output', '  secrets - Unlock secret trails');
        addMessage('output', '  clear - Clear console');
        addMessage('output', '  matrix - Enter the matrix');
        addMessage('output', '  pizza - Order pizza (just kidding)');
        break;
      
      case 'cat':
        toggleCatMode();
        addMessage('output', isCatMode ? 'Cat mode deactivated! 🐕' : 'Cat mode activated! 🐱');
        break;
      
      case 'secrets':
        unlockSecretTrails();
        addMessage('output', 'Secret trails unlocked! 🗝️');
        break;
      
      case 'clear':
        setMessages([]);
        break;
      
      case 'matrix':
        addMessage('output', 'Entering the matrix...');
        setTimeout(() => {
          addMessage('output', '01001000 01100101 01101100 01101100 01101111');
          addMessage('output', 'Welcome to the real world, Neo. 🕶️');
        }, 1000);
        break;
      
      case 'pizza':
        addMessage('output', 'Pizza ordering feature not implemented yet... 🍕');
        addMessage('output', 'But we can offer you some trail mix! 🥜');
        break;
      
      case 'konami':
        addMessage('output', 'Try the Konami Code: ↑↑↓↓←→←→BA');
        break;
      
      case 'exit':
      case 'quit':
        setIsVisible(false);
        setTimeout(onClose, 300);
        break;
      
      default:
        addMessage('error', `Command not found: ${command}`);
        addMessage('output', 'Type "help" for available commands.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-96 bg-black text-green-400 border-green-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <CardTitle className="text-green-400">Developer Console</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-green-400 hover:text-green-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-60 mb-4 font-mono text-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-1 ${
                  message.type === 'command' 
                    ? 'text-yellow-400' 
                    : message.type === 'error' 
                    ? 'text-red-400' 
                    : 'text-green-400'
                }`}
              >
                {message.content}
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <span className="text-green-400 font-mono">></span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command..."
                className="bg-transparent border-green-500 text-green-400 font-mono"
                autoComplete="off"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperConsole;
