import Title from './../components/Title';
import { assets } from './../assets/assets';
import { Helmet } from 'react-helmet-async';
import NewsletterBox from './../components/NewsletterBox';
import DemoInfoBox from './../components/DemoInfoBox';

const About = () => {
  return (
    <div>
      <Helmet>
        <title>About Us | Fash-Shop</title>
        <meta name="description" content="Learn more about Fash-Shop and our commitment to quality." />
      </Helmet>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <DemoInfoBox />

      <div className='my-10 flex flex-col md:flex-row gap-16'>

        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="about_img" />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-brand-blue-300'>
          <p>Fash-Shop was born out of a passion for digital excellence and a desire to create a seamless online shopping experience. This is a demo e-commerce project designed to showcase a modern, responsive, and feature-rich web application built with the MERN stack.</p>

          <p>From the intuitive user interface to the robust backend management, every element of Fash-Shop has been meticulously crafted to represent a professional-grade storefront. Our goal was to demonstrate how technology can elevate fashion retail into a digital art form.</p>

          <b className='text-brand-blue-50'>Our Vision</b>
          <p>Our vision is to push the boundaries of e-commerce by integrating cutting-edge technologies with user-centric design, ensuring that every click brings the customer closer to their perfect style statement.</p>
        </div>

      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>

        <div className='border border-brand-blue-800 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-brand-blue-300'>We meticulously select and vet each product to ensure it meets our high standards of quality and durability.</p>
        </div>

        <div className='border border-brand-blue-800 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-brand-blue-300'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier or faster.</p>
        </div>

        <div className='border border-brand-blue-800 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-brand-blue-300'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>

      </div>


      <NewsletterBox />

    </div>
  )
}

export default About
