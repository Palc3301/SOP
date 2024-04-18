import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { TipoEscalonador } from '../escalonador/TipoEscalonador'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcess'

export class Nucleo {
  private id: number
  private numeroInstrucoesPorClock: number
  private _subProcesso: SubProcesso | undefined

  constructor(id: number, numeroInstrucoesPorClock: number) {
    this.id = id
    this.numeroInstrucoesPorClock = numeroInstrucoesPorClock

    this._subProcesso = undefined
  }

  public executar({
    prioridade,
    tempoExecucao,
    tipo,
  }: Omit<RespostaExecucaoEscalonador, 'element'>) {
    if (tipo === TipoEscalonador.FILA) {
      console.log(`Running ${this._subProcesso?.getId}`)
    }

    if (tipo === TipoEscalonador.PRIORIDADE) {
      if (prioridade < 2) {
          console.log(`Running: ${this._subProcesso?.getId} - priority: Low`);
      } else if (prioridade === 2) {
          console.log(`Running: ${this._subProcesso?.getId} - priority: Medium`);
      } else {
          console.log(`Running: ${this._subProcesso?.getId} - priority: Critical`);
      }
  }

    if (tipo === TipoEscalonador.ASCDESC) {
      console.log(
        `Running ${this._subProcesso?.getId} - Runtime: ${tempoExecucao}`,
      )
    }

    if (tipo === TipoEscalonador.LOTERIA) {
      console.log(`Running ${this._subProcesso?.getId}`)
    }

    if (tipo === TipoEscalonador.ROUND_ROBIN) {
      console.log(`Running ${this._subProcesso?.getId}`)
    }

    this.finalizar()
  }

  private finalizar() {
    if (
      this._subProcesso &&
      this._subProcesso.getProcesso.getInstrucoes >
        this._subProcesso.getProcesso.getInstrucoesExecutadas
    ) {
      this._subProcesso.finalizar()
      this._subProcesso.getProcesso.setInstrucoesExecutadas(
        this._subProcesso.getInstrucoes,
      )
      this._subProcesso.getProcesso.verificarConclusaoSubProcesso()
      this._subProcesso = undefined
    }
  }

  public get getId() {
    return this.id
  }

  public get subProcesso(): SubProcesso | undefined {
    return this._subProcesso
  }

  public set subProcesso(subProcesso: SubProcesso | undefined) {
    this._subProcesso = subProcesso
  }
}