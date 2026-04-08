import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { BrewLayout } from "@/components/layout/BrewLayout"
import { Home } from "@/routes/Home"
import { NovaBrassagem } from "@/routes/NovaBrassagem"
import { Brassagem } from "@/routes/Brassagem"
import { Historico } from "@/routes/Historico"
import { Glossario } from "@/routes/Glossario"
import { NotFound } from "@/routes/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="nova-brassagem" element={<NovaBrassagem />} />
          <Route path="historico" element={<Historico />} />
          <Route path="glossario" element={<Glossario />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="brassagem/:id" element={<BrewLayout />}>
          <Route index element={<Brassagem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
