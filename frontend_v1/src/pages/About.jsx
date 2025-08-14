import '../styles/about.css'

const About = () => {
   return (
      <div className="about-container">
         <div className="about-hero">
            <h1 className="about-title">artisan</h1>
            <p className="about-subtitle">Complete your style with awesome clothes from us</p>
         </div>

         <div className="about-content">
            <section className="about-section">
               <h2>Artisan의 이야기</h2>
               <p>MINIMART는 2025년에 시작된 수공예 온라인몰입니다. 우리는 모든 사람이 자신만의 독특한 스타일을 표현할 수 있도록 고품질의 서비스를 제공합니다.</p>
            </section>

            <section className="about-section">
               <h2>MINIMART의 미션</h2>
               <div className="mission-grid">
                  <div className="mission-item">
                     <h3>품질</h3>
                     <p>최고 품질의 소재와 정교한 제작 과정을 통해 오래도록 사랑받을 수 있는 제품을 찾아냅니다.</p>
                  </div>
                  <div className="mission-item">
                     <h3>스타일</h3>
                     <p>트렌디하면서도 시대를 초월하는 디자인으로 개성 있는 스타일을 연출할 수 있도록 돕습니다.</p>
                  </div>
                  <div className="mission-item">
                     <h3>지속가능성</h3>
                     <p>환경을 생각하는 지속가능한 상생을 추구하며, 책임감 있는 유통 과정을 유지합니다.</p>
                  </div>
               </div>
            </section>

            <section className="about-section">
               <h2>MINIMART의 약속</h2>
               <ul className="promise-list">
                  <li>고객 만족을 최우선으로 하는 서비스 제공</li>
                  <li>합리적인 가격으로 프리미엄 품질의 제품 공급</li>
                  <li>빠르고 안전한 배송 서비스</li>
                  <li>친환경적이고 지속가능한 포장</li>
               </ul>
            </section>
         </div>
      </div>
   )
}

export default About
