export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeText(text) {
  return String(text).trim();
}

export function containsKeyword(text, keyword) {
  if (!text) {
    return false;
  }

  return text.toLowerCase().includes(keyword.toLowerCase());
}

export function countKeywords(text, keywords) {
  if (!text) {
    return 0;
  }

  const lower = text.toLowerCase();
  return keywords.reduce((count, keyword) => {
    return count + (lower.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
}

export function randomChoice(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return list[Math.floor(Math.random() * list.length)];
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}
