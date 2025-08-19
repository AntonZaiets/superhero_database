import React from 'react';

export const TextareaField = ({ id, label, register, error, placeholder }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={id}>
      {label} *
    </label>
    <textarea
      id={id}
      {...register(id)}
      className={`form-input form-textarea ${error ? 'error' : ''}`}
      placeholder={placeholder}
    />
    {error && <p className="error-message">{error.message}</p>}
  </div>
);
