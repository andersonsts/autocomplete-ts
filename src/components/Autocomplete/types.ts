import { Item } from "types"

export type AutocompleteSearchProps = {
  debounceMs?: number
  placeholder?: string,
  loadingMsg?: string,
  emptyMsg?: string,
  callData: (term: string) => Promise<Item[]>,
  onGetSelectedValue: (selectedOption: string) => void,
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