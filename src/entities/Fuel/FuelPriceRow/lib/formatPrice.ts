// Цена за литр в формате макета: два знака после запятой, разделитель — запятая
// (dc.html:920–925 — «52,40»). divideNumber из shared здесь не подходит:
// он разбивает разряды, а цена за литр всегда двузначная.
export const formatPrice = (price: number) => price.toFixed(2).replace('.', ',')
