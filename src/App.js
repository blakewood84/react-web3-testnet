import './App.css';
import { useState } from 'react';
import { InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import Web3 from "web3";
import Tx from "ethereumjs-tx";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://kovan.infura.io/v3/4835aacd00f14c729f65403918fe2367"
  )
);

function App() {

  const [field, setField] = useState({
    sendingAddress: '',
    receivingAddress: '',
    privateKey: '',
    amount: 0,
    checkBalanceInput: '',
    balance: 0
  })

  // const [sendingAddress, setSendingAddress] = useState('')
  // const [receivingAddress, setReceivingAddress] = useState('')
  // const [privateKey, setPrivateKey] = useState('')
  // const [amount, setAmount] = useState(0)
  // const [sendingAddressBalance, setSendingAddressBalance] = useState(0)
  // const [receivingAddressBalance, setReceivingAddressBalance] = useState(0)

  const handleInputChange = (event) => {
    setField({
      ...field,
      [event.target.name]: event.target.value
    })
  }

  const checkAddressValid = async (address) => {
    return await web3.utils.isAddress(address)
    
  }

  const getBalance = async () => {
    var isValid = await checkAddressValid(field['checkBalanceInput'])
    if(isValid) {
      var getBalance = await web3.eth.getBalance(field['checkBalanceInput'])
      console.log(getBalance)
      setField({
        ...field,
        balance: web3.utils.fromWei(getBalance, 'ether')
      })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{width: '400px'}}>
          <div className="mb-3" style={{margin: '0px', padding: '0px', width: '100%'}}>
            <Row>
              <Col>ETH Balance:</Col>
              <Col style={{textAlign: 'left'}}>{field['balance']}</Col>
            </Row>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_send.svg" /></InputGroup.Text>
            <FormControl
              name="sendingAddress"
              onChange={handleInputChange}
              placeholder="Sending Address"
              aria-label="Sending Address"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_key.svg" /></InputGroup.Text>
            <FormControl
              name="privateKey"
              onChange={handleInputChange}
              placeholder="Private Key"
              aria-label="Private Key"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_receive.svg" /></InputGroup.Text>
            <FormControl
              name="receivingAddress"
              onChange={handleInputChange}
              placeholder="Receiving Address"
              aria-label="Receiving Address"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_ethereum.svg" /></InputGroup.Text>
            <FormControl
              name="amount"
              onChange={handleInputChange}
              placeholder="Amount"
              aria-label="Amount"
            />
          </InputGroup>
          <Button variant="primary" size="lg" className="mb-4" style={{float: 'right', width: '100%'}}>Send</Button>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_ethereum.svg" /></InputGroup.Text>
            <FormControl
              name="checkBalanceInput"
              onChange={handleInputChange}
              placeholder="Sending Address"
              aria-label="Sending Address"
            />
          </InputGroup>
          <Button onClick={getBalance} variant="primary" size="lg" style={{float: 'right', width: '100%'}}>Check Balance</Button>
        </div>
        
      </header>
    </div>
  );
}

export default App;
