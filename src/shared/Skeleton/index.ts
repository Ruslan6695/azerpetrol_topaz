// Skeletons экспортирует компонент по умолчанию, а `export *` default не
// пробрасывает — отсюда именованный реэкспорт: без него слайс приходится
// импортировать вглубь, в обход public API.
export { default as Skeleton } from './ui/Skeletons'
export * from './ui/Skeletons'
