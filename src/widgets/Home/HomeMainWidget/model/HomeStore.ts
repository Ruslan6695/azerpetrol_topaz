import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IHomeStore } from '../config/interfaces/IHomeStore'

const store = create<IHomeStore>()(
    immer((set) => ({
        data: undefined,
        texts: {},

        setData(data) {
            set((state) => {
                state.data = data
                data?.texts.forEach((text) => {
                    const splittedSmallTexts = text.small_text.split('**')
                    const splittedBigTexts = text.big_text.split('**')

                    const smallText = `${splittedSmallTexts[0]}\n${splittedSmallTexts[1]}`
                    const bigText = `${splittedBigTexts[0]}\n${splittedBigTexts[1]}`
                    state.texts = {
                        ...state.texts,
                        [text.link]: {
                            small_text: text.small_text.includes('**')
                                ? smallText
                                : text.small_text,
                            big_text: text.big_text.includes('**')
                                ? bigText
                                : text.big_text,
                        },
                    }
                })
            })
        },
    }))
)

export const HomeStore = createSelectorHooks(store)
