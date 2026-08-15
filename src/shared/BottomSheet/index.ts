// BottomSheet экспортируется по умолчанию, а `export *` default не
// пробрасывает — отсюда именованный реэкспорт: без него слайс приходится
// импортировать вглубь, в обход public API.
export { default as BottomSheet } from './ui/BottomSheet'
export * from './ui/BottomSheet'
