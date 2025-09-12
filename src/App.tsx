import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Plus, Minus, Receipt, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface FoodItem {
  id: string
  name: string
  description: string
  pricePerPerson: number
  category: string
  minimumOrder?: number
}

interface SelectedItem extends FoodItem {
  quantity: number
}

const FOOD_CATEGORIES = [
  { id: 'appetizers', label: 'Appetizers', icon: '🍤' },
  { id: 'mains', label: 'Main Courses', icon: '🍖' },
  { id: 'sides', label: 'Side Dishes', icon: '🥗' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' },
  { id: 'beverages', label: 'Beverages', icon: '🥤' }
]

const MENU_ITEMS: FoodItem[] = [
  // Appetizers
  { id: 'bruschetta', name: 'Bruschetta Platter', description: 'Fresh tomatoes, basil, and mozzarella on toasted bread', pricePerPerson: 4.50, category: 'appetizers' },
  { id: 'shrimp-cocktail', name: 'Shrimp Cocktail', description: 'Jumbo shrimp with cocktail sauce', pricePerPerson: 8.75, category: 'appetizers' },
  { id: 'cheese-board', name: 'Artisan Cheese Board', description: 'Selection of fine cheeses with crackers and fruits', pricePerPerson: 6.25, category: 'appetizers' },
  { id: 'stuffed-mushrooms', name: 'Stuffed Mushrooms', description: 'Button mushrooms stuffed with herbs and breadcrumbs', pricePerPerson: 5.50, category: 'appetizers' },

  // Mains
  { id: 'grilled-chicken', name: 'Grilled Chicken Breast', description: 'Herb-marinated chicken with lemon pepper seasoning', pricePerPerson: 18.00, category: 'mains' },
  { id: 'beef-tenderloin', name: 'Beef Tenderloin', description: 'Premium cut beef with red wine reduction', pricePerPerson: 32.00, category: 'mains' },
  { id: 'salmon-fillet', name: 'Atlantic Salmon', description: 'Fresh salmon with dill and citrus glaze', pricePerPerson: 24.50, category: 'mains' },
  { id: 'vegetarian-pasta', name: 'Vegetarian Pasta Primavera', description: 'Seasonal vegetables with penne pasta', pricePerPerson: 14.75, category: 'mains' },

  // Sides
  { id: 'roasted-vegetables', name: 'Roasted Seasonal Vegetables', description: 'Chef\'s selection of fresh vegetables', pricePerPerson: 7.25, category: 'sides' },
  { id: 'garlic-mashed-potatoes', name: 'Garlic Mashed Potatoes', description: 'Creamy potatoes with roasted garlic', pricePerPerson: 5.75, category: 'sides' },
  { id: 'wild-rice-pilaf', name: 'Wild Rice Pilaf', description: 'Aromatic rice with herbs and almonds', pricePerPerson: 6.50, category: 'sides' },
  { id: 'caesar-salad', name: 'Caesar Salad', description: 'Romaine lettuce with house-made dressing', pricePerPerson: 8.00, category: 'sides' },

  // Desserts
  { id: 'chocolate-mousse', name: 'Chocolate Mousse', description: 'Rich Belgian chocolate mousse with berries', pricePerPerson: 9.50, category: 'desserts' },
  { id: 'tiramisu', name: 'Classic Tiramisu', description: 'Traditional Italian dessert with coffee and mascarpone', pricePerPerson: 8.75, category: 'desserts' },
  { id: 'fruit-tart', name: 'Fresh Fruit Tart', description: 'Seasonal fruits on vanilla pastry cream', pricePerPerson: 7.25, category: 'desserts' },
  { id: 'cheesecake', name: 'New York Cheesecake', description: 'Classic cheesecake with berry compote', pricePerPerson: 8.25, category: 'desserts' },

  // Beverages
  { id: 'coffee-service', name: 'Coffee Service', description: 'Freshly brewed coffee and tea selection', pricePerPerson: 3.50, category: 'beverages', minimumOrder: 10 },
  { id: 'soft-drinks', name: 'Soft Drinks', description: 'Assorted sodas and juices', pricePerPerson: 2.75, category: 'beverages' },
  { id: 'wine-selection', name: 'Wine Selection', description: 'House red and white wine', pricePerPerson: 12.00, category: 'beverages', minimumOrder: 21 },
  { id: 'sparkling-water', name: 'Sparkling Water', description: 'Premium sparkling water with lemon', pricePerPerson: 2.25, category: 'beverages' }
]

function App() {
  const [partySize, setPartySize] = useKV<number>("party-size", 0)
  const [selectedItems, setSelectedItems] = useKV<SelectedItem[]>("selected-items", [])
  const [activeCategory, setActiveCategory] = useState('appetizers')

  const handlePartySizeChange = (value: string) => {
    const size = parseInt(value) || 0
    if (size >= 0 && size <= 1000) {
      setPartySize(size)
    }
  }

  const addItem = (item: FoodItem) => {
    setSelectedItems((current) => {
      const existing = current.find(i => i.id === item.id)
      if (existing) {
        return current.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
    toast.success(`Added ${item.name}`)
  }

  const updateQuantity = (itemId: string, change: number) => {
    setSelectedItems((current) => {
      return current.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change)
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const removeItem = (itemId: string) => {
    setSelectedItems((current) => current.filter(item => item.id !== itemId))
    toast.success("Item removed")
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.pricePerPerson * partySize * item.quantity)
    }, 0)
  }

  const calculateItemTotal = (item: SelectedItem) => {
    return item.pricePerPerson * partySize * item.quantity
  }

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory)
  const totalCost = calculateTotal()
  const isValidOrder = partySize > 0 && selectedItems.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Catering Estimator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan your perfect event with our easy-to-use catering calculator. 
            Select your guest count and favorite dishes to get an instant quote.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={24} />
                  Party Size
                </CardTitle>
                <CardDescription>
                  How many guests will be attending your event?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label htmlFor="party-size" className="font-medium">
                    Number of guests:
                  </Label>
                  <Input
                    id="party-size"
                    type="number"
                    min="1"
                    max="1000"
                    value={partySize || ""}
                    onChange={(e) => handlePartySizeChange(e.target.value)}
                    placeholder="Enter guest count"
                    className="w-32"
                  />
                  {partySize > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {partySize} {partySize === 1 ? 'guest' : 'guests'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menu Selection</CardTitle>
                <CardDescription>
                  Choose from our delicious catering options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid w-full grid-cols-5">
                    {FOOD_CATEGORIES.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        <span className="hidden sm:inline">{category.icon}</span>
                        <span className="sm:ml-1">{category.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {FOOD_CATEGORIES.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="mt-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {filteredItems.map((item) => {
                          const selectedItem = selectedItems.find(s => s.id === item.id)
                          const isSelected = !!selectedItem
                          
                          return (
                            <Card 
                              key={item.id} 
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                isSelected ? 'ring-2 ring-accent shadow-md' : ''
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{item.name}</CardTitle>
                                  <Badge variant="outline" className="font-mono">
                                    ${item.pricePerPerson.toFixed(2)}/person
                                  </Badge>
                                </div>
                                <CardDescription className="text-sm">
                                  {item.description}
                                </CardDescription>
                                {item.minimumOrder && (
                                  <p className="text-xs text-muted-foreground">
                                    Minimum order: {item.minimumOrder} people
                                  </p>
                                )}
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                  {isSelected ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus size={14} />
                                      </Button>
                                      <span className="w-8 text-center font-medium">
                                        {selectedItem.quantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus size={14} />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button 
                                      onClick={() => addItem(item)}
                                      variant="secondary"
                                      size="sm"
                                      disabled={!partySize || (item.minimumOrder && partySize < item.minimumOrder)}
                                    >
                                      <Plus size={16} className="mr-1" />
                                      Add Item
                                    </Button>
                                  )}
                                  
                                  {partySize > 0 && isSelected && (
                                    <div className="text-right">
                                      <p className="text-sm font-medium">
                                        ${calculateItemTotal(selectedItem).toFixed(2)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        total cost
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt size={20} />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partySize === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Enter your party size to begin
                  </p>
                ) : selectedItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Add menu items to see your estimate
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">
                              ${item.pricePerPerson.toFixed(2)} × {partySize} guests × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-medium">${calculateItemTotal(item).toFixed(2)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Estimate:</span>
                        <span className="text-primary">${totalCost.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${(totalCost / partySize).toFixed(2)} per person
                      </p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!isValidOrder}>
                          <Download size={16} className="mr-2" />
                          Generate Detailed Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Catering Estimate Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Event Information</h3>
                            <p className="text-muted-foreground">
                              Party Size: <span className="font-medium text-foreground">{partySize} guests</span>
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-4">Selected Items</h3>
                            <div className="space-y-3">
                              {selectedItems.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <Badge variant="outline">Qty: {item.quantity}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {item.description}
                                  </p>
                                  <div className="flex justify-between text-sm">
                                    <span>${item.pricePerPerson.toFixed(2)}/person × {partySize} guests × {item.quantity}</span>
                                    <span className="font-medium">${calculateItemTotal(item).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between text-xl font-bold">
                              <span>Total Estimate:</span>
                              <span className="text-primary">${totalCost.toFixed(2)}</span>
                            </div>
                            <p className="text-muted-foreground text-right">
                              ${(totalCost / partySize).toFixed(2)} per person
                            </p>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Note:</strong> This is an estimate only. Final pricing may vary based on 
                              specific requirements, delivery location, and service options. 
                              Contact us for a detailed quote and to confirm availability.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App