function backendLink() {
  const isLocal =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  const link = isLocal
    ? "http://localhost:5542"
    : process.env.REACT_APP_BACKEND_REMOTE_LINK;

  return link;
}

export default backendLink;
