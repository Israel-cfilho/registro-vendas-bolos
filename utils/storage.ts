import type { Venda } from "../types"

// Funções para gerenciar localStorage
export const salvarVenda = (venda: Venda): void => {
  const vendas = obterVendas()
  vendas.push(venda)
  localStorage.setItem("vendas-bolos", JSON.stringify(vendas))
}

export const obterVendas = (): Venda[] => {
  if (typeof window === "undefined") return []

  const vendas = localStorage.getItem("vendas-bolos")
  return vendas ? JSON.parse(vendas) : []
}

export const obterVendasPorMes = (mes: string): Venda[] => {
  const todasVendas = obterVendas()
  return todasVendas.filter((venda) => venda.mes === mes)
}

export const obterMesesComVendas = (): string[] => {
  const vendas = obterVendas()
  const meses = vendas.map((venda) => venda.mes)
  return [...new Set(meses)].sort().reverse() // mais recente primeiro
}
