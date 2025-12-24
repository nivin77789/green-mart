import React, { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Toaster, toast } from 'sonner';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBJK-AGuTOiUxHinJZPH9rmQ_2Wa7ixrMM",
    authDomain: "green-mart-28e7a.firebaseapp.com",
    databaseURL: "https://green-mart-28e7a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "green-mart-28e7a",
    storageBucket: "green-mart-28e7a.firebasestorage.app",
    messagingSenderId: "881520746742",
    appId: "1:881520746742:web:d177ca0c751198fac84cd7"
};

// Initialize
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const FCMPushListener = () => {
    useEffect(() => {
        // 1. Request Permission
        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted.');

                    // 2. Get Token (VAPID Key is public, can be generated in console, or used without for basic)
                    // You might need to add your VAPID key: getToken(messaging, { vapidKey: 'YOUR_KEY' });
                    const token = await getToken(messaging, {
                        vapidKey: 'YOUR_VAPID_PUBLIC_KEY_HERE' // OPTIONAL but recommended
                    });

                    if (token) {
                        console.log('FCM Token:', token);
                        // In a real app, you would send this token to your backend to subscribe it to the topic "GreenMart_all"
                        // Since we don't have a backend to subscribe, clients must handle subscription differently or
                        // the "Sender" must send to individual tokens (Impractical without backend).
                        //
                        // HOWEVER, assuming you set up a cloud function or use Console to subscribe tokens:
                        // For now, we just enable the foreground listener.
                    }
                }
            } catch (err) {
                console.log('Unable to get permission to notify.', err);
            }
        };

        requestPermission();

        // 3. Handle Foreground Messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            toast(payload.notification?.title || "New Message", {
                description: payload.notification?.body,
                duration: 5000,
            });

            // Play sound
            try {
                new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3").play();
            } catch (e) { }
        });

        return () => unsubscribe();
    }, []);

    return <Toaster position="top-right" />;
};

export default FCMPushListener;
