import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/useProducts"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Home() {
  const { products, isLoading } = useProducts()
  const { toast } = useToast()

  const handleProductClick = (productName: string) => {
    toast({
      title: "Product Selected",
      description: `You clicked on ${productName}`,
    })
  }

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to React Boilerplate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern, production-ready starter template with all the essentials configured and
          working.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Example Products (Mock Data)</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-bold">${product.price}</p>
                  <Button onClick={() => handleProductClick(product.title)} className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-2">What's Included:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <li>✅ Vite + React 19 + TypeScript</li>
          <li>✅ Tailwind CSS configured</li>
          <li>✅ shadcn/ui components</li>
          <li>✅ React Router for navigation</li>
          <li>✅ Zustand for state management</li>
          <li>✅ Mock data for prototyping</li>
          <li>✅ ESLint + Prettier</li>
          <li>✅ Path aliases (@/) working</li>
        </ul>
      </section>
    </div>
  )
}
