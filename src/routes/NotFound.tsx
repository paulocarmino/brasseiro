import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Home } from "lucide-react"

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild>
        <Link to="/">
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Link>
      </Button>
    </div>
  )
}
