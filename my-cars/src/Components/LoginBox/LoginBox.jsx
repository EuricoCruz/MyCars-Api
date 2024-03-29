import React, {useState, useEffect} from 'react';
import InputCustomizado from '../InputCustomizado/InputCustomizado';
import axios from 'axios'
import {useCookies} from 'react-cookie'
import "./LoginBox.scss"
import {useHistory} from 'react-router-dom'


export default function LoginBox() {
  const [cookies, setCookie] = useCookies(['name']);
  const [newUser, setNewUser] = useState(false)
  const [values, setValues] = useState({});
  const [hasMsg, setHasMsg] = useState(false)
  const [message, setMessage] = useState('')
  const history = useHistory()


  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    setHasMsg(false)
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    const {email, password, name, passwordConfirmation} = values;
    console.log(email, password)
    if(!newUser) {
      if(!email || !password || email === "" || password === "") {
      setHasMsg(true)
      setMessage("É preciso inserir um email e senha")
      return;
      }
      axios.post(`http://localhost:5000/users/login`, {email, password} )
      .then(res => {
        setCookie("user", res.data)
        history.push("/cars")
      })
      .catch(error => {
        if(error.response.status === 400) {
          setHasMsg(true)
          setMessage("A senha ou o usuário estão incorretos")
        }
        if(error.response.status === 401) {
          setHasMsg(true)
          setMessage("A senha ou o usuário estão incorretos")
        }
        if(error.response.status === 402) {
          setHasMsg(true)
          setMessage("Usuário não cadastrado")
        }
    

      })
    } else {
      if(!email || !password || !passwordConfirmation || !name || email === "" || password === "" || name === "" || passwordConfirmation === "") {
      setHasMsg(true)
      setMessage("É preciso preencher todos os campos")

      return;
    } 
    if(password !== passwordConfirmation) {
      setHasMsg(true)
      setMessage("As senhas cadastradas não coincidem")
      return;
    }
      axios.post(`http://localhost:5000/users`, {email, password, name} )
      .then(res => {
        axios.post(`http://localhost:5000/users/login`, {email, password} )
        .then(res => {
          setCookie("user", res.data)
          history.push("/cars")
        })
        .catch(err => console.log(err))
      })
      .catch(err => {
        setHasMsg(true)
        setMessage("Ocorreu um erro, tente novamente")
        return;
      })
    }
  }
  
  console.log(values)
  return (
    <div className="login-box-container"> 

      {!newUser ? 
        <form  className="form-container" onSubmit={handleSubmit}>
        <h1 className="box-title">Faça seu login</h1>
        {hasMsg && <span className="error-message">{message}</span>}
        <InputCustomizado 
          label="E-mail"
          type="email"
          name="email"
          onChange={(event) => handleChange(event)}
        />  
        <InputCustomizado 
          label="Senha"
          type="password"
          name="password"
          onChange={(event) => handleChange(event)}
        />  
        <div onClick={() => setNewUser(true)}>
          <span className="trade-form">Ainda não tem uma senha? Cadastre-se</span>
        </div>
        <button className="call-to-action" type="submit">Cadastrar</button>
        </form>
        : 
      <form className="form-container" onSubmit={handleSubmit}>
      <h1 className="box-title">Faça seu cadastro</h1>
        {hasMsg && <span>{message}</span>}
        <InputCustomizado 
          label="Digite seu nome"
          type="text"
          name="name"
          onChange={(event) => handleChange(event)}
        />  
        <InputCustomizado 
          label="Digite um e-mail"
          type="email"
          name="email"
          onChange={(event) => handleChange(event)}
        />  
        <InputCustomizado 
          label="Digite sua senha"
          type="password"
          name="password"
          onChange={(event) => handleChange(event)}
        />  
        <InputCustomizado 
          label="Confirme a senha"
          type="password"
          name="passwordConfirmation"
          onChange={(event) => handleChange(event)}
        />
        <div onClick={() => setNewUser(false)}>
          <span className="trade-form">retornar para login</span>
        </div>
        <button className="call-to-action" type="submit">Cadastrar</button>
        </form>  
      }
    </div>
  )
}