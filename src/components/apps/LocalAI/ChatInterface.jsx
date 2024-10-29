import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';

export function ChatInterface({ selectedModel, settings }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedModel || isGenerating) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Simulate AI response with streaming
      const response = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, response]);

      const fullResponse = `I am running locally on your machine using the ${selectedModel.name} model. This is a simulated response to demonstrate the interface.`;
      
      if (settings.streamResponse) {
        for (let i = 0; i < fullResponse.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setMessages(prev => [
            ...prev.slice(0, -1),
            { ...response, content: fullResponse.slice(0, i + 1) }
          ]);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...response, content: fullResponse }
        ]);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'error',
          content: 'Failed to generate response. Please try again.'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedModel) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Please select a model to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 overflow-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}
            `}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <div
              className={`
                max-w-[80%] rounded-lg p-3
                ${message.role === 'user'
                  ? 'bg-blue-500/10 text-blue-100'
                  : message.role === 'error'
                  ? 'bg-red-500/10 text-red-200'
                  : 'bg-gray-800 text-gray-100'}
              `}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}