'use client';

import Image from "next/image";

const ExploreBtn = () => {
    // Use an anchor tag as the main element and style it like a button.
    return (
        <a href="#events" id="explore-btn" className="mt-7 mx-auto">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} className="flex-shrink-0" />
        </a>
    );
}

export default ExploreBtn;