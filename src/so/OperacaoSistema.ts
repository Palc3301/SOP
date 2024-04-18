import { Escalonador } from '../escalonador/Escalonador'
import { MetodoAscDesc } from '../escalonador/MetodoAscDesc'
import { MetodoFila } from '../escalonador/MetodoFila'
import { MetodoLoteria } from '../escalonador/MetodoLoteria'
import { MetodoPrioridade } from '../escalonador/MetodoPrioridade'
import { MetodoRoundRobin } from '../escalonador/MetodoRoundRobin'
import { GerenciadorHD } from '../memoria/GerenciadorHD'
import { GerenciadorMemoria } from '../memoria/GerenciadorMemoria'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcess'
import { TipoChamadaSistema } from './TipoChamadaSistema'

interface PropsChamadaSistema {
  tipoChamada: TipoChamadaSistema
  tamanhoProcesso?: number
  processo?: Processo
  tempoExecucao?: number
  prioridade?: number
}

export class OperacaoSistema {
  public static gerenciadorMemoria = new GerenciadorMemoria()
  public static gerenciadorHD = new GerenciadorHD()
  public static escalonador: Escalonador = new MetodoFila()

  public static chamadaSistema({
    tipoChamada,
    tamanhoProcesso,
    processo,
    tempoExecucao,
    prioridade
  }: PropsChamadaSistema): Processo | void | SubProcesso[] {
    if (tipoChamada === TipoChamadaSistema.CRIAR_EM_MEMORIA && tamanhoProcesso && !processo) {
      const tempoExecucaoValor = typeof tempoExecucao !== 'undefined' ? tempoExecucao : 0;
      return new Processo(tamanhoProcesso, tempoExecucaoValor, prioridade)
    }

    if (tipoChamada === TipoChamadaSistema.ESCREVER_EM_MEMORIA && processo) {
      const checarEscrita = this.gerenciadorMemoria.verificarEscrita(processo)

      if (checarEscrita) {
        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
      } else {
        // const processos = this.gerenciadorMemoria.swap(processo)

        // for (let i = 0; i < processos.length; i++) {
        //   const elemento = processos[i]
        //   this.gerenciadorHD.gravar(elemento)
        //   this.escalonador.encerrar(elemento)
        // }

        // this.gerenciadorMemoria.escrever(processo)
        // this.escalonador.adicionarSubProcesso(processo)
        console.log('Page Fault');
        
      }
    }

    if (tipoChamada === TipoChamadaSistema.LER_EM_MEMORIA && processo) {
      return this.gerenciadorMemoria.ler(processo)
    }

    if (tipoChamada === TipoChamadaSistema.EXCLUIR_EM_MEMORIA && processo) {
      this.escalonador.encerrar(processo)
      return this.gerenciadorMemoria.excluir(processo)
    }

    if (tipoChamada === TipoChamadaSistema.PARAR && processo) {
      this.escalonador.encerrar(processo)
    }

    if (tipoChamada === TipoChamadaSistema.ACORDAR && processo) {
      const checarEscrita = this.gerenciadorMemoria.verificarEscrita(processo)

      if (checarEscrita) {
        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
        this.gerenciadorHD.remover(processo)
      } else {
        const processos = this.gerenciadorMemoria.swap(processo)

        for (let i = 0; i < processos.length; i++) {
          const elemento = processos[i]
          this.gerenciadorHD.gravar(elemento)
          this.escalonador.encerrar(elemento)
        }
        processo.setinputmemory = Date.now()

        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
        this.gerenciadorHD.remover(processo)
      }
    }
  }
}