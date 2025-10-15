// Report Button Component
import React from 'react';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import './ReportButton.css';

interface ReportButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  onClick,
  label = 'Generate Report',
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  return (
    <button
      className={`report-btn report-btn-${variant} report-btn-${size}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {icon || <FaFilePdf />}
      <span>{label}</span>
      <FaDownload className="download-icon" />
    </button>
  );
};

export default ReportButton;
