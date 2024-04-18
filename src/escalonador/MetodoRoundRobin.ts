import { TipoChamadaSistema } from '../so/TipoChamadaSistema'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { TipoEscalonador } from './TipoEscalonador'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcess'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { GerenciadorCpu } from '../cpu/GerenciadorCpu'

export class MetodoRoundRobin extends FilaEscalonador {
  private countExecutedSubProcess: number = 0
  private processInExecution: Processo | null = null
  private graficoQuantum: Map<string, number> = new Map()
  private quantum: number
  
  constructor(quantum: number) {
    super()
    this.quantum = quantum * 1000
  }

  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)

    const subProcessos = OperacaoSistema.chamadaSistema({
      tipoChamada: TipoChamadaSistema.LER_EM_MEMORIA,
      processo,
    }) as SubProcesso[]

    subProcessos.forEach((sp) => {
      this.filaSubProcessos.push(sp)
    })

    this.processInExecution = this.filaProcessos[0]
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      if (
        this.processInExecution?.getId &&
        elemento.getProcesso.getId === this.processInExecution.getId
      ) {
        this.countExecutedSubProcess++
      }
      
      console.log(this.processInExecution?.getId)

      const aux = this.filaSubProcessos.map((sp) => sp.getProcesso.getId)
      
      if (!aux.includes(elemento.getProcesso.getId)) {
        this.filaProcessos.shift()
        this.processInExecution = this.filaProcessos[0]
        this.countExecutedSubProcess = 0
      }

      const valueQuantum = this.graficoQuantum.get(elemento.getProcesso.getId)

      if (
        !valueQuantum &&
        this.countExecutedSubProcess === GerenciadorCpu.NUMERO_DE_NUCLEOS
      ) {
        this.graficoQuantum.set(elemento.getProcesso.getId, GerenciadorCpu.CLOCK)

        if (GerenciadorCpu.CLOCK >= this.quantum) {
          this.rotacionar(elemento.getProcesso.getId)
        }

        this.countExecutedSubProcess = 0
      }

      if (
        valueQuantum &&
        this.countExecutedSubProcess === GerenciadorCpu.NUMERO_DE_NUCLEOS
      ) {
        this.graficoQuantum.set(
          elemento.getProcesso.getId,
          GerenciadorCpu.CLOCK + valueQuantum,
        )

        this.countExecutedSubProcess = 0
      }

      const value = this.graficoQuantum.get(elemento.getProcesso.getId)

      if (
        !(GerenciadorCpu.CLOCK >= this.quantum) &&
        value &&
        value >= this.quantum
      ) {
        this.rotacionar(elemento.getProcesso.getId)
      }
      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.ROUND_ROBIN,
      }
    } else {
      return undefined
    }
  }

  public rotacionar(processoid:string) {
    if (
      this.processInExecution &&
      this.processInExecution.getInstrucoes >
        this.processInExecution.getInstrucoesExecutadas
    ) {
      const subProcessosPorProcesso = this.getSubProcessoPorProcesso()

      this.removerProcessoEsubProcesso()

      this.adicionarProcessoEsubProcessoNoFinal(subProcessosPorProcesso)

      this.processInExecution = this.filaProcessos[0]
      this.countExecutedSubProcess = 0
      this.graficoQuantum.set(processoid,0)
    }
  }

  private getSubProcessoPorProcesso() {
    return this.filaSubProcessos.filter(
      (sp) => sp.getProcesso.getId === this.processInExecution?.getId,
    )
  }

  private removerProcessoEsubProcesso() {
    this.filaProcessos.shift()

    this.filaSubProcessos = this.filaSubProcessos.filter(
      (sp) => sp.getProcesso.getId !== this.processInExecution?.getId,
    )
  }

  private adicionarProcessoEsubProcessoNoFinal(subProcessos: SubProcesso[]) {
    if (this.processInExecution) {
      this.filaProcessos.push(this.processInExecution)

      subProcessos.forEach((sp) => {
        this.filaSubProcessos.push(sp)
      })
    }
  }
}