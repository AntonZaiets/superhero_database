import React from 'react';
import { Loader as LucideLoader } from 'lucide-react';

export const Loader = ({ size = 16, className = '' }) => (
  <LucideLoader size={size} className={`animate-spin ${className}`} />
);
