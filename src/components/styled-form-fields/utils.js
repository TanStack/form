

function getMessageType( error, warning, success ) {
  let type = null;
  if ( error ) type = 'error';
  if ( !error && warning ) type = 'warning';
  if ( !error && !warning && success ) type = 'success';
  return type;
}

function getMessage( error, warning, success ) {
  let message = '';
  if ( error ) message = error;
  if ( !error && warning ) message = warning;
  if ( !error && !warning && success ) message = success;
  return message;
}

function shouldShowValidation({
  touchValidation,
  valueValidation,
  touched,
  value
}) {
  if ( touchValidation && !touched ) {
    return false;
  }
  if ( valueValidation && !value ) {
    return false;
  }
  return true;
}

export default {
  getMessage,
  getMessageType,
  shouldShowValidation
};
