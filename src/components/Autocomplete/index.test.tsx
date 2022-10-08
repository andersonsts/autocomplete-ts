import { fireEvent, render, screen } from "@testing-library/react"
import { Item } from "types"
import { MESSAGES } from "utils/contants"
import Autocomplete from "."
import { AutocompleteSearchProps } from "./types"

const doRequest = (_?: string) => {
  const makePromise = (result: Item[] = []) => new Promise<Item[]>(res => res(result))

  return {
    emptyResult: () => makePromise(),
    successResult: () => makePromise([{ id: 1, name: 'Ander' }]) 
  }
}

type RequestType = 'emptyResult' | 'successResult'

const setup = (requestType?: RequestType, props?: Partial<AutocompleteSearchProps>) => {
  const call = doRequest()[requestType || 'successResult']

  render(
    <Autocomplete 
      onGetSelectedValue={() => {}} 
      callData={call} 
      {...props}  
    />
  )

  const autocompleteInput = screen.getByPlaceholderText(MESSAGES.placeholder)
  const highlightedText = 'an'
  const restText = 'der'
  const [highlightedPart, anotherPart] = [new RegExp(highlightedText, 'i'), new RegExp(restText, 'i')]
  const input = screen.getByPlaceholderText(MESSAGES.placeholder) as HTMLInputElement

  function typeInInput(value = highlightedText) {
    fireEvent.change(input, { target: { value: value } })
  }
  function pressEnterKey() {
    fireEvent.keyDown(input, { code: 'Enter' })
  }

  return {
    autocompleteInput,
    typeInInput,
    highlightedPart,
    anotherPart,
    input,
    pressEnterKey
  }
}

describe('<Autocomplete />', () => {
  it('should render component correctly', () => {
    const { autocompleteInput } = setup()

    expect(autocompleteInput).toBeInTheDocument()
  })

  it('should change text of input correctly and show options with highlighted', async () => {
    const { typeInInput, highlightedPart, anotherPart } = setup()

    typeInInput()
    expect(await screen.findByText(highlightedPart)).toBeInTheDocument()
    expect(await screen.findByText(anotherPart)).toBeInTheDocument()
  })

  it('should show loading while request is going on', async () => {
    const { typeInInput } = setup()

    typeInInput()
    expect(await screen.findByText(MESSAGES.loadingMsg)).toBeInTheDocument()
  })

  it('should show empty state if text does not match with any results', async () => {
    const { typeInInput } = setup('emptyResult')
    
    typeInInput()
    expect(await screen.findByText(MESSAGES.emptyMsg)).toBeInTheDocument()
  })

  it('should call function to send information from autocomplete to upper tree level', () => {
    const onGetSelectedValueFn = jest.fn()

    const termValue = 'an'
    const { typeInInput, pressEnterKey } = setup('successResult', { onGetSelectedValue: onGetSelectedValueFn })

    typeInInput(termValue)
    pressEnterKey()
    expect(onGetSelectedValueFn).toHaveBeenCalledTimes(1)
    expect(onGetSelectedValueFn).toHaveBeenCalledWith(termValue)
  })

  it('should not call function to send information from autocomplete to upper tree level if input is empty', () => {
    const onGetSelectedValueFn = jest.fn()
    
    const { typeInInput, pressEnterKey } = setup('emptyResult', { onGetSelectedValue: onGetSelectedValueFn })

    typeInInput('')
    pressEnterKey()
    expect(onGetSelectedValueFn).toHaveBeenCalledTimes(0)
  })
})