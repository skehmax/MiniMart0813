import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { FreeMode, Pagination } from 'swiper/modules'
import '../../styles/itemDetail.css'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getItemThunk, getSellerItemsThunk } from '../../features/itemSlice'

function ItemDetail() {
   const { loading, error, item, items } = useSelector((s) => s.item)

   const { name, price, stock_number, description, status, is_sale, sale, ItemImgs, ItemOptions, Seller } = item ?? {}
   const dispatch = useDispatch()
   const id = useParams().id
   const [imgs, setImgs] = useState({})
   const [option, setOption] = useState('')
   const [number, setNumber] = useState('')

   useEffect(() => {
      dispatch(getItemThunk(id))
         .unwrap()
         .then((result) => {
            dispatch(getSellerItemsThunk(result.item.Seller.id))
         })
   }, [dispatch])

   useEffect(() => {
      if (!item) return
      const repImg = ItemImgs.find((v, i) => v.rep_img_yn)
      const detailsImg = ItemImgs.find((v, i) => v.details_img_yn)
      const otherImgs = ItemImgs.filter((v, i) => !(v.details_img_yn || v.rep_img_yn))
      setImgs({ repImg, detailsImg, otherImgs })
   }, [item])

   const handleOptionChange = (event) => {
      setOption(event.target.value)
   }

   const handleNumberChange = (event) => {
      setNumber(event.target.value)
   }

   const basePrice = useMemo(() => {
      if (!item) return
      if (!option) return price
      const opt = ItemOptions.find((e) => e.id === option)
      return opt ? opt.price + price : price
   }, [option, ItemOptions, price, item])

   const finalPrice = useMemo(() => {
      return is_sale ? basePrice * ((100 - sale) / 100) : basePrice
   }, [basePrice, is_sale, sale])

   if (loading) <p>로딩중...</p>

   return (
      item && (
         <>
            <div className="item-detail-wrap">
               <div className="item-detail__rep-wrap">
                  <div className="rep-imgs">
                     <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                        {imgs.repImg && (
                           <SwiperSlide>
                              <img src={`${import.meta.env.VITE_API_URL}${imgs.repImg.img_url}`} alt="대표 상품 이미지" />
                           </SwiperSlide>
                        )}
                        {imgs.otherImgs &&
                           imgs.otherImgs.map((e, i) => {
                              return (
                                 <SwiperSlide key={Date.now()}>
                                    <img src={`${import.meta.env.VITE_API_URL}${e.img_url}`} alt={`${i + 2}번째 상품 이미지`} />
                                 </SwiperSlide>
                              )
                           })}
                     </Swiper>
                  </div>
                  <div className="rep-info">
                     <h2>{name}</h2>
                     <div className="rep-price">
                        {is_sale && (
                           <i>
                              <img src="/public/세일.png" alt="" />
                              <span>{sale}%</span>
                           </i>
                        )}
                        <div>
                           <i>
                              <img src="/public/원화.png" alt="" />
                           </i>
                           <p style={is_sale ? { color: 'red' } : {}}>{finalPrice.toLocaleString()}</p>
                        </div>
                     </div>
                     <p>{Seller?.name}</p>
                     <div className="rep-options">
                        <div className="options__option">
                           <p>상품 옵션</p>

                           <Select
                              value={option}
                              onChange={handleOptionChange}
                              displayEmpty
                              sx={{ width: '140px' }}
                              MenuProps={{
                                 PaperProps: {
                                    sx: {
                                       maxWidth: 200, // 메뉴 전체 최대 폭
                                       whiteSpace: 'normal', // 줄바꿈 허용
                                       wordBreak: 'break-word', // 단어 단위 줄바꿈
                                    },
                                 },
                                 MenuListProps: {
                                    sx: {
                                       '& .MuiMenuItem-root': {
                                          whiteSpace: 'normal',
                                          wordBreak: 'break-word',
                                          lineHeight: 1.4,
                                       },
                                    },
                                 },
                              }}
                           >
                              <MenuItem value="">
                                 <em>옵션을 선택하세요</em>
                              </MenuItem>
                              {ItemOptions.map((e, i) => {
                                 return (
                                    <MenuItem value={e.id} key={`${Date.now()}${i}`}>
                                       {e.name}
                                    </MenuItem>
                                 )
                              })}
                           </Select>
                        </div>
                        <div className="options__number">
                           <p>개수</p>

                           <Select value={number} onChange={handleNumberChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }} sx={{ width: '140px !important' }}>
                              <MenuItem value="">
                                 <em>개수를 선택하세요</em>
                              </MenuItem>
                              <MenuItem value={1}>1개</MenuItem>
                              <MenuItem value={2}>2개</MenuItem>
                              <MenuItem value={3}>3개</MenuItem>
                              <MenuItem value={4}>4개</MenuItem>
                              <MenuItem value={5}>5개</MenuItem>
                           </Select>
                        </div>
                     </div>
                     <p>남은 재고 : {stock_number}</p>
                     <Button variant="contained" sx={{ backgroundColor: '#2c2c2c', marginBottom: '10px' }}>
                        {status === 'FOR_SALE' ? '장바구니 담기' : status === 'SOLD_OUT' ? '매진' : '판매종료'}
                     </Button>

                     <div>
                        <Accordion>
                           <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                              <Typography component="span" sx={{ textAlign: 'left', width: '100%' }}>
                                 상품소개
                              </Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{ textAlign: 'left', width: '100%' }}>{description}</AccordionDetails>
                        </Accordion>
                     </div>
                  </div>
               </div>
               <div className="another-item-card-wrap">
                  <h4>이 판매자의 다른 상품</h4>
                  {
                     <Swiper slidesPerView="auto" spaceBetween={12} freeMode={true} modules={[FreeMode]} className="fiveDaysSwiper">
                        {items &&
                           items
                              .filter((e) => e.id !== item.id)
                              .map((e, i) => {
                                 return (
                                    <SwiperSlide key={Date.now() + i}>
                                       <div className="another-item-card">
                                          <div>
                                             <p>{e.name}</p>
                                             <div>
                                                <img src={`${Seller.User.profile_img}`} alt="판매자" referrerPolicy="no-referrer" />
                                                <p>{Seller.name}</p>
                                             </div>
                                          </div>
                                          <div>
                                             <img src={`${import.meta.env.VITE_API_URL}${e.ItemImgs[0].img_url}`} alt="상품이미지" />
                                          </div>
                                       </div>
                                    </SwiperSlide>
                                 )
                              })}
                     </Swiper>
                  }
                  <Link id="seller-more" to={'/'}>
                     더보기
                  </Link>
               </div>
               <div className="item-detail__description-img">{imgs.detailsImg && <img src={`${import.meta.env.VITE_API_URL}${imgs.detailsImg.img_url}`} alt="대표 상품 이미지" />}</div>
               <div className="item-detail__review-wrap">
                  <div>
                     <p>최근 리뷰</p>
                  </div>
               </div>
            </div>
         </>
      )
   )
}

export default ItemDetail
