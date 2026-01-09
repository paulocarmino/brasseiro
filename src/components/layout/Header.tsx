import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, Info } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            React Boilerplate
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">
                <Info className="w-4 h-4 mr-2" />
                About
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
