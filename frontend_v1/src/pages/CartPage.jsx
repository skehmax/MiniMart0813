import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/CartPage.css'

const getCartAPI = async () => {
   try {
      const response = await axios.get('/api/cart', { withCredentials: true })
      return response.data.data
   } catch (error) {
      console.error('Error fetching cart:', error)
      return []
   }
}

const removeFromCartAPI = async (cartId) => {
   try {
      await axios.delete(`/api/cart/${cartId}`, { withCredentials: true })
      return true
   } catch (error) {
      console.error('Error removing from cart:', error)
      return false
   }
}

const CartPage = () => {
   const [cartItems, setCartItems] = useState([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const fetchCartItems = async () => {
         setIsLoading(true)
         const items = await getCartAPI()
         setCartItems(items)
         setIsLoading(false)
      }
      fetchCartItems()
   }, [])

   const handleRemoveItem = async (cartId) => {
      const success = await removeFromCartAPI(cartId)
      if (success) {
         setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartId))
      } else {
         alert('상품 삭제에 실패했습니다.')
      }
   }

   const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
         const itemPrice = item.Item?.price || 0
         const optionPrice = item.ItemOption?.price || 0
         const quantity = item.count || 0
         return total + (itemPrice + optionPrice) * quantity
      }, 0)
   }

   if (isLoading) {
      return (
         <div className="cartContainer">
            <p>장바구니를 불러오는 중...</p>
         </div>
      )
   }

   return (
      <div className="cartContainer">
         <h1 className="cartTitle">장바구니</h1>
         <div className="cartGrid">
            <div className="cartItemsList">
               {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                     <div key={item.id} className="cartItem">
                        <img src={item.Item?.ItemImgs?.[0]?.img_url || '/placeholder.png'} alt={item.Item?.name} className="cartItemImg" />
                        <div className="cartItemInfo">
                           <p className="cartItemName">{item.Item?.name}</p>
                           <p className="cartItemOption">옵션: {item.ItemOption?.name || '기본'}</p>
                           <p className="cartItemOption">수량: {item.count}개</p>
                        </div>
                        <div className="cartItemActions">
                           <p className="cartItemPrice">{((item.Item?.price + (item.ItemOption?.price || 0)) * item.count).toLocaleString()}원</p>
                           <button onClick={() => handleRemoveItem(item.id)} className="removeBtn">
                              삭제
                           </button>
                        </div>
                     </div>
                  ))
               ) : (
                  <p style={{ textAlign: 'center', padding: '4rem' }}>장바구니가 비어있습니다.</p>
               )}
            </div>

            {cartItems.length > 0 && (
               <aside className="summaryBox">
                  <div className="summaryRow">
                     <span>총 상품 금액</span>
                     <span>{calculateTotal().toLocaleString()}원</span>
                  </div>
                  <div className="summaryRow">
                     <span>배송비</span>
                     <span>{calculateTotal() >= 50000 ? '무료' : '3,000원'}</span>
                  </div>
                  <div className="summaryRow summaryTotal">
                     <span>총 주문금액</span>
                     <span>{(calculateTotal() + (calculateTotal() >= 50000 ? 0 : 3000)).toLocaleString()}원</span>
                  </div>
                  <button className="checkoutBtn">주문하기</button>
               </aside>
            )}
         </div>
      </div>
   )
}

export default CartPage
