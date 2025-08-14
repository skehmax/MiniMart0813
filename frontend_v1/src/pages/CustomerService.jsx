import React, { useState } from 'react'

// --- 스타일 객체 ---
const styles = {
   container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem', fontFamily: 'sans-serif' },
   title: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' },
   tabContainer: { display: 'flex', borderBottom: '2px solid #eee', marginBottom: '2rem' },
   tabButton: { padding: '1rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: '#888' },
   activeTab: { color: 'black', borderBottom: '2px solid black' },
   // FAQ 아코디언 스타일
   faqItem: { border: '1px solid #eee', borderRadius: '8px', marginBottom: '0.5rem' },
   faqQuestion: { padding: '1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' },
   // 1:1 문의 폼 스타일
   form: { display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #eee', padding: '2rem', borderRadius: '8px' },
   input: { padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
   textarea: { padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '150px', fontSize: '1rem', fontFamily: 'sans-serif' },
   submitButton: { padding: '1rem', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
}

// --- 가짜 데이터 (나중에 API로 실제 데이터를 가져와야 합니다) ---
const noticesData = [
   { id: 1, title: '미니마트 시스템 점검 안내 (08/15 02:00 ~ 04:00)', date: '2025-08-14' },
   { id: 2, title: '추석 연휴 배송 지연 안내', date: '2025-08-12' },
   { id: 3, title: '개인정보처리방침 개정 안내', date: '2025-08-01' },
]

const faqData = [
   { q: '배송은 얼마나 걸리나요?', a: '영업일 기준 2~3일 소요됩니다. 주문량이 많은 경우 하루 이틀 지연될 수 있습니다.' },
   { q: '교환/반품 정책은 어떻게 되나요?', a: '상품 수령 후 7일 이내에 신청 가능하며, 제품의 택이 제거되지 않은 상태여야 합니다.' },
   { q: '회원가입은 어떻게 하나요?', a: '우측 상단의 로그인 버튼을 클릭하여 회원가입 페이지로 이동할 수 있습니다.' },
]

// --- 각 탭에 해당하는 컨텐츠 컴포넌트 ---

const Notices = () => (
   <div>
      {noticesData.map((notice) => (
         <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
            <span>{notice.title}</span>
            <span style={{ color: '#888' }}>{notice.date}</span>
         </div>
      ))}
   </div>
)

const FAQ = () => (
   <div>
      {faqData.map((item, index) => (
         <details key={index} style={styles.faqItem}>
            <summary style={styles.faqQuestion}>
               <span>{item.q}</span>
               <span>▼</span>
            </summary>
            <div style={{ padding: '1rem', borderTop: '1px solid #eee', color: '#555', lineHeight: '1.6' }}>{item.a}</div>
         </details>
      ))}
   </div>
)

const QnA = () => (
   <form style={styles.form}>
      <h3 style={{ margin: 0 }}>무엇을 도와드릴까요?</h3>
      <select style={styles.input}>
         <option>문의 유형을 선택하세요</option>
         <option>배송</option>
         <option>주문/결제</option>
         <option>취소/교환/반품</option>
         <option>기타</option>
      </select>
      <input type="text" placeholder="제목을 입력하세요" style={styles.input} />
      <textarea placeholder="문의 내용을 입력하세요" style={styles.textarea}></textarea>
      <button type="submit" style={styles.submitButton}>
         문의하기
      </button>
   </form>
)

// --- 고객센터 메인 컴포넌트 ---
export default function CustomerService() {
   const [activeTab, setActiveTab] = useState('notices')

   const renderContent = () => {
      if (activeTab === 'faq') return <FAQ />
      if (activeTab === 'qna') return <QnA />
      return <Notices />
   }

   return (
      <div style={styles.container}>
         <h1 style={styles.title}>고객센터</h1>
         <div style={styles.tabContainer}>
            <button style={{ ...styles.tabButton, ...(activeTab === 'notices' && styles.activeTab) }} onClick={() => setActiveTab('notices')}>
               공지사항
            </button>
            <button style={{ ...styles.tabButton, ...(activeTab === 'faq' && styles.activeTab) }} onClick={() => setActiveTab('faq')}>
               자주 묻는 질문
            </button>
            <button style={{ ...styles.tabButton, ...(activeTab === 'qna' && styles.activeTab) }} onClick={() => setActiveTab('qna')}>
               1:1 문의
            </button>
         </div>
         <div>{renderContent()}</div>
      </div>
   )
}
