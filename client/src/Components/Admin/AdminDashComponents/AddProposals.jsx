import {React,Fragment} from 'react'
import ProposalList from './utilities/ProposalList'
import {useForm} from "react-hook-form"
import {useState,useEffect} from 'react'
import UserABI from '../../../../../artifacts/contracts/CommuneVoting.sol/CommuneVoting.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import { Oval } from 'react-loader-spinner'

const Loader=()=>{
  return(
    <div className='flex flex-col items-center justify-center'>
      <Oval
      height={25}
      width={25}
      color="green"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="lime"
      strokeWidth={2}
      strokeWidthSecondary={2}
      />
    </div>
  )
}

const Child=(props)=>{
  return (
    <>
      {props.list.map((item,index)=>(
              <Fragment key={index}>{item.name!="" && <ProposalList name={item.name} totVote={item.totalVote} openForVotes={item.openForVotes} key={item.id}/>}</Fragment>
      ))}
    </>
  );
} 

const AddProposals = () => {
    const [data,setData]=useState([])
    const [proposalName,setName]=useState("")
    const [chk,setChk]=useState(0)
    const [rcnfm,setConfirm]=useState(0)

    const {register,handleSubmit,formState:{errors,isValid}}= useForm({
        mode: "all"
    }
    )

    useEffect(()=>{
      setName("")
      let e = async() => {await getProposalList()}
      e().then(()=>{
        console.log("Proposal data retrieved")
        setChk(1)
      }
      )
    },[rcnfm])

    const onSubmit = async () => {
      await addProposal()
      console.log("Submitted: "+proposalName)
    }

    const getProposalList = async () => {
      try{
          if(window.ethereum){
              const provider=new ethers.providers.Web3Provider(ethereum)
              const signer=provider.getSigner()
              const VotingContract=new ethers.Contract(
                  ContractAddress,
                  UserABI.abi,
                  signer
              )          
              let proposals=await VotingContract.getProposals(false)
              setData(proposals)
          }
          else{
              console.log("Ethereum object does not exist!")
          }
      }catch(error){
          console.log(error)
      }
      }

    const addProposal = async () => {
    try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const VotingContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )          
            await VotingContract.addProposal(proposalName).then((log)=>{
              provider.waitForTransaction(log.hash,1).then((receipt)=>{
                if(receipt){
                  if(receipt.status==1)
                    setConfirm(previousRcnfm=>previousRcnfm+1)
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
    <div>
    <section className="mt-6 gap-8">
        <h1 className="text-2xl font-bold mb-8">Add Proposal</h1>
        <form id='form' onSubmit={handleSubmit(onSubmit)} className='w-full mx-auto rounded-lg bg-cyan-900 p-8 px-8'>
                <div className='flex flex-col text-[#e4d7ff] py-2'>
                    <label className='font-bold text-xl text-white'>Proposal Name</label>
                    <div className='p-4 grid grid-cols-3 gap-4'>
                    <div className='col-span-2'>    
                        <input className='rounded-lg w-full bg-gray-800 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" {...register("proposalName", { required: true, pattern:/^(?!\s+$).*$/ })} value={proposalName} onChange={(e)=>setName(e.target.value)}/>
                    </div>
                    <div>
                    <button id='wallet-id' className='w-full mt-2 p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Add</button>
                    </div>
                </div>
                <h1 className=' text-red-500 font-bold'>
                  {errors.proposalName?.type === "required" && "Proposal Name is required"}
                  {errors.proposalName?.type === "pattern" && "Proposal Name cannot contains only white-spaces"}
                </h1>
                </div>
            </form>
    </section>
    <section className='mt-6 gap-8'>
        <h1 className="text-2xl font-bold mb-4">Proposal History</h1>
        <div className="min-w-[320px] gap-3 flex flex-col">
            <div className="grid  items-center justify-items-center grid-cols-3 gap-4 mb-4">
              <div className="col-span-1 flex items-center gap-4">
                <span className="py-1 px-3 rounded-full font-bold text-center">Proposal Name</span>
              </div>
              <div>
                <span className="py-1 px-3 rounded-full font-bold flex items-center text-center">Total Vote Count</span>
              </div>
              <div>
                <span className="ml-10 py-1 px-3 rounded-full font-bold flex items-center">Status</span>
              </div>
              </div>
            </div>
        <div className="min-w-[320px] bg-white py-6 rounded-2xl shadow-2xl h-[29vh] gap-6 flex flex-col overflow-y-auto scrollbar">
                        {chk?<Child list={data}/>:<Loader/>}
              </div>   
    </section>
    </div>
  )
}

export default AddProposals