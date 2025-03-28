"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Home, MapPin, Calendar, GraduationCap, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock course data
const COURSES = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your first website.",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "Sarah Johnson",
    image: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    color: "from-purple-500 to-pink-500",
    enrolled: true,
    progress: 35,
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts including hooks, context, and performance optimization.",
    level: "Advanced",
    duration: "6 weeks",
    instructor: "Michael Chen",
    image: "/placeholder.svg?height=200&width=300",
    category: "Frontend",
    color: "from-blue-500 to-cyan-500",
    enrolled: false,
  },
]

// Mock housing data
const HOUSING = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    description: "Bright and spacious studio apartment, perfect for students. Close to public transportation.",
    price: 750,
    currency: "USD",
    period: "month",
    location: "Downtown University District",
    distance: "0.5 miles to campus",
    image: "/placeholder.svg?height=200&width=300",
    color: "from-blue-500 to-cyan-500",
    status: "Application Pending",
  },
  {
    id: 2,
    title: "Shared 3-Bedroom Apartment",
    description: "Private room in a shared apartment with two other students. Common kitchen and living area.",
    price: 450,
    currency: "USD",
    period: "month",
    location: "North Campus Area",
    distance: "0.8 miles to campus",
    image: "/placeholder.svg?height=200&width=300",
    color: "from-green-500 to-teal-500",
    status: "Saved",
  },
]

// Mock upcoming events
const EVENTS = [
  {
    id: 1,
    title: "Housing Tour",
    description: "Tour of Modern Studio Apartment",
    date: "2023-08-15",
    time: "10:00 AM",
    type: "housing",
  },
  {
    id: 2,
    title: "Course Deadline",
    description: "Project submission for Web Development",
    date: "2023-08-20",
    time: "11:59 PM",
    type: "course",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your courses and housing all in one place</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-primary/20 hover:bg-primary/5">
            Logout
          </Button>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{COURSES.filter((c) => c.enrolled).length}</div>
              <p className="text-muted-foreground">Enrolled Courses</p>
            </CardContent>
            <CardFooter>
              <Link href="/courses">
                <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 p-0">
                  Browse more courses →
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" />
                Housing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{HOUSING.length}</div>
              <p className="text-muted-foreground">Saved Properties</p>
            </CardContent>
            <CardFooter>
              <Link href="/housing">
                <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 p-0">
                  Find housing options →
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{EVENTS.length}</div>
              <p className="text-muted-foreground">Scheduled Events</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 p-0">
                View calendar →
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="housing">My Housing</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.map((course) => (
                <Card key={course.id} className="overflow-hidden border-0 shadow-lg card-hover bg-white">
                  <div className={`h-3 w-full bg-gradient-to-r ${course.color}`}></div>
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
                      {course.level}
                    </Badge>
                    {course.enrolled && (
                      <Badge className="absolute top-3 left-3 bg-green-500 text-white">Enrolled</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <span className="text-secondary font-medium">{course.category}</span> • {course.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{course.description}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                    {course.enrolled && course.progress && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {course.enrolled ? (
                      <Button className="w-full">Continue Learning</Button>
                    ) : (
                      <Button className="w-full gradient-bg hover:opacity-90 transition-opacity">Enroll Now</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}

              <Card className="overflow-hidden border-0 shadow-lg card-hover bg-white flex flex-col items-center justify-center p-8 h-[400px]">
                <BookOpen className="h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">Discover More Courses</h3>
                <p className="text-center text-gray-500 mb-6">
                  Explore our catalog of courses to continue your learning journey
                </p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="housing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HOUSING.map((housing) => (
                <Card key={housing.id} className="overflow-hidden border-0 shadow-lg card-hover bg-white">
                  <div className={`h-3 w-full bg-gradient-to-r ${housing.color}`}></div>
                  <div className="relative">
                    <img
                      src={housing.image || "/placeholder.svg"}
                      alt={housing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
                      ${housing.price}/{housing.period}
                    </Badge>
                    <Badge className="absolute top-3 left-3 bg-blue-500 text-white">{housing.status}</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{housing.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {housing.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{housing.description}</p>
                    <p className="text-sm mt-2 text-muted-foreground">{housing.distance}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/housing/${housing.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}

              <Card className="overflow-hidden border-0 shadow-lg card-hover bg-white flex flex-col items-center justify-center p-8 h-[400px]">
                <Home className="h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">Find Your Perfect Home</h3>
                <p className="text-center text-gray-500 mb-6">
                  Browse our verified housing options for international students
                </p>
                <Link href="/housing">
                  <Button>Explore Housing</Button>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled tours, deadlines, and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {EVENTS.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${event.type === "housing" ? "bg-blue-100" : "bg-purple-100"}`}>
                        {event.type === "housing" ? (
                          <Home
                            className={`h-5 w-5 ${event.type === "housing" ? "text-blue-500" : "text-purple-500"}`}
                          />
                        ) : (
                          <BookOpen
                            className={`h-5 w-5 ${event.type === "housing" ? "text-blue-500" : "text-purple-500"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}

                  {EVENTS.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No upcoming events</h3>
                      <p className="text-gray-500">Schedule a housing tour or enroll in a course to see events here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

