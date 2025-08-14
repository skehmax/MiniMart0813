import React from 'react'
import { Link } from 'react-router-dom'

// 아이콘들을 가져옵니다.
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const Footer = () => {
   // 스타일 객체
   const styles = {
      footer: {
         backgroundColor: '#1C1C1C', // 검은색 배경
         color: 'white',
         padding: '4rem 2rem',
         fontFamily: 'sans-serif',
      },
      container: {
         display: 'grid',
         gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // 그리드 레이아웃
         gap: '2rem',
         maxWidth: '1200px',
         margin: '0 auto',
      },
      section: {
         display: 'flex',
         flexDirection: 'column',
      },
      title: {
         fontWeight: 'bold',
         fontSize: '1.1rem',
         marginBottom: '1.5rem',
         color: '#FFFFFF',
      },
      link: {
         color: '#A0A0A0', // 밝은 회색 텍스트
         textDecoration: 'none',
         marginBottom: '0.8rem',
         fontSize: '0.9rem',
      },
      description: {
         color: '#A0A0A0',
         fontSize: '0.9rem',
         lineHeight: '1.5',
      },
      socialIcons: {
         display: 'flex',
         gap: '1rem',
         marginTop: '1rem',
      },
   }

   return (
      <footer style={styles.footer}>
         <div style={styles.container}>
            {/* FASHION 섹션 */}
            <div style={styles.section}>
               <h3 style={{ ...styles.title, fontSize: '1.5rem' }}>FASHION</h3>
               <p style={styles.description}>Complete your style with awesome clothes from us.</p>
               <div style={styles.socialIcons}>
                  <FacebookIcon />
                  <InstagramIcon />
                  <TwitterIcon />
                  <LinkedInIcon />
               </div>
            </div>

            {/* 제품 목록 섹션 */}
            <div style={styles.section}>
               <h3 style={styles.title}>제품 목록</h3>
               <Link to="/about" style={styles.link}>
                  브랜드 소개
               </Link>
               <Link to="/stores" style={styles.link}>
                  매장
               </Link>
               <Link to="/products/bags" style={styles.link}>
                  가방
               </Link>
               <Link to="/products/jackets" style={styles.link}>
                  셔츠, 자켓
               </Link>
            </div>

            {/* 고객 서비스 섹션 */}
            <div style={styles.section}>
               <h3 style={styles.title}>고객 서비스</h3>
               <Link to="/orders" style={styles.link}>
                  주문 배송 조회
               </Link>
               <Link to="/returns" style={styles.link}>
                  반품 신청
               </Link>
               <Link to="/shipping" style={styles.link}>
                  배송 서비스
               </Link>
               <Link to="/customer-service" style={styles.link}>
                  FAQ
               </Link>
            </div>

            {/* Company 섹션 */}
            <div style={styles.section}>
               <h3 style={styles.title}>Company</h3>
               <Link to="/terms" style={styles.link}>
                  Terms & conditions
               </Link>
               <Link to="/privacy" style={styles.link}>
                  Privacy Policy
               </Link>
            </div>
         </div>
      </footer>
   )
}

export default Footer
