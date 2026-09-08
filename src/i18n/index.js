import { ar } from "./ar";
import { en } from "./en";

export const dictionaries = { ar, en };
export const DEFAULT_LANGUAGE = "ar";
export const LANGUAGE_STORAGE_KEY = "handemade-lang";

export function lookup(dict, key) {
  return key.split(".").reduce((acc, part) => (acc == null ? acc : acc[part]), dict);
}

export function interpolate(template, vars = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    vars[name] == null ? "" : String(vars[name])
  );
}

export function translate(dict, key, vars) {
  const value = lookup(dict, key);
  if (typeof value !== "string") return key;
  return interpolate(value, vars);
}
