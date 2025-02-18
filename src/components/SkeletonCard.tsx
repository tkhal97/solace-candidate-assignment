// src/components/SkeletonCard.tsx
const styles = {
  card: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse",
  cardBody: "p-6",
  contentRow: "flex items-start gap-4",
  avatarSkeleton: "flex-shrink-0 w-16 h-16 rounded-full bg-gray-200",
  contentColumn: "flex-1",
  titleSkeleton: "h-7 bg-gray-200 rounded-md mb-3 w-3/4",
  lineSkeleton1: "h-4 bg-gray-200 rounded-md mb-2 w-1/2",
  lineSkeleton2: "h-4 bg-gray-200 rounded-md mb-2 w-1/3",
  lineSkeleton3: "h-4 bg-gray-200 rounded-md w-2/5",
  specialtiesSection: "mt-4",
  specialtiesHeader: "h-4 bg-gray-200 rounded-md mb-2 w-1/4",
  specialtiesRow: "flex flex-wrap gap-2",
  specialtyBadge1: "h-6 bg-gray-200 rounded-full w-16",
  specialtyBadge2: "h-6 bg-gray-200 rounded-full w-20",
  specialtyBadge3: "h-6 bg-gray-200 rounded-full w-24",
  cardFooter: "bg-gray-50 px-6 py-3 flex justify-between items-center",
  footerLeft: "h-5 bg-gray-200 rounded-md w-24",
  footerRight: "h-8 bg-gray-200 rounded-md w-20",
};

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.contentRow}>
          {/* Avatar skeleton */}
          <div className={styles.avatarSkeleton}></div>

          {/* Basic info skeleton */}
          <div className={styles.contentColumn}>
            <div className={styles.titleSkeleton}></div>
            <div className={styles.lineSkeleton1}></div>
            <div className={styles.lineSkeleton2}></div>
            <div className={styles.lineSkeleton3}></div>
          </div>
        </div>

        {/* Specialties skeleton */}
        <div className={styles.specialtiesSection}>
          <div className={styles.specialtiesHeader}></div>
          <div className={styles.specialtiesRow}>
            <div className={styles.specialtyBadge1}></div>
            <div className={styles.specialtyBadge2}></div>
            <div className={styles.specialtyBadge3}></div>
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}></div>
        <div className={styles.footerRight}></div>
      </div>
    </div>
  );
}
