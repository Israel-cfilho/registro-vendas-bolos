export interface Bolo {
  id: number
  sabor: string
  preco: number
}

export interface ItemVenda {
  sabor: string
  preco: number
  quantidade: number
}

export interface Venda {
  id: string
  nomeCliente: string
  itens: ItemVenda[]
  formaPagamento: "pix" | "dinheiro"
  total: number
  data: string
  mes: string
}
