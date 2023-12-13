import React, { useState, useEffect } from 'react'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import { LoadingOutlined } from '@ant-design/icons'
import SearchPopup from './SearchPopup'
import { useRef } from 'react'
import { debounce } from '@/utils/'
import { useNavigate } from 'react-router-dom'

let timer

const handleSearch = debounce((value) => window.API.send('search', value), timer)

const Search = () => {
  const [val, setVal] = useState('')
  const [showLoading, setShowLoading] = useState(false)
  const [data, setData] = useState([])
  const [popupVisible, setPopupVisible] = useState(true)
  const popupRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  
  const onKeyDown = ({key}) => (key === 'Enter') && toSearch(val)
  const onSearchRes = (_, args) => {
    setData(args?.content || [])
    setShowLoading(false)
    setPopupVisible(true)
    console.log(args.content);
    document.removeEventListener('click', handleDocumentClick)
    document.addEventListener('click', handleDocumentClick)
  }
  const handleDocumentClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.targe) && !inputRef.current.contains(event.target)) {
      setPopupVisible(false)
      document.removeEventListener('click', handleDocumentClick)
    }
  }
  const onChange = ({ target: {value} }) => {
    setVal(value)
    if (!value) {
      setShowLoading(false)
      setData([])
      clearTimeout(timer)
      return
    }
    setShowLoading(true)
    handleSearch({keyword: value, type: 'song'})
  }
  const toSearch = (keyword) => {
    if (!keyword) return
    window.API.remove("search", onSearchRes)
    setPopupVisible(false)
    setShowLoading(false)
    setVal(keyword)
    navigate(`/SearchResult/${keyword}`)
  }
  
  useEffect(() => {
    window.API.on("search", onSearchRes)
    document.addEventListener('click', handleDocumentClick)
    return () => {
      window.API.remove("search", onSearchRes)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])


  return (
    <div className='relative flex items-center flex-1 h-full overflow-visible transition-all duration-300 bg-white focus-within:shadow-lg rounded-3xl hover:shadow-lg'>
      <SearchOutlined onClick={() => toSearch(val)} className='text-[20px] ml-4 mr-2' />
      <input
        ref={inputRef} type="text" value={val}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onClick={() => {
        setPopupVisible(true)
        setTimeout(() => {
          document.addEventListener('click', handleDocumentClick)
        }, 1)
      }} className='flex-1 h-full mr-4 font-medium tracking-wide' />
      { showLoading && <LoadingOutlined  className='text-[20px] ml-4 mr-4' /> }
      { data.length > 0 && <SearchPopup onClick={toSearch} innerRef={popupRef} data={data} popupVisible={popupVisible}  /> }
  </div>
  )
}

export default Search