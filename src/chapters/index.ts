import { chapter01 } from "./01-why-typescript";
import { chapter02 } from "./02-primitives-and-inference";
import { chapter03 } from "./03-functions-objects-interfaces";
import { chapter04 } from "./04-arrays-tuples-enums-literals";
import { chapter05 } from "./05-unions-intersections-aliases";
import { chapter06 } from "./06-narrowing-and-control-flow";
import { chapter07 } from "./07-generics";
import { chapter08 } from "./08-keyof-typeof-indexed-access";
import { chapter09 } from "./09-mapped-types-and-utilities";
import { chapter10 } from "./10-conditional-types-and-infer";
import { chapter11 } from "./11-classes-and-oo-modeling";
import { chapter12 } from "./12-modules-declarations-and-third-party-libs";
import { chapter13 } from "./13-tsconfig-and-engineering";
import { chapter14 } from "./14-type-safe-api-design";
import type { Chapter, ChapterId } from "../shared/chapter";

export const chapters: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
  chapter11,
  chapter12,
  chapter13,
  chapter14
];

export const chapterMap = new Map<ChapterId, Chapter>(
  chapters.map((chapter) => [chapter.id, chapter])
);
