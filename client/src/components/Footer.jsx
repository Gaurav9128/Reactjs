import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaHome,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "#",
      className: "text-[#0A66C2]",
    },
    {
      icon: FaGithub,
      label: "GitHub",
      href: "#",
      className: "text-gray-900",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "#",
      className: "text-[#E4405F]",
    },
    {
      icon: FaYoutube,
      label: "YouTube",
      href: "#",
      className: "text-[#FF0000]",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: "#",
      className: "text-[#25D366]",
    },
  ];

  const exploreLinks = [
    {
      label: "Home",
      to: "/",
      icon: FaHome,
    },
    {
      label: "Venue",
      to: "/venue",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Speakers",
      to: "/speakers",
      icon: FaUsers,
    },
    {
      label: "Organizers",
      to: "/organizers",
      icon: FaUsers,
    },
    {
      label: "Sponsors",
      to: "/sponsors",
      icon: FaTrophy,
    },
    {
      label: "Workshop Schedule",
      to: "/workshop-schedule",
      icon: FaCalendarAlt,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50 px-4 py-8 sm:px-6">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(30,64,175,0.08)]">

        {/* ===================================================
            MAIN FOOTER CONTENT
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr_1.1fr]">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="px-6 py-7 sm:px-8 lg:px-9">

            <Link
              to="/"
              className="inline-block transition duration-300 hover:scale-[1.01]"
            >
              <img
                src={logo}
                alt="Poornima University"
                className="h-[72px] w-auto object-contain sm:h-[82px]"
              />
            </Link>

            <p className="mt-3 max-w-[320px] text-sm leading-6 text-gray-500">
              Rajasthan's largest React community helping developers
              learn, connect and grow together.
            </p>

            {/* Social Icons */}

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(
                ({ icon: SocialIcon, label, href, className }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <SocialIcon
                      size={17}
                      className={`${className} transition-transform duration-300 group-hover:scale-110`}
                    />
                  </a>
                )
              )}
            </div>
          </div>

          {/* =================================================
              EXPLORE
          ================================================= */}

          <div className="border-t border-gray-100 px-6 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-9">

            <h3 className="mb-5 text-lg font-bold text-[#0b1935]">
              Explore
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">

              {exploreLinks.map(
                ({ label, to, icon: LinkIcon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group flex items-center gap-3 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-blue-600"
                  >
                    <LinkIcon
                      size={17}
                      className="shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-blue-600"
                    />

                    <span>{label}</span>
                  </Link>
                )
              )}

            </div>
          </div>

          {/* =================================================
              STAY UPDATED
          ================================================= */}

          <div className="border-t border-gray-100 px-6 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-9">

            <h3 className="text-lg font-bold text-[#0b1935]">
              Stay Updated
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Get updates about workshops and events.
            </p>

            {/* Newsletter */}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50"
            >
              <input
                type="email"
                placeholder="Enter Email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Join
              </button>
            </form>

          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="border-t border-gray-100 px-6 py-4 sm:px-8 lg:px-9">

          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

            {/* Copyright */}

            <p className="text-sm text-gray-500">
              © 2026 Poornima University. All rights reserved.
            </p>

            {/* Built With */}

            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
              <span>Built with</span>

              <FaHeart
                className="text-blue-600"
                size={13}
              />

              <span>for developers</span>
            </div>

            {/* Motto */}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Learn</span>
              <span className="text-blue-600">•</span>
              <span>Connect</span>
              <span className="text-blue-600">•</span>
              <span>Grow</span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;