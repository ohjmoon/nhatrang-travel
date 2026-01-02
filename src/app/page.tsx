import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Palmtree,
  UtensilsCrossed,
  Hotel,
  Camera,
  Waves,
  ShoppingBag,
  MapPin,
  Calendar,
  Plane,
  Star,
  ArrowRight,
  Sun
} from "lucide-react"

const categories = [
  {
    icon: Hotel,
    title: "숙소",
    titleEn: "Accommodation",
    description: "깜란, 빈펄, 시내 등 지역별 최고의 숙소",
    count: "30+",
    color: "ocean",
    href: "/accommodation"
  },
  {
    icon: UtensilsCrossed,
    title: "맛집",
    titleEn: "Restaurants",
    description: "한식, 베트남식, 씨푸드 등 현지 맛집",
    count: "69",
    color: "sunset",
    href: "/restaurants"
  },
  {
    icon: Camera,
    title: "볼거리",
    titleEn: "Attractions",
    description: "섬, 해변, 문화유적, 테마파크",
    count: "28",
    color: "palm",
    href: "/attractions"
  },
  {
    icon: Waves,
    title: "액티비티",
    titleEn: "Activities",
    description: "수상스포츠, 스파, 투어, 나이트라이프",
    count: "21",
    color: "ocean",
    href: "/activities"
  },
  {
    icon: ShoppingBag,
    title: "쇼핑",
    titleEn: "Shopping",
    description: "마트, 쇼핑몰, 야시장, 기념품",
    count: "10",
    color: "sunset",
    href: "/shopping"
  },
  {
    icon: Calendar,
    title: "일정 플래너",
    titleEn: "Planner",
    description: "나만의 완벽한 여행 일정 만들기",
    count: "NEW",
    color: "palm",
    href: "/planner"
  },
]

const features = [
  {
    icon: MapPin,
    title: "지도 연동",
    description: "모든 장소를 지도에서 한눈에"
  },
  {
    icon: Calendar,
    title: "일정 관리",
    description: "드래그앤드롭으로 쉬운 일정 편집"
  },
  {
    icon: Plane,
    title: "항공권 연동",
    description: "항공 일정 자동 반영"
  },
  {
    icon: Star,
    title: "현지인 꿀팁",
    description: "현지 경험 기반 추천 정보"
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
              <Palmtree className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-ocean-800">나트랑 트래블</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</a>
            <a href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</a>
            <a href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</a>
            <a href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</a>
          </div>
          <Button variant="ocean" size="sm">
            일정 만들기
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-ocean-200 rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sunset-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-20 w-64 h-64 bg-palm-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sunset-100 text-sunset-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sun className="w-4 h-4" />
              베트남 최고의 해변 휴양지
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ocean-900 mb-6 leading-tight">
              나트랑에서의
              <br />
              <span className="text-gradient">완벽한 휴가</span>를
              <br />
              계획하세요
            </h1>

            <p className="text-lg md:text-xl text-ocean-600 mb-8 max-w-2xl mx-auto">
              맛집, 숙소, 볼거리, 액티비티까지
              <br className="hidden md:block" />
              나트랑 여행의 모든 정보를 한 곳에서 확인하고 일정을 만들어보세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ocean" size="xl" className="group">
                여행 일정 만들기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-ocean-300 text-ocean-700 hover:bg-ocean-50">
                둘러보기
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ocean-600">69+</div>
                <div className="text-sm text-ocean-500">맛집</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-sunset-500">30+</div>
                <div className="text-sm text-sunset-600">숙소</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-palm-500">28+</div>
                <div className="text-sm text-palm-600">볼거리</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L48 54C96 48 192 36 288 42C384 48 480 72 576 78C672 84 768 72 864 60C960 48 1056 36 1152 42C1248 48 1344 72 1392 84L1440 96V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-900 mb-4">
              무엇을 찾고 계신가요?
            </h2>
            <p className="text-ocean-600 max-w-2xl mx-auto">
              카테고리별로 정리된 나트랑의 모든 정보를 탐색해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              const colorClasses = {
                ocean: "bg-ocean-50 border-ocean-200 hover:border-ocean-400 group-hover:bg-ocean-500",
                sunset: "bg-sunset-50 border-sunset-200 hover:border-sunset-400 group-hover:bg-sunset-500",
                palm: "bg-palm-50 border-palm-200 hover:border-palm-400 group-hover:bg-palm-500",
              }
              const iconColorClasses = {
                ocean: "text-ocean-500 group-hover:text-white",
                sunset: "text-sunset-500 group-hover:text-white",
                palm: "text-palm-500 group-hover:text-white",
              }

              return (
                <a href={category.href} key={category.title}>
                  <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses[category.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${colorClasses[category.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')}`}>
                          <Icon className={`w-7 h-7 transition-colors ${iconColorClasses[category.color as keyof typeof iconColorClasses]}`} />
                        </div>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                          category.color === 'ocean' ? 'bg-ocean-100 text-ocean-700' :
                          category.color === 'sunset' ? 'bg-sunset-100 text-sunset-700' :
                          'bg-palm-100 text-palm-700'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-xl mb-1">{category.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500 mb-1">
                        {category.titleEn}
                      </CardDescription>
                      <p className="text-ocean-600 text-sm mt-2">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-ocean-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-900 mb-4">
              스마트한 여행 계획
            </h2>
            <p className="text-ocean-600 max-w-2xl mx-auto">
              나트랑 트래블만의 특별한 기능으로 완벽한 여행을 준비하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-ocean-900 mb-2">{feature.title}</h3>
                  <p className="text-ocean-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ocean-600 via-ocean-500 to-palm-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 나트랑 여행을 계획해보세요
            </h2>
            <p className="text-lg text-white/90 mb-8">
              회원가입하고 나만의 맞춤 여행 일정을 만들어보세요.
              <br />
              무료로 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="sunset" size="xl" className="group">
                무료로 시작하기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="xl" className="text-white hover:bg-white/20">
                더 알아보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ocean-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-palm-400 flex items-center justify-center">
                <Palmtree className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">나트랑 트래블</span>
            </div>
            <div className="flex gap-6 text-ocean-300">
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">문의하기</a>
            </div>
            <div className="text-ocean-400 text-sm">
              &copy; 2024 Nha Trang Travel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
