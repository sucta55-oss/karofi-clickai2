/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Droplets, 
  Flame, 
  Snowflake, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Menu, 
  X, 
  CheckCircle2,
  Info,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tính năng", href: "#features" },
    { name: "Công nghệ AIoTec", href: "#aiotec" },
    { name: "Hệ thống lọc", href: "#filtration" },
    { name: "Thông số", href: "#specs" },
  ];

  const handleOpenCheckout = () => {
    setStep(1);
    setIsCheckoutOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("Vui lòng cấu hình VITE_GOOGLE_SCRIPT_URL trong Secrets.");
      alert("Hệ thống đang bảo trì phần kết nối dữ liệu. Vui lòng thử lại sau!");
      setLoading(false);
      setIsCheckoutOpen(false);
      return;
    }

    try {
      // Gửi dữ liệu qua Google Apps Script
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Google Script yêu cầu no-cors nếu không cấu hình CORS phức tạp
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Giả lập thành công vì no-cors không trả về body
      alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      setIsCheckoutOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng liên hệ hotline 1900 6418.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              {step === 1 ? "Thông tin đặt hàng" : "Thanh toán đơn hàng"}
            </DialogTitle>
            <DialogDescription>
              {step === 1 
                ? "Vui lòng nhập thông tin để chúng tôi giao hàng nhanh nhất." 
                : "Hoàn tất thanh toán để sở hữu Karofi Platinum S6."}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid gap-6 py-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A" 
                    className="rounded-xl h-12" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com" 
                    className="rounded-xl h-12" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09xx xxx xxx" 
                    className="rounded-xl h-12" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Địa chỉ đặt hàng</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường, quận/huyện..." 
                    className="rounded-xl h-12" 
                  />
                </div>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.name || !formData.phone || !formData.address}
                  className="w-full h-14 rounded-xl bg-blue-600 text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Tiếp tục thanh toán
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid gap-6 py-4"
              >
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500">Sản phẩm:</span>
                    <span className="font-bold">Karofi Platinum S6</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 font-medium">Tổng thanh toán:</span>
                    <span className="text-2xl font-black text-blue-600">1.000 VNĐ</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Phương thức thanh toán</Label>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-600 bg-blue-50">
                      <CreditCard className="text-blue-600" />
                      <span className="font-bold text-blue-900">Thanh toán Online</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 opacity-50">
                      <div className="h-6 w-6 rounded-full border border-slate-300" />
                      <span className="font-medium text-slate-500">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-blue-600 text-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </Button>
                <button 
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  Quay lại thông tin
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 py-3 shadow-sm backdrop-blur-md" : "bg-transparent py-6"}`}>
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Droplets className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">KAROFI <span className="font-light text-slate-400">PLATINUM</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {link.name}
              </a>
            ))}
            <Button 
              onClick={handleOpenCheckout}
              className="rounded-full bg-blue-600 px-6 font-semibold hover:bg-blue-700"
            >
              Mua Ngay
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 top-full w-full bg-white p-6 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-slate-600"
                  >
                    {link.name}
                  </a>
                ))}
                <Button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenCheckout();
                  }}
                  className="w-full rounded-xl bg-blue-600 py-6 text-lg font-semibold"
                >
                  Mua Ngay
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,#e0f2fe_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                Sản phẩm cao cấp 2024
              </Badge>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
                Karofi Platinum <span className="text-blue-600">S6</span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-slate-600 md:text-2xl">
                Đỉnh cao công nghệ lọc nước thông minh. Tận hưởng nguồn nước tinh khiết với 3 chế độ Nóng - Lạnh - Nguội tức thì.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={handleOpenCheckout}
                  className="h-14 rounded-full bg-blue-600 px-8 text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700"
                >
                  Mua Ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleOpenCheckout}
                  className="h-14 rounded-full border-slate-200 px-8 text-lg font-bold hover:bg-slate-50"
                >
                  Mua Ngay
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">10+</span>
                  <span className="text-sm text-slate-500">Lõi lọc Smax Pro</span>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">AIoTec</span>
                  <span className="text-sm text-slate-500">Giám sát thông minh</span>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">QCVN</span>
                  <span className="text-sm text-slate-500">Chuẩn nước uống trực tiếp</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 mx-auto max-w-[400px]">
                <img 
                  src="https://karofi.karofi.com/karofi-com/2026/01/karofi-platinum-s6-1.png" 
                  alt="Karofi Platinum S6" 
                  className="h-auto w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-indigo-100/50 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Tiện Nghi Vượt Trội</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Karofi Platinum S6 mang đến trải nghiệm sử dụng nước hoàn hảo với những tính năng đột phá.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: <Flame className="h-8 w-8 text-orange-500" />, 
                title: "Nước Nóng Tức Thì", 
                desc: "Nhiệt độ lên đến 95°C, pha trà, cafe, mì tôm chỉ trong giây lát." 
              },
              { 
                icon: <Snowflake className="h-8 w-8 text-blue-500" />, 
                title: "Nước Lạnh Sâu", 
                desc: "Công nghệ làm lạnh Block cho nước lạnh sâu, sảng khoái ngày hè." 
              },
              { 
                icon: <Droplets className="h-8 w-8 text-teal-500" />, 
                title: "Nước Nguội Tinh Khiết", 
                desc: "Nguồn nước sạch chuẩn quốc gia, uống trực tiếp không cần đun sôi." 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 mb-6">{feature.desc}</p>
                <Button 
                  variant="ghost" 
                  onClick={handleOpenCheckout}
                  className="text-blue-600 font-bold p-0 hover:bg-transparent hover:text-blue-700"
                >
                  Mua Ngay <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AIoTec Section */}
      <section id="aiotec" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-[300px]">
                <img 
                  src="https://picsum.photos/seed/smartphone/600/1200" 
                  alt="AIoTec App" 
                  className="rounded-[3rem] border-8 border-slate-900 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -right-8 top-1/4 rounded-2xl bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm font-bold">Nước Tinh Khiết</span>
                  </div>
                </div>
                <div className="absolute -left-8 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3 text-blue-600">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-sm font-bold">Đã Kết Nối</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-indigo-100 text-indigo-700">Công nghệ độc quyền</Badge>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Công Nghệ AIoTec <br /> Thấu Hiểu Mọi Nhu Cầu
              </h2>
              <p className="mb-8 text-lg text-slate-600">
                Lần đầu tiên, bạn có thể kiểm soát hoàn toàn chiếc máy lọc nước của mình chỉ với một chiếc điện thoại thông minh.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: "Giám sát chất lượng nước (TDS)", desc: "Theo dõi độ tinh khiết của nước theo thời gian thực." },
                  { title: "Cảnh báo thay lõi lọc", desc: "Tự động thông báo khi đến hạn thay lõi, đảm bảo an toàn." },
                  { title: "Quản lý tình trạng máy", desc: "Kiểm tra lịch sử sử dụng và tình trạng hoạt động từ xa." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                onClick={handleOpenCheckout}
                className="h-14 rounded-full bg-blue-600 px-8 text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700"
              >
                Mua Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtration System */}
      <section id="filtration" className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Hệ Thống 10 Lõi Lọc Smax Pro</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Gấp đôi hiệu quả lọc, gấp đôi tuổi thọ lõi lọc với công nghệ Smax Pro thế hệ mới nhất.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <Card className="border-none bg-slate-800/50 text-white backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Màng RO Mỹ Smax</h3>
                  </div>
                  <p className="text-slate-400 mb-6">
                    Trái tim của máy lọc nước, loại bỏ 99.99% vi khuẩn, virus, kim loại nặng và các tạp chất độc hại. Công suất lọc lên đến 20 lít/giờ.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenCheckout}
                    className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl"
                  >
                    Mua Ngay
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none bg-slate-800/50 text-white backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Cụm Lõi Chức Năng Smax</h3>
                  </div>
                  <p className="text-slate-400 mb-6">
                    Bổ sung khoáng chất có lợi (Ca, Mg, Na, K...), cân bằng pH, tạo vị ngọt tự nhiên cho nước và hoạt hóa phân tử nước giúp cơ thể hấp thụ tốt hơn.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenCheckout}
                    className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl"
                  >
                    Mua Ngay
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[500px] w-full max-w-[400px]">
                <img 
                  src="https://karofi.com/media/wysiwyg/platinum-s6/loi-loc.png" 
                  alt="Smax Pro Filters" 
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/30 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Thông Số Kỹ Thuật</h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
                <TabsTrigger value="general" className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Thông tin chung</TabsTrigger>
                <TabsTrigger value="technical" className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Kỹ thuật chi tiết</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-8">
                <div className="grid divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-sm">
                  {[
                    { label: "Model", value: "Platinum S6" },
                    { label: "Số cấp lọc", value: "10 Cấp" },
                    { label: "Chế độ nước", value: "Nóng - Lạnh - Nguội" },
                    { label: "Màng lọc", value: "RO Purifim 100 GPD (Mỹ)" },
                    { label: "Bình áp", value: "6 Lít" },
                    { label: "Kích thước", value: "310 x 380 x 960 (mm)" }
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between p-6">
                      <span className="font-medium text-slate-500">{spec.label}</span>
                      <span className="font-bold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="technical" className="mt-8">
                <div className="grid divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-sm">
                  {[
                    { label: "Công suất lọc", value: "20 Lít/giờ" },
                    { label: "Điện áp", value: "220V / 50Hz" },
                    { label: "Công suất nóng", value: "430W" },
                    { label: "Công suất lạnh", value: "90W" },
                    { label: "Nhiệt độ nóng", value: "85 - 95°C" },
                    { label: "Nhiệt độ lạnh", value: "6 - 10°C" }
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between p-6">
                      <span className="font-medium text-slate-500">{spec.label}</span>
                      <span className="font-bold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-10 text-center">
              <Button 
                size="lg" 
                onClick={handleOpenCheckout}
                className="h-14 rounded-full bg-blue-600 px-12 text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700"
              >
                Mua Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Câu Hỏi Thường Gặp</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="mb-4 rounded-2xl border-none bg-white px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold hover:no-underline">Chuẩn nước uống trực tiếp là gì?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Nước sau khi lọc qua Karofi Platinum S6 đạt chuẩn QCVN 6-1:2010/BYT của Bộ Y Tế, có thể uống trực tiếp tại vòi mà không cần đun sôi.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="mb-4 rounded-2xl border-none bg-white px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold hover:no-underline">Bao lâu thì cần thay lõi lọc?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Thời gian thay lõi phụ thuộc vào chất lượng nước đầu vào và lượng nước sử dụng. Với công nghệ AIoTec, máy sẽ tự động thông báo cho bạn qua điện thoại khi cần thay lõi.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="mb-4 rounded-2xl border-none bg-white px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold hover:no-underline">Chính sách bảo hành như thế nào?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Karofi Platinum S6 được bảo hành lên đến 36 tháng cho linh kiện điện, mang lại sự an tâm tuyệt đối cho người sử dụng.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-[3rem] bg-blue-600 px-8 py-20 text-center text-white shadow-2xl shadow-blue-200">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,#3b82f6_0%,transparent_50%)]" />
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Sẵn Sàng Cho Nguồn Nước Sạch?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-blue-100">
              Liên hệ ngay để nhận tư vấn và ưu đãi đặc biệt dành riêng cho dòng sản phẩm Platinum S6.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleOpenCheckout}
                className="h-16 rounded-full bg-white px-10 text-lg font-bold text-blue-600 hover:bg-slate-100"
              >
                Mua Ngay <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleOpenCheckout}
                className="h-16 rounded-full border-white/30 bg-white/10 px-10 text-lg font-bold hover:bg-white/20"
              >
                Mua Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Droplets className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-blue-900">KAROFI</span>
              </div>
              <p className="mb-8 max-w-sm text-slate-500">
                Tập đoàn Karofi - Chuyên gia lọc nước thông minh hàng đầu Việt Nam. Cam kết mang đến nguồn nước tinh khiết cho mọi gia đình.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-slate-900">Liên Hệ</h4>
              <ul className="space-y-4 text-slate-500">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>1900 6418</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>info@karofi.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-blue-600" />
                  <span>Tầng 7, Tòa nhà HUDLAND Tower, Lô ACC7, KĐT Linh Đàm, Hoàng Mai, Hà Nội</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-slate-900">Sản Phẩm</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Máy lọc nước RO</a></li>
                <li><a href="#" className="hover:text-blue-600">Cây nước nóng lạnh</a></li>
                <li><a href="#" className="hover:text-blue-600">Máy lọc không khí</a></li>
                <li><a href="#" className="hover:text-blue-600">Lõi lọc thay thế</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-12" />
          
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-slate-400">
              © 2024 Karofi Group. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600">Chính sách bảo mật</a>
              <a href="#" className="hover:text-slate-600">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
