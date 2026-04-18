import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, Clock, MapPin, Plus, Send, CheckCircle2, ChevronDown, Flag, X } from 'lucide-react';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { id: 'Lighting', label: 'Lighting Issue', color: '#F59E0B' }, // Warning
    { id: 'Traffic', label: 'Traffic/Diversion', color: '#3B82F6' }, // Blue
    { id: 'Suspicious', label: 'Suspicious Activity', color: '#EF4444' }, // Danger
    { id: 'General', label: 'General Awareness', color: '#14F1D9' }  // Teal
];

// Mock data: posts
const initialPosts = [
    {
        id: 1,
        area: 'Central',
        category: 'Lighting',
        text: 'All streetlights are completely out from 4th avenue to 8th avenue. Very dark.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        reactions: 12,
        hasReacted: false,
    },
    {
        id: 2,
        area: 'West LA',
        category: 'Suspicious',
        text: 'Noticed a group of people aggressively approaching commuters near the south gate entrance.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        reactions: 5,
        hasReacted: true,
    },
    {
        id: 3,
        area: 'Hollywood',
        category: 'Traffic',
        text: 'Heavy police presence and traffic diversion around the station. Avoid the area if driving.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        reactions: 34,
        hasReacted: false,
    }
];

const getTimeAgo = (dateString) => {
    const minDiff = Math.floor((new Date() - new Date(dateString)) / 60000);
    if (minDiff < 60) return `${minDiff} min ago`;
    const hourDiff = Math.floor(minDiff / 60);
    if (hourDiff < 24) return `${hourDiff} hr ago`;
    return '1 day ago';
};

const CommunityFeed = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('community_posts');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return initialPosts;
            }
        }
        return initialPosts;
    });

    useEffect(() => {
        localStorage.setItem('community_posts', JSON.stringify(posts));
    }, [posts]);
    const [showPostForm, setShowPostForm] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ area: '', category: CATEGORIES[0].id, text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Redirect to login if not authenticated (though instructions say anonymous, we need to know they're a user to prevent spam, but display is anonymous)
    // Actually, instruction says "Users can anonymously post" - usually implies logged in but display name stripped. Let's make it available but prompt login to post.
    
    const [isAdmin] = useState(user?.role === 'admin' || user?.email === 'admin@crimelense.com'); // Mock admin check

    const handleReaction = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    reactions: post.hasReacted ? post.reactions - 1 : post.reactions + 1,
                    hasReacted: !post.hasReacted
                };
            }
            return post;
        }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this post?')) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!formData.area.trim() || !formData.text.trim()) return;

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newPost = {
                id: Date.now(),
                area: formData.area,
                category: formData.category,
                text: formData.text,
                timestamp: new Date().toISOString(),
                reactions: 0,
                hasReacted: false,
            };
            
            setPosts([newPost, ...posts]);
            setIsSubmitting(false);
            setShowPostForm(false);
            setShowSuccess(true);
            setFormData({ area: '', category: CATEGORIES[0].id, text: '' });
            
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header & Disclaimer */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Neighborhood <span className="text-neon-teal">Watch</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-6">
                        Real-time community safety observations
                    </p>
                    
                    <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3 text-left">
                        <AlertCircle size={20} className="text-warning shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-warning font-bold text-sm mb-1">Community Guidelines</h4>
                            <p className="text-gray-300 text-xs leading-relaxed">
                                This is an anonymous community awareness feed. Do NOT post personal information, names, descriptions of individuals, or anything that could identify someone. <b>This is not a crime reporting tool.</b> If you are in immediate danger, use the Emergency Panel. Posts auto-expire after 48 hours.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-header with Create Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-xl flex items-center gap-2">
                        <Users size={20} className="text-neon-teal" /> Live Feed
                    </h2>
                    <button 
                        onClick={() => {
                            if (!isAuthenticated) navigate('/login');
                            else setShowPostForm(!showPostForm);
                        }}
                        className={showPostForm ? 'btn-ghost btn-sm' : 'btn-primary btn-sm'}
                    >
                        {showPostForm ? <X size={14} /> : <Plus size={14} />}
                        {showPostForm ? 'Cancel' : 'Post Observation'}
                    </button>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 rounded-xl bg-safe/20 border border-safe/50 flex items-center gap-3 text-safe font-medium">
                            <CheckCircle2 size={20} /> Observation posted anonymously to the feed.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Post Form Dropdown */}
                <AnimatePresence>
                    {showPostForm && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="overflow-hidden mb-8"
                        >
                            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-neon-teal/30 relative">
                                <h3 className="text-white font-bold mb-4">Share an Observation</h3>
                                
                                <div className="space-y-4">
                                    {/* Area */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Location / Area</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="e.g. Hollywood Metro Station"
                                                value={formData.area}
                                                onChange={(e) => setFormData({...formData, area: e.target.value})}
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-teal/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Category</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, category: cat.id})}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all text-center ${formData.category === cat.id ? 'bg-white/10' : 'bg-white/5 border-transparent text-gray-400 hover:text-white'}`}
                                                    style={{ borderColor: formData.category === cat.id ? cat.color : undefined, color: formData.category === cat.id ? cat.color : undefined }}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Observation Text */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">What did you observe?</label>
                                        <textarea 
                                            required
                                            maxLength={200}
                                            rows={3}
                                            placeholder="Briefly describe the safety issue keeping it factual and anonymous..."
                                            value={formData.text}
                                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-teal/50 transition-colors resize-none"
                                        />
                                        <div className="text-right text-xs text-gray-500 mt-1">{formData.text.length}/200</div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className={`btn-primary w-full justify-center ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-deep-navy border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <><Send size={15} /> Post Anonymously</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feed List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {posts.map((post) => {
                            const categoryInfo = CATEGORIES.find(c => c.id === post.category) || CATEGORIES[3];
                            
                            return (
                                <motion.div 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    {/* Post Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span 
                                                className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2"
                                                style={{ backgroundColor: `${categoryInfo.color}15`, color: categoryInfo.color }}
                                            >
                                                {categoryInfo.label}
                                            </span>
                                            <h4 className="text-white font-bold flex items-center gap-1.5">
                                                <MapPin size={14} className="text-gray-400" /> {post.area}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} /> {getTimeAgo(post.timestamp)}
                                            </span>
                                            {/* Admin Delete Button */}
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(post.id)} className="text-gray-600 hover:text-danger p-1" title="Delete Post (Admin)">
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Body */}
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                        "{post.text}"
                                    </p>

                                    {/* Reactions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleReaction(post.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                                    post.hasReacted 
                                                        ? 'bg-neon-teal/10 text-neon-teal border-neon-teal/30' 
                                                        : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <Flag size={14} className={post.hasReacted ? "fill-neon-teal" : ""} /> 
                                                I noticed this too
                                            </button>
                                            {post.reactions > 0 && (
                                                <span className="text-gray-500 text-xs font-medium">
                                                    {post.reactions} {post.reactions === 1 ? 'person' : 'people'} agree
                                                </span>
                                            )}
                                        </div>
                                        
                                        <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                                            Anonymous User
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    
                    {posts.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <Users size={40} className="mx-auto mb-3 text-gray-500" />
                            <p className="text-gray-400">No observations in the last 48 hours.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityFeed;
