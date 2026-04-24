import React from 'react'

function Title({text1, text2}) {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-brand-blue-300'>{text1} <span className='bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent font-medium'>{text2}</span></p>
      {/* text after state line */}
      <p className='w-8 sm:w-12 h-[2px] sm:h-[2px] bg-gradient-to-r from-red-500 to-blue-500'></p>
      
    </div>
  )
}

export default Title
