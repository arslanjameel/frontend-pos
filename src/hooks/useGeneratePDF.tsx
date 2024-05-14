// 'use client'
// import { jsPDF } from 'jspdf'
// import html2canvas from 'html2canvas'
// import {
//   A4HEIGHT,
//   A4WIDTH,
// } from 'src/utils/globalConstants'
// import { sendEmailWithAttachment } from 'src/services/email.service'

// const useGeneratePDF = () => {
//   const generatePDF = async (
//     itemId: string,
//     saveOrReturn: (val: any) => void,
//   ) => {
//     const pdf = new jsPDF('p', 'pt', 'a4', false)

//     const jsxContainer = document.getElementById(itemId)

//     if (jsxContainer) {
//       html2canvas(jsxContainer).then(async canvas => {
//         const numSlices = Math.ceil(
//           canvas.height / A4HEIGHT,
//         )

//         const vals = []

//         for (
//           let sliceIndex = 0;
//           sliceIndex < numSlices;
//           sliceIndex++
//         ) {
//           const startY = sliceIndex * A4HEIGHT
//           const sliceHeight = Math.min(
//             A4HEIGHT,
//             canvas.height - startY,
//           )
//           vals.push({
//             startY,
//             sliceHeight,
//             width: canvas.width,
//           })

//           const sliceCanvas =
//             document.createElement('canvas')
//           sliceCanvas.width = canvas.width
//           sliceCanvas.height = sliceHeight

//           const sliceContext = sliceCanvas.getContext('2d')
//           sliceContext?.drawImage(
//             canvas,
//             0,
//             startY,
//             canvas.width,
//             sliceHeight,
//             0,
//             0,
//             canvas.width,
//             sliceHeight,
//           )

//           // console.log(canvas.height, vals)
//           if (sliceIndex > 0) {
//             pdf.addPage()
//           }

//           const scaleFactor = A4WIDTH / canvas.width
//           const imgWidth = A4WIDTH
//           const imgHeight = sliceHeight * scaleFactor

//           pdf.addImage(
//             sliceCanvas.toDataURL('image/png'),
//             'PNG',
//             0,
//             0,
//             imgWidth,
//             imgHeight,
//           )
//         }

//         saveOrReturn(pdf)
//       })
//     }
//   }

//   const downloadPDF = async (
//     itemId: string,
//     fileName = 'jsx_to_image.pdf',
//   ) => {
//     generatePDF(itemId, (pdf: any) => {
//       pdf.save(fileName)
//     })
//   }

//   const emailPDF = async (
//     itemId: string,
//     fileName = 'jsx_to_image.pdf',
//   ) => {
//     generatePDF(itemId, (pdf: any) => {
//       const blob = pdf.output('blob')

//       sendEmailWithAttachment({
//         email: 'brian@gmail.com',
//         email_title: 'Title',
//         email_body: 'Body',
//         store_id: '0',
//         file: new File([blob], fileName, {
//           type: blob.type,
//         }),
//       })
//         .then(res => console.log('res', res))
//         .catch(err => console.log('err', err))
//     })
//   }

//   return {
//     generatePDF,
//     downloadPDF,
//     emailPDF,
//   }
// }

// export default useGeneratePDF
