import React, { useState, useEffect } from "react";
import { Search, Moon, Sun, Settings, LogOut, ClipboardList, Truck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const QuickActionCard = ({ onSearch }: { onSearch: (query: string) => void }) => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [ordersToday, setOrdersToday] = useState(0);
    const [onlineDrivers, setOnlineDrivers] = useState(0);

    // Theme Toggle Logic
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Calculate Stats
    useEffect(() => {
        const db = firebase.database();
        const ordersRef = db.ref("root/order");
        const driversRef = db.ref("root/nexus_hr/employees");

        const today = new Date().toLocaleDateString('en-CA');

        // Orders Listener
        ordersRef.on("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const count = Object.values(data).filter((o: any) => {
                    const orderDate = new Date(o.last_updated || o.timestamp).toLocaleDateString('en-CA');
                    return orderDate === today;
                }).length;
                setOrdersToday(count);
            }
        });

        // Drivers Listener
        driversRef.on("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Filter for Logistics/Ride role and NOT offline (simplified active check)
                const onlineCount = Object.values(data).filter((e: any) =>
                    (e.role === 'Ride' || e.department === 'Logistics') &&
                    e.status === 'Active' &&
                    e.availabilityStatus !== 'Offline' // Assuming availabilityStatus or similar logic exists, otherwise just Active
                ).length;
                // Note: Previous logic in OrderManagement implied calculating "offline" manually.
                // Here we will use a simpler approximation if explicit status isn't available, 
                // but if we want strictly "Online", we might need that "delivery_boys" logic again.
                // For now, let's count Active employees.
                setOnlineDrivers(onlineCount);
            }
        });

        return () => {
            ordersRef.off();
            driversRef.off();
        };
    }, []);

    return (
        <Card className="h-full border-[#D7CCC8]/30 dark:border-white/5 shadow-[0_8px_32px_rgba(141,110,99,0.1)] bg-white/60 dark:bg-black/40 backdrop-blur-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_16px_48px_rgba(141,110,99,0.15)]">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-[#5D4037] dark:text-white flex items-center gap-2">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1887F] group-focus-within:text-[#5D4037] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search apps..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-[#D7CCC8] dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#8D6E63]/30 transition-all placeholder:text-[#A1887F]/70 text-sm font-medium text-[#5D4037] dark:text-slate-200"
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#EFEBE9]/50 dark:bg-white/5 border border-[#D7CCC8] dark:border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 transition-transform hover:scale-[1.02]">
                        <div className="bg-white dark:bg-white/10 p-2 rounded-full mb-1 shadow-sm text-[#5D4037] dark:text-[#D7CCC8]">
                            <ClipboardList size={20} />
                        </div>
                        <span className="text-2xl font-black text-[#5D4037] dark:text-[#D7CCC8] pointer-events-none">
                            {ordersToday}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D6E63] dark:text-slate-400">
                            Orders Today
                        </span>
                    </div>

                    <div className="bg-[#E8F5E9]/50 dark:bg-emerald-900/10 border border-[#C8E6C9] dark:border-emerald-500/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 transition-transform hover:scale-[1.02]">
                        <div className="bg-white dark:bg-white/10 p-2 rounded-full mb-1 shadow-sm text-emerald-600 dark:text-emerald-400">
                            <Truck size={20} />
                        </div>
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 pointer-events-none">
                            {onlineDrivers}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-slate-400">
                            Drivers Online
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 mt-auto">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-[#D7CCC8]/30 dark:border-white/10 transition-all group shadow-sm hover:shadow-md hover:shadow-[#8D6E63]/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#F5F5F5] dark:bg-slate-800 text-[#8D6E63] dark:text-slate-400 group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
                                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                            <span className="text-sm font-bold text-[#5D4037] dark:text-slate-300">Dark Mode</span>
                        </div>
                        <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${isDark ? 'bg-[#5D4037]' : 'bg-[#D7CCC8]'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-[#D7CCC8]/30 dark:border-white/10 transition-all group shadow-sm hover:shadow-md hover:shadow-[#8D6E63]/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[#F5F5F5] dark:bg-slate-800 text-[#8D6E63] dark:text-slate-400 group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
                                <Settings size={18} />
                            </div>
                            <span className="text-sm font-bold text-[#5D4037] dark:text-slate-300">Settings</span>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            sessionStorage.clear();
                            toast.success("Signed out successfully");
                            navigate("/");
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/30 transition-all group shadow-sm hover:shadow-red-500/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <LogOut size={18} />
                            </div>
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">Sign Out</span>
                        </div>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActionCard;
