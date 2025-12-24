import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, Users, Settings } from "lucide-react";
import AppGrid from "@/components/AppGrid";
import NotificationWidget from "@/components/NotificationWidget";
import QuickActionCard from "@/components/QuickActionCard";
import Navbar from "@/components/Navbar";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const AppGallery = () => {
  const [aiBannerEnabled, setAiBannerEnabled] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    setUserRole(role);

    const db = firebase.database();
    const settingsRef = db.ref("root/settings/aiBannerEnabled");
    settingsRef.on("value", (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setAiBannerEnabled(val);
    });
    return () => settingsRef.off();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#FDFCF5] dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Floating decorative elements & Noise */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-[1] mix-blend-overlay"></div>

        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#D2B48C]/20 rounded-full blur-[100px] animate-float opacity-70" />
        <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-[#DEB887]/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F5DEB3]/10 rounded-full blur-[100px] animate-glow-pulse" />
      </div>

      <div className="flex-1 relative z-10 p-4 md:p-6 pt-20 md:pt-24 flex flex-col overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto flex flex-col xl:grid xl:grid-cols-5 gap-4 xl:gap-6 flex-1 min-h-0">

          {/* Left Sidebar - Quick Actions */}
          <div className="hidden xl:block xl:col-span-1 h-full min-h-0 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
            <QuickActionCard onSearch={setSearchQuery} />
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 flex flex-col gap-4 min-h-0 flex-1 order-1 xl:order-none">
            {aiBannerEnabled && (
              <div className="flex-shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link to="/chat" className="group relative block w-full bg-gradient-to-br from-[#5D4037] via-[#795548] to-[#8D6E63] rounded-2xl p-4 md:p-5 shadow-xl shadow-[#5D4037]/20 overflow-hidden transition-all duration-500 hover:shadow-[#5D4037]/40 hover:-translate-y-1">

                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-[#A1887F]/30 rounded-full blur-2xl" />
                  <div className="absolute right-20 top-10 w-16 h-16 bg-[#D7CCC8]/20 rounded-full blur-xl" />

                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[#EFEBE9] text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#D7CCC8] animate-pulse" />
                        <span>AI Assistant</span>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                          Need help managing?
                        </h2>
                        <p className="text-[#D7CCC8] text-xs sm:text-sm leading-relaxed font-medium line-clamp-1 sm:line-clamp-none">
                          Chat with our advanced AI to analyze sales, check stock instantly.
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 hidden sm:block">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white text-white group-hover:text-[#5D4037] transition-all duration-300 shadow-lg">
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Mobile Admin Controls - Below Banner */}
            {userRole === "admin" && (
              <div className="grid grid-cols-2 gap-3 xl:hidden animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                <Link
                  to="/staffes"
                  className="group relative flex flex-row items-center justify-center gap-3 p-3 h-16 rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent backdrop-blur-md border border-white/40 hover:border-[#8D6E63]/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#8D6E63]/20 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#8D6E63]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                  <div className="relative p-2 rounded-xl bg-[#8D6E63]/10 group-hover:bg-[#8D6E63]/20 transition-all duration-300 group-hover:scale-110">
                    <Users className="w-4 h-4 text-[#5D4037] dark:text-[#A1887F]" />
                  </div>
                  <span className="relative text-[10px] font-bold text-[#5D4037] dark:text-[#D7CCC8] text-center tracking-wide group-hover:text-[#5D4037] transition-colors whitespace-nowrap">
                    Manage Staff
                  </span>
                </Link>

                <button
                  onClick={() => setIsManaging(!isManaging)}
                  className={`group relative flex flex-row items-center justify-center gap-3 p-3 h-16 rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 overflow-hidden ${isManaging
                    ? "bg-[#5D4037] border-[#5D4037] shadow-[#5D4037]/30"
                    : "bg-gradient-to-br from-white/40 via-white/20 to-transparent border-white/40 hover:border-[#8D6E63]/50 hover:shadow-[#8D6E63]/20"
                    }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${isManaging ? "bg-white/10" : "bg-[#8D6E63]/10"}`} />

                  <div className={`relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${isManaging ? "bg-white/20" : "bg-[#8D6E63]/10 group-hover:bg-[#8D6E63]/20"
                    }`}>
                    <Settings className={`w-4 h-4 ${isManaging ? "text-white animate-spin-slow" : "text-[#5D4037] dark:text-[#A1887F]"}`} />
                  </div>
                  <span className={`relative text-[10px] font-bold text-center tracking-wide transition-colors whitespace-nowrap ${isManaging ? "text-white" : "text-[#5D4037] dark:text-[#D7CCC8] group-hover:text-[#5D4037]"
                    }`}>
                    {isManaging ? "Done" : "Manage Apps"}
                  </span>
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0">
              <AppGrid isManaging={isManaging} searchQuery={searchQuery} />
            </div>
          </div>

          {/* Right Sidebar - Notifications & Admin Tools */}
          <div className="xl:col-span-1 h-auto xl:h-full min-h-0 flex-shrink-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 flex flex-col gap-4 order-2 xl:order-none">

            {/* Desktop Admin Controls */}
            {userRole === "admin" && (
              <div className="hidden xl:grid grid-cols-2 gap-3 flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <Link
                  to="/staffes"
                  className="group relative flex flex-col items-center justify-center gap-2 p-3 h-[110px] rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent backdrop-blur-md border border-white/40 hover:border-[#8D6E63]/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#8D6E63]/20 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#8D6E63]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                  <div className="relative p-2.5 rounded-xl bg-[#8D6E63]/10 group-hover:bg-[#8D6E63]/20 transition-all duration-300 group-hover:scale-110">
                    <Users className="w-5 h-5 text-[#5D4037] dark:text-[#A1887F]" />
                  </div>
                  <span className="relative text-xs font-bold text-[#5D4037] dark:text-[#D7CCC8] text-center tracking-wide group-hover:text-[#5D4037] transition-colors whitespace-nowrap">
                    Manage Staff
                  </span>
                </Link>

                <button
                  onClick={() => setIsManaging(!isManaging)}
                  className={`group relative flex flex-col items-center justify-center gap-2 p-3 h-[110px] rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 overflow-hidden ${isManaging
                    ? "bg-[#5D4037] border-[#5D4037] shadow-[#5D4037]/30"
                    : "bg-gradient-to-br from-white/40 via-white/20 to-transparent border-white/40 hover:border-[#8D6E63]/50 hover:shadow-[#8D6E63]/20"
                    }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${isManaging ? "bg-white/10" : "bg-[#8D6E63]/10"}`} />

                  <div className={`relative p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${isManaging ? "bg-white/20" : "bg-[#8D6E63]/10 group-hover:bg-[#8D6E63]/20"
                    }`}>
                    <Settings className={`w-5 h-5 ${isManaging ? "text-white animate-spin-slow" : "text-[#5D4037] dark:text-[#A1887F]"}`} />
                  </div>
                  <span className={`relative text-xs font-bold text-center tracking-wide transition-colors whitespace-nowrap ${isManaging ? "text-white" : "text-[#5D4037] dark:text-[#D7CCC8] group-hover:text-[#5D4037]"
                    }`}>
                    {isManaging ? "Done" : "Manage Apps"}
                  </span>
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 hidden xl:block">
              <NotificationWidget />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppGallery;
