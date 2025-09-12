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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Users, Plus, Minus, Receipt, Download, MapPin, Phone, User, Trash, Calendar, Check, ClipboardText } from '@phosphor-icons/react'
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

interface CustomerDetails {
  name: string
  phone: string
  email: string
  address: string
  eventDate: string
}

interface Order {
  id: string
  orderDate: string
  customer: CustomerDetails
  partySize: number
  selectedArea: string
  items: SelectedItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

const BENGALURU_AREAS = [
  'Begur',
  'Bommanahalli', 
  'Arekere',
  'Hulimavu',
  'Ashay Nagar',
  'Electronic City',
  'Bannerghatta Road'
]

const FOOD_CATEGORIES = [
  { id: 'appetizers', label: 'Appetizers', icon: '🍤' },
  { id: 'mains', label: 'Main Courses', icon: '🍖' },
  { id: 'sides', label: 'Side Dishes', icon: '🥗' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' },
  { id: 'beverages', label: 'Beverages', icon: '🥤' }
]

const MENU_ITEMS: FoodItem[] = [
  // Appetizers
  { id: 'spring-roll', name: 'Spring Roll', description: 'Crispy spring rolls filled with vegetables and served hot', pricePerPerson: 45, category: 'appetizers' },
  { id: 'samosa', name: 'Samosa', description: 'Golden fried samosas stuffed with spiced potatoes and peas', pricePerPerson: 35, category: 'appetizers' },
  { id: 'pakoda', name: 'Mixed Pakoda', description: 'Assorted vegetable fritters with mint and tamarind chutney', pricePerPerson: 40, category: 'appetizers' },
  { id: 'french-fries', name: 'French Fries', description: 'Crispy golden fries seasoned with herbs and spices', pricePerPerson: 50, category: 'appetizers' },
  { id: 'pani-puri', name: 'Pani Puri', description: 'Traditional street food with spiced water and chutneys', pricePerPerson: 30, category: 'appetizers', minimumOrder: 20 },
  { id: 'dahi-kabab', name: 'Dahi Kabab', description: 'Soft yogurt kebabs with aromatic spices and herbs', pricePerPerson: 55, category: 'appetizers' },

  // Main Courses
  { id: 'paneer-curry', name: 'Paneer Curry', description: 'Rich and creamy paneer curry with aromatic spices', pricePerPerson: 120, category: 'mains' },
  { id: 'chole', name: 'Chole (Chickpea Curry)', description: 'Spicy chickpea curry cooked with onions and tomatoes', pricePerPerson: 95, category: 'mains' },
  { id: 'dal-makhani', name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked with butter and spices', pricePerPerson: 85, category: 'mains' },
  { id: 'dal-tadka', name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin, garlic and spices', pricePerPerson: 70, category: 'mains' },
  { id: 'roti', name: 'Roti', description: 'Fresh whole wheat flatbread cooked on tawa', pricePerPerson: 15, category: 'mains' },
  { id: 'paratha', name: 'Paratha', description: 'Layered flatbread cooked with ghee, soft and flaky', pricePerPerson: 25, category: 'mains' },
  { id: 'puri', name: 'Puri', description: 'Deep-fried puffed bread, crispy and light', pricePerPerson: 20, category: 'mains' },
  { id: 'bhatura', name: 'Bhatura', description: 'Fluffy deep-fried bread perfect with chole', pricePerPerson: 30, category: 'mains' },

  // Side Dishes
  { id: 'mixed-salad', name: 'Mixed Salad', description: 'Fresh cucumber, tomato, onion and carrot salad', pricePerPerson: 35, category: 'sides' },
  { id: 'pickles', name: 'Indian Pickles', description: 'Assorted traditional pickles - mango, lime and mixed vegetable', pricePerPerson: 20, category: 'sides' },
  { id: 'raita', name: 'Mixed Raita', description: 'Cooling yogurt with cucumber, onion and mint', pricePerPerson: 40, category: 'sides' },
  { id: 'papad', name: 'Roasted Papad', description: 'Crispy lentil wafers roasted to perfection', pricePerPerson: 15, category: 'sides' },

  // Desserts
  { id: 'ice-cream', name: 'Ice Cream', description: 'Assorted flavors - vanilla, chocolate, and kulfi', pricePerPerson: 60, category: 'desserts' },
  { id: 'gulab-jamun', name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose-flavored syrup', pricePerPerson: 45, category: 'desserts' },
  { id: 'halwa', name: 'Halwa', description: 'Traditional sweet made with semolina, ghee and sugar', pricePerPerson: 50, category: 'desserts' },

  // Beverages
  { id: 'chaas', name: 'Chaas (Buttermilk)', description: 'Refreshing spiced buttermilk with mint and cumin', pricePerPerson: 25, category: 'beverages' },
  { id: 'fruit-shots', name: 'Fresh Fruit Shots', description: 'Seasonal fruit juices - mango, orange, sweet lime', pricePerPerson: 40, category: 'beverages' },
  { id: 'cold-drinks', name: 'Cold Drinks', description: 'Assorted soft drinks and sodas', pricePerPerson: 35, category: 'beverages' },
  { id: 'masala-soda', name: 'Masala Soda', description: 'Refreshing soda with Indian spices and lemon', pricePerPerson: 30, category: 'beverages' }
]

function App() {
  const [partySize, setPartySize] = useKV<number>("party-size", 0)
  const [selectedItems, setSelectedItems] = useKV<SelectedItem[]>("selected-items", [])
  const [selectedArea, setSelectedArea] = useKV<string>("selected-area", "")
  const [orders, setOrders] = useKV<Order[]>("customer-orders", [])
  const [activeCategory, setActiveCategory] = useState('appetizers')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    eventDate: ''
  })
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

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
    
    if (item.minimumOrder && partySize > 0 && partySize < item.minimumOrder) {
      toast.success(`Added ${item.name}`, {
        description: `Note: This item requires minimum ${item.minimumOrder} guests`
      })
    } else {
      toast.success(`Added ${item.name}`)
    }
  }

  const updateQuantity = (itemId: string, change: number) => {
    setSelectedItems((current) => {
      return current.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          if (newQuantity <= 0) {
            toast.success("Item removed")
            return null // Mark for removal
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter((item): item is SelectedItem => item !== null)
    })
  }

  const removeItem = (itemId: string) => {
    setSelectedItems((current) => current.filter(item => item.id !== itemId))
    toast.success("Item removed")
  }

  const resetMenu = () => {
    setSelectedItems([])
    toast.success("Menu cleared", {
      description: "All items have been removed from your order"
    })
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.pricePerPerson * partySize * item.quantity)
    }, 0)
  }

  const calculateItemTotal = (item: SelectedItem) => {
    return item.pricePerPerson * partySize * item.quantity
  }

  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }))
  }

  const isCustomerFormValid = () => {
    return customerDetails.name.trim() !== '' &&
           customerDetails.phone.trim() !== '' &&
           customerDetails.address.trim() !== '' &&
           customerDetails.eventDate !== '' &&
           selectedArea !== ''
  }

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5)
    return `ORDER-${timestamp}-${random}`.toUpperCase()
  }

  const submitOrder = async () => {
    if (!isCustomerFormValid() || !isValidOrder) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmittingOrder(true)
    
    try {
      const newOrder: Order = {
        id: generateOrderId(),
        orderDate: new Date().toISOString(),
        customer: { ...customerDetails },
        partySize,
        selectedArea,
        items: [...selectedItems],
        totalAmount: totalCost,
        status: 'pending'
      }

      // Store order in database
      setOrders((current) => [newOrder, ...current])
      
      // Clear form and cart
      setSelectedItems([])
      setPartySize(0)
      setSelectedArea("")
      setCustomerDetails({
        name: '',
        phone: '',
        email: '',
        address: '',
        eventDate: ''
      })
      setShowOrderForm(false)

      toast.success("Order submitted successfully!", {
        description: `Order ID: ${newOrder.id}. We'll contact you soon!`
      })

    } catch (error) {
      toast.error("Failed to submit order. Please try again.")
      console.error("Order submission error:", error)
    } finally {
      setIsSubmittingOrder(false)
    }
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
                  Party Size & Location
                </CardTitle>
                <CardDescription>
                  How many guests will be attending and where is your event?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                  
                  <div className="flex items-center gap-4">
                    <Label htmlFor="area-select" className="font-medium">
                      <MapPin size={16} className="inline mr-1" />
                      Delivery Area:
                    </Label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select area in Bengaluru" />
                      </SelectTrigger>
                      <SelectContent>
                        {BENGALURU_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedArea && (
                      <Badge variant="outline" className="ml-2">
                        Bengaluru - {selectedArea}
                      </Badge>
                    )}
                  </div>
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
                                    ₹{item.pricePerPerson.toFixed(0)}/person
                                  </Badge>
                                </div>
                                <CardDescription className="text-sm">
                                  {item.description}
                                </CardDescription>
                                {item.minimumOrder && (
                                  <p className={`text-xs ${
                                    partySize > 0 && partySize < item.minimumOrder 
                                      ? 'text-destructive' 
                                      : 'text-muted-foreground'
                                  }`}>
                                    Minimum order: {item.minimumOrder} people
                                    {partySize > 0 && partySize < item.minimumOrder && (
                                      <span className="ml-1">(Not met)</span>
                                    )}
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
                                      disabled={item.minimumOrder && partySize > 0 && partySize < item.minimumOrder}
                                    >
                                      <Plus size={16} className="mr-1" />
                                      Add Item
                                    </Button>
                                  )}
                                  
                                  {partySize > 0 && isSelected && (
                                    <div className="text-right">
                                      <p className="text-sm font-medium">
                                        ₹{calculateItemTotal(selectedItem).toFixed(0)}
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt size={20} />
                    Order Summary
                  </CardTitle>
                  {selectedItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetMenu}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash size={16} className="mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Add menu items to see your estimate
                  </p>
                ) : (
                  <div className="space-y-4">
                    {partySize === 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-amber-800">
                          <strong>Set party size</strong> to calculate total cost
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">
                              ₹{item.pricePerPerson.toFixed(0)} × {partySize || '?'} guests × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-medium">
                              {partySize > 0 ? `₹${calculateItemTotal(item).toFixed(0)}` : 'Set party size'}
                            </p>
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
                        <span className="text-primary">
                          {partySize > 0 ? `₹${totalCost.toFixed(0)}` : 'Set party size'}
                        </span>
                      </div>
                      {partySize > 0 && (
                        <p className="text-sm text-muted-foreground">
                          ₹{(totalCost / partySize).toFixed(0)} per person
                        </p>
                      )}
                    </div>
                    
                    <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!isValidOrder}>
                          <ClipboardText size={16} className="mr-2" />
                          {!isValidOrder && partySize === 0 
                            ? 'Set Party Size to Continue'
                            : !isValidOrder && selectedItems.length === 0
                            ? 'Add Items to Continue'
                            : 'Place Order'
                          }
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Complete Your Order</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Customer Information Form */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Customer Information</CardTitle>
                              <CardDescription>Please provide your details for order confirmation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="customer-name" className="text-sm font-medium">
                                    Full Name *
                                  </Label>
                                  <Input
                                    id="customer-name"
                                    type="text"
                                    value={customerDetails.name}
                                    onChange={(e) => handleCustomerDetailsChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-1"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="customer-phone" className="text-sm font-medium">
                                    Phone Number *
                                  </Label>
                                  <Input
                                    id="customer-phone"
                                    type="tel"
                                    value={customerDetails.phone}
                                    onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                                    placeholder="Enter 10-digit mobile number"
                                    className="mt-1"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="customer-email" className="text-sm font-medium">
                                  Email Address (Optional)
                                </Label>
                                <Input
                                  id="customer-email"
                                  type="email"
                                  value={customerDetails.email}
                                  onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                                  placeholder="Enter your email address"
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="customer-address" className="text-sm font-medium">
                                  Complete Address *
                                </Label>
                                <Textarea
                                  id="customer-address"
                                  value={customerDetails.address}
                                  onChange={(e) => handleCustomerDetailsChange('address', e.target.value)}
                                  placeholder="Enter complete delivery address with landmark"
                                  className="mt-1 min-h-[80px]"
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="event-date" className="text-sm font-medium">
                                  Event Date *
                                </Label>
                                <Input
                                  id="event-date"
                                  type="date"
                                  value={customerDetails.eventDate}
                                  onChange={(e) => handleCustomerDetailsChange('eventDate', e.target.value)}
                                  className="mt-1"
                                  min={new Date().toISOString().split('T')[0]}
                                  required
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Order Summary */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Party Size:</p>
                                  <p className="font-medium">{partySize} guests</p>
                                </div>
                                {selectedArea && (
                                  <div>
                                    <p className="text-muted-foreground">Delivery Area:</p>
                                    <p className="font-medium">Bengaluru - {selectedArea}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3">Selected Items ({selectedItems.length})</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {selectedItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-muted-foreground">
                                          ₹{item.pricePerPerson} × {partySize} × {item.quantity}
                                        </p>
                                      </div>
                                      <p className="font-medium">₹{calculateItemTotal(item).toFixed(0)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-primary">₹{totalCost.toFixed(0)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground text-right">
                                ₹{(totalCost / partySize).toFixed(0)} per person
                              </p>
                            </CardContent>
                          </Card>

                          {/* Action Buttons */}
                          <div className="flex gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowOrderForm(false)}
                              className="flex-1"
                              disabled={isSubmittingOrder}
                            >
                              Back to Menu
                            </Button>
                            <Button
                              onClick={submitOrder}
                              className="flex-1"
                              disabled={!isCustomerFormValid() || isSubmittingOrder}
                            >
                              {isSubmittingOrder ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Check size={16} className="mr-2" />
                                  Confirm Order
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Note:</strong> After placing your order, our team will contact you within 2-4 hours to confirm details, 
                              finalize pricing, and discuss payment options. This is an estimate - final pricing may vary based on 
                              specific requirements and delivery logistics.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* View Previous Quote Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" disabled={!isValidOrder}>
                          <Download size={16} className="mr-2" />
                          View Quote Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Catering Estimate Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Event Information</h3>
                            <div className="space-y-1">
                              <p className="text-muted-foreground">
                                Party Size: <span className="font-medium text-foreground">{partySize} guests</span>
                              </p>
                              {selectedArea && (
                                <p className="text-muted-foreground">
                                  Delivery Area: <span className="font-medium text-foreground">Bengaluru - {selectedArea}</span>
                                </p>
                              )}
                            </div>
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
                                    <span>₹{item.pricePerPerson.toFixed(0)}/person × {partySize} guests × {item.quantity}</span>
                                    <span className="font-medium">₹{calculateItemTotal(item).toFixed(0)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between text-xl font-bold">
                              <span>Total Estimate:</span>
                              <span className="text-primary">₹{totalCost.toFixed(0)}</span>
                            </div>
                            <p className="text-muted-foreground text-right">
                              ₹{(totalCost / partySize).toFixed(0)} per person
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone size={18} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Subhash</p>
                      <p className="text-sm text-muted-foreground mb-1">Catering Manager</p>
                      <a 
                        href="tel:+919036960295" 
                        className="text-primary font-medium hover:underline flex items-center gap-1"
                      >
                        <Phone size={14} />
                        +91 90369 60295
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Call for custom requirements, bulk orders, or special dietary needs
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Orders View */}
            {orders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt size={20} />
                    Recent Orders ({orders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {orders.slice(0, 5).map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{order.customer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {order.id} • {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge 
                                variant={order.status === 'pending' ? 'secondary' : order.status === 'confirmed' ? 'default' : 'destructive'}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Phone:</p>
                                <p className="font-mono">{order.customer.phone}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Event Date:</p>
                                <p>{new Date(order.customer.eventDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Guests:</p>
                                <p>{order.partySize} people</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Amount:</p>
                                <p className="font-medium">₹{order.totalAmount.toFixed(0)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Address:</p>
                              <p className="text-xs">{order.customer.address}</p>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">
                                Items: {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {orders.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Showing 5 most recent orders. Total: {orders.length} orders
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App