const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toISOString().split("T")[0];
};

export default formatTimestamp;
