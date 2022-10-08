import { useRef, useState, ChangeEvent, KeyboardEvent } from 'react'

import './styles.css'

const STATUS = {
  idle: 'idle',
  loading: 'loading',
  empty: 'empty'
}

type AutocompleteSearchProps = {
  callData: (term: string) => Promise<string[]>,
  debounceMs?: number
  onGetSelectedValue: (selectedOption: string) => void,
  placeholder?: string,
  loadingMsg?: string,
  emptyMsg?: string
}

export default function Autocomplete({ 
  callData,
  debounceMs = 500,
  onGetSelectedValue,
  placeholder = 'Search...',
  loadingMsg = 'Loading...',
  emptyMsg = 'No results.'
}: AutocompleteSearchProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const [term, setTerm] = useState<string>('') 
  const [data, setData] = useState<string[]>([])
  const [status, setStatus] = useState<string>(STATUS.idle)

  function handleReset() {
    setTerm('')
    setData([])
    setStatus(STATUS.idle)
    onGetSelectedValue('')
  }

  function handleSelectOption(item: string) {
    setTerm(item)
    setData([])
    setStatus(STATUS.idle)
    onGetSelectedValue(item)
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter') {
      onGetSelectedValue(term)
      setStatus(STATUS.idle)
      setData([])
    }
  }

  function handleChangeInputValue(e: ChangeEvent<HTMLInputElement>) {
    setStatus(STATUS.loading)
    setTerm(e.target.value)
    const currentTerm = e.target.value

    timeoutRef.current && clearTimeout(timeoutRef.current);

    if (!currentTerm.trim()) {
      handleReset()
      return;
    }

    timeoutRef.current = setTimeout(() => {
      callData(currentTerm)
        .then(result => {
          if (!result.length) {
            setStatus(STATUS.empty)
          } else {
            setStatus(STATUS.idle)
          }
          setData(result)
        })
    }, debounceMs)
  }

  const showEmptyState = status === STATUS.empty 
  const showLoadingState = status === STATUS.loading 
  const showListOptions = !showLoadingState && !!data.length
  const inputIsFilled = !!term.trim()

  return (
    <div 
      className="autocomplete-container" 
    >
      <input 
        type="text" 
        placeholder={placeholder} 
        value={term}
        onChange={handleChangeInputValue}
        onKeyDown={handleKeyPress}
      />
      {inputIsFilled && (
        <button className='clear-btn' onClick={handleReset}>
          ✖
        </button>
      )}
      <ul 
        className="list-options" 
      >
        {showLoadingState && <LoadingStatus loadingMsg={loadingMsg} />}
        {showEmptyState && <EmptyStatus emptyMsg={emptyMsg} />}
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

function LoadingStatus({ loadingMsg }: { loadingMsg: string }) {
  return (
    <div className="loading-state">
      {loadingMsg}
    </div>
  )
}

function EmptyStatus({ emptyMsg }: { emptyMsg: string }) {
  return (
    <div className='empty-list'>
      {emptyMsg}
    </div>
  )
}

type ListProps = {
  data: string[]
  onSelectItem: (item: string) => void
  term: string;
}

function List({ data, onSelectItem, term }: ListProps) {
  function handleSelectOption(item: string) {
    onSelectItem(item)
  }

  return (
    <>
      {data.map(item => (
        <li key={item}>
          <button 
            onClick={() => handleSelectOption(item)}
          >
            <Name name={item} highlight={term} />
          </button>
        </li>
      ))}
    </>
  )
}

type NameProps = {
  name: string
  highlight: string;
}

function Name({ name, highlight }: NameProps) {
  if (!highlight.trim()) return <span>{name}</span>;

  const escapeRegExp = (str = "") =>
    str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
  const parts = name.split(regex);

  return (
    <span>
      {parts
        .filter((part: string) => part)
        .map((part: string, i) =>
          regex.test(part) ? (
            <b key={i}>{part}</b>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </span>
  );
};