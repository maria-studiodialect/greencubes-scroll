'use client';
import { useState } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from 'next/navigation';

const ScrollElement = () => {
    const { scrollYProgress } = useScroll();
    const [userName, setUserName] = useState(''); // Store the user's name
    const router = useRouter(); // Use Next.js router to navigate to Certificate

    // Step 1: Zoom out the first image from scale 10 to 1, hold scale at 1
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.3], [10, 2, 1]);

    // Adjust the object position for the first image to keep it centered
    const objectPositionY = useTransform(scrollYProgress, [0, 0.3], [-500, 0]);
    const objectPositionX = useTransform(scrollYProgress, [0, 0.3], [-300, 0]);

    // Step 2: Opacity transition for first and second image
    const firstImageOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [1, 1, 1]);
    const secondImageOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.4], [0, 0.7, 0.7]);

    // Step 3: Key messages animation (slide in)
    const message1X = useTransform(scrollYProgress, [0.4, 0.45], [-100, 0]);
    const message1Y = useTransform(scrollYProgress, [0.45, 0.55], [-300, -150]);
    const message2X = useTransform(scrollYProgress, [0.5, 0.6], ['100%', '0%']);
    const message2Y = useTransform(scrollYProgress, [0.6, 0.7], [0, 200]);
    const message1Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.65], [0, 1, 0]);
    const message2Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.9], [0, 1, 0]);

    // Step 4: Final section scroll for call to action
    const callToActionY = useTransform(scrollYProgress, [0.7, 1], [800, 0]);
    const callToActionOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Manually construct the URL with query parameters
        router.push(`/certificate?name=${encodeURIComponent(userName)}`);
    };

    return (
        <div style={{ height: '2000vh' }} className='bg-black'> {/* Tall container for scrolling */}
            
            {/* Step 1: First Image zooms out */}
            <motion.div 
                style={{ scale, opacity: firstImageOpacity, y: objectPositionY, x: objectPositionX }}
                className="w-full h-screen fixed top-0 left-0"
            >
                <motion.img 
                    src="/amable_ortho.jpg" 
                    alt="Zoomable Image"
                    className="w-screen h-screen object-cover"
                />
            </motion.div>

            {/* Step 2: Second Image fades in */}
            <motion.div 
                style={{ opacity: secondImageOpacity }}
                className="w-full h-screen fixed top-0 left-0"
            >
                <motion.img 
                    src="/heat_map_2.jpg" 
                    alt="Fading Image"
                    className="w-screen h-screen object-cover object-[25%]"
                />
            </motion.div>

            {/* Step 3: Key messages slide in */}
            <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
                <motion.div 
                    style={{ x: message1X, opacity: message1Opacity, y: message1Y }} 
                    className="absolute text-white text-xl left-4 bg-black/60 py-6 rounded px-5"
                >
                    Key message 1
                </motion.div>
                <motion.div 
                    style={{ x: message2X, opacity: message2Opacity, y: message2Y }} 
                    className="absolute text-white text-xl right-4  bg-black/60 py-6 rounded px-5"
                >
                    Key message 2
                </motion.div>
            </div>

            {/* Step 4: Final section with Call to Action */}
            <motion.div 
                style={{ opacity: callToActionOpacity, y: callToActionY }}
                className="w-full h-screen bg-[url('/frog.jpg')] bg-cover bg-center flex items-center justify-center fixed top-0"
            >
                <div className="text-center text-white flex flex-col items-between justify-around h-full px-12">
                    <h1 className="text-4xl capitalize font-semibold">ACTIVATE YOUR GREEN CUBE</h1>
                    <form className="mt-4 space-y-4 flex flex-col justify-center items-center px-5" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)} // Capture the name input
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="block w-full p-2 bg-zinc-900 text-white rounded px-4"
                        />
                        <button 
                            type="submit" 
                            className="w-full p-2 bg-lime-500 hover:bg-green-500 text-white text-lg rounded"
                        >
                            Activate
                        </button>
                    </form>
                </div> 
            </motion.div>
        </div>
    );
};

export default ScrollElement;
