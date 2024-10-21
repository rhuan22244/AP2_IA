function distancia(cidade1, cidade2) {
  const dx = cidade1.x - cidade2.x;
  const dy = cidade1.y - cidade2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calcularCusto(rota, cidades) {
  let custo = 0;
  for (let i = 0; i < rota.length - 1; i++) {
      const cidadeAtual = cidades[rota[i]];
      const proximaCidade = cidades[rota[i + 1]];
      custo += distancia(cidadeAtual, proximaCidade);
  }
  custo += distancia(cidades[rota[rota.length - 1]], cidades[rota[0]]);
  return custo;
}

function gerarRota(n) {
  const rota = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rota[i], rota[j]] = [rota[j], rota[i]];
  }
  return rota;
}

function gerarPopulacao(tamanhoPopulacao, nCidades) {
  return Array.from({ length: tamanhoPopulacao }, () => gerarRota(nCidades));
}

function selecaoPorTorneio(populacao, cidades, k = 3) {
  const torneio = Array.from({ length: k }, () => populacao[Math.floor(Math.random() * populacao.length)]);
  torneio.sort((a, b) => calcularCusto(a, cidades) - calcularCusto(b, cidades));
  return torneio[0];
}

function crossover(pai1, pai2) {
  const tamanho = pai1.length;
  const inicio = Math.floor(Math.random() * tamanho);
  const fim = inicio + Math.floor(Math.random() * (tamanho - inicio));
  const filho = Array(tamanho).fill(-1);
  
  for (let i = inicio; i < fim; i++) {
      filho[i] = pai1[i];
  }
  
  let pointer = 0;
  for (let i = 0; i < tamanho; i++) {
      const gene = pai2[i];
      if (!filho.includes(gene)) {
          while (filho[pointer] !== -1) {
              pointer++;
          }
          filho[pointer] = gene;
      }
  }
  return filho;
}

function mutacao(rota, taxaMutacao) {
  for (let i = 0; i < rota.length; i++) {
      if (Math.random() < taxaMutacao) {
          const j = Math.floor(Math.random() * rota.length);
          [rota[i], rota[j]] = [rota[j], rota[i]];
      }
  }
  return rota;
}

function algoritmoGenetico(cidades, tamanhoPopulacao = 100, geracoes = 500, taxaMutacao = 0.01) {
  const nCidades = cidades.length;
  let populacao = gerarPopulacao(tamanhoPopulacao, nCidades);
  
  for (let geracao = 0; geracao < geracoes; geracao++) {
      const novaPopulacao = [];
      
      for (let i = 0; i < tamanhoPopulacao; i++) {
          const pai1 = selecaoPorTorneio(populacao, cidades);
          const pai2 = selecaoPorTorneio(populacao, cidades);
          let filho = crossover(pai1, pai2);
          filho = mutacao(filho, taxaMutacao);
          novaPopulacao.push(filho);
      }
      
      populacao = novaPopulacao;

      const melhorRota = populacao.reduce((melhor, rota) => (
          calcularCusto(rota, cidades) < calcularCusto(melhor, cidades) ? rota : melhor
      ), populacao[0]);
      
      const melhorCusto = calcularCusto(melhorRota, cidades);
      console.log(`Geração ${geracao + 1}: Melhor custo = ${melhorCusto}`);
  }

  const melhorRota = populacao.reduce((melhor, rota) => (
      calcularCusto(rota, cidades) < calcularCusto(melhor, cidades) ? rota : melhor
  ), populacao[0]);
  
  return { melhorRota, melhorCusto: calcularCusto(melhorRota, cidades) };
}

const cidades = [
  { x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 3 },
  { x: 5, y: 2 }, { x: 6, y: 6 }, { x: 8, y: 3 },
  { x: 7, y: 7 }, { x: 9, y: 9 }
];

const resultado = algoritmoGenetico(cidades);
console.log("Melhor rota encontrada:", resultado.melhorRota);
console.log("Com custo total de:", resultado.melhorCusto);

  