// Шаги сценария заправки. Это подэкраны одного роута (вкладка «Топливо»),
// поэтому не ESCREENS: процесс переключает их локальным состоянием.
// Живёт в shared, потому что тип нужен и процессу, и виджетам шагов.
export type TFuelRoad = 'main' | 'selectAzsAndColumn' | 'selectTrkType' | 'selectLiters'
