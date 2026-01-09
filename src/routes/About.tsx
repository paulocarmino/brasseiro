import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>

      <h1 className="text-4xl font-bold">About This Boilerplate</h1>

      <Card>
        <CardHeader>
          <CardTitle>Purpose</CardTitle>
          <CardDescription>Why this boilerplate exists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This boilerplate is designed to eliminate the tedious setup process when starting new
            React projects. It includes all the modern tools and libraries you need, pre-configured
            and working together.
          </p>
          <p>
            Instead of spending hours setting up Tailwind, shadcn/ui, routing, state management, and
            other essentials, you can start building features immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mock-First Approach</CardTitle>
          <CardDescription>Start fast, scale when ready</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The boilerplate starts with <strong>mock data</strong> to enable rapid prototyping
            without backend dependencies. When you're ready to add a real backend:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Install Supabase client: npm install @supabase/supabase-js</li>
            <li>Copy template: cp templates/supabase.ts.example src/lib/supabase.ts</li>
            <li>Configure environment variables in .env</li>
            <li>Update api.ts to use Supabase instead of mocks</li>
          </ol>
          <p className="text-sm text-muted-foreground">
            See CLAUDE.md for detailed migration instructions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Core</h4>
              <ul className="text-sm space-y-1">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Vite</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Styling</h4>
              <ul className="text-sm space-y-1">
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
                <li>• Lucide Icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">State & Routing</h4>
              <ul className="text-sm space-y-1">
                <li>• React Router</li>
                <li>• Zustand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Code Quality</h4>
              <ul className="text-sm space-y-1">
                <li>• ESLint</li>
                <li>• Prettier</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
