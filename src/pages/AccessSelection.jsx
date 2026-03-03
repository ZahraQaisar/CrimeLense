import React from 'react';
import { User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0B1220]">
            {/* Background Gradient & radial glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#09101b] to-[#08101C] z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-5xl font-bold text-white mb-16 tracking-tight">Continue As</h1>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* User Card */}
                    <div
                        className="group relative w-[340px] h-[420px] rounded-[20px] bg-[#111928]/75 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,224,184,0.15)] overflow-hidden cursor-pointer"
                        onClick={() => navigate('/login')} // Assuming user goes to login
                    >
                        {/* Border Beam Effect Container */}
                        <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
                            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#00E0B8_360deg)] animate-border-beam w-[200%] h-[200%] top-[-50%] left-[-50%]"></div>
                        </div>
                        {/* Inner Mask to hide center of beam */}
                        <div className="absolute inset-[1px] bg-[#111928]/90 rounded-[19px] z-10"></div>


                        <div className="relative z-20 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:border-[#00E0B8]/50 transition-colors duration-300">
                                <User size={48} className="text-[#00E0B8] opacity-80 group-hover:opacity-100 transition-all duration-300" />
                            </div>

                            <h2 className="text-2xl font-semibold text-white mb-8">User Access</h2>

                            <button className="px-8 py-3 rounded-full border border-[#00E0B8] text-[#00E0B8] font-medium hover:bg-[#00E0B8] hover:text-[#0B1220] transition-all duration-300 shadow-[0_0_15px_rgba(0,224,184,0.1)] hover:shadow-[0_0_20px_rgba(0,224,184,0.4)]">
                                Enter as User
                            </button>
                        </div>
                    </div>

                    {/* Admin Card */}
                    <div
                        className="group relative w-[340px] h-[420px] rounded-[20px] bg-[#111928]/75 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,76,76,0.15)] overflow-hidden cursor-pointer"
                        onClick={() => navigate('/admin/login')} // Assuming admin has separate login or same
                    >
                        {/* Border Beam Effect Container */}
                        <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
                            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#FF4C4C_360deg)] animate-border-beam w-[200%] h-[200%] top-[-50%] left-[-50%]"></div>
                        </div>
                        {/* Inner Mask to hide center of beam */}
                        <div className="absolute inset-[1px] bg-[#111928]/90 rounded-[19px] z-10"></div>

                        <div className="relative z-20 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:border-[#FF4C4C]/50 transition-colors duration-300">
                                <Shield size={48} className="text-[#FF4C4C] opacity-80 group-hover:opacity-100 transition-all duration-300" />
                            </div>

                            <h2 className="text-2xl font-semibold text-white mb-8">Admin Access</h2>

                            <button className="px-8 py-3 rounded-full border border-[#FF4C4C] text-[#FF4C4C] font-medium hover:bg-[#FF4C4C] hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,76,76,0.1)] hover:shadow-[0_0_20px_rgba(255,76,76,0.4)]">
                                Enter as Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessSelection;
