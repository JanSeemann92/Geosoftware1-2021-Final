export const TruncateText = ({ text = "", maxLength = 120 }) => {
  const length = text.length;

  if (!text) {
    return <>-</>;
  }

  if (length > maxLength) {
    return <>{text.slice(0, maxLength)}...</>;
  }

  return <>{text}</>;
};
