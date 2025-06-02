import React, { useEffect, useState } from 'react';
import dark_logo from "../../assets/logos/black_logo.png"

function CommingSoon() {
    return (
        <div className="relative w-full h-screen">
            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/2093323/pexels-photo-2093323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Background"
                className="w-full h-full object-cover"
            />

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Logo at top-left */}
            <a href="/" className="absolute top-4 left-4 z-10">
                <img
                    src={dark_logo}
                    alt="Logo"
                    className="h-[50px] md:h-[70px] w-auto cursor-pointer"
                />
            </a>

            {/* Centered Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-[45px] md:text-[70px] lg:text-[100px] font-bold text-center text-shadow-white">
                    COMING SOON
                </h1>
            </div>
        </div>


    );
}

export default CommingSoon;