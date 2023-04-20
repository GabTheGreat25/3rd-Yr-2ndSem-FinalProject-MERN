import * as yup from 'yup'

export default yup.object({
  name: yup.string('Enter your Name').required('Name is required'),
  text: yup.string('Enter your Text').required('Text is required'),
  price: yup.string('Enter your Price').required('Price is required'),
})
