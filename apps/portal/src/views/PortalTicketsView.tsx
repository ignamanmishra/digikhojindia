import React, { useEffect, useState } from 'react';
import { portalRequest } from '../api';
import type { Ticket, TicketReply } from '@digikhojindia/types';
import { LifeBuoy, CheckCircle2, MessageSquare, Star, ArrowRight, CornerDownLeft } from 'lucide-react';

export const PortalTicketsView: React.FC<{ initialTicketId?: string | null }> = ({ initialTicketId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');

  // Rating Modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const fetchTickets = () => {
    setLoading(true);
    portalRequest('/tickets')
      .then((res) => {
        setTickets(res.tickets || []);
        if (res.tickets?.length > 0) {
          const targetId = initialTicketId || res.tickets[0].id;
          loadTicketDetails(targetId);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadTicketDetails = (id: string) => {
    portalRequest(`/tickets/${id}`)
      .then((res) => {
        setSelectedTicket(res.ticket);
        setReplies(res.replies || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTickets();
  }, [initialTicketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await portalRequest(`/tickets/${selectedTicket.id}/replies`, {
        method: 'POST',
        body: JSON.stringify({ message: replyMessage }),
      });
      setReplyMessage('');
      loadTicketDetails(selectedTicket.id);
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await portalRequest(`/tickets/${selectedTicket.id}/confirm-resolution`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
      setShowRatingModal(false);
      loadTicketDetails(selectedTicket.id);
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      
      {/* Left List Pane (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Support Tickets</h3>
            <p className="text-[11px] text-slate-500">{tickets.length} total requests</p>
          </div>
          <button onClick={fetchTickets} className="text-xs text-blue-600 font-semibold hover:underline">
            Refresh
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
          {tickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => loadTicketDetails(t.id)}
                className={`w-full p-4 text-left transition-colors flex flex-col justify-between ${
                  isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      t.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{t.category}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span className={`font-semibold uppercase ${
                    t.status === 'Closed' ? 'text-slate-400' :
                    t.status === 'Resolved' ? 'text-emerald-600' :
                    'text-blue-600'
                  }`}>
                    {t.status}
                  </span>
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Detail Pane (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            <div className="p-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-blue-600">{selectedTicket.id}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {selectedTicket.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Lead: <strong className="text-slate-700">{selectedTicket.assigned_employee_name || 'Digikhojindia Support'}</strong>
                </p>
              </div>

              {/* Confirm Resolution Button if Resolved */}
              {selectedTicket.status === 'Resolved' && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 size={14} />
                  <span>Confirm Resolution & Close</span>
                </button>
              )}
            </div>

            {/* Conversation Messages */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {/* Original Complaint */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Your Initial Description</span>
                <p className="text-xs text-slate-800 leading-relaxed">{selectedTicket.description}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Logged on {new Date(selectedTicket.created_at).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Resolution Confirmation Notice if Closed */}
              {selectedTicket.status === 'Closed' && selectedTicket.customer_feedback_rating && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-emerald-800">
                    <CheckCircle2 size={14} />
                    <span>Issue Verified & Confirmed Resolved by You</span>
                  </div>
                  <p>Rating: {'★'.repeat(selectedTicket.customer_feedback_rating)} ({selectedTicket.customer_feedback_rating}/5)</p>
                  {selectedTicket.customer_feedback_comment && (
                    <p className="italic text-emerald-800">"{selectedTicket.customer_feedback_comment}"</p>
                  )}
                </div>
              )}

              {/* Thread */}
              <div className="space-y-3 pt-2">
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl text-xs max-w-xl ${
                      r.is_customer
                        ? 'bg-blue-600 text-white ml-auto shadow-sm'
                        : 'bg-slate-100 text-slate-800 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                      <strong>{r.sender_name} {r.is_customer ? '(You)' : '(Digikhojindia)'}</strong>
                      <span>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed">{r.message}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Reply Input Form */}
            {selectedTicket.status !== 'Closed' && (
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type a message or answer back to our support team..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow shrink-0"
                >
                  Send Reply
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs my-auto">
            Select a ticket from the left queue to view messages.
          </div>
        )}
      </div>

      {/* RATING & RESOLUTION MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Confirm Issue Resolution</h3>
            <p className="text-xs text-slate-500">
              Please rate your experience with Digikhojindia's technical resolution.
            </p>

            {/* 1-5 Star Picker */}
            <div className="flex justify-center gap-2 text-2xl text-amber-400 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-110 ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Optional remarks or feedback for the support lead..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResolution}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow"
              >
                Confirm & Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
