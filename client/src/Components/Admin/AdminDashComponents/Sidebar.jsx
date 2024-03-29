import React, { useState } from 'react';
import './indexAdmin.css'
import adminAvatar from '../../../assets/adminAvatar.png'  
import { Link,useNavigate } from 'react-router-dom';
import AuthConsumer from '../../../auth/useAuth'

import {
    RiHomeLine,
    RiUser3Line,
    RiPieChartLine,
    RiCloseLine,
    RiLogoutBoxLine
} from "react-icons/ri";

import {
    MdHowToVote, MdMenuOpen,
} from "react-icons/md"

import {
    FaUserSecret,
    FaVoteYea
} from "react-icons/fa"

import{
    FiUsers
} from "react-icons/fi"

const Sidebar = (props) => {

    const [showMenu, setShowMenu] = useState(false);
    const {logoutAdmin}=AuthConsumer();

    const navigate=useNavigate();

    const signout=()=>{
        logoutAdmin().then(()=>{
            navigate('./login')
            alert("Logged Out!")
        })
    }

  return (
    <>
        <div
            className = {
                `bg-primary-900 h-full fixed lg:static w-[80%] lg:w-full transition-all z-50 duration-300
                ${showMenu ? "left-0" : "-left-full"}`
            }
        >
            <div className = "flex flex-col items-center justify-center p-8 gap-4 h-[20vh]">

                <img
                    src={adminAvatar}
                    alt="profile picture"
                    className="w-20 h-20 object-cover rounded-full ring-2 ring-gray-300"
                />

                <h1 className="text-xl text-white font-bold">
                    {props.name}
                </h1>
                <div className="lg:hidden bg-[#2a565ba8] text-white rounded-2xl p-1">
                    <h1 className="text-green-400 text-sm font-bold " >{props.address}</h1>
                </div>
            </div>

            <div className = "bg-primary-100 p-8 pt-9 h-[80vh] flex flex-col justify-between gap-10">

                <nav className="flex flex-col gap-5">

                    <Link to="./adminDashboard" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <RiHomeLine /> Dashboard
                    </Link>

                    <Link to="./validateUsers" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <RiUser3Line /> Users
                    </Link>

                    <Link to="./viewVoterList" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <FiUsers /> Voters
                    </Link>

                    <Link to="./addProposals" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <MdHowToVote /> Add Proposal
                    </Link>

                    <Link to="./addCandidates" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <FaUserSecret /> Candidates
                    </Link>

                    <Link to="./auditProposals" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <FaVoteYea /> Proposals
                    </Link>

                    <Link to="./viewResults" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <RiPieChartLine /> Poll Results
                    </Link>

                    <button className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors" onClick={signout}>
                        <RiLogoutBoxLine /> Logout
                    </button>
                </nav>

            </div>

        </div>

        <button onClick={() => setShowMenu(!showMenu)}
                className = "lg:hidden fixed right-4 bottom-4 text-2xl bg-primary-900 p-2.5 rounded-full text-white z-50">

            {showMenu ? <RiCloseLine /> : <MdMenuOpen />}

        </button>
    </>
  )
}

export default Sidebar;