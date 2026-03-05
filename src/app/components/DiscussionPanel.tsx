import { X, Send, Paperclip, Tag } from 'lucide-react';
import { useState } from 'react';
import { Message } from './table/types';

interface DiscussionPanelProps {
  requestId: string;
  requestTitle: string;
  status: string;
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

export function DiscussionPanel({
  requestId,
  requestTitle,
  status,
  messages,
  onClose,
  onSendMessage,
}: DiscussionPanelProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {requestId}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                status.includes('1') ? 'bg-blue-100 text-blue-800' :
                status.includes('2') ? 'bg-yellow-100 text-yellow-800' :
                status.includes('3') ? 'bg-orange-100 text-orange-800' :
                status.includes('4') ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{requestTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                {message.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{message.userName}</span>
                <span className="text-xs text-gray-500">{message.userRole}</span>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {message.content.split(' ').map((word, idx) => {
                    if (word.startsWith('@')) {
                      return (
                        <span key={idx} className="text-blue-600 font-medium">
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </p>
                {message.lineItemTag && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      <Tag className="w-3 h-3" />
                      {message.lineItemTag}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Composer */}
      <div className="border-t border-[#E5E7EB] p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
            <div className="flex items-center gap-2 mt-2">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Tag className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
