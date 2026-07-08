const LETTER_COLORS = [
  "bg-teal-600 text-white",
  "bg-emerald-600 text-white",
  "bg-sky-600 text-white",
  "bg-indigo-600 text-white",
  "bg-violet-600 text-white",
  "bg-fuchsia-600 text-white",
  "bg-rose-600 text-white",
  "bg-amber-600 text-white",
  "bg-lime-700 text-white",
  "bg-cyan-700 text-white",
];

export function getAvatarLetter(name, email) {
  const trimmedName = name?.trim();
  if (trimmedName) return trimmedName[0].toUpperCase();

  const trimmedEmail = email?.trim();
  if (trimmedEmail) return trimmedEmail[0].toUpperCase();

  return "?";
}

export function getAvatarColorClass(letter) {
  const code = letter?.charCodeAt(0) || 0;
  return LETTER_COLORS[code % LETTER_COLORS.length];
}
