const Notification = ({ notify }) => {
  if (!notify.message) {
    return null;
  } else if (notify.error) {
    return <div className="error-message">{notify.message}</div>;
  }
  return <div className="success-message">{notify.message}</div>;
};

export default Notification;
