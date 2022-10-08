import { Item } from "../../types"

export type AutocompleteSearchProps = {
  callData: (term: string) => Promise<Item[]>,
  debounceMs?: number
  onGetSelectedValue: (selectedOption: string) => void,
  placeholder?: string,
  loadingMsg?: string,
  emptyMsg?: string
}

export type ListProps = {
  data: Item[]
  onSelectItem: (item: Item) => void
  term: string;
}

export type NameProps = {
  name: string
  highlight: string;
}

export type Message = {
  text: string
}