import { TipoEscalonador } from '../escalonador/TipoEscalonador'
import { SubProcesso } from '../process/SubProcess'

export interface RespostaExecucaoEscalonador {
  elemento: SubProcesso
  tipo: TipoEscalonador
  prioridade: number
  tempoExecucao: number
}
