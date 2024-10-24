'use client';
import React, { useState, useEffect } from 'react';
import View360, { EquirectProjection, ControlBar } from '@egjs/view360';
import "@egjs/view360/css/view360.min.css";
import "@egjs/view360/css/control-bar.min.css";
import Image from 'next/image';

const Video360Player = () => {
    const [showGyroButton, setShowGyroButton] = useState(false); // State to show/hide the button
    const [gyroEnabled, setGyroEnabled] = useState(false); // Track if gyro permission is granted
    const [viewer, setViewer] = useState(null); // Store the viewer instance

    const initializeViewer = (enableGyro = false) => {
        if (viewer) {
            viewer.destroy(); // Destroy existing viewer if any
        }

        const newViewer = new View360('#viewer', {
            projection: new EquirectProjection({
                src: '/360Cam_sm.mp4', // Path to your 360 video
                video: {
                    autoplay: true,
                    muted: true,
                },
            }),
            gyro: enableGyro, // Enable gyro if permission is granted
            zoom: false,
            plugins: [
                new ControlBar({
                    gyroButton: false,
                    showBackground: false,
                    progressBar: false,
                    videoTime: false, 
                    volumeButton: false,
                }),
            ],
        });

        setViewer(newViewer); // Store the new viewer instance
    };

    useEffect(() => {
        // Initialize the viewer without gyro by default
        initializeViewer(false);

        // Clean up the viewer when the component is unmounted
        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    }, []);

    const handleGyroPermission = async () => {
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
        if (shouldQueryPermission) {
            try {
                const permissionStatus = await DeviceMotionEvent.requestPermission();
                if (permissionStatus === 'granted') {
                    setGyroEnabled(true); // Update state to reflect gyro permission granted
                    setShowGyroButton(false); // Hide the button
                    localStorage.setItem('gyroPermission', 'granted'); // Persist gyro permission state

                    // Reinitialize the viewer with gyro enabled
                    initializeViewer(true);
                    console.log('Gyro permission granted and viewer reinitialized with gyro');
                } else {
                    console.log('Gyro permission denied');
                }
            } catch (error) {
                console.log('Error requesting gyro permission:', error);
            }
        }
    };

    // Check local storage for gyro permission on initial load
    useEffect(() => {
        const storedPermission = localStorage.getItem('gyroPermission');
        const shouldQueryPermission = DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";

        if (storedPermission === 'granted') {
            setGyroEnabled(true); // If permission is already granted, enable gyro
            setShowGyroButton(false); // Hide the button
            initializeViewer(true); // Initialize the viewer with gyro enabled
        } else if (shouldQueryPermission) {
            setShowGyroButton(true); // Show the button if permission is needed
        }
    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '90vh', backgroundColor: 'black' }} className='relative overflow-hidden'>
            <canvas className="view360-canvas" />

            {/* Show an overlay button if gyro permission is required */}
            {showGyroButton && !gyroEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-20">
                    <Image
                        src="/look-around.svg"
                        alt="Look Around"
                        width={200}
                        height={200}
                        className='mb-5'
                    />
                    <button
                        className="px-4 py-2 bg-lime-500 text-black font-semibold rounded-lg text-sm"
                        onClick={handleGyroPermission}
                    >
                        Enable Gyroscope
                    </button>
                </div>
            )}
        </div>
    );
};

export default Video360Player;