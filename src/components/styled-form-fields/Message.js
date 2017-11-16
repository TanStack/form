/* ---------- Imports ---------- */

// Import React
import React from 'react';

const Message = ({ message, type, ...rest }) => {
  return (
    <small {...rest} className={`react-form-message react-form-message-${type}`}>{message}</small>
  );
};

export default Message;
