// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace | Find Your Perfect Healthcare Advocate",
  description:
    "Connect with healthcare advocates matched to your specific needs and preferences.",
};

const styles = {
  header: "bg-white border-b border-gray-100",
  headerContainer: "container mx-auto px-4 py-4 max-w-7xl",
  headerContent: "flex items-center justify-between",
  logoContainer: "flex items-center gap-2",
  logoImage: "h-10 w-auto",
  navigation: "hidden md:flex space-x-8",
  navLink: "text-gray-600 hover:text-blue-600 transition-colors",
  headerButtons: "flex items-center gap-4",
  loginButton:
    "hidden md:block text-gray-700 hover:text-gray-900 transition-colors",
  ctaButton:
    "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm",
  footer: "bg-gray-900 text-gray-300",
  footerContainer: "container mx-auto px-4 py-12 max-w-7xl",
  footerGrid: "grid grid-cols-1 md:grid-cols-4 gap-8",
  footerLogoContainer: "mb-4",
  footerDescription: "text-gray-400 mb-4",
  footerHeading: "text-white font-semibold mb-4",
  footerLinkList: "space-y-2",
  footerLink: "text-gray-400 hover:text-white transition-colors",
  footerBottom: "pt-8 mt-8 border-t border-gray-800 text-sm text-gray-400",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <div className={styles.logoContainer}>
                <Image
                  src="/solaceLogo.png"
                  alt="Solace Logo"
                  width={40}
                  height={40}
                  className={styles.logoImage}
                />
              </div>

              <nav className={styles.navigation}>
                <a href="#" className={styles.navLink}>
                  How it Works
                </a>
                <a href="#" className={styles.navLink}>
                  For Advocates
                </a>
                <a href="#" className={styles.navLink}>
                  Resources
                </a>
                <a href="#" className={styles.navLink}>
                  FAQ
                </a>
              </nav>

              <div className={styles.headerButtons}>
                <button className={styles.loginButton}>Log in</button>
                <button className={styles.ctaButton}>Get Started</button>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              <div>
                <div className={styles.footerLogoContainer}>
                  <Image
                    src="/solaceLogo.png"
                    alt="Solace Logo"
                    width={40}
                    height={40}
                    className={styles.logoImage}
                  />
                </div>
                <p className={styles.footerDescription}>
                  Connecting patients with the perfect healthcare advocates to
                  navigate their care journey.
                </p>
              </div>

              <div>
                <h3 className={styles.footerHeading}>Company</h3>
                <ul className={styles.footerLinkList}>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={styles.footerHeading}>Resources</h3>
                <ul className={styles.footerLinkList}>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Patient Stories
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={styles.footerHeading}>Legal</h3>
                <ul className={styles.footerLinkList}>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className={styles.footerLink}>
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.footerBottom}>
              <p>
                © {new Date().getFullYear()} Find Solace, Inc. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
