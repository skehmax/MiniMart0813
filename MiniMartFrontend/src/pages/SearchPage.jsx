import { useState, useEffect, useCallback } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/SearchPage.css'

const searchItemsAPI = async (params) => {
   try {
      const response = await axios.get('/api/item/search', { params })
      return response.data?.data
   } catch (error) {
      console.error('Error searching items:', error)
      return { items: [], totalItems: 0 }
   }
}

const addToCartAPI = async (itemData) => {
   try {
      await axios.post('/api/cart', itemData, { withCredentials: true })
      return true
   } catch (error) {
      console.error('Error adding to cart:', error)
      return false
   }
}

const SearchPage = () => {
   const location = useLocation()
   const navigate = useNavigate()
   const [results, setResults] = useState({ items: [], totalItems: 0 })
   const [searchTerm, setSearchTerm] = useState('')
   const [tags, setTags] = useState([])
   const [priceRange, setPriceRange] = useState([0, 5000000])
   const [isLoading, setIsLoading] = useState(false)

   useEffect(() => {
      const initialSearchTerm = location.state?.searchTerm || new URLSearchParams(location.search).get('keyword') || ''
      setSearchTerm(initialSearchTerm)
      const initialTags = initialSearchTerm.split(' ').filter((tag) => tag.trim() !== '')
      setTags(initialTags)
   }, [location.state, location.search])

   const runSearch = useCallback(
      async (currentTags, currentPrice) => {
         setIsLoading(true)
         const keyword = currentTags.join(' ')
         const params = {
            keyword,
            minPrice: currentPrice[0],
            maxPrice: currentPrice[1],
         }
         navigate(`/search?keyword=${encodeURIComponent(keyword)}`, { replace: true, state: { searchTerm: keyword } })
         const searchResult = await searchItemsAPI(params)

         setResults(searchResult || { items: [], totalItems: 0 })

         setIsLoading(false)
      },
      [navigate]
   )

   useEffect(() => {
      const handler = setTimeout(() => {
         if (tags.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000000) {
            runSearch(tags, priceRange)
         }
      }, 500)
      return () => clearTimeout(handler)
   }, [tags, priceRange, runSearch])

   const handleRemoveTag = (tagToRemove) => {
      setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
   }

   const handlePriceChange = (index, value) => {
      const newPriceRange = [...priceRange]
      newPriceRange[index] = Number(value)
      if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
         newPriceRange[1] = newPriceRange[0]
      }
      if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
         newPriceRange[0] = newPriceRange[1]
      }
      setPriceRange(newPriceRange)
   }

   const handleAddToCart = async (item) => {
      const defaultOption = item.ItemOptions && item.ItemOptions.length > 0 ? item.ItemOptions[0] : null

      const success = await addToCartAPI({
         itemId: item.id,
         itemOptionId: defaultOption ? defaultOption.id : null,
         count: 1,
      })

      if (success) {
         if (window.confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
            navigate('/cart')
         }
      } else {
         alert('장바구니 담기에 실패했습니다.')
      }
   }

   return (
      <div className="pageContainer">
         <aside className="filterSection">
            <div className="filterBox">
               <h3 className="filterTitle">검색 필터</h3>
               <div className="tagContainer">
                  {tags.map((tag, index) => (
                     <span key={index} className="filterTag">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>×</button>
                     </span>
                  ))}
               </div>

               <div className="priceRangeContainer">
                  <h3 className="filterTitle" style={{ marginTop: '2rem' }}>
                     가격 설정
                  </h3>
                  <input type="range" min="0" max="5000000" value={priceRange[1]} onChange={(e) => handlePriceChange(1, e.target.value)} style={{ width: '100%' }} />
                  <div className="priceInputContainer">
                     <input type="number" className="priceInput" value={priceRange[0]} onChange={(e) => handlePriceChange(0, e.target.value)} />
                     <span>-</span>
                     <input type="number" className="priceInput" value={priceRange[1]} onChange={(e) => handlePriceChange(1, e.target.value)} />
                  </div>
               </div>
            </div>
         </aside>

         <main className="resultsSection">
            <h1 className="resultsTitle">
               '<span className="highlight">{tags.join(' ') || '전체 상품'}</span>' 검색 결과
               <span style={{ color: '#999', fontSize: '1.2rem', marginLeft: '1rem' }}>({results?.totalItems || 0}개)</span>
            </h1>

            {isLoading ? (
               <p>검색 중...</p>
            ) : results?.items && results.items.length > 0 ? (
               <div className="resultsGrid">
                  {results.items.map((item) => (
                     <div key={item.id} className="productCard">
                        <Link to={`/item/${item.id}`} className="productLink">
                           <img src={item.ItemImgs && item.ItemImgs.length > 0 ? item.ItemImgs[0].img_url : '/placeholder.png'} alt={item.name} className="productImage" />
                           <div className="productInfo">
                              <p className="sellerName">{item.Seller?.name || '판매자 정보 없음'}</p>
                              <p className="itemName">{item.name}</p>
                              <p className="price">{item.price.toLocaleString()}원</p>
                           </div>
                        </Link>
                        <div className="cardFooter">
                           <button className="addToCartBtn" onClick={() => handleAddToCart(item)}>
                              장바구니 담기
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <p>검색 결과가 없습니다.</p>
            )}
         </main>
      </div>
   )
}

export default SearchPage
