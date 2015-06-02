export function log (message) {
  console.log(`AE:INFO ----> ${message}`);
};

export function debug (message) {
  console.warn(`AE:WARN ----> ${message}`);
};

export function error (message) {
  console.error(`AE:ERROR ---> ${message}`);
};
