export const mockOrderHistory = [
   {
      orderId: 'ORD_20250813_001',
      date: '2025-08-13',
      totalPrice: 48000,
      status: '배송 완료',
      items: [
         {
            itemId: 101,
            name: '무선 블루투스 이어폰',
            price: 35000,
            quantity: 1,
            imageUrl: 'https://cdn.pixabay.com/photo/2017/04/18/16/06/earphone-2239459_1280.jpg',
         },
         {
            itemId: 102,
            name: '휴대용 보조 배터리',
            price: 13000,
            quantity: 1,
            imageUrl: 'https://cdn.pixabay.com/photo/2019/07/28/18/25/power-bank-4369719_1280.jpg',
         },
      ],
   },
   {
      orderId: 'ORD_20250812_002',
      date: '2025-08-12',
      totalPrice: 24000,
      status: '배송 중',
      items: [
         {
            itemId: 103,
            name: '스마트폰 거치대',
            price: 24000,
            quantity: 1,
            imageUrl: 'https://cdn.pixabay.com/photo/2018/09/20/19/27/smartphone-3691653_1280.jpg',
         },
      ],
   },
]
