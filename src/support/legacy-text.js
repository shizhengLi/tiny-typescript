export function formatLegacyTitle(title) {
  return title.trim().replace(/\s+/g, " ").toUpperCase();
}

export function makeSlug(input) {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}
