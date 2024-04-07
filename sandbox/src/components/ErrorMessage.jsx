const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="errorMessage">{message}</div>;
};

export default ErrorMessage;
