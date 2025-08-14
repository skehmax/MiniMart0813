import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPageThunk, updateMyPageThunk, deleteAccountThunk } from '../../features/mypageSlice'
import { logoutUserThunk } from '../../features/authSlice'
import { useDaumPostcodePopup } from 'react-daum-postcode'

const API_BASE_URL = import.meta.env.VITE_API_URL

const UserInfoForm = () => {
   const fileInputRef = useRef(null)
   const dispatch = useDispatch()
   const user = useSelector((state) => state.mypage.user)
   const { loading, error } = useSelector((state) => state.mypage)
   const [previewImage, setPreviewImage] = useState('')
   const token = localStorage.getItem('token')
   const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
   const open = useDaumPostcodePopup(scriptUrl)

   const [name, setName] = useState('')
   const [phone_number, setPhone_number] = useState('')
   const [email, setEmail] = useState('')
   const [zipcode, setZipcode] = useState('')
   const [address, setAddress] = useState('')
   const [detailaddress, setDetailaddress] = useState('')
   const [extraaddress, setExtraaddress] = useState('')
   const [profile_img, setProfile_img] = useState('')
   const [originalData, setOriginalData] = useState(null)

   useEffect(() => {
      dispatch(fetchMyPageThunk('/mypage'))
   }, [dispatch])

   useEffect(() => {
      if (user) {
         setOriginalData(user)
         setName(user.name || '')
         setPhone_number(user.phone_number || '')
         setEmail(user.email || '')
         setZipcode(user.zipcode || '')
         setAddress(user.address || '')
         setDetailaddress(user.detailaddress || '')
         setExtraaddress(user.extraaddress || '')
         setProfile_img(user.profile_img || '')

         const fullImageUrl = user.profile_img ? `${API_BASE_URL}${user.profile_img}` : `${API_BASE_URL}/uploads/profile-images/default.png`
         setPreviewImage(fullImageUrl)
      }
   }, [user])

   const handleImageClick = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click()
      }
   }

   const handleAddressSearch = () => {
      open({
         onComplete: (data) => {
            let roadAddr = data.roadAddress
            let extraAddr = ''

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
               extraAddr += data.bname
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
               extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
            }
            if (extraAddr !== '') {
               extraAddr = `(${extraAddr})`
            }

            setZipcode(data.zonecode)
            setAddress(roadAddr)
            setExtraaddress(extraAddr)
            setDetailaddress('') // 상세주소는 초기화
         },
      })
   }

   const handleSave = () => {
      if (loading) {
         return
      }

      if (!originalData) {
         alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
         return
      }

      const updatedFields = {}
      if (name !== originalData.name && name !== '') {
         updatedFields.name = name
      }
      if (phone_number !== originalData.phone_number && phone_number !== '') {
         updatedFields.phone_number = phone_number
      }
      // if (email !== originalData.email && email !== '') {
      //    updatedFields.email = email
      // }
      if (zipcode !== originalData.zipcode && zipcode !== '') {
         updatedFields.zipcode = zipcode
      }
      if (address !== originalData.address && address !== '') {
         updatedFields.address = address
      }
      if (detailaddress !== originalData.detailaddress && detailaddress !== '') {
         updatedFields.detailaddress = detailaddress
      }
      if (extraaddress !== originalData.extraaddress && extraaddress !== '') {
         updatedFields.extraaddress = extraaddress
      }
      if (profile_img !== originalData.profile_img && profile_img !== '') {
         updatedFields.profile_img = profile_img
      }

      //바꾼 거 없으면 나가
      if (Object.keys(updatedFields).length === 0) {
         alert('변경된 내용이 없습니다.')
         return
      }

      dispatch(updateMyPageThunk(updatedFields))
         .unwrap()
         .then(() => {
            alert('수정사항이 성공적으로 적용되었습니다.')
         })
         .catch((error) => {
            console.error('업데이트 실패 에러:', error)
            if (typeof error === 'string') {
               alert(`수정 실패: ${error}`)
            } else if (error?.message) {
               alert(`수정 실패: ${error.message}`)
            } else if (error?.data?.message) {
               alert(`수정 실패: ${error.data.message}`)
            } else {
               alert('수정 실패: 알 수 없는 오류가 발생했습니다.')
            }
         })
   }

   const handleDeleteAccount = () => {
      if (window.confirm('정말 회원탈퇴 하시겠습니까?')) {
         dispatch(deleteAccountThunk())
            .unwrap()
            .then(() => {
               alert('정상적으로 탈퇴 되었습니다.')
               dispatch(logoutUserThunk())
                  .unwrap()
                  .then(() => {
                     window.location.href = '/'
                  })
            })
            .catch((err) => {
               console.error('회원 탈퇴 실패:', err)
               alert(`회원 탈퇴 실패: ${err.message || err}`)
            })
      }
   }

   const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file && file.type.startsWith('image/')) {
         const reader = new FileReader()
         reader.onloadend = () => {
            setPreviewImage(reader.result)
         }
         reader.readAsDataURL(file)
         uploadProfileImage(file)
            .then((uploadedImageUrl) => {
               setProfile_img(uploadedImageUrl)
            })
            .catch(() => {
               alert('이미지 업로드 실패')
               setPreviewImage(profile_img)
            })
      } else {
         alert('이미지 파일만 선택해주세요.')
      }
   }

   const uploadProfileImage = async (file) => {
      const formData = new FormData()
      formData.append('profileImage', file)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/mypage/uploads/profile-images`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${token}`,
         },
         body: formData,
         credentials: 'include',
      })

      if (!response.ok) {
         throw new Error('업로드 실패')
      }
      const data = await response.json()
      return data.url
   }

   if (loading && !user) return <p>로딩 중...</p>

   return (
      <div className="user-info-box">
         {loading && !user && <p className="loading">로딩 중...</p>}
         {error && <p className="error">에러: {error}</p>}

         <div className="user-info-left" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            <img className="user-profile-img" src={previewImage || `${API_BASE_URL}/uploads/profile-images/default.png`} alt="프로필" style={{ cursor: 'pointer' }} />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
         </div>

         <div className="profile-card">
            <div className="profile-row">
               <label htmlFor="name">이름</label>
               <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="profile-row">
               <label htmlFor="phone_number">전화번호</label>
               <input id="phone_number" name="phone_number" type="tel" value={phone_number} placeholder="01012345678" maxLength="11" onChange={(e) => setPhone_number(e.target.value)} />
            </div>

            <div className="profile-row">
               <label htmlFor="email">이메일</label>
               <input id="email" name="email" type="email" value={email} placeholder="변경할 이메일" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="profile-row">
               <label htmlFor="zipcode">우편번호</label>
               <div className="address-input-group">
                  <input id="zipcode" name="zipcode" type="text" value={zipcode} readOnly placeholder="우편번호" />
                  <button type="button" onClick={handleAddressSearch}>
                     우편번호 찾기
                  </button>
               </div>
            </div>
            <div className="profile-row">
               <label htmlFor="address">주소</label>
               <input id="address" name="address" type="text" value={address} readOnly placeholder="주소" />
            </div>
            <div className="profile-row">
               <label htmlFor="detail_address">상세 주소</label>
               <input id="detail_address" name="detail_address" type="text" value={detailaddress} onChange={(e) => setDetailaddress(e.target.value)} placeholder="상세 주소" />
            </div>
            <div className="profile-row">
               <label htmlFor="extra_address">참고항목</label>
               <input id="extra_address" name="extra_address" type="text" value={extraaddress} readOnly placeholder="참고항목" />
            </div>

            <button className="btn btn-save" onClick={handleSave} disabled={loading}>
               {loading ? '저장 중...' : '정보 수정'}
            </button>
            <button className="btn btn-withdraw" onClick={handleDeleteAccount} disabled={loading}>
               회원 탈퇴
            </button>
         </div>
      </div>
   )
}

export default UserInfoForm
