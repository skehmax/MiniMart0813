import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState('')
   const navigate = useNavigate()
   const token = useSelector((state) => state.auth.token)

   const handleSearch = async () => {
      // ... 기존 검색 로직은 동일 ...
      if (!searchTerm.trim()) {
         return alert('검색어를 입력해주세요.')
      }
      try {
         const headers = { 'Content-Type': 'application/json' }
         if (token) {
            headers['Authorization'] = `Bearer ${token}`
         }
         const response = await fetch(`http://localhost:8000/api/item/search?keyword=${searchTerm}`, { method: 'GET', headers })
         const data = await response.json()
         if (response.ok && data.success) {
            navigate('/search', { state: { results: data.data, searchTerm: searchTerm } })
         } else {
            alert(data.message || '검색에 실패했습니다.')
         }
      } catch (error) {
         alert('검색 중 오류가 발생했습니다.')
      }
   }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSearch()
      }
   }

   // ✅ 스타일 객체 수정
   const styles = {
      // ✅ 전체를 감싸는 노란색 배경 추가
      wrapper: {
         backgroundColor: '#EBD96B',
         padding: '2rem 0', // 위아래 여백
         width: '100%',
      },
      // ✅ 검색창과 메뉴 아이콘을 담는 중앙 컨테이너
      container: {
         display: 'flex',
         alignItems: 'center',
         gap: '1.5rem',
         maxWidth: '1200px', // 최대 가로 너비
         margin: '0 auto', // 중앙 정렬
         padding: '0 2rem',
         boxSizing: 'border-box',
      },
      searchBox: {
         display: 'flex',
         alignItems: 'center',
         flexGrow: 1, // 남은 공간을 모두 차지
         backgroundColor: 'white',
         borderRadius: '8px',
         padding: '0.8rem 1.5rem',
         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      input: {
         border: 'none',
         outline: 'none',
         flexGrow: 1,
         marginLeft: '0.5rem',
         fontSize: '1rem',
      },
   }

   return (
      <div style={styles.wrapper}>
         <div style={styles.container}>
            {/* ✅ MINIMART 로고 제거 */}
            <MenuIcon style={{ cursor: 'pointer' }} />
            <div style={styles.searchBox}>
               <input type="text" placeholder="검색어를 입력해주세요." style={styles.input} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} />
               <SearchIcon style={{ color: '#555', cursor: 'pointer' }} onClick={handleSearch} />
            </div>
         </div>
      </div>
   )
}

export default SearchBar
