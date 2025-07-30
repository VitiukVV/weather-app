import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';

import React from 'react';

import styles from './BackButton.module.scss';

interface BackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, children = 'Back' }) => {
  return (
    <Button
      startIcon={<ArrowBack />}
      onClick={onClick}
      className={styles['back-button']}
      variant="outlined"
    >
      {children}
    </Button>
  );
};

export default BackButton;
