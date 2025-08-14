import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import '../../styles/searchbar.css'

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState('')
   const navigate = useNavigate()
   const token = useSelector((state) => state.auth.token)

   const handleSearch = async () => {
      if (!searchTerm.trim()) {
         return alert('검색어를 입력해주세요.')
      }

      try {
         const headers = { 'Content-Type': 'application/json' }
         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }

         const response = await fetch(`http://localhost:8000/api/item/search?keyword=${searchTerm}`, {
            method: 'GET',
            headers,
         })

         const data = await response.json()

         // 성공 여부와 관계없이 검색 페이지로 이동
         if (response.ok) {
            navigate('/search', {
               state: {
                  results: data.data || [],
                  searchTerm: searchTerm,
                  success: data.success,
               },
            })
         } else {
            // 오류가 발생해도 검색 페이지로 이동하되, 빈 결과로 처리
            navigate('/search', {
               state: {
                  results: [],
                  searchTerm: searchTerm,
                  success: false,
                  error: data.message || '검색에 실패했습니다.',
               },
            })
         }
      } catch (error) {
         console.error('Search error:', error)
         // 네트워크 오류 등이 발생해도 검색 페이지로 이동
         navigate('/search', {
            state: {
               results: [],
               searchTerm: searchTerm,
               success: false,
               error: '검색 중 오류가 발생했습니다.',
            },
         })
      }
   }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSearch()
      }
   }

   return (
      <div className="searchbar-wrapper">
         <div className="searchbar-container">
            <MenuIcon className="searchbar-menu-icon" />
            <div className="searchbar-search-box">
               <input type="text" placeholder="검색어를 입력해주세요." className="searchbar-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} />
               <SearchIcon className="searchbar-search-icon" onClick={handleSearch} />
            </div>
         </div>
      </div>
   )
}

export default SearchBar
