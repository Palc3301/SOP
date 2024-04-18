import { OperacaoSistema } from "../so/OperacaoSistema";
import { TipoChamadaSistema } from "../so/TipoChamadaSistema";
import { Processo } from "./Processo";


export function criarProcesso(tamanho:number, tempo?:number,  prioridade?:number) {
  const processo = OperacaoSistema.chamadaSistema({
    tipoChamada: TipoChamadaSistema.CRIAR_EM_MEMORIA,
    tamanhoProcesso: tamanho, 
    tempoExecucao: tempo,
    prioridade: prioridade
  })
  OperacaoSistema.chamadaSistema({
    tipoChamada: TipoChamadaSistema.ESCREVER_EM_MEMORIA,
    processo: processo as Processo,
  })
  return processo
}