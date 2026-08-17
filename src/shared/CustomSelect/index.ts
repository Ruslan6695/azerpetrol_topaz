// Сам CustomSelect вытеснен GlassSelect и удалён. От слайса остались шит
// с колесом-пикером, хук выбора и тип опции — их использует GlassSelect.
export * from './ui/CustomSelectBottomSheet'
export * from './lib/hooks/useSelect'
export type { ISelectOption } from './config/interfaces/ISelectOption'
