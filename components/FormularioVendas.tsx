"use client"

import type React from "react"
import { useState } from "react"
import { bolosDisponiveis } from "../data/bolos"
import type { Venda, ItemVenda } from "../types"
import { salvarVenda } from "../utils/storage"

interface FormularioVendaProps {
  onVendaAdicionada: () => void
}

export function FormularioVenda({ onVendaAdicionada }: FormularioVendaProps) {
  const [nomeCliente, setNomeCliente] = useState("")
  const [saborSelecionado, setSaborSelecionado] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [formaPagamento, setFormaPagamento] = useState<"pix" | "dinheiro">("pix")
  const [itens, setItens] = useState<ItemVenda[]>([])

  const boloSelecionado = bolosDisponiveis.find((bolo) => bolo.sabor === saborSelecionado)
  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  const adicionarItem = () => {
    if (!saborSelecionado || !boloSelecionado) {
      alert("Selecione um sabor!")
      return
    }

    const novoItem: ItemVenda = {
      sabor: saborSelecionado,
      preco: boloSelecionado.preco,
      quantidade,
    }

    setItens([...itens, novoItem])
    setSaborSelecionado("")
    setQuantidade(1)
  }

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeCliente || itens.length === 0) {
      alert("Por favor, preencha o nome do cliente e adicione pelo menos um item!")
      return
    }

    const agora = new Date()
    const venda: Venda = {
      id: Date.now().toString(),
      nomeCliente,
      itens,
      formaPagamento,
      total,
      data: agora.toLocaleDateString("pt-BR"),
      mes: `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`,
    }

    salvarVenda(venda)

    setNomeCliente("")
    setSaborSelecionado("")
    setQuantidade(1)
    setFormaPagamento("pix")
    setItens([])

    onVendaAdicionada()
  }

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Nova Venda</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
              Nome do Cliente
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
                        focus:ring-blue-500 focus:border-blue-500 mb-4"
              id="cliente"
              type="text"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              placeholder="Digite o nome do cliente"
              required
            />
          </div>

          <div className="border border-gray-200 rounded-md p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Bolos</h3>

            <div className="mb-3">
              <label htmlFor="sabor" className="block text-sm font-medium text-gray-700 mb-1">
                Sabor do Bolo
              </label>
              <select
                id="sabor"
                onChange={(e) => setSaborSelecionado(e.target.value)}
                value={saborSelecionado}
                className="w-full px-3 py-2 border border-gray-300
                          rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:border-blue-500 mb-2"
              >
                <option value="">Selecione o sabor</option>
                {bolosDisponiveis.map((bolo) => (
                  <option key={bolo.id} value={bolo.sabor}>
                    {bolo.sabor} - R$ {bolo.preco.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade
              </label>
              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300
                          rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:border-blue-500 mb-2"
              />
            </div>

            <button
              type="button"
              onClick={adicionarItem}
              className="w-full bg-green-800 text-white font-semibold py-2 px-4 rounded-md
                      hover:bg-green-700 focus:outline-none focus:ring-2 
                      focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Adicionar Item
            </button>
          </div>

          {itens.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Itens Adicionados:</h3>
              <div className="space-y-2">
                {itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">
                      {item.quantidade}x: {item.sabor} - R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="pagamento" className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento
            </label>
            <select
              id="pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as "pix" | "dinheiro")}
              className="w-full px-3 py-2 border border-gray-300
                        rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500"
            >
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
          </div>

          <div className="p-3 bg-green-100 rounded-md mb-4">
            <p className="text-lg font-semibold text-green-600">Total: R$ {total.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md
                    hover:bg-blue-700 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrar Venda
          </button>
        </form>
      </div>
    </div>
  )
}
