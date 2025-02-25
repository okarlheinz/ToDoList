const DataAtual = () => {
    const dataHoje = new Date().toLocaleDateString("pt-BR");
  
    return <span>{dataHoje}</span>;
  };
  
  export default DataAtual;
  