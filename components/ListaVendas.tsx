"use client"

import { useState, useEffect } from "react"
import type { Venda } from "../types"
import { obterVendasPorMes, obterMesesComVendas } from "../utils/storage"

interface ListarVendasProps {
  atualizarLista: boolean
}

export function ListaVendas({ atualizarLista }: ListarVendasProps) {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [mesSelecionado, setMesSelecionado] = useState("")
  const [mesesDisponiveis, setMesesDisponiveis] = useState<string[]>([])
  const [faturamentoMensal, setFaturamentoMensal] = useState<{
    [key: string]: number
  }>({})

  useEffect(() => {
    const meses = obterMesesComVendas()
    setMesesDisponiveis(meses)

    const faturamento: { [key: string]: number } = {}
    meses.forEach((mes) => {
      const vendasDoMes = obterVendasPorMes(mes)
      faturamento[mes] = vendasDoMes.reduce((total, venda) => total + (venda.total || 0), 0)
    })
    setFaturamentoMensal(faturamento)

    if (meses.length > 0 && !mesSelecionado) {
      setMesSelecionado(meses[0]) //pega o mes mais recente
    }
  }, [atualizarLista])

  useEffect(() => {
    if (mesSelecionado) {
      const vendasDoMes = obterVendasPorMes(mesSelecionado)
      setVendas(vendasDoMes)
    }
  }, [mesSelecionado, atualizarLista])

  const formatarMes = (mes: string) => {
    const [ano, mesNum] = mes.split("-")
    const nomeMeses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return `${nomeMeses[Number.parseInt(mesNum) - 1]} ${ano}`
  }

  const totalVendas = vendas.reduce((total, venda) => total + (venda.total || 0), 0)
  const faturamentoTotal = Object.values(faturamentoMensal).reduce((total, valor) => total + (valor || 0), 0)

  return (
    <div className="w-full space-y-6">
      {mesesDisponiveis.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Faturamento Mensal</h2>
          </div>
          <div className="p-6">
            <div className="mb-4 p-4 bg-blue-100 rounded-md">
              <p className="font-bold text-blue-800">Faturamento Total: R$ {faturamentoTotal.toFixed(2)}</p>
            </div>
            <div className="grid gap-3">
              {mesesDisponiveis.map((mes) => (
                <div key={mes} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                  <span className="font-bold text-gray-700">{formatarMes(mes)}</span>
                  <span className="font-bold text-green-600">R$ {(faturamentoMensal[mes] || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendas Registradas</h2>
          {mesesDisponiveis.length > 0 && (
            <div className="w-48">
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500"
              >
                <option value="">Selecione o mês</option>
                {mesesDisponiveis.map((mes) => (
                  <option key={mes} value={mes}>
                    {formatarMes(mes)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="p-6">
          {vendas.length === 0 ? (
            <p>Nenhuma venda registrada neste mês.</p>
          ) : (
            <>
              <div className="mb-4 p-3 bg-green-100 rounded-md">
                <p className="font-semibold text-green-800">
                  Total do mês: R$ {totalVendas.toFixed(2)} ({vendas.length} vendas)
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {vendas.map((venda) => (
                  <div key={venda.id} className="border border-gray-200 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <p>
                        <strong>Cliente:</strong> {venda.nomeCliente || "N/A"}
                      </p>
                      <p>
                        <strong>Data:</strong> {venda.data || "N/A"}
                      </p>
                      <p>
                        <strong>Pagamento:</strong> {venda.formaPagamento ? venda.formaPagamento.toUpperCase() : "N/A"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <strong className="text-sm">Itens:</strong>
                      <div className="mt-1 space-y-1">
                        {venda.itens && venda.itens.length > 0 ? (
                          venda.itens.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                              <span>
                                {item.quantidade}x: {item.sabor} - R$ {(item.preco * item.quantidade).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="bg-gray-50 p-2 rounded text-sm">Nenhum item registrado</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-md p-3">
                      <p className="font-semibold text-green-800">
                        <strong>Total:</strong> R$ {(venda.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
