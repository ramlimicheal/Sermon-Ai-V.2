import React, { useState } from 'react';
import { Mail, Send, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmailSharingProps {
  sermonTitle: string;
  sermonContent: string;
}

export const EmailSharing: React.FC<EmailSharingProps> = ({ sermonTitle, sermonContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      // Simulate email sending (in production, this would call a backend API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSent(true);
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Mail className="h-3.5 w-3.5" />
        Share via Email
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between">
              <h3 className="font-semibold text-bible-900">Share Sermon via Email</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bible-500 hover:text-bible-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-bible-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="pastor@church.com"
                  className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bible-700 mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900 resize-none"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                  {error}
                </div>
              )}

              {sent && (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Email sent successfully!
                </div>
              )}

              <div className="bg-bible-50 p-3 rounded text-xs text-bible-600">
                <p className="font-medium mb-1">Sermon Details:</p>
                <p>Title: {sermonTitle}</p>
                <p>Length: {sermonContent.length} characters</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-bible-200 flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={isSending}
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
