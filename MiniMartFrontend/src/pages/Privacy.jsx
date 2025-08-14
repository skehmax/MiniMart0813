import React from 'react'
import '../styles/privacy.css'

const Privacy = () => {
   return (
      <div className="privacy-container">
         <div className="privacy-header">
            <h1>개인정보처리방침</h1>
            <p>MINIMART에서는 고객님의 개인정보를 소중히 여기며 안전하게 보호하고 있습니다.</p>
            <div className="privacy-date">최종 업데이트: 2024년 8월</div>
         </div>

         <div className="privacy-content">
            <section className="privacy-section">
               <h2>1. 개인정보 수집 및 이용 목적</h2>
               <div className="privacy-text">
                  <p>MINIMART에서는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다:</p>
                  <ul>
                     <li>회원 가입 및 관리</li>
                     <li>상품 주문 및 배송 서비스 제공</li>
                     <li>고객 상담 및 불만 처리</li>
                     <li>마케팅 및 광고에 활용</li>
                     <li>서비스 개선 및 신상품 개발</li>
                  </ul>
               </div>
            </section>

            <section className="privacy-section">
               <h2>2. 수집하는 개인정보 항목</h2>
               <div className="privacy-subsection">
                  <h3>필수 정보</h3>
                  <p>이름, 이메일 주소, 전화번호, 배송 주소, 결제 정보</p>
               </div>
               <div className="privacy-subsection">
                  <h3>선택 정보</h3>
                  <p>생년월일, 성별, 관심 분야, 마케팅 수신 동의 여부</p>
               </div>
               <div className="privacy-subsection">
                  <h3>자동 수집 정보</h3>
                  <p>IP 주소, 쿠키, 접속 기록, 서비스 이용 기록</p>
               </div>
            </section>

            <section className="privacy-section">
               <h2>3. 개인정보 보유 및 이용 기간</h2>
               <div className="privacy-text">
                  <ul>
                     <li>
                        <strong>회원 정보:</strong> 회원 탈퇴 시까지 또는 관련 법령에 따른 보존 기간
                     </li>
                     <li>
                        <strong>주문 정보:</strong> 주문 완료 후 5년간 보관
                     </li>
                     <li>
                        <strong>결제 정보:</strong> 결제 완료 후 5년간 보관
                     </li>
                     <li>
                        <strong>상담 기록:</strong> 상담 완료 후 3년간 보관
                     </li>
                  </ul>
               </div>
            </section>

            <section className="privacy-section">
               <h2>4. 개인정보 제3자 제공</h2>
               <div className="privacy-text">
                  <p>MINIMART는 원칙적으로 고객님의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
                  <ul>
                     <li>고객님이 사전에 동의한 경우</li>
                     <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                     <li>배송업체, 결제대행업체 등 서비스 제공을 위해 필요한 최소한의 정보 제공</li>
                  </ul>
               </div>
            </section>

            <section className="privacy-section">
               <h2>5. 개인정보 처리 위탁</h2>
               <div className="privacy-text">
                  <p>원활한 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:</p>
                  <div className="privacy-table">
                     <div className="table-row">
                        <div className="table-cell">
                           <strong>위탁업체</strong>
                        </div>
                        <div className="table-cell">
                           <strong>위탁업무</strong>
                        </div>
                     </div>
                     <div className="table-row">
                        <div className="table-cell">배송업체</div>
                        <div className="table-cell">상품 배송</div>
                     </div>
                     <div className="table-row">
                        <div className="table-cell">결제대행업체</div>
                        <div className="table-cell">결제 처리</div>
                     </div>
                     <div className="table-row">
                        <div className="table-cell">고객센터 운영업체</div>
                        <div className="table-cell">고객 상담</div>
                     </div>
                  </div>
               </div>
            </section>

            <section className="privacy-section">
               <h2>6. 정보주체의 권리와 행사 방법</h2>
               <div className="privacy-text">
                  <p>고객님은 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
                  <ul>
                     <li>개인정보 처리 현황에 대한 열람 요구</li>
                     <li>오류 등이 있을 경우 정정·삭제 요구</li>
                     <li>처리정지 요구</li>
                  </ul>
                  <p>권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, FAX 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</p>
               </div>
            </section>

            <section className="privacy-section">
               <h2>7. 개인정보 보호를 위한 기술적·관리적 대책</h2>
               <div className="privacy-text">
                  <ul>
                     <li>개인정보 암호화 저장</li>
                     <li>해킹 등에 대비한 기술적 대책</li>
                     <li>개인정보에 대한 접근 제한</li>
                     <li>개인정보보호 전담조직 운영</li>
                     <li>개인정보보호 교육 실시</li>
                  </ul>
               </div>
            </section>

            <section className="privacy-section">
               <h2>8. 개인정보보호책임자</h2>
               <div className="contact-info">
                  <div className="contact-item">
                     <strong>개인정보보호책임자</strong>
                     <p>이름: 홍길동</p>
                     <p>직책: 개인정보보호팀장</p>
                     <p>연락처: privacy@minimart.com</p>
                     <p>전화: 02-1234-5678</p>
                  </div>
               </div>
            </section>
         </div>
      </div>
   )
}

export default Privacy
