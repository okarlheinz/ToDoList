import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreventReload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleReload = (event) => {
      event.preventDefault();
      navigate("/"); // Redireciona para a página inicial
    };

    window.addEventListener("beforeunload", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, [navigate]);

  return null; // Não renderiza nada na tela
};

export default PreventReload;
