import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  return (
    <div className={styles["tooltip"]}>
      {children}
      <span className={styles["tooltip-text"]}>{text}</span>
    </div>
  );
};

export default Tooltip;
