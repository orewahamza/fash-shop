
import Title from './../components/Title';
import { assets } from './../assets/assets';
import { Helmet } from 'react-helmet-async';
import NewsletterBox from './../components/NewsletterBox';
import DemoInfoBox from './../components/DemoInfoBox';
import { toast } from 'react-toastify';

const Contact = () => {
  return (
    <div>
      <Helmet>
        <title>Contact Us | Fash-Shop</title>
        <meta name="description" content="Get in touch with the Fash-Shop team for support or inquiries." />
      </Helmet>

      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <DemoInfoBox />

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="contact_img" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl'>Our Store</p>
          <p className='text-brand-blue-300'>Sector 10, Uttara Model Town <br />Dhaka-1230</p>
          <p className='text-brand-blue-300'>Tel: +8804875465 <br />Email: admin@gmail.com </p>
          <p className='font-semibold text-xl text-brand-blue-500'>Careers at Forever</p>
          <p className='text-brand-blue-300'>Learn more about our teams and job openings.</p>

          <button onClick={() => toast.info("This is a demo project and doesn't support job applications yet.")} className='border border-brand-blue-500 px-8 py-4 text-sm bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 transition-all duration-500 '>Explore Jobs</button>

        </div>

      </div>

      <NewsletterBox />

    </div>
  )
}

export default Contact
