import React, { useState } from 'react';
import { Book, MessageCircle, HelpCircle, FileText } from 'lucide-react';

const HelpCard = ({ icon: Icon, title, desc }) => {
    return (
        <div className="rounded-2xl p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 44, height: 44, background: 'rgba(38, 204, 194, 0.08)', border: '1px solid rgba(38, 204, 194, 0.3)' }}>
                <Icon size={20} color="#26CCC2" />
            </div>
            <h3 className="text-sm font-bold mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>{title}</h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            <button 
                onClick={() => alert(`Redirecting to ${title} resources...`)}
                className="text-xs font-semibold mt-auto text-left w-fit pt-2 transition-colors hover:text-white" 
                style={{ color: 'var(--accent)' }}>
                Learn more &rarr;
            </button>
        </div>
    );
};

const HelpSupport = () => {
    const [ticketSent, setTicketSent] = useState(false);

    const handleTicketSubmit = () => {
        if(ticketSent) return;
        setTicketSent(true);
        setTimeout(() => {
            alert('Your priority support ticket has been sent to our engineers. We will get back to you within 2-4 hours.');
        }, 300);
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1100px]">
            <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Help & Support</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Find answers to your questions, explore documentation, or contact our team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <HelpCard icon={Book} title="Documentation" desc="Detailed guides on using CrimePrediction and SafeRoute features." />
                <HelpCard icon={HelpCircle} title="FAQ" desc="Quick answers to the most frequently asked user queries." />
                <HelpCard icon={MessageCircle} title="Live Chat" desc="Reach out directly to our support engineers." />
                <HelpCard icon={FileText} title="API Reference" desc="Integrate CrimeLense data securely into your native applications." />
            </div>

            <div className="rounded-2xl p-8 mt-4 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div>
                    <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Need direct assistance?</h2>
                    <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Our enterprise support team is available 24/7 for paying customers. Create a ticket and an engineer will get back to you within 2-4 hours.
                    </p>
                </div>
                <button 
                    onClick={handleTicketSubmit}
                    disabled={ticketSent}
                    className={`px-6 py-3 shrink-0 rounded-lg text-sm font-bold transition-all whitespace-nowrap shadow-lg ${ticketSent ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`} 
                    style={{ background: ticketSent ? 'var(--surface)' : 'var(--accent)', color: ticketSent ? 'var(--text-primary)' : '#0b0e14', fontFamily: "'Space Grotesk', sans-serif", border: ticketSent ? '1px solid var(--border-subtle)' : 'none' }}>
                    {ticketSent ? 'Ticket Submitted ✓' : 'Open Support Ticket'}
                </button>
            </div>
        </div>
    );
};

export default HelpSupport;
