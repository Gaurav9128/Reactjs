import React from "react";

import { FaWhatsapp } from "react-icons/fa";
import {
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
    FaXTwitter,
} from "react-icons/fa6";


const CommunitySection = () => {

    const socials = [
        {
            icon: <FaLinkedinIn />,
            name: "LinkedIn",
            link: "https://www.linkedin.com/company/reactrajasthan",
        },
        {
            icon: <FaInstagram />,
            name: "Instagram",
            link: "https://www.instagram.com/reactrajasthan",
        },
        {
            icon: <FaYoutube />,
            name: "YouTube",
            link: "https://www.youtube.com/@ReactRajasthan",
        },
        {
            icon: <FaWhatsapp />,
            name: "WhatsApp",
            link: "https://chat.whatsapp.com/KCMpUoo2AYfBAHTTYYIAAX",
        },
        {
            icon: <FaXTwitter />,
            name: "Twitter",
            link: "https://x.com/react_rajasthan",
        },
    ];


    return (

        <section className="
            py-16 md:py-24
            bg-gradient-to-br 
            from-blue-50 
            via-white 
            to-blue-100
            overflow-hidden
        ">


            <div className="max-w-7xl mx-auto px-5 md:px-6">


                {/* Heading */}

                <div className="text-center mb-14 md:mb-20">

                    <span className="
                        px-4 py-2
                        bg-blue-100
                        text-blue-700
                        rounded-full
                        text-xs md:text-sm
                        font-semibold
                    ">
                        Community Hub
                    </span>


                    <h2 className="
                        mt-5 md:mt-6
                        text-3xl
                        sm:text-4xl
                        md:text-5xl
                        font-bold
                        text-gray-900
                    ">
                        Join Our Community
                    </h2>


                    <p className="
                        mt-4
                        text-sm
                        sm:text-base
                        md:text-lg
                        text-gray-600
                        max-w-2xl
                        mx-auto
                    ">
                        Connect with developers, attend workshops, explore opportunities,
                        and stay updated with upcoming events.
                    </p>


                </div>



                {/* Desktop Hex Layout */}

                <div className="
                    hidden
                    md:flex
                    relative
                    justify-center
                    items-center
                    min-h-[500px]
                ">


                    {/* Center */}

                    <CenterCard />


                    <HexCard
                        {...socials[0]}
                        className="absolute top-0"
                    />


                    <HexCard
                        {...socials[1]}
                        className="
                        absolute
                        top-24
                        right-[15%]
                        "
                    />


                    <HexCard
                        {...socials[2]}
                        className="
                        absolute
                        bottom-12
                        right-[20%]
                        "
                    />


                    <HexCard
                        {...socials[3]}
                        className="
                        absolute
                        bottom-12
                        left-[20%]
                        "
                    />


                    <HexCard
                        {...socials[4]}
                        className="
                        absolute
                        top-24
                        left-[15%]
                        "
                    />

                </div>




                {/* Mobile Layout */}

                <div className="
                    md:hidden
                    flex
                    flex-col
                    items-center
                    gap-8
                ">


                    <CenterCard />


                    <div className="
                        grid
                        grid-cols-2
                        gap-5
                        w-full
                        max-w-sm
                        justify-items-center
                    ">

                        {
                            socials.map((item,index)=>(

                                <HexCard
                                    key={index}
                                    {...item}
                                />

                            ))
                        }

                    </div>


                </div>


            </div>


        </section>

    );
};





const CenterCard = ()=>{

    return (

        <div className="
            z-20
            w-60
            h-60
            md:w-64
            md:h-64
            rounded-full
            bg-white
            shadow-2xl
            border
            border-blue-100
            flex
            flex-col
            justify-center
            items-center
            text-center
            p-6
        ">


            <h3 className="
                text-xl
                md:text-2xl
                font-bold
                text-blue-700
            ">
                React Workshop
            </h3>


            <p className="
                text-gray-600
                mt-3
                text-sm
            ">
                Learn • Build • Network
            </p>


            <button className="
                mt-5
                px-5
                py-2.5
                bg-blue-600
                text-white
                rounded-full
                text-sm
                hover:bg-blue-700
                transition
            ">
                Join Now
            </button>


        </div>

    );

};





const HexCard = ({icon,title,link,className=""})=>{


    return (

        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >


            <div
                className="
                    group
                    w-28
                    h-28
                    md:w-32
                    md:h-32
                    bg-white
                    shadow-xl
                    hover:shadow-blue-300
                    hover:-translate-y-2
                    transition-all
                    duration-500
                    cursor-pointer
                "
                style={{
                    clipPath:
                    "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
                }}
            >


                <div className="
                    w-full
                    h-full
                    flex
                    flex-col
                    justify-center
                    items-center
                ">


                    <div className="
                        text-2xl
                        md:text-3xl
                        text-blue-600
                        group-hover:scale-125
                        transition
                        duration-300
                    ">
                        {icon}
                    </div>



                    <span className="
                        mt-2
                        text-xs
                        md:text-sm
                        font-semibold
                        text-gray-700
                    ">
                        {title}
                    </span>



                </div>


            </div>


        </a>

    );

};



export default CommunitySection;