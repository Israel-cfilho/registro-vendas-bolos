"use client"

import { useState } from "react"
import { FormularioVenda } from "../components/FormularioVendas"
import { ListaVendas } from "../components/ListaVendas"

export default function Home() {
  const [atualizar, setAtualizar] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Controle de Vendas - Bolos de Rolo</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormularioVenda onVendaAdicionada={() => setAtualizar(!atualizar)} />
        <ListaVendas atualizarLista={atualizar} />
      </div>
    </main>
  )
}
