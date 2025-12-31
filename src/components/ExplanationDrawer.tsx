import React from "react";
import styles from "./ExplanationDrawer.module.css";

export interface ExplanationDrawerProps {
  open: boolean;
  onClose: () => void;
  violatedPrinciple?: string;
  betterAlternative?: string;
  tacticalTags?: string[];
  whyMatters?: string;
}

const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({
  open,
  onClose,
  violatedPrinciple,
  betterAlternative,
  tacticalTags,
  whyMatters,
}) => {
  return (
    <div className={`${styles.drawer} ${open ? styles.open : ""}`}
         role="dialog"
         aria-modal="true">
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      <div className={styles.content}>
        {violatedPrinciple && (
          <section>
            <h3>Violated Principle</h3>
            <p>{violatedPrinciple}</p>
          </section>
        )}
        {betterAlternative && (
          <section>
            <h3>Better Alternative</h3>
            <p>{betterAlternative}</p>
          </section>
        )}
        {tacticalTags && tacticalTags.length > 0 && (
          <section>
            <h3>Tactical Tags</h3>
            <ul>
              {tacticalTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </section>
        )}
        {whyMatters && (
          <section>
            <h3>Why This Matters</h3>
            <p>{whyMatters}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExplanationDrawer;
