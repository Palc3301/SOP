export class Processo {
  private id: string
  private tamanho: number
  private instrucoes: number
  private instrucoesExecutadas: number
  private subProcesso: string[]
  private tempoExecucao: number
  private prioridade: number
  private inputMemory: number

  public static COUNT_PROCESS = 0

  constructor(tamanho: number, tempoExecucao: number, prioridade?:number) {
    Processo.COUNT_PROCESS++
    this.inputMemory = Date.now()

    this.id = `P${Processo.COUNT_PROCESS}`
    this.tamanho = tamanho
    this.tempoExecucao = tempoExecucao

    this.subProcesso = []
    this.inserirSubProcesso()

    this.instrucoes = this.subProcesso.length * 7
    this.instrucoesExecutadas = 0

    

    const prioridadeAleatoria = Math.floor(Math.random() * 2)
    this.prioridade = prioridade||prioridadeAleatoria
  }
  
  public set setinputmemory(inputMemory : number) {
    this.inputMemory = inputMemory;
  }
  
  private inserirSubProcesso() {
    this.subProcesso = []
    for (let i = 0; i < this.getTamanho; i++) {
      this.subProcesso.push(`${this.id}-${i}`)
    }
  }

  public verificarConclusaoSubProcesso() {
    if (this.instrucoesExecutadas === this.instrucoes) {
      console.log(
        `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`,
      )
      console.log(`Process ${this.id} finished`)
      console.log(
        `$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`,
      )
    }
  }

  public setInstrucoesExecutadas(quantidade: number) {
    this.instrucoesExecutadas += quantidade
  }

  public get getInputMemory() {
    return this.inputMemory
  }

  public get getInstrucoesExecutadas() {
    return this.instrucoesExecutadas
  }

  public get getId() {
    return this.id
  }

  public get getTamanho() {
    return this.tamanho
  }

  public get getInstrucoes() {
    return this.instrucoes
  }

  public get getSubProcesso() {
    return this.subProcesso
  }

  public get getTempoExecucao() {
    return this.tempoExecucao
  }

  public get getPrioridade() {
    return this.prioridade
  }
}
