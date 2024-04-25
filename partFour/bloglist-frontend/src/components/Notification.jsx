const Notification = ({ messageObj }) => {
  if (messageObj.error) {
    return <div className="errorMessage">{messageObj.error}</div>;
  } else if (messageObj.message) {
    return <div className="successMessage">{messageObj.message}</div>;
  }
  return null;
};

export default Notification;
