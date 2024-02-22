import Typed from 'react-typed'
import { Link } from 'react-router-dom'
import React from 'react'

const Home = () => {
  return (
    <div className="flex items-center justify-center custom-img text-white">
        <div className="max-w-[800px] w-full h-screen mx-auto text-center flex flex-col justify-center">
            <p className="text-[#ffffff] font-bold p-2 text-lg">VOTING SYSTEM FOR COMMUNEAI</p>
            <h1 className="md:text-6xl sm:text-4xl font-bold md:py-6 text-[#35bab3]">COMMUNEAI.ORG</h1>
            <div className='flex justify-center items-center py-1.5'>
                <p className="md:text-5xl sm:text-4xl font-bold">Decentralized Voting Application</p>
                {/* <Typed className='md:text-5xl sm:text-4xl text-xl font-bold pl-3 text-[#7040ff]'
                    strings={['for Proposals', 'on Commune', 'with Transparency']}
                    typeSpeed={100}
                    backSpeed={120}
                    loop={true}
                /> */}
            </div>
            <button className='bg-blue-700 hover:shadow-2xl text-center hover:bg-blue-600 duration-200 text-white hover:text-white w-[200px] rounded-xl font-bold my-6 mx-auto py-3'><Link to="/register">Vote now!</Link></button>
        </div>
    </div>
  )
}

export default Home