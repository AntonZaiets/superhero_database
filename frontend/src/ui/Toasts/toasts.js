import { toast } from 'react-toastify';
import { toastMessages, toastOptions } from './config';

export const showToast = (category, messageKey, type = 'success', optionKey = 'default') => {
  const message = toastMessages[category]?.[messageKey] || messageKey;
  const options = toastOptions[optionKey];

  toast[type](message, options);
};
