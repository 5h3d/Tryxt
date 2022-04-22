import { useState, useEffect } from 'react';
import './App.css';
import { BsArrowRight } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { abi, CONTRACT_ADDRESS } from "./constants";

import { ethers } from "ethers";



function App() {
  const [ address, setAddress] = useState("0x000000000000000000")
  const [ addressTo, setAddressTo] = useState(" ")
  const [ amount, setAmount] = useState(" ")
  const [ message, setMessage] = useState(" ")
  // const [ balance, setBalance] = useState("24")
  const [ history, setHistory] = useState(false)
  const [ loading, setLoading] = useState(false)
  const [ connected, setConnected] = useState(false)
  // const [ provider, setProvder] = useState("")
  const [ ethBalance, setEthBalance] = useState(0)
  const [ allTransactions, setAllTransactions] = useState([])
  // const [ contract, setContract] = useState({})
  

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contracts = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
  

  //   const getaccount = async()=>{
  //     const account = await provider.send("eth_requestAccounts", [0]);
  //     console.log(account)
  //   }

  //   getaccount()
  // useEffect(()=>{
  //   checkAccount()
  //   // console.log("ran")
  // }, [])

  



  useEffect(()=>{
    if (typeof window.ethereum == 'undefined') {
      alert('Please install metamask');
    }else{
      checkAccount()
    }
    
    
  },[])

  const checkAccount = async()=>{
    const isConnected = window.ethereum.isConnected()
    // console.log("connected")
    if (isConnected === true){
      try {

        const account = await provider.send("eth_requestAccounts", [0]);
        const balance = await provider.getBalance(account[0]);
        setEthBalance(ethers.utils.formatEther(balance))
        setAddress(account)
        getAllTransactions()
        setConnected(true)

      } catch (error) {
        throw error
      }
    }
    
  }

  const connectWallet = async()=>{
   
    try {
     
      const account = await provider.send("eth_requestAccounts", [0]);
      
      const balance = await provider.getBalance(account[0]);
      console.log(balance)
      setEthBalance(ethers.utils.formatEther(balance))
      setAddress(account)
      setConnected(true)


    } catch (error) {
      throw new error ("Install metamask")
    }

  }
  const transfer = async()=>{
    
    try {
      const signer = provider.getSigner()
      const parsedAmount = ethers.utils.parseEther(`${amount}`)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
      const account = await provider.send("eth_requestAccounts", [0]);

      const tx = window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account[0],
            to: addressTo,
            value: parsedAmount._hex,
            gas: '0x5208',
          },
        ],
      })
      tx.wait()
      contract.transferFunc(addressTo, parsedAmount, message)

      
      console.log("complete")
    } catch (error) {
      
    }
    
  }
  
  const getAllTransactions = async()=>{
    
    const transactions = await contracts.getAllTransactions()
    setAllTransactions(transactions)
    console.log( await contracts.getAllTransactions())

    
    
    
  }



  return (
    <div className="App">
      <div className="container-content">

        {!connected? <div className="connect__wallet">
        <button onClick={connectWallet}>Connect wallet</button> 
        
        </div>: <div className="wallet__details">
          <div className="send__transaction">
            <input type="text" placeholder='Address' onChange={(e)=>{ setAddressTo(e.target.value)}}/>
            <input type="number" placeholder='Amount' onChange={(e)=>{ setAmount(e.target.value)}} />
            
            <input type="text" placeholder='message' onChange={(e)=>{ setMessage(e.target.value)}}/>
            <button onClick={transfer}>Send <BiSend /></button>

          </div>
          <div className="card">
            <div className="card__showcase">
              <h4>{address}</h4>
              <p>{ethBalance}ETH</p>
            </div>
            <p className="transaction__history-btn" onClick={()=>{setHistory(!history); getAllTransactions()}}>Transaction history</p>
          </div>
        </div>}
        
        

        
      </div>

      { connected && history && (<div className="transaction__history ">
        <div className="close"> <BsArrowRight  className='close__icon' onClick={()=>{setHistory(false)}} /></div>
        <div className="transaction__header">
          <h2>Transaction history</h2>
        </div>
          <div className="transaction__history-contents">
            {allTransactions.length > 0 ? allTransactions.map((tran)=>(<div className='transaction' key={Math.random()}>
              <small>Reciever: {tran.reciever}</small>
              <small>Amount: {ethers.utils.formatUnits(tran.amount._hex)}  ETH</small>
              <small>Time: {  tran.timestamp._hex}</small>
              <small>Message: {tran.message}</small>
              <hr />

            </div>)): (<h2>Loading...</h2>)}
              
          </div>
      </div>)}
    </div>
  );
}

export default App;
