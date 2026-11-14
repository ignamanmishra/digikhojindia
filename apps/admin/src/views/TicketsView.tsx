import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import type { Ticket, TicketReply, TicketInternalNote } from '@digikhojindia/types';
import { LifeBuoy, AlertCircle, MessageSquare, Lock, CheckCircle2, Clock } from 'lucide-react';

export const TicketsView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [internalNotes, setInternalNotes] = useState<TicketInternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [replyMessage, setReplyMessage] = useState('');
  const [noteMessage, setNoteMessage] = useState('');

  const fetchTickets = () => {
    setLoading(true);
    apiRequest('/tickets')
      .then((res) => {
        setTickets(res.tickets || []);
        if (res.tickets?.length > 0 && !selectedTicket) {
          loadTicketDetails(res.tickets[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadTicketDetails = (id: string) => {
    apiRequest(`/tickets/${id}`)
      .then((res) => {
        setSelectedTicket(res.ticket);
        setReplies(res.replies || []);
        setInternalNotes(res.internal_notes || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await apiRequest(`/tickets/${selectedTicket.id}/replies`, {
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

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !noteMessage.trim()) return;

    try {
      await apiRequest(`/tickets/${selectedTicket.id}/internal-notes`, {
        method: 'POST',
        body: JSON.stringify({ note: noteMessage }),
      });
      setNoteMessage('');
      loadTicketDetails(selectedTicket.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      await apiRequest(`/tickets/${selectedTicket.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
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
            <h3 className="text-sm font-bold text-slate-900">Support Ticket Queue</h3>
            <p className="text-[11px] text-slate-500">{tickets.length} total active tickets</p>
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
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.customer_organization}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-medium text-slate-600">{t.status}</span>
                  <span>SLA: {new Date(t.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            {/* Ticket Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-blue-600">{selectedTicket.id}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {selectedTicket.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                    Status: {selectedTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-700">{selectedTicket.customer_organization}</strong> ({selectedTicket.customer_name})
                </p>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="flex items-center gap-1.5">
                {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
                  <button
                    onClick={() => handleUpdateStatus('Resolved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 size={13} />
                    <span>Resolve</span>
                  </button>
                )}
                {selectedTicket.status !== 'In Progress' && (
                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Body (Customer Replies + Internal Notes) */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {/* Original Complaint Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Customer Description</span>
                <p className="text-xs text-slate-800 leading-relaxed">{selectedTicket.description}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Logged on {new Date(selectedTicket.created_at).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Staff-only Internal Notes Box */}
              {internalNotes.length > 0 && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Lock size={13} />
                    <span>Internal Staff Troubleshooting Notes (Strictly Hidden from Customer)</span>
                  </div>
                  {internalNotes.map((note) => (
                    <div key={note.id} className="text-xs text-amber-950 border-t border-amber-200/60 pt-1.5 mt-1">
                      <p className="font-medium">{note.note}</p>
                      <span className="text-[10px] text-amber-700 font-semibold">{note.author_name} • {new Date(note.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Thread of Replies */}
              <div className="space-y-3 pt-2">
                {replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl text-xs max-w-xl ${
                      r.is_customer
                        ? 'bg-slate-100 text-slate-800 mr-auto'
                        : 'bg-blue-600 text-white ml-auto shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                      <strong>{r.sender_name}</strong>
                      <span>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed">{r.message}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Inputs: Customer-visible Reply & Internal Note */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Send Visible Reply */}
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type official reply visible to customer..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow shrink-0"
                >
                  Send Reply
                </button>
              </form>

              {/* Add Internal Staff Note */}
              <form onSubmit={handleAddInternalNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  placeholder="🔒 Add private internal technical note (customer cannot see this)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-amber-50/60 border border-amber-300 rounded-lg text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shrink-0"
                >
                  Save Note
                </button>
              </form>

            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs my-auto">
            Select a ticket from the queue to view full conversation and take action.
          </div>
        )}
      </div>

    </div>
  );
};

