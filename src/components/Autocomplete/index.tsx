import { useRef, useState, ChangeEvent, KeyboardEvent, Fragment } from 'react'

import { applyRegex } from 'utils'
import { MESSAGES, STATUS } from 'utils/contants'
import { Item } from 'types'

import { AutocompleteSearchProps, ListProps, Message, NameProps } from './types'
import './styles.css'

export default function Autocomplete({ 
  debounceMs = 500,
  placeholder = MESSAGES.placeholder,
  loadingMsg = MESSAGES.loadingMsg,
  emptyMsg = MESSAGES.emptyMsg,
  callData,
  onGetSelectedValue,
}: AutocompleteSearchProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const [term, setTerm] = useState<string>('') 
  const [data, setData] = useState<Item[]>([])
  const [status, setStatus] = useState<string>(STATUS.idle)

  const showEmptyState = status === STATUS.empty 
  const showLoadingState = status === STATUS.loading 
  const showListOptions = !showLoadingState && !!data.length
  const inputIsFilled = !!term.trim()

  function handleSelectOption(item: Item) {
    setTerm(item.name)
    setData([])
    setStatus(STATUS.idle)
    onGetSelectedValue(item.name)
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter' && inputIsFilled) {
      onGetSelectedValue(term)
      setStatus(STATUS.idle)
      setData([])
    }
  }

  function handleClear() {
    setTerm('')
    setData([])
    setStatus(STATUS.idle)
    onGetSelectedValue('')
  }

  function handleChangeInputValue(e: ChangeEvent<HTMLInputElement>) {
    setStatus(STATUS.loading)
    setTerm(e.target.value)
    const currentTerm = e.target.value

    timeoutRef.current && clearTimeout(timeoutRef.current);

    if (!currentTerm.trim()) {
      handleClear()
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await callData(currentTerm)
        result.length ? setStatus(STATUS.idle) : setStatus(STATUS.empty)
        setData(result)
      } catch (error) {
        console.error(error)
      }
    }, debounceMs)
  }

  return (
    <div className="autocomplete-container">
      <input 
        type="text" 
        placeholder={placeholder} 
        value={term}
        onChange={handleChangeInputValue}
        onKeyDown={handleKeyPress}
      />
      {inputIsFilled && (
        <button aria-label='clear-text' className='clear-btn' onClick={handleClear}>
          ✖
        </button>
      )}
      <ul 
        className="list-options" 
      >
        {showLoadingState && <LoadingStatus text={loadingMsg} />}
        {showEmptyState && <EmptyStatus text={emptyMsg} />}
        {showListOptions && (
          <List
            data={data}
            onSelectItem={handleSelectOption}
            term={term}
          />
        )}
      </ul>
    </div>
  )
}

function LoadingStatus({ text }: Message) {
  return (
    <div className="loading-state">
      {text}
    </div>
  )
}

function EmptyStatus({ text }: Message) {
  return (
    <div className='empty-list'>
      {text}
    </div>
  )
}

function List({ term, data, onSelectItem }: ListProps) {
  function handleSelectOption(item: Item) {
    onSelectItem(item)
  }

  return (
    <>
      {data.map(item => (
        <li key={item.id}>
          <button 
            onClick={() => handleSelectOption(item)}
          >
            <Name 
              name={item.name} 
              highlight={term} 
            />
          </button>
        </li>
      ))}
    </>
  )
}

function Name({ name, highlight }: NameProps) {
  if (!highlight.trim()) return <span>{name}</span>;
  
  const regex = applyRegex(highlight) 
  const splittedName = name.split(regex);

  const getFormattedName = (letters: string[]) => {
    return letters.map((letter: string, i) => 
      <Fragment key={i}>
        {regex.test(letter) ? <b>{letter}</b> : letter}
      </Fragment>
    )
  }

  return <>{getFormattedName(splittedName)}</>
};