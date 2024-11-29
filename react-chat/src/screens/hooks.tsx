import {useRef, useState} from 'react'

// Да надо было сделать через компонент который в props принимает callback который он вызывает когда setFilter
// Ну я сначала сделал потом подумал что весь родительский компонент использующий такой хук будет ререндериться
export function useFilter(): [string, React.JSX.Element] {
  const filterInputRef = useRef<HTMLInputElement>(null)

  const defaultFilterString = 'user10'

  const [filterString, setFilterString] = useState(defaultFilterString)

  const setFilter = () => setFilterString(filterInputRef.current ? filterInputRef.current.value : defaultFilterString)
  return [filterString,<>
    <input type="text" placeholder={`filter (default: ${defaultFilterString})`} ref={filterInputRef}
      onKeyDown={(e) => {
        if (e.key === 'Enter') setFilter()
      }}
    />
    <button onClick={setFilter}>
      Filter
    </button>
  </>]

}