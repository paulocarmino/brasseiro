import { Outlet } from "react-router-dom"
import { BrewTopBar } from "./BrewTopBar"
import { Toaster } from "@/components/ui/toaster"

export function BrewLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrewTopBar />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-4">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  )
}
