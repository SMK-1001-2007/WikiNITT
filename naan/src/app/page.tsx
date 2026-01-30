import Link from "next/link";
import Image from "next/image";
import { LandingSearch } from "@/components/LandingSearch";
import {
  TrendingUp,
  Star,
  ArrowRight,
  ArrowLeft,
  User,
  FilePen,
  Library,
  Calendar,
  Bus,
  Clock,
  ChevronRight,
  Utensils,
  Flame,
  UserPlus,
  MapPin,
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-secondary text-text-main font-sans antialiased selection:bg-primary/10 selection:text-primary">
      <LandingNavbar />
      <div className="w-full bg-primary text-white py-2 flex justify-center">
        <div className="w-full max-w-[1280px] px-4 flex items-center justify-between text-xs md:text-sm font-medium">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
            <p className="truncate">
              NITTFest '26 Dates Announced — Registration opens tomorrow at
              10:00 AM.
            </p>
          </div>
          <Link
            className="ml-4 hover:underline whitespace-nowrap opacity-90 hover:opacity-100"
            href="#"
          >
            Read more →
          </Link>
        </div>
      </div>
      <main className="flex-1 flex flex-col items-center w-full">
        <section className="w-full relative bg-white border-b border-border-light overflow-hidden">
          <div className="absolute inset-0 hero-pattern z-0 pointer-events-none"></div>
          <div className="w-full max-w-[1280px] mx-auto px-4 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              The Open Knowledge Hub of NIT Trichy
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black text-slate-900 mb-6 tracking-tight">
              Search{" "}
              <span className="self-center font-bold whitespace-nowrap text-blue-900">
                Wiki
              </span>
              <span className="self-center font-bold whitespace-nowrap text-amber-600">
                NITT
              </span>
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-2xl font-light">
              Access curated information, academic resources, and campus
              insights contributed by students, for students.
            </p>
            <LandingSearch />
            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-text-muted">
              <span>Trending:</span>
              <Link
                className="text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded"
                href="#"
              >
                #Festember
              </Link>
              <Link
                className="text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded"
                href="#"
              >
                #CycleTests
              </Link>
              <Link
                className="text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded"
                href="#"
              >
                #HostelRules
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full max-w-[1280px] px-4 -mt-12 relative z-20 mb-16">
          <div className="bg-white rounded-xl shadow-elegant border border-slate-100 p-1 md:p-2">
            <div className="relative w-full overflow-hidden rounded-lg bg-slate-900 text-white">
              <div className="absolute inset-0 z-0">
                <Image
                  alt="Clock tower view"
                  className="h-full w-full object-cover opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiTw7Rwo5VtECbigT09pYmeRaDgNHM44UzdeHPwGob1YJRQy3FBftwts3ZpCt-d41lEI-C6AcBsQ_gZF5XYjpypNYPhI4PiD0kMz_BBgtW6KCYCsoM6cyXWGVP7ixrzItHHJvgy_Cuu5HjWS9jASGzuF4r6tlcKMriiAxf-uzSIApOD8kLmmguBFiJbuz8s7bglFrInrOk9HXRFz2Ze4VcejKx2NyNNoanaF8M5JKxKr_vjhmKCuZpuJ3I79PPdJMutxjoD2k5e7tM"
                  width={1280}
                  height={720}
                />
                <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-slate-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between p-8 md:p-12 gap-8 min-h-[360px]">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 self-start rounded bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md mb-4 border border-white/10">
                    <Star className="w-4 h-4" />
                    EDITOR'S PICK
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4">
                    The Clock Tower Chronicles: <br />
                    Examining Campus Heritage
                  </h2>
                  <p className="text-slate-200 text-lg font-light leading-relaxed max-w-xl">
                    An in-depth look at the architectural evolution of NIT
                    Trichy's most iconic landmark and its significance in
                    student culture.
                  </p>
                </div>
                <div className="shrink-0">
                  <button className="flex items-center gap-2 h-12 px-8 rounded bg-white text-primary font-bold hover:bg-slate-100 transition-colors shadow-lg">
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full max-w-[1280px] px-4 py-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-6 w-1 bg-primary rounded-full"></span>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Live Campus Pulse
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group p-6 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Online Now
                </span>
                <User className="text-primary bg-primary/5 p-1.5 rounded-lg w-8 h-8" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-slate-900">
                  1,204
                </span>
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                Active users
              </span>
            </div>
            <div className="group p-6 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Edits
                </span>
                <FilePen className="text-primary bg-primary/5 p-1.5 rounded-lg w-8 h-8" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-slate-900">
                  45
                </span>
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />{" "}
                +12% today
              </span>
            </div>
            <div className="group p-6 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Articles
                </span>
                <Library className="text-primary bg-primary/5 p-1.5 rounded-lg w-8 h-8" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-slate-900">
                  3.5k
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1 block">
                Total contributions
              </span>
            </div>
            <div className="group p-6 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Events
                </span>
                <Calendar className="text-primary bg-primary/5 p-1.5 rounded-lg w-8 h-8" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-slate-900">
                  8
                </span>
              </div>
              <span className="text-xs font-medium text-accent mt-1 block">
                Scheduled this week
              </span>
            </div>
          </div>
        </section>
        <section className="w-full bg-slate-50 border-y border-border-light py-16">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-2">
                  Featured Collection
                </h2>
                <p className="text-text-muted">
                  Handpicked guides for campus survival.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary shadow-sm transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary shadow-sm transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1">
              <div className="snap-start shrink-0 w-[300px] md:w-[380px] group cursor-pointer bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    alt="Students studying"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQhO8YqPCep0oTaS81C8nXwsx8vsPDPiKKmXUTbwc2W9GVXK5aTePT-UUB5SYGE1TReLAwZZ0XmDWQmZucZgVRAfb9ljU7C0h14yUBiDX5hEU5vnEV7SNFrK9EW52Xv-EmfzlqC90Kgl4qTTZUkl9ljZnnqUN_KGCpKyjiHhkEtAmV5aFC7tgQxW--375R22sHnARorTBiLvY8LRDGdO2jydrD074_rHpZ3oobgSyeIS9lSm3fxrXzL3ecNL4UiBQ3fjrDyJjqTkFm"
                    width={380}
                    height={214}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                    Premium Guide
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    Placement Stats 2025
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    Detailed analysis of package trends across departments,
                    including top recruiters and average CTC breakdown.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    Read Analysis{" "}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <div className="snap-start shrink-0 w-[300px] md:w-[380px] group cursor-pointer bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    alt="Concert crowd"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuIFqFQwljTduCCyxu6Ez_ZeCe-NmsRTxZOffcPeOTGOmyL2ummyL8GtHk4b1HdwqlBHn3rSg1c1opLOaUUVfN6HqSdHYjOtHpx3zKKr-lE3PNMmTEXI3GVIFYbpQsqqQjI791G7q6D7bqMz1z0LOvtf3SCIO-JbZMzU7nhk84WnUMkBjWHT3M0HHzk27rXeIN6-RymQaRS1wNMly1r5lUSTLuvWiYSnyCyR1M1D9IOERK9Q7PFRfYdX2UkJcvqhhcuWIQxo0n8glY"
                    width={380}
                    height={214}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    Festember Survival Guide
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    The ultimate guide for the cultural fest: Pro shows, guest
                    lectures, workshops, and food stall reviews.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    Explore Guide{" "}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <div className="snap-start shrink-0 w-[300px] md:w-[380px] group cursor-pointer bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    alt="Dorm room"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuChTougxrQO-1NI8zdy4AFr47JeBPRri3MSbnsTHuAbo4w9iTEMB3cZUi5xj_YcUI-6KIZSXE-JxfVqRbKH6aO5YuJsIOMe-PBR-kmPm7HeOPL8V4qpF8Ywe_3Wj3EGhAIki4lBz1t-bZUSkFL6S7wYF1HocE2g60K1yd2bX0RnWIY9wF0l-KpLMB91ZvPBD74P1t9L1f0qWmftfBJ-DWH05D5BCFwYLTuBVZxasqs1EA22IqBl69Z_ERGwjAGgxdh-423zv0w17bqC"
                    width={380}
                    height={214}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    Hostel Life 101
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    Everything freshers need to know: Mess hacks, what to pack,
                    room decor ideas, and laundry services.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    Get Tips{" "}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <div className="snap-start shrink-0 w-[300px] md:w-[380px] group cursor-pointer bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    alt="Modern campus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuABppBS50Ga0MoqlAz6q3GitCxJ6EwRjCbHDzmzbvriqSbSN5pLXRu0v1mczKwMNtySB-LpqLj_AqbHQxv-J9NQrn3oiDL0FWxTava7-SPyyz9RmDCPUFyjltwLqSFcrvhP6Vu9BTN-VCDKZWpfbKtXfr0c8OOZl3H7VtQhdSLP4QJwnM6CYnkL-7caaizRKfbocqO7fPSjoqGGVLQoOQrNyCPg3iMlKembKPhIfcCDJfVzhMoWj7BbSHE_4DCfuvFvgEseiVRTr-8b"
                    width={380}
                    height={214}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    Campus Map 2.0
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    Never get lost again. Updated routes, new academic blocks,
                    and hidden shortcuts around campus.
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    View Map{" "}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full max-w-[1280px] px-4 py-16 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                  Latest Updates
                </h2>
                <div className="h-px bg-slate-200 grow"></div>
                <Link
                  className="text-sm font-semibold text-primary hover:underline"
                  href="#"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  className="group flex items-start p-5 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md hover:border-primary/20 transition-all"
                  href="#"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex shrink-0 items-center justify-center mr-5 border border-blue-100">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div className="grow">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Bus Schedule - '26
                    </h4>
                    <p className="text-sm text-text-muted mt-1">
                      Updated timings for routes to Trichy City and BHEL
                      Township.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        2 hrs ago
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />{" "}
                        @admin
                      </span>
                    </div>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="text-primary w-6 h-6" />
                  </div>
                </Link>
                <Link
                  className="group flex items-start p-5 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md hover:border-primary/20 transition-all"
                  href="#"
                >
                  <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex shrink-0 items-center justify-center mr-5 border border-green-100">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div className="grow">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Mega Mess Menu - October
                    </h4>
                    <p className="text-sm text-text-muted mt-1">
                      Special dinner announced for Diwali. Check the full chart.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        5 hrs ago
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />{" "}
                        @mess_comm
                      </span>
                    </div>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="text-primary w-6 h-6" />
                  </div>
                </Link>
                <Link
                  className="group flex items-start p-5 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-md hover:border-primary/20 transition-all"
                  href="#"
                >
                  <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex shrink-0 items-center justify-center mr-5 border border-purple-100">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="grow">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      Central Library Extended Hours
                    </h4>
                    <p className="text-sm text-text-muted mt-1">
                      Library will remain open until 2 AM during exam week.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        1 day ago
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />{" "}
                        @librarian
                      </span>
                    </div>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="text-primary w-6 h-6" />
                  </div>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                  Trending Now
                </h2>
              </div>
              <div className="flex flex-col gap-6 sticky top-24">
                <div className="p-6 rounded-xl bg-linear-to-br from-primary to-primary-light text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm uppercase">
                      Hot Topic
                    </span>
                    <Flame className="opacity-80 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">End Sem Schedule</h3>
                  <p className="text-sm text-white/90 mb-6 font-light">
                    Tentative dates released for B.Tech & M.Tech. Check your
                    department slots.
                  </p>
                  <button className="w-full py-3 rounded bg-white text-primary text-sm font-bold hover:bg-slate-100 transition-colors shadow-sm">
                    Download PDF
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-white border border-slate-100 shadow-soft">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">
                        Club Activity
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Spider R&D Inductions
                      </h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-slate-50 mt-2">
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <Calendar className="text-slate-400 w-5 h-5" />
                      Tomorrow
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <MapPin className="text-slate-400 w-5 h-5" />
                      Orion Building
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <Clock className="text-slate-400 w-5 h-5" />
                      5:00 PM
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 rounded border border-slate-200 text-slate-600 text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
