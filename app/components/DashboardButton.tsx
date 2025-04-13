import React from "react";
import styles from "./DashboardButton.module.scss";
import { FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";

type DashboardButtonProps = {
  label?: string;
};

const DashboardButton: React.FC<DashboardButtonProps> = ({ label = "Open Dashboard" }) => {
  return (
    <Link href="/EditVideo/Dashboard" className={styles.dashboardButton}>
      <FaTachometerAlt />
      {label}
    </Link>
  );
};

export default DashboardButton;
