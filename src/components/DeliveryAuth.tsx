import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { Truck } from "lucide-react";

interface AuthProps {
    onLogin: (user: any) => void;
}

export const DeliveryAuth = ({ onLogin }: AuthProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: ''
    });
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            toast({ title: "Error", description: "Email and Password are required", variant: "destructive" });
            return;
        }

        const db = firebase.database();
        const usersRef = db.ref("root/delivery_users");

        if (isLogin) {
            // LOGIN
            usersRef.orderByChild("email").equalTo(formData.email).once("value", snapshot => {
                if (snapshot.exists()) {
                    const userData = Object.values(snapshot.val())[0] as any;
                    if (userData.password === formData.password) {
                        toast({ title: "Welcome back!", description: `Logged in as ${userData.name}` });
                        sessionStorage.setItem("delivery_user", JSON.stringify(userData));
                        sessionStorage.setItem("user_role", "delivery");
                        onLogin(userData);
                    } else {
                        toast({ title: "Error", description: "Invalid password", variant: "destructive" });
                    }
                } else {
                    toast({ title: "Error", description: "User not found", variant: "destructive" });
                }
            });
        } else {
            // SIGNUP
            if (!formData.name || !formData.phone) {
                toast({ title: "Error", description: "Name and Phone are required for signup", variant: "destructive" });
                return;
            }

            // check if email exists
            usersRef.orderByChild("email").equalTo(formData.email).once("value", snapshot => {
                if (snapshot.exists()) {
                    toast({ title: "Error", description: "Email already registered", variant: "destructive" });
                } else {
                    const newUserRef = usersRef.push();
                    const newUser = {
                        id: newUserRef.key,
                        ...formData,
                        role: "Delivery Partner",
                        joinedAt: new Date().toISOString()
                    };
                    newUserRef.set(newUser).then(() => {
                        toast({ title: "Success", description: "Account created successfully!" });

                        // Also Add to Employee Management -> Delivery Boys
                        const empRef = db.ref("root/nexus_hr/employees").push();
                        empRef.set({
                            firstName: formData.name.split(' ')[0],
                            lastName: formData.name.split(' ').slice(1).join(' ') || '',
                            email: formData.email,
                            contactNumber: formData.phone,
                            role: "Ride", // Assuming 'Ride' is the role key for Delivery Boys or create new
                            department: "Logistics",
                            status: "Offline",
                            dateOfJoining: new Date().toISOString(),
                            deliveryUserId: newUserRef.key // Link back
                        });

                        sessionStorage.setItem("delivery_user", JSON.stringify(newUser));
                        sessionStorage.setItem("user_role", "delivery");
                        onLogin(newUser);
                    });
                }
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF5] dark:bg-slate-950 p-6 relative overflow-hidden font-sans">

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D2B48C]/20 dark:bg-blue-600/20 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-[#DEB887]/20 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-float-reverse" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-10 space-y-3">
                    <div className="w-24 h-24 bg-white/80 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-6 border border-[#8D6E63]/10 dark:border-slate-800 rotate-12 hover:rotate-0 transition-transform duration-500">
                        <Truck size={48} className="text-[#5D4037] dark:text-indigo-400 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black text-[#3E2723] dark:text-white tracking-tight">
                        Green Mart<span className="text-[#8D6E63]">Hub</span>
                    </h1>
                    <p className="text-[#5D4037]/70 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                        Delivery Partner Portal
                    </p>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-8 shadow-2xl shadow-[#8D6E63]/10 dark:shadow-indigo-500/10 border border-[#8D6E63]/20 dark:border-slate-800/50 space-y-6">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-black text-[#3E2723] dark:text-white tracking-tight">
                            {isLogin ? "Welcome Back" : "Join the Fleet"}
                        </h2>
                        <p className="text-sm text-[#5D4037]/70 dark:text-slate-400 font-medium">
                            {isLogin ? "Enter your credentials to access dashboard" : "Register and start earning today"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] dark:text-slate-400 px-1">Full Name</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/50 border-[#D7CCC8] dark:border-slate-700/50 font-bold focus:ring-2 focus:ring-[#8D6E63] dark:focus:ring-indigo-500 transition-all px-5"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] dark:text-slate-400 px-1">Phone</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/50 border-[#D7CCC8] dark:border-slate-700/50 font-bold focus:ring-2 focus:ring-[#8D6E63] dark:focus:ring-indigo-500 transition-all px-5"
                                        placeholder="+91..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] dark:text-slate-400 px-1">Email Address</Label>
                            <Input
                                className="h-14 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/50 border-[#D7CCC8] dark:border-slate-700/50 font-bold focus:ring-2 focus:ring-[#8D6E63] dark:focus:ring-indigo-500 transition-all px-5"
                                type="email"
                                placeholder="name@GreenMart.in"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] dark:text-slate-400 px-1">Security Key</Label>
                            <Input
                                className="h-14 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/50 border-[#D7CCC8] dark:border-slate-700/50 font-bold focus:ring-2 focus:ring-[#8D6E63] dark:focus:ring-indigo-500 transition-all px-5"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            className="w-full h-16 bg-[#5D4037] hover:bg-[#4E342E] dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-black text-lg rounded-2xl shadow-xl shadow-[#5D4037]/20 dark:shadow-indigo-600/20 active:scale-95 transition-all mt-4"
                        >
                            {isLogin ? "Launch Dashboard" : "Register Account"}
                        </Button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-black uppercase tracking-[0.2em] text-[#8D6E63] hover:text-[#5D4037] dark:text-slate-400 dark:hover:text-indigo-600 transition-colors py-2"
                        >
                            {isLogin ? "Need an entry? Join us →" : "← Back to Login"}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#A1887F]/50 dark:text-slate-400/50">
                    Secure & Encrypted Environment
                </p>
            </div>
        </div>
    );
};
