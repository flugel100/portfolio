import { id } from "./id";
import { en } from "./en";
import type { Lang } from "../site";

export type { Dict } from "./id";

const dictionaries = { id, en } as const;

export const getDict = (lang: Lang) => dictionaries[lang];
