import React from 'react';
import './Communities.css';
import Properties from './Properties';

/**
 * Communities View
 * Renders the unified Community Tiers & Properties hierarchy starting at Step 1 (Community Tiers).
 */
export default function Communities(props) {
  return <Properties {...props} initialStep={1} />;
}
