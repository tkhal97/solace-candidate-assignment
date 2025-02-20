"use client";

// src/components/MobileMenu.tsx
import { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
}

const styles = {
  mobileMenuButton: "block md:hidden text-gray-700 hover:text-gray-900",
  mobileMenu: "fixed inset-0 bg-white z-50 flex flex-col md:hidden",
  mobileMenuHeader: "flex items-center justify-between p-4 border-b",
  mobileMenuClose: "text-gray-700 hover:text-gray-900",
  mobileNavigation: "flex flex-col p-6 space-y-6",
  mobileNavLink: "text-lg text-gray-700 hover:text-blue-600 transition-colors",
  mobileButtons: "flex flex-col space-y-4 p-6 mt-auto border-t",
  mobileLoginButton: "w-full py-3 text-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors",
  mobileCTAButton: "w-full py-3 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm",
  logoContainer: "flex items-center gap-2",
  logoImage: "h-10 w-auto",
};

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleMenu}
        aria-label="Open menu"
      >
        <MenuIcon size={24} />
      </button>

      {isOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuHeader}>
            <div className={styles.logoContainer}>
              <Image
                src="/solaceLogo.png"
                alt="Solace Logo"
                width={40} 
                height={40}
                className={styles.logoImage}
              />
            </div>
            <button 
              className={styles.mobileMenuClose}
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <XIcon size={24} />
            </button>
          </div>

          <nav className={styles.mobileNavigation}>
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className={styles.mobileNavLink}
                onClick={toggleMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.mobileButtons}>
            <button className={styles.mobileLoginButton}>
              Log in
            </button>
            <button className={styles.mobileCTAButton}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}