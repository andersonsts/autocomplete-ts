import { Item } from "../types"
import { FAKE_RESPONSE_TIME_MS } from "../utils/contants"
import DATA from './data.json'

export const callDataExample = async (term: string): Promise<Item[]> => {
  return new Promise<Item[]>((resolve) => {
    setTimeout(() => {
      const filteredData = DATA.filter(item => item.name.toLowerCase().includes(term.toLowerCase()))
      resolve(filteredData)
    }, FAKE_RESPONSE_TIME_MS);
  })
}