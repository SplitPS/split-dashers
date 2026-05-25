
window._apiBase = (function () {
  const h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return ''; 
  return 'https://split.ps.fhgdps.com'; 
}());
