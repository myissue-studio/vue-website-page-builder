import type { PageBuilderConfig } from '../../types'

export type TipTapHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const ALL_HEADING_LEVELS: TipTapHeadingLevel[] = [1, 2, 3, 4, 5, 6]
const HEADING_LEVELS_WITHOUT_H1: TipTapHeadingLevel[] = [2, 3, 4, 5, 6]

/** When true, TipTap toolbars hide H1 and the editor will not create level-1 headings. */
export function isTipTapH1Disabled(config?: PageBuilderConfig | null): boolean {
  return config?.userSettings?.disableH1 === true
}

export function getTipTapHeadingLevels(
  config?: PageBuilderConfig | null,
): TipTapHeadingLevel[] {
  return isTipTapH1Disabled(config) ? HEADING_LEVELS_WITHOUT_H1 : ALL_HEADING_LEVELS
}
