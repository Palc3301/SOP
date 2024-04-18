import { Processo } from './process/Processo'
import { TipoChamadaSistema } from './so/TipoChamadaSistema'
import { OperacaoSistema } from './so/OperacaoSistema'
import { criarProcesso } from './process/CriarProcessos'





const p1 = criarProcesso(130,10,1)
const p2 = criarProcesso(90,5,2)
const p3 = criarProcesso(34,15,3)


//Swap

// const p1 = criarProcesso(92,10,1)
// const p2 = criarProcesso(90,5,2)
// const p3 = criarProcesso(34,15,3)
// const p4 = criarProcesso(58)
// const p5 = criarProcesso(69)

// const chamadas = [
//     { tipoChamada: TipoChamadaSistema.ACORDAR, processo: p1 as Processo },
//   ]
// chamadas.forEach(chamada => OperacaoSistema.chamadaSistema(chamada))



// console.log(OperacaoSistema.gerenciadorHD.getHd);