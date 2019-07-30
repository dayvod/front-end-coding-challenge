export default function compareStrings(a, b) {
  if (a.toUpperCase().charCodeAt() > b.toUpperCase().charCodeAt()) {
    return 1;
  }

  if (a.toUpperCase().charCodeAt() < b.toUpperCase().charCodeAt()) {
    return -1;
  }

  return 0;
}
