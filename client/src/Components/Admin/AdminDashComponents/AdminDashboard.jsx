import { useEffect,useState } from "react"
import UserABI from '../../../../../artifacts/contracts/CommuneVoting.sol/CommuneVoting.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import {Pie} from "react-chartjs-2"
import {
    Chart as ChartJS,ArcElement,CategoryScale,LinearScale,Tooltip
} from 'chart.js'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip
)

const DrawList=(props)=>{
    const [flg,setflg]=useState(false)
    const [chk,setChk]=useState(0)
    const [role,setRole]=useState("")

    useEffect(()=>{
        getRole(props.id).then(()=>{
            setflg(true)
        })
    },[chk])

    const switchRole=async(id)=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const VotingContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )          
                setflg(false)
                await VotingContract.switchRole(id.toNumber()).then((log)=>{
                    provider.waitForTransaction(log.hash,1).then((receipt)=>{
                        if(receipt){
                          if(receipt.status==1)
                            setChk(prevChk=>prevChk+1);
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
            error=error.data.message.toString()
            console.log(error)
            if (error.indexOf('revert') > -1) {
                setChk(prevChk=>prevChk+1);
                error = error.replace(/^.*revert/, '')
                alert(error) 
            }
            }
    }

    const getRole=async (id)=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const VotingContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )          

                setflg(false)
                await VotingContract.getUserRole(id.toNumber()).then((val)=>{
                    if(val===true){
                        setRole("Admin")
                    }
                    else{
                        setRole("User")
                    }
                })
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="grid items-center justify-items-center grid-cols-3 gap-4">
          <div className='flex items-center gap-4'>
           <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium">{props.name}</span>
          </div>
          <div className='flex items-center gap-4'>
           {flg?<span className="bg-purple-100 text-orange-800 py-1 px-3 rounded-md font-medium">{role}</span>:<span className="text-green-200 py-1 px-3 rounded-md font-medium">Changing...</span>}
          </div>
          <div className='flex items-center gap-4'>
            <button className=" bg-teal-400 rounded-md p-2 text-white font-bold" onClick={()=>switchRole(props.id)}>Switch Role</button>
          </div>
        </div>
    );
}

const Child=(props)=>{
    return (
      <>
        {props.list.map(item=>(
                <DrawList name={item.name} id={item.id} key={item.id}/>
        ))}
      </>
    );
  }

const AdminDashboard = () => {

    const [data,setData]=useState([])
    const [activeData,setActive]=useState([])
    const [userData,setUsers]=useState([])
    const [registeredData,setRegistered]=useState([])

    const linedata={
        labels: ["Active","Inactive"],
        datasets: [{
            data: [activeData.length,data.length-activeData.length],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',  
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 0.7)',  
                'rgba(255, 99, 132, 0.7)',
            ],
            pointBorderWidth: 4,
            tension: 0.5
        }]
    }
    
    useEffect(()=>{
        getProposalList()
    },[])

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
                let activeProposals=await VotingContract.getProposals(true)
                setActive(activeProposals)
                let users=await VotingContract.getUserList()
                setUsers(users)
                let voters=await VotingContract.getVoterList()
                setRegistered(voters)
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
        }

        return (
            <div className="mt-6 p-4 rounded-2xl">
                <div className="grid grid-rows-1 gap-6 sm:grid-cols-1 md:grid-cols-2">
                    <div className="grid grid-cols-1 items-start bg-primary-100 p-6 rounded-2xl shadow-2xl gap-6 border-1 border-slate-900">
                        <h1 className="col-span-2 text-[#5fffa7] text-xl font-bold">Change User Role</h1>
                        <div className="grid gap-y-4 items-center">
                            <div className="col-span-2 p-8 rounded-md shadow-2xl mb-8 gap-6 flex flex-col overflow-y-auto scrollbar max-h-320">
                                <Child list={registeredData}/>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-2 bg-primary-100 p-8 rounded-2xl flex flex-col shadow-2xl gap-6 border-1 border-slate-900">
                        <div className="grid grid-cols-2 gap-y-4 items-center">
                            <h1 className="text-white text-xl font-bold grid justify-items-center">Total Proposals</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#9de4f8] text-2xl font-bold">{data.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Active</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#c4f5b9] text-2xl font-bold">{activeData.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Inactive</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#f5b9b9] text-2xl font-bold">{data.length-activeData.length}</h1>
                            </div>
                            <div className="col-span-2 bg-gradient-to-r from-white to-slate-300 p-4 rounded-2xl shadow-2xl mt-2 gap-6 flex flex-col border-1 border-slate-900">
                                <Pie className="lg:max-h-72" data={linedata}></Pie>
                            </div>

                            <h1 className="text-white text-xl font-bold grid justify-items-center">Registered Users</h1>
                            <div className="grid justify-items-end">
                                <h1 className="text-[#9de4f8] text-2xl font-bold">{userData.length+registeredData.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Unvalidated Users</h1>
                            <div className="grid justify-items-end">
                                <h1 className=" text-[#f5b9b9] text-2xl font-bold">{userData.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Validated Users</h1>
                            <div className="grid justify-items-end">
                                <h1 className="text-[#c4f5b9] text-2xl font-bold">{registeredData.length}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default AdminDashboard