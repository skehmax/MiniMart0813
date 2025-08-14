import { useDispatch } from 'react-redux'
import { itemCreateThunk } from '../../features/itemSlice'
import { useState } from 'react'
import '../../styles/itemUpload.css'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'

function IteamCreateForm() {
   const [imgUrls, setImgUrls] = useState([])
   const [imgFiles, setImgFiles] = useState([])
   const [repImgUrl, setRepImgUrl] = useState(null)
   const [repImgFile, setRepImgFile] = useState(null)
   const [detailsImg, setDetailsImg] = useState(null)
   const [options, setOptions] = useState([{ id: 1, name: '기본옵션', price: '0' }])
   const [formData, setFormData] = useState({ status: 'FOR_SALE', stock_number: '0', price: '0', is_sale: false, sale: '0', description: '', name: '' })
   const [empty, setEmpty] = useState({ name: false, price: false, stock_number: false, description: false, options: false, imgs: false, img: false, rep_img: false })
   const [hashtags, setHashtags] = useState('')

   const dispatch = useDispatch()
   const navigate = useNavigate()

   function handleSubmit(e) {
      e.preventDefault()

      const newEmpty = {
         name: !formData?.name?.trim(),
         price: !formData?.price?.trim() || formData.price == 0,
         stock_number: !formData?.stock_number?.trim() || (formData.stock_number == 0 && formData.status === 'FOR_SALE'),
         description: !formData?.description?.trim(),
         imgs: imgFiles.length === 0,
         img: !detailsImg,
         options: options.some((o) => !o.name.trim()),
         rep_img: !repImgFile,
      }
      setEmpty(newEmpty)

      const isSuccess = Object.values(newEmpty).every((v) => v === false)

      if (!isSuccess) {
         alert('필수 정보를 모두 기입해 주세요')
         return
      }
      if (formData.is_sale && formData.sale == 0) {
         alert('할인율을 정하거나 정가판매로 바꿔주세요')
      }

      const addFormData = new FormData()

      //기본 formData들 추가
      Object.entries(formData).forEach(([key, value]) => {
         if (key === 'price' || key === 'stock_number') {
            // 콤마 제거
            value = value.replace(/,/g, '')
         }
         addFormData.append(key, value)
      })

      // options 추가
      const optionsForSubmit = options.map((opt) => ({
         ...opt,
         price: opt.price.toString().replace(/,/g, ''),
      }))
      addFormData.append('options', JSON.stringify(optionsForSubmit))

      // 이미지 파일들 추가
      imgFiles.forEach((file) => {
         const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
         addFormData.append('imgs', encodedFile)
      })
      // 상세설명 이미지 추가
      const encodedDetailsImg = new File([detailsImg], encodeURIComponent(detailsImg.name), { type: detailsImg.type })
      addFormData.append('img', encodedDetailsImg)

      //대표 이미지 추가
      const encodedRepImg = new File([repImgFile], encodeURIComponent(repImgFile.name), { type: repImgFile.type })
      addFormData.append('rep_img', encodedRepImg)

      const tagsArray = hashtags
         .split('#') // '#' 기준 분리
         .map((tag) => tag.trim()) // 앞뒤 공백 제거
         .filter((tag) => tag.length > 0) // 빈 문자열 제거
      const uniqueTags = [...new Set(tagsArray)]

      //해시태그 추가
      addFormData.append('hashtags', JSON.stringify(uniqueTags))

      dispatch(itemCreateThunk(addFormData))
         .unwrap()
         .then((result) => {
            alert('상품이 성공적으로 등록되었습니다!')
            navigate(`/item/${result.item.id}`)
         })
         .catch(() => {
            alert('서버 에러로 등록에 실패하였습니다.')
         })
   }

   function handleImgs(e) {
      setImgUrls([])
      const files = e.target.files

      if (!files) return
      //이미지 갯수 제한
      if (files.length > 4) {
         alert('최대 4개까지 선택할 수 있습니다.')
         e.target.value = null
         return
      }
      //이미지 파일 크기 제한
      for (let file of files) {
         if (file.size > 4 * 1024 * 1024) {
            alert(`파일 "${file.name}"이 4MB를 초과합니다.`)
            e.target.value = null
            return
         }
         const reader = new FileReader()
         reader.onload = (event) => {
            setImgUrls((prev) => [...prev, event.target.result])
         }
         reader.readAsDataURL(file)
      }
      setImgFiles(Array.from(files))
   }

   function handleDetailsImg(e) {
      const file = e.target.files[0]
      if (!file) return
      if (file.size > 10 * 1024 * 1024) {
         alert(`파일 "${file.name}"이 10MB를 초과합니다.`)
         e.target.value = null
         return
      }
      setDetailsImg(file)
   }

   function handleFormData(field, value) {
      if (field === 'price' || field == 'stock_number') {
         value = value
            .replace(/[^0-9]/g, '')
            .replace(/^0+/, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
         if (value === '') value = '0'
      }
      if (field == 'sale') {
         value = Number(value.replace(/[^0-9]/g, ''))
         if (value >= 100) {
            value = 99
         }
      }

      setFormData({ ...formData, [field]: value })
   }

   function addOption() {
      setOptions((prev) => [...prev, { id: Date.now(), name: '', price: 0 }])
   }

   function handleChangeOptions(id, field, value) {
      if (field === 'price') {
         value = value
            .replace(/[^0-9-]/g, '') // 숫자와 -만 허용
            .replace(/(?!^)-/g, '') // 맨 앞이 아닌 - 제거
            .replace(/^(-?)0+(\d)/, '$1$2') // 맨 앞 0 제거 (단, -는 유지)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 3자리마다 콤마
         if (value === '' || value === '-') value = '0'
      }

      setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)))
   }

   function deleteOption(id) {
      return () => {
         const newOptions = options.filter((e) => e.id !== id)
         setOptions(newOptions)
      }
   }

   function handleRepImg(e) {
      setRepImgUrl(null)
      const file = e.target.files[0]

      if (!file) return
      if (file.size > 4 * 1024 * 1024) {
         alert(`파일이 4MB를 초과합니다.`)
         e.target.value = null
         return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
         setRepImgUrl(event.target.result)
         setRepImgFile(file)
      }
      reader.readAsDataURL(file)
   }
   return (
      <>
         <div className="item-upload-form">
            <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
               <div className="item-upload-form__imgs">{repImgUrl && <img src={repImgUrl} alt="대표 이미지 미리보기" />}</div>
               <div className="item_img">
                  <label htmlFor="rep_item_img" className="item_img_label">
                     대표 상품 이미지 등록
                  </label>
                  <span> 4mb 이내의 이미지 등록이 가능합니다. (3:4 비율의 이미지를 추천합니다)</span>

                  {empty.rep_img && <p className="empty"> 반드시 대표 이미지를 등록해야 합니다.</p>}

                  <input type="file" name="" id="rep_item_img" hidden accept="image/*" onChange={(e) => handleRepImg(e)} />
               </div>

               <div className="item-upload-form__imgs">
                  {imgUrls[0] && <img src={imgUrls[0]} alt="미리보기" />}
                  {imgUrls[1] && <img src={imgUrls[1]} alt="미리보기" />}
                  {imgUrls[2] && <img src={imgUrls[2]} alt="미리보기" />}
                  {imgUrls[3] && <img src={imgUrls[3]} alt="미리보기" />}
               </div>
               <div className="item_img">
                  <label htmlFor="item_img" className="item_img_label">
                     상품 이미지 등록{' '}
                  </label>
                  <span> 최대 4개까지 이미지 등록이 가능합니다. (파일당 4mb 제한)</span>

                  {empty.imgs && <p className="empty"> 최소 1개의 이미지를 등록해야 합니다.</p>}

                  <input type="file" name="" id="item_img" hidden multiple accept="image/*" onChange={(e) => handleImgs(e)} />
               </div>
               <div className="item_name_price">
                  <div className="item_name">
                     <label htmlFor="name">제품 이름</label>
                     <input
                        type="text"
                        name=""
                        id="name"
                        placeholder="제품명 입력"
                        autoComplete="off"
                        spellCheck="false"
                        value={formData.name}
                        onChange={(e) => {
                           handleFormData('name', e.target.value)
                        }}
                     />
                     {empty.name && <p className="empty">제품 이름을 입력해 주세요 </p>}
                  </div>
                  <div className="item_price">
                     <label htmlFor="price">기본가격</label>
                     <input type="text" name="" id="price" placeholder="000원 (숫자만 입력)" autoComplete="off" spellCheck="false" value={formData.price} onChange={(e) => handleFormData('price', e.target.value)} />
                     {empty.price && <p className="empty">기본 가격을 입력해 주세요 </p>}
                  </div>
               </div>
               <div>
                  <label htmlFor="stock_number">재고수량</label>
                  <input
                     type="text"
                     name=""
                     id="stock_number"
                     autoComplete="off"
                     placeholder="재고수량 입력"
                     value={formData.status !== 'SOLD_OUT' ? formData.stock_number : 0}
                     onChange={(e) => handleFormData('stock_number', e.target.value)}
                     readOnly={formData.status === 'FOR_SALE' ? false : true}
                  />
                  {empty.stock_number && <p className="empty"> 재고수량을 입력해 주세요</p>}
               </div>
               <div>
                  <label htmlFor="hashtags">해시태그 추가</label>
                  <input type="text" name="" id="hashtags" autoComplete="off" placeholder="해시태그 입력" value={hashtags} onChange={(e) => setHashtags(e.target.value.replace(/\s/g, ''))} spellCheck="false" />
               </div>
               <div className="item-stock">
                  <label htmlFor="status">판매상태</label>
                  <div className="radio-wrap">
                     <input type="radio" name="status" id="for-sale" hidden defaultChecked onChange={() => handleFormData('status', 'FOR_SALE')} />
                     <label htmlFor="for-sale">판매중</label>
                     <input type="radio" name="status" id="sold-out" hidden onChange={() => handleFormData('status', 'SOLD_OUT')} />
                     <label htmlFor="sold-out">재고없음(품절)</label>
                     <input type="radio" name="status" id="discontinued" hidden onChange={() => handleFormData('status', 'DISCONTINUED')} />
                     <label htmlFor="discontinued">판매중지</label>
                  </div>
               </div>
               <div>
                  <label htmlFor="img">상세 설명 이미지 등록(1장, 10mb 제한)</label>
                  <input type="file" name="" id="img" accept="image/*" onChange={(e) => handleDetailsImg(e)} />
                  {empty.img && <p className="empty">상품 상세 설명 이미지를 등록해 주세요 </p>}
               </div>
               <div className="item-description">
                  <label htmlFor="description">상세 설명</label>
                  <textarea
                     name=""
                     id="description"
                     spellCheck="false"
                     value={formData.description}
                     onChange={(e) => {
                        handleFormData('description', e.target.value)
                     }}
                  ></textarea>
                  {empty.description && <p className="empty">상품 상세 설명을 입력해 주세요 </p>}
               </div>
               <div className="item-options">
                  <button type="button" onClick={addOption}>
                     옵션 추가하기
                  </button>
                  <div className="default">
                     <label htmlFor="option-name">기본옵션</label>
                     <input type="text" name="" id="option-name" placeholder="기본 옵션" spellCheck="false" value={options[0].name} onChange={(event) => handleChangeOptions(1, 'name', event.target.value)} autoComplete="off" />
                     <label htmlFor="add-price">옵션 추가 가격</label>
                     <input type="text" name="" id="add-price" value={0} readOnly />
                     <i></i>
                  </div>
                  {options.map((e, i) => {
                     if (i == 0) return
                     return (
                        <div className="item-option" key={e.id}>
                           <label htmlFor={`option-name-${e.id}`}>옵션{i}</label>
                           <input type="text" name="" id={`option-name-${e.id}`} placeholder="예) 250mm, XL, 파란색 등..." spellCheck="false" value={e.name} onChange={(event) => handleChangeOptions(e.id, 'name', event.target.value)} autoComplete="off" />
                           <label htmlFor={`add-price-${e.id}`}>옵션 추가 가격</label>
                           <input type="text" name="" id={`add-price-${e.id}`} value={e.price} onChange={(event) => handleChangeOptions(e.id, 'price', event.target.value)} />
                           <i onClick={deleteOption(e.id)}>
                              <DeleteIcon />
                           </i>
                        </div>
                     )
                  })}
               </div>
               <div className="sale-wrap">
                  <label htmlFor="">할인여부</label>
                  <div className="radio-wrap">
                     <input type="radio" name="sale" id="yes" hidden onChange={() => handleFormData('is_sale', true)} />
                     <label htmlFor="yes">할인판매</label>
                     <input type="radio" name="sale" id="no" hidden onChange={() => handleFormData('is_sale', false)} defaultChecked />
                     <label htmlFor="no">정가판매</label>
                  </div>
                  <label htmlFor="sale">할인율</label>
                  <input type="text" name="" id="sale" placeholder="숫자만 입력 예) 15" autoComplete="off" onChange={(e) => handleFormData('sale', e.target.value)} value={formData.is_sale === false ? 0 : formData.sale} readOnly={!formData.is_sale} />
                  <div>{formData.sale === 0 ? <p>예상가격 {formData.price}</p> : <p>예상가격 {(Number(formData?.price?.replace(/,/g, '')) * (100 - formData.sale)) / 100 || 0}</p>}</div>
               </div>

               <button type="submit" className="item-upload__submit">
                  등록하기
               </button>
            </form>
         </div>
      </>
   )
}

export default IteamCreateForm
