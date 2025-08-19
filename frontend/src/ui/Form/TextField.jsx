import React from 'react';

export const TextField = ({ id, label, register, error, placeholder }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={id}>
      {label} *
    </label>
    <input
      id={id}
      type="text"
      {...register(id)}
      className={`form-input ${error ? 'error' : ''}`}
      placeholder={placeholder}
    />
    {error && <p className="error-message">{error.message}</p>}
  </div>
);
