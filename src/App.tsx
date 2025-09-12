import { useState, useEffect } from 'react'
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
import { Users, Plus, Minus, Receipt, Download, MapPin, Phone, User, Trash, Calendar, Check, ClipboardText, Lock, Shield, Eye, Clock } from '@phosphor-icons/react'
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
  eventTime: string
}

interface UserRegistration {
  name: string
  phone: string
  email: string
  address: string
  isRegistered: boolean
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

interface AdminAuth {
  isLoggedIn: boolean
  sessionExpiry?: number
}

// Admin credentials
const ADMIN_EMAIL = "admin@catering.com"
const ADMIN_PASSWORD = "catering123"
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours

const PARTY_TIME_SLOTS = [
  { id: 'morning', label: 'Morning (10:00 AM - 1:00 PM)', value: '10:00-13:00' },
  { id: 'afternoon', label: 'Afternoon (1:00 PM - 4:00 PM)', value: '13:00-16:00' },
  { id: 'evening', label: 'Evening (6:00 PM - 9:00 PM)', value: '18:00-21:00' },
  { id: 'dinner', label: 'Dinner (7:00 PM - 10:00 PM)', value: '19:00-22:00' },
]

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
  const [adminAuth, setAdminAuth] = useKV<AdminAuth>("admin-auth", { isLoggedIn: false })
  const [userRegistration, setUserRegistration] = useKV<UserRegistration>("user-registration", {
    name: '',
    phone: '',
    email: '',
    address: '',
    isRegistered: false
  })
  const [activeCategory, setActiveCategory] = useState('appetizers')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' })
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    eventDate: '',
    eventTime: ''
  })
  const [registrationData, setRegistrationData] = useState<UserRegistration>({
    name: '',
    phone: '',
    email: '',
    address: '',
    isRegistered: false
  })
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false)

  // Check admin session on load and populate customer details from registration
  useEffect(() => {
    if (adminAuth.isLoggedIn && adminAuth.sessionExpiry) {
      if (Date.now() > adminAuth.sessionExpiry) {
        setAdminAuth({ isLoggedIn: false })
        toast.info("Admin session expired. Please log in again.")
      }
    }
    
    // Pre-populate customer details if user is registered
    if (userRegistration.isRegistered) {
      setCustomerDetails(prev => ({
        ...prev,
        name: userRegistration.name,
        phone: userRegistration.phone,
        email: userRegistration.email,
        address: userRegistration.address
      }))
    }
  }, [adminAuth, setAdminAuth, userRegistration])

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

  const handleRegistrationChange = (field: keyof UserRegistration, value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }))
  }

  const isRegistrationFormValid = () => {
    return registrationData.name.trim() !== '' &&
           registrationData.phone.trim() !== '' &&
           registrationData.address.trim() !== ''
  }

  const handleUserRegistration = async () => {
    if (!isRegistrationFormValid()) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmittingRegistration(true)
    
    try {
      const registeredUser = {
        ...registrationData,
        isRegistered: true
      }
      
      setUserRegistration(registeredUser)
      
      // Pre-populate customer details
      setCustomerDetails(prev => ({
        ...prev,
        name: registeredUser.name,
        phone: registeredUser.phone,
        email: registeredUser.email,
        address: registeredUser.address
      }))
      
      setShowRegistrationForm(false)
      setShowOrderForm(true)
      
      toast.success("Registration successful!", {
        description: "You can now place your order"
      })
      
    } catch (error) {
      toast.error("Registration failed. Please try again.")
      console.error("Registration error:", error)
    } finally {
      setIsSubmittingRegistration(false)
    }
  }

  const handleLogout = () => {
    setUserRegistration({
      name: '',
      phone: '',
      email: '',
      address: '',
      isRegistered: false
    })
    setCustomerDetails({
      name: '',
      phone: '',
      email: '',
      address: '',
      eventDate: '',
      eventTime: ''
    })
    toast.success("Logged out successfully")
  }

  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }))
  }

  const isCustomerFormValid = () => {
    const isBasicInfoValid = customerDetails.name.trim() !== '' &&
           customerDetails.phone.trim() !== '' &&
           customerDetails.address.trim() !== '' &&
           customerDetails.eventDate !== '' &&
           customerDetails.eventTime !== '' &&
           selectedArea !== ''
    
    if (!isBasicInfoValid) return false
    
    // Check if event date is at least 7 days from now
    const eventDate = new Date(customerDetails.eventDate)
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    
    return eventDate >= oneWeekFromNow
  }

  const getMinimumDate = () => {
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    return oneWeekFromNow.toISOString().split('T')[0]
  }

  const handleAdminLogin = () => {
    if (adminCredentials.email === ADMIN_EMAIL && adminCredentials.password === ADMIN_PASSWORD) {
      const sessionExpiry = Date.now() + SESSION_DURATION
      setAdminAuth({ isLoggedIn: true, sessionExpiry })
      setShowAdminLogin(false)
      setShowAdminPanel(true)
      setAdminCredentials({ email: '', password: '' })
      toast.success("Admin login successful")
    } else {
      toast.error("Invalid credentials")
    }
  }

  const handleAdminLogout = () => {
    setAdminAuth({ isLoggedIn: false })
    setShowAdminPanel(false)
    toast.success("Logged out successfully")
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((current) => 
      current.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    )
    toast.success(`Order ${newStatus}`)
  }

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5)
    return `ORDER-${timestamp}-${random}`.toUpperCase()
  }

  const submitOrder = async () => {
    if (!isCustomerFormValid() || !isValidOrder) {
      if (!isCustomerFormValid()) {
        const eventDate = new Date(customerDetails.eventDate)
        const oneWeekFromNow = new Date()
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
        
        if (customerDetails.eventDate && eventDate < oneWeekFromNow) {
          toast.error("Event date must be at least 7 days from today")
        } else {
          toast.error("Please fill all required fields including event time")
        }
      }
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
        eventDate: '',
        eventTime: ''
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
            Rasoi Express
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for authentic home-style Indian catering. Plan your perfect event with our easy-to-use 
            catering calculator and get instant quotes for delicious homestyle meals.
          </p>
          
          <div className="mt-6 flex gap-4 justify-center">
            {userRegistration.isRegistered ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
                  <User size={16} className="text-accent" />
                  <span className="text-sm text-accent font-medium">
                    Welcome, {userRegistration.name}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <User size={14} />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowRegistrationForm(true)}
                className="flex items-center gap-2"
              >
                <User size={16} />
                Register / Login
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-2"
            >
              <Shield size={16} />
              Admin Access
            </Button>
          </div>
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
                        <Button 
                          className="w-full" 
                          disabled={!isValidOrder}
                          onClick={() => {
                            if (!userRegistration.isRegistered && isValidOrder) {
                              setShowRegistrationForm(true)
                              return
                            }
                          }}
                        >
                          <ClipboardText size={16} className="mr-2" />
                          {!isValidOrder && partySize === 0 
                            ? 'Set Party Size to Continue'
                            : !isValidOrder && selectedItems.length === 0
                            ? 'Add Items to Continue'
                            : !userRegistration.isRegistered
                            ? 'Register & Place Order'
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
                              <CardDescription>
                                {userRegistration.isRegistered 
                                  ? "Your registered information is pre-filled below"
                                  : "Please provide your details for order confirmation"
                                }
                              </CardDescription>
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
                                    disabled={userRegistration.isRegistered}
                                    required
                                  />
                                  {userRegistration.isRegistered && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      From your registration
                                    </p>
                                  )}
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
                                    disabled={userRegistration.isRegistered}
                                    required
                                  />
                                  {userRegistration.isRegistered && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      From your registration
                                    </p>
                                  )}
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
                                  disabled={userRegistration.isRegistered}
                                />
                                {userRegistration.isRegistered && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    From your registration
                                  </p>
                                )}
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
                                  disabled={userRegistration.isRegistered}
                                  required
                                />
                                {userRegistration.isRegistered && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    From your registration
                                  </p>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    min={getMinimumDate()}
                                    required
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Minimum 7 days advance booking required
                                  </p>
                                </div>
                                
                                <div>
                                  <Label htmlFor="event-time" className="text-sm font-medium">
                                    Event Time *
                                  </Label>
                                  <Select value={customerDetails.eventTime} onValueChange={(value) => handleCustomerDetailsChange('eventTime', value)}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PARTY_TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot.id} value={slot.value}>
                                          {slot.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
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
                                {customerDetails.eventDate && (
                                  <div>
                                    <p className="text-muted-foreground">Event Date:</p>
                                    <p className="font-medium">{new Date(customerDetails.eventDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                                {customerDetails.eventTime && (
                                  <div>
                                    <p className="text-muted-foreground">Event Time:</p>
                                    <p className="font-medium">
                                      {PARTY_TIME_SLOTS.find(slot => slot.value === customerDetails.eventTime)?.label || customerDetails.eventTime}
                                    </p>
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
                          <DialogTitle>Rasoi Express - Catering Quote Details</DialogTitle>
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
          </div>
        </div>

        {/* User Registration Dialog */}
        <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User size={20} />
                Register to Place Order
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => handleRegistrationChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-phone">Phone Number *</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => handleRegistrationChange('phone', e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reg-email">Email Address (Optional)</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => handleRegistrationChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reg-address">Complete Address *</Label>
                <Textarea
                  id="reg-address"
                  value={registrationData.address}
                  onChange={(e) => handleRegistrationChange('address', e.target.value)}
                  placeholder="Enter complete address with landmark"
                  className="mt-1 min-h-[80px]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRegistrationForm(false)}
                  className="flex-1"
                  disabled={isSubmittingRegistration}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUserRegistration}
                  className="flex-1"
                  disabled={!isRegistrationFormValid() || isSubmittingRegistration}
                >
                  {isSubmittingRegistration ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <User size={16} className="mr-2" />
                      Register & Continue
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Why register?</strong> Your information will be saved for future orders, 
                  making the booking process faster and easier.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Login Dialog */}
        <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock size={20} />
                Admin Login
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter admin email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdminLogin}
                  className="flex-1"
                >
                  <Shield size={16} className="mr-2" />
                  Login
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Panel Dialog */}
        <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Shield size={20} />
                  Admin Dashboard - Order Management
                </DialogTitle>
                <Button 
                  variant="outline" 
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2"
                >
                  <Lock size={16} />
                  Logout
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Orders Found</p>
                  <p className="text-muted-foreground">Customer orders will appear here once submitted.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">All Orders ({orders.length})</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{orders.filter(o => o.status === 'pending').length} Pending</Badge>
                      <Badge variant="default">{orders.filter(o => o.status === 'confirmed').length} Confirmed</Badge>
                      <Badge variant="destructive">{orders.filter(o => o.status === 'cancelled').length} Cancelled</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg">{order.customer.name}</h4>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {order.id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Ordered: {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={order.status === 'pending' ? 'secondary' : order.status === 'confirmed' ? 'default' : 'destructive'}
                                  className="mb-2"
                                >
                                  {order.status.toUpperCase()}
                                </Badge>
                                <p className="text-xl font-bold">₹{order.totalAmount.toFixed(0)}</p>
                                <p className="text-sm text-muted-foreground">₹{(order.totalAmount / order.partySize).toFixed(0)}/person</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Contact Details</p>
                                <p className="font-medium">{order.customer.phone}</p>
                                {order.customer.email && <p className="text-sm">{order.customer.email}</p>}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Event Details</p>
                                <p className="font-medium">{new Date(order.customer.eventDate).toLocaleDateString()}</p>
                                <p className="text-sm">{order.customer.eventTime}</p>
                                <p className="text-sm">{order.partySize} guests</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                                <p className="font-medium">Bengaluru - {order.selectedArea}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Complete Address</p>
                              <p className="text-sm p-3 bg-muted/30 rounded border">{order.customer.address}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-3">Ordered Items ({order.items.length})</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded border">
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        ₹{item.pricePerPerson} × {order.partySize} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-medium">₹{(item.pricePerPerson * order.partySize * item.quantity).toFixed(0)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                    className="flex-1"
                                  >
                                    <Check size={16} className="mr-2" />
                                    Confirm Order
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="flex-1"
                                  >
                                    Cancel Order
                                  </Button>
                                </>
                              )}
                              
                              {order.status === 'confirmed' && (
                                <Button
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="flex-1"
                                >
                                  Cancel Order
                                </Button>
                              )}
                              
                              {order.status === 'cancelled' && (
                                <Button
                                  onClick={() => updateOrderStatus(order.id, 'pending')}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Reactivate Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App