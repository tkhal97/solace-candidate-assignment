// src/components/AdvocateCard.tsx
import { useState, useEffect, useRef } from "react";
import {
  PhoneIcon,
  MapPinIcon,
  AwardIcon,
  BadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Advocate } from "@/types/advocate";

interface AdvocateCardProps {
  advocate: Advocate;
}

const styles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col",
  cardBody: "p-6 flex-1",
  contentRow: "flex items-start gap-4",
  avatar: "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold",
  infoContainer: "flex-1 min-w-0",
  name: "text-xl font-semibold text-gray-900 truncate",
  infoRow: "text-gray-500 mb-1 flex items-center gap-1",
  infoRowLast: "text-gray-500 flex items-center gap-1",
  infoIcon: "inline",
  specialtiesSection: "mt-4",
  specialtiesHeading: "text-sm font-medium text-gray-700 mb-2",
  specialtiesList: "flex flex-wrap gap-2",
  specialtiesCollapsed: "flex flex-wrap gap-2",
  specialtiesExpanded: "flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1",
  specialtyTag: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700",
  moreTag: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700",
  expandedContent: "mt-6 pt-4 border-t border-gray-100",
  phoneContainer: "flex items-center gap-2 mt-4",
  phoneIcon: "text-gray-500",
  phoneLink: "text-blue-600 hover:text-blue-800 transition-colors",
  spacer: "flex-grow mt-auto",
  footer: "bg-gray-50 px-6 py-3 flex justify-between items-center mt-auto",
  toggleButton: "text-sm text-gray-600 flex items-center gap-1 hover:text-gray-900 transition-colors",
  contactButton: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors",
  visiblyHidden: "invisible",
};

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(true);
  const specialtiesContainerRef = useRef<HTMLDivElement>(null);

  const formatPhoneNumber = (phoneNumber: number) => {
    const phoneStr = phoneNumber.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneNumber;
  };

  useEffect(() => {
    if (advocate.specialties.length > 3) {
      setNeedsExpansion(true);
      return;
    }
    setNeedsExpansion(false);
    setIsExpanded(true);
  }, [advocate.specialties.length]);

  const initials = `${advocate.firstName[0]}${advocate.lastName[0]}`;

  const getColorForName = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-pink-100 text-pink-800",
      "bg-teal-100 text-teal-800",
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarColor = getColorForName(`${advocate.firstName} ${advocate.lastName}`);
  const hasMultipleSpecialties = advocate.specialties.length > 3;

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.contentRow}>
          <div className={`${styles.avatar} ${avatarColor}`}>{initials}</div>
          <div className={styles.infoContainer}>
            <h2 className={styles.name}>
              {advocate.firstName} {advocate.lastName}
            </h2>
            <div className={styles.infoRow}>
              <div className="inline-flex items-center gap-1">
                <BadgeIcon size={14} className={styles.infoIcon} />
                <span>{advocate.degree}</span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className="inline-flex items-center gap-1">
                <MapPinIcon size={14} className={styles.infoIcon} />
                <span>{advocate.city}</span>
              </div>
            </div>
            <div className={styles.infoRowLast}>
              <div className="inline-flex items-center gap-1">
                <AwardIcon size={14} className={styles.infoIcon} />
                <span>
                  {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? "year" : "years"} experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className={styles.specialtiesSection} ref={specialtiesContainerRef}>
          <h3 className={styles.specialtiesHeading}>Specialties</h3>
          <div className={isExpanded && hasMultipleSpecialties ? styles.specialtiesExpanded : styles.specialtiesCollapsed}>
            {advocate.specialties
              .slice(0, isExpanded ? undefined : 3)
              .map((specialty, index) => (
                <span key={index} className={styles.specialtyTag}>
                  {specialty}
                </span>
              ))}
            {!isExpanded && advocate.specialties.length > 3 && (
              <span className={styles.moreTag}>
                +{advocate.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* phone number - shown always when no expansion needed */}
        {(isExpanded || !needsExpansion) && (
          <div className={styles.phoneContainer}>
            <PhoneIcon size={16} className={styles.phoneIcon} />
            <a href={`tel:${advocate.phoneNumber}`} className={styles.phoneLink}>
              {formatPhoneNumber(advocate.phoneNumber)}
            </a>
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className={styles.spacer}></div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${styles.toggleButton} ${!needsExpansion ? styles.visiblyHidden : ''}`}
          aria-hidden={!needsExpansion}
          tabIndex={needsExpansion ? 0 : -1}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon size={16} />
              Show less
            </>
          ) : (
            <>
              <ChevronDownIcon size={16} />
              Show more
            </>
          )}
        </button>

        <button className={styles.contactButton}>Contact</button>
      </div>
    </div>
  );
}
