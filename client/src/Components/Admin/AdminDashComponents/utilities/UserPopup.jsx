import {React,useState} from "react";
import UserABI from '../../../../../../artifacts/contracts/CommuneVoting.sol/CommuneVoting.json'
import { ContractAddress } from '../../../../config.js'
import {ethers} from 'ethers'
import DropDown from './DropDown'

const AddedUserNames = (props) => {
    const removeUser=async()=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const VotingContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )     
                await VotingContract.setUserToProposal(props.proposalID,props.id, false).then((log)=>{
                  provider.waitForTransaction(log.hash,1).then((receipt)=>{
                    if(receipt){
                      if(receipt.status==1)
                        props.onSelect()
                      else if(receipt.status==0)
                        console.log("Transaction Failed!");
                    }
                  })
                })
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
    }
    return (
        <div className="border-solid border-slate-900">
        <div className="grid grid-cols-2 gap-4 items-center my-2">
            <span className="text-white font-bold text-xl">{props.userName}</span>
            <button className="bg-red-500 rounded-md p-1 text-lg text-white" onClick={removeUser}>Remove</button>
        </div>
        </div>
    )
}

const UChild=(props)=>{
    return(
        <>
            <DropDown data={props.list} onSelect={props.func}/>
        </>
    )
}

const AChild=(props)=>{
    return(
    <>
      {props.list.map(item=>(
              <AddedUserNames userName={item.name} proposalID={props.proposalID} id={item.id} onSelect={props.func} key={item.id}/>
      ))}
    </>
    )
}

const handleClick = (e,func) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
        func(false);
    }
}

const UserPopup = (props) => {
    const [selected,setSelected]=useState([])
    const handleCallback = (childData) =>{
        setSelected(childData)
    }
    const addUser=async()=>{
        if(selected.length!=0){
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const VotingContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )     
                await VotingContract.setUserToProposal(props.proposalID,selected.id, true).then((log)=>{
                  provider.waitForTransaction(log.hash,1).then((receipt)=>{
                    if(receipt){
                      if(receipt.status==1)
                        props.func()
                      else if(receipt.status==0)
                        console.log("Transaction Failed!");
                    }
                  })
                })
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
        }
    }
    
    return (
        <>
          {props.showUserModal?(
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowUserModal)}>
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <div className=" mr-10">
                            <h3 className="text-3xl font-semibold text-orange-400">Available Voters</h3>
                        </div>
                      <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => props.setShowUserModal(false)}>
                        <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                      </button>
                    </div>
                    <div className="grid relative p-6 flex-auto">
                    <div className='grid items-center grid-cols-4 gap-4'>
                    <label className='grid text-xl text-white'>Select Voter</label>
                    <div className='col-span-2' key="9087">    
                    <div>
                        <UChild list={props.udata} func={handleCallback}/>
                    </div>
                    </div>
                    <div>
                        <button id='wallet-id' className='w-full p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' onClick={addUser}>Add</button>
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center p-5 border-t border-b border-slate-200">
                    <h3 className="text-3xl font-semibold text-orange-400">Added Voters</h3>
                    </div>
                    <div className="relative p-6 flex-auto">
                    <div className='grid items-center'>
                    {props.adata.length>0?
                    <div className="min-w-[320px] p-8 rounded-2xl shadow-2xl gap-2 flex flex-col">
                        <AChild list={props.adata} proposalID={props.proposalID} func={props.func}/>
                    </div>:null
                    }
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ):null}
        </>
      )}

export default UserPopup