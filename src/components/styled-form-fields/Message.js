import React from 'react'

//

import classNames from 'classnames'

const Message = ({ message, type, ...rest }) => {
  const classes = classNames('react-form-message', {
    [`react-form-message-${type}`]: type,
  })
  return (
    <small {...rest} className={classes}>
      {message}
    </small>
  )
}

export default Message
