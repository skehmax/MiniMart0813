import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk, fetchUserInfoThunk } from './features/authSlice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import LoginSuccess from './pages/LoginSuccess'
import RegisterPage from './pages/local/RegisterPage'
import LoginPage from './pages/local/LoginPage'
import FindPasswordPage from './pages/local/FindPasswordPage'
import ItemCreatePage from './pages/item/ItemCreatePage'
import Mypage from './pages/Mypage'
import GoogleLoginSuccess from './pages/auth/GoogleLoginSuccess'
import Footer from './components/shared/Footer'
import RegisterSeller from './pages/RegisterSeller'
import ManagerPage from './pages/ManagerPage'
import SearchPage from './pages/SearchPage'
import Navbar from './components/shared/Navbar'
import SellerPage from './pages/SellerPage'
import ItemDetail from './pages/item/ItemDetail'
import QnAPage from './pages/QnAPage'
import ReviewForm from './components/item/ReviewForm'
import CartPage from './pages/CartPage'
import About from './pages/About'
import Privacy from './pages/Privacy'
import SearchResults from './pages/SearchResult'

function App() {
   const dispatch = useDispatch()
   const { token } = useSelector((state) => state.auth)

   // 앱 시작 시 토큰이 있으면 사용자 정보 요청
   // 카카오 토큰이 없으면 로컬 로그인이 되어있는가 체크
   useEffect(() => {
      if (token) {
         dispatch(fetchUserInfoThunk())
      } else {
         dispatch(checkAuthStatusThunk())
      }
   }, [dispatch, token])

   return (
      <>
         <Navbar />
         <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<MainPage />}></Route>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/success" element={<LoginSuccess />} />
            <Route path="/item/upload" element={<ItemCreatePage />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            {/* 이메일 비번찾기 */}
            <Route path="/findpassword" element={<FindPasswordPage />} />
            {/* 내 정보 페이지 */}
            <Route path="/login/success/google" element={<GoogleLoginSuccess />} />
            <Route path="/mypage" element={<Mypage />} />
            {/* 판매자 등록 페이지 */}
            <Route path="/seller-register" element={<RegisterSeller />}></Route>
            {/* 관리자 페이지 */}
            <Route path="/manager/*" element={<ManagerPage />}></Route>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/seller/:sellerId" element={<SellerPage />} />
            {/* 문의 페이지 */}
            <Route path="/qna" element={<QnAPage />} />
            {/* 리뷰 페이지 */}
            <Route path="/review" element={<ReviewForm />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/search" element={<SearchResults />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
