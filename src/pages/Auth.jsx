import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebaseConfig"; // Importando corretamente o app
import "./Auth.css";
import Logo from "../assets/Prancheta 2.png"
import Fundo from "../assets/wallpaper.jpg"

const auth = getAuth(app);

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login bem-sucedido!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Cadastro realizado!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <img src={Logo} alt="coderx" />
        <h1>Todo List</h1>
      </div>
      <div className="form-box">
        <h2>{isLogin ? "Login" : "Cadastre-se"}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
        </form>
        <label htmlFor="">
          Ainda não tem uma conta?
          <button className="sign-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Cadastre-se" : "Já tenho uma conta"}
          </button>
        </label>
      </div>
    </div>
  );
};

export default Auth;
