"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Bed, Bath, Home, ArrowLeft, Heart, Share, CheckCircle, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock housing data
const HOUSING_OPTIONS = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    description:
      "Bright and spacious studio apartment, perfect for students. Close to public transportation and within walking distance to the university campus. The apartment features a fully equipped kitchenette, a comfortable sleeping area, and a modern bathroom. All utilities are included in the rent, making budgeting easier for students.",
    price: 750,
    currency: "USD",
    period: "month",
    location: "Downtown University District",
    address: "123 University Ave, Apt 5B",
    distance: "0.5 miles to campus",
    bedrooms: 0,
    bathrooms: 1,
    size: 350,
    sizeUnit: "sq ft",
    amenities: ["Wifi", "Furnished", "Laundry", "Kitchen", "Heating", "Air Conditioning", "Security System"],
    type: "Studio",
    available: "Immediately",
    leaseTerms: ["6 months", "9 months", "12 months"],
    securityDeposit: 750,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    landlord: {
      name: "University Housing LLC",
      responseRate: "95%",
      responseTime: "within a day",
      verified: true,
    },
    color: "from-blue-500 to-cyan-500",
  },
]

export default function HousingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [leaseTerm, setLeaseTerm] = useState<string>("12 months")

  // Find the housing option by ID
  const housing = HOUSING_OPTIONS.find((h) => h.id.toString() === params.id) || HOUSING_OPTIONS[0]

  const handleBookTour = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date for your tour",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Tour Scheduled!",
      description: `Your tour has been scheduled for ${selectedDate}. The landlord will contact you with details.`,
    })

    setSelectedDate("")
  }

  const handleApply = () => {
    if (!message) {
      toast({
        title: "Please add a message",
        description: "A brief introduction helps landlords understand your needs",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Application Submitted!",
      description: "Your application has been sent to the landlord. You'll receive a response soon.",
    })

    setMessage("")
  }

  const handleSaveProperty = () => {
    toast({
      title: "Property Saved",
      description: "This property has been added to your saved list",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{housing.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {housing.location} • <span className="ml-1">{housing.distance}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveProperty} className="border-primary/20 hover:bg-primary/5">
                <Heart className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                <Share className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 md:row-span-2">
            <img
              src={housing.images[0] || "/placeholder.svg"}
              alt={housing.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {housing.images.slice(1, 4).map((image, index) => (
            <div key={index}>
              <img
                src={image || "/placeholder.svg"}
                alt={`${housing.title} - image ${index + 2}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{housing.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Bed className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <span className="font-bold">{housing.bedrooms === 0 ? "Studio" : housing.bedrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Bath className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <span className="font-bold">{housing.bathrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Home className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm text-gray-500">Size</span>
                        <span className="font-bold">
                          {housing.size} {housing.sizeUnit}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm text-gray-500">Available</span>
                        <span className="font-bold">{housing.available}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-bold mb-2">Lease Terms</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Security deposit: ${housing.securityDeposit}</li>
                        <li>Available lease terms: {housing.leaseTerms.join(", ")}</li>
                        <li>Utilities included in rent</li>
                        <li>First and last month's rent required at signing</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About the Landlord</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold">{housing.landlord.name}</h3>
                          {housing.landlord.verified && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Response rate: {housing.landlord.responseRate} • Responds {housing.landlord.responseTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {housing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                    <CardDescription>{housing.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-gray-500">Map view would be displayed here</p>
                    </div>

                    <h3 className="font-bold mb-2">Nearby</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>University campus: {housing.distance}</li>
                      <li>Public transportation: 0.2 miles</li>
                      <li>Grocery store: 0.3 miles</li>
                      <li>Restaurants: 0.4 miles</li>
                      <li>Gym: 0.5 miles</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className={`h-3 w-full bg-gradient-to-r ${housing.color}`}></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  ${housing.price}
                  <span className="text-base font-normal text-gray-500">/{housing.period}</span>
                </CardTitle>
                <CardDescription>Security deposit: ${housing.securityDeposit}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lease-term">Lease Term</Label>
                  <select
                    id="lease-term"
                    value={leaseTerm}
                    onChange={(e) => setLeaseTerm(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {housing.leaseTerms.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="tour-date">Schedule a Tour</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tour-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                    <Button onClick={handleBookTour} variant="outline" className="border-primary/20 hover:bg-primary/5">
                      <CalendarIcon className="h-4 w-4 mr-2" /> Book
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message to Landlord</Label>
                  <Textarea
                    id="message"
                    placeholder="Introduce yourself and ask any questions you have about the property..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] border-primary/20 focus-visible:ring-primary"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleApply} className="w-full gradient-bg hover:opacity-90 transition-opacity">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {HOUSING_OPTIONS.slice(0, 2).map((property) => (
                  <div key={property.id} className="flex gap-3">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{property.title}</h4>
                      <p className="text-sm text-gray-500">{property.location}</p>
                      <p className="text-sm font-bold">
                        ${property.price}/{property.period}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

