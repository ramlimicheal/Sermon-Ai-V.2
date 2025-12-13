import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Check, 
  ArrowRight, 
  Play,
  Star,
  FileText,
  Lightbulb,
  Link2,
  Languages,
  Download,
  Quote,
  Menu,
  X,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const features = [
    {
      icon: BookOpen,
      title: 'Commentary Synthesis',
      description: 'Insights from multiple theological perspectives, synthesized into actionable content.'
    },
    {
      icon: Lightbulb,
      title: 'Illustration Finder',
      description: 'Historical, scientific, and modern stories that connect with your congregation.'
    },
    {
      icon: Link2,
      title: 'Cross-References',
      description: 'Connected passages across Scripture with theological context.'
    },
    {
      icon: FileText,
      title: 'Outline Builder',
      description: 'Professional sermon structures in multiple formats.'
    },
    {
      icon: Languages,
      title: 'Multi-Language',
      description: 'English, Tamil, with more languages coming soon.'
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'PDF, Word, or print-ready pulpit notes.'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Price', preachr: 'From $19/mo', logos: '$300 - $10,000+' },
    { feature: 'Learning Curve', preachr: 'Minutes', logos: 'Weeks to Months' },
    { feature: 'Commentary Synthesis', preachr: true, logos: false },
    { feature: 'Illustration Finder', preachr: true, logos: false },
    { feature: 'Sermon Outlines', preachr: true, logos: false },
    { feature: 'Cross-References', preachr: true, logos: true },
    { feature: 'Greek/Hebrew Tools', preachr: true, logos: true },
    { feature: 'Cloud-Based', preachr: true, logos: false },
    { feature: 'Export Options', preachr: true, logos: true },
  ];

  const testimonials = [
    {
      quote: "I went from 15+ hours on sermon prep to just 3-4 hours. The quality hasn't dropped—if anything, my sermons are more impactful.",
      author: "Pastor David Chen",
      role: "Grace Community Church"
    },
    {
      quote: "The illustration finder alone is worth it. It surfaces stories I never would have found.",
      author: "Rev. Sarah Mitchell",
      role: "First Baptist"
    },
    {
      quote: "As a bi-vocational pastor, time is precious. Preachr gives me seminary-level research in a fraction of the time.",
      author: "Pastor James Okonkwo",
      role: "New Life Fellowship"
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      description: 'Try Preachr',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '3 sermons per month',
        'Basic commentary',
        'Limited illustrations',
        'Standard outlines'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pastor',
      description: 'For weekly preaching',
      monthlyPrice: 19,
      yearlyPrice: 15,
      features: [
        'Unlimited sermons',
        'Full research suite',
        'All illustration types',
        'Advanced outlines',
        'Greek & Hebrew lexicon',
        'Export to PDF & Word',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Church',
      description: 'For teams',
      monthlyPrice: 49,
      yearlyPrice: 39,
      features: [
        'Everything in Pastor',
        '5 team members',
        'Shared library',
        'Collaboration tools',
        'Series planning',
        'Analytics',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-stone-900 text-white p-1.5 rounded">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold text-stone-900">Preachr</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-stone-600 hover:text-stone-900">Features</a>
              <a href="#compare" className="text-sm text-stone-600 hover:text-stone-900">Compare</a>
              <a href="#pricing" className="text-sm text-stone-600 hover:text-stone-900">Pricing</a>
              <Button variant="outline" size="sm" onClick={onSignIn || onGetStarted}>Sign In</Button>
              <Button size="sm" onClick={onGetStarted}>Get Started</Button>
            </div>

            <button 
              className="md:hidden p-2 text-stone-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-50 border-b border-stone-200 px-6 py-4 space-y-4">
            <a href="#features" className="block text-sm text-stone-600">Features</a>
            <a href="#compare" className="block text-sm text-stone-600">Compare</a>
            <a href="#pricing" className="block text-sm text-stone-600">Pricing</a>
            <Button className="w-full" onClick={onGetStarted}>Get Started</Button>
          </div>
        )}
      </nav>

      {/* Hero Section - Minimal & Premium */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-stone-500 mb-6 tracking-wide uppercase">
            Sermon Preparation Platform
          </p>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-900 leading-tight mb-6">
            Prepare sermons in
            <br />
            <span className="italic text-stone-500" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>half the time</span>
          </h1>
          
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deep biblical scholarship meets intelligent research tools. 
            Spend less time researching, more time shepherding.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted} 
              className="bg-stone-900 hover:bg-stone-800 px-8"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-stone-500">
            <span>No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>14-day free trial</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>Cancel anytime</span>
          </div>

          {/* Animated Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-stone-200 shadow-2xl shadow-stone-200/50 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-stone-100 px-4 py-3 flex items-center gap-2 border-b border-stone-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded px-3 py-1 text-xs text-stone-400 border border-stone-200">
                    app.preachr.com
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 bg-stone-50">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-stone-900 text-sm">Preachr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 bg-stone-200 rounded animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-stone-200" />
                  </div>
                </div>

                {/* Three Column Layout */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Left Panel - Cross References */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Link2 className="h-4 w-4 text-stone-400" />
                      <span className="text-xs font-medium text-stone-700">Cross References</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2 bg-stone-50 rounded border border-stone-100">
                        <div className="h-2 w-20 bg-stone-300 rounded mb-2 animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                        <div className="h-2 w-4/5 bg-stone-200 rounded mt-1 animate-pulse" style={{ animationDelay: '200ms' }} />
                      </div>
                      <div className="p-2 bg-stone-50 rounded border border-stone-100">
                        <div className="h-2 w-16 bg-stone-300 rounded mb-2 animate-pulse" style={{ animationDelay: '300ms' }} />
                        <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
                        <div className="h-2 w-3/4 bg-stone-200 rounded mt-1 animate-pulse" style={{ animationDelay: '500ms' }} />
                      </div>
                      <div className="p-2 bg-stone-50 rounded border border-stone-100">
                        <div className="h-2 w-24 bg-stone-300 rounded mb-2 animate-pulse" style={{ animationDelay: '600ms' }} />
                        <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '700ms' }} />
                      </div>
                    </div>
                  </div>

                  {/* Middle Panel - Commentary */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="h-4 w-4 text-stone-400" />
                      <span className="text-xs font-medium text-stone-700">Commentary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-stone-300 rounded animate-pulse" />
                      <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-5/6 bg-stone-200 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                      <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '450ms' }} />
                      <div className="h-2 w-4/5 bg-stone-200 rounded animate-pulse" style={{ animationDelay: '600ms' }} />
                      <div className="h-4" />
                      <div className="h-2 w-full bg-stone-300 rounded animate-pulse" style={{ animationDelay: '750ms' }} />
                      <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '900ms' }} />
                      <div className="h-2 w-3/4 bg-stone-200 rounded animate-pulse" style={{ animationDelay: '1050ms' }} />
                    </div>
                  </div>

                  {/* Right Panel - Sermon Notes */}
                  <div className="bg-white rounded-lg border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-4 w-4 text-stone-400" />
                      <span className="text-xs font-medium text-stone-700">Sermon Notes</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                          <div className="h-2 w-24 bg-stone-400 rounded animate-pulse" />
                        </div>
                        <div className="pl-4 space-y-1">
                          <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                          <div className="h-2 w-5/6 bg-stone-200 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                          <div className="h-2 w-20 bg-stone-400 rounded animate-pulse" style={{ animationDelay: '600ms' }} />
                        </div>
                        <div className="pl-4 space-y-1">
                          <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '800ms' }} />
                          <div className="h-2 w-4/5 bg-stone-200 rounded animate-pulse" style={{ animationDelay: '1000ms' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                          <div className="h-2 w-28 bg-stone-400 rounded animate-pulse" style={{ animationDelay: '1200ms' }} />
                        </div>
                        <div className="pl-4 space-y-1">
                          <div className="h-2 w-full bg-stone-200 rounded animate-pulse" style={{ animationDelay: '1400ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-4 flex items-center justify-between bg-white rounded-lg border border-stone-200 p-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-stone-400" />
                      <span className="text-xs text-stone-500">3 illustrations found</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-stone-400" />
                      <span className="text-xs text-stone-500">12 cross-references</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-20 bg-stone-100 rounded text-xs flex items-center justify-center text-stone-500">Export</div>
                    <div className="h-7 w-16 bg-stone-900 rounded text-xs flex items-center justify-center text-white">Save</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Subtle */}
      <section className="py-12 border-y border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['D', 'S', 'J', 'M'].map((letter, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium border-2 border-white">
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-stone-600 ml-2">2,500+ pastors</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-stone-400 text-stone-400" />
              ))}
              <span className="text-sm text-stone-600 ml-2">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-stone-400" />
              <span className="text-sm text-stone-600">50+ hours saved monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Clean Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-stone-500 mb-4 tracking-wide uppercase">Features</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 mb-4">
              Everything you need to
              <br />
              <span className="italic text-stone-500" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>preach with confidence</span>
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              A complete toolkit for sermon preparation, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-6 rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-5 group-hover:bg-stone-900 transition-colors">
                  <feature.icon className="h-6 w-6 text-stone-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison - Minimal Table */}
      <section id="compare" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-stone-900 mb-4">
              Preachr vs. Logos
            </h2>
            <p className="text-stone-600">
              See why pastors are making the switch.
            </p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-stone-50 border-b border-stone-200">
              <div className="p-4 text-sm font-medium text-stone-500">Feature</div>
              <div className="p-4 text-sm font-medium text-stone-900 text-center border-x border-stone-200">Preachr</div>
              <div className="p-4 text-sm font-medium text-stone-500 text-center">Logos</div>
            </div>

            {comparisonFeatures.map((row, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-3 ${idx !== comparisonFeatures.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="p-4 text-sm text-stone-700">{row.feature}</div>
                <div className="p-4 flex items-center justify-center border-x border-stone-100">
                  {typeof row.preachr === 'boolean' ? (
                    row.preachr ? (
                      <Check className="h-4 w-4 text-stone-900" />
                    ) : (
                      <Minus className="h-4 w-4 text-stone-300" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-stone-900">{row.preachr}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.logos === 'boolean' ? (
                    row.logos ? (
                      <Check className="h-4 w-4 text-stone-400" />
                    ) : (
                      <Minus className="h-4 w-4 text-stone-300" />
                    )
                  ) : (
                    <span className="text-sm text-stone-500">{row.logos}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple Steps */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-stone-900 mb-4">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Enter your passage',
                description: 'Type your scripture reference and select your language.'
              },
              {
                step: '2',
                title: 'Research & explore',
                description: 'Access commentary, cross-references, and illustrations.'
              },
              {
                step: '3',
                title: 'Build & export',
                description: 'Generate outlines and export to PDF or Word.'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-lg font-medium text-stone-900">{item.step}</span>
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600">{item.description}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%]">
                    <div className="border-t border-dashed border-stone-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Minimal Cards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-stone-900 mb-4">
              What pastors say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="border border-stone-200 rounded-lg p-6">
                <Quote className="h-6 w-6 text-stone-200 mb-4" />
                <p className="text-stone-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-stone-900 text-sm">{testimonial.author}</p>
                  <p className="text-xs text-stone-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Clean Cards */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-medium text-stone-900 mb-4">
              Simple pricing
            </h2>
            <p className="text-stone-600 mb-8">
              14-day free trial on all plans.
            </p>

            <div className="inline-flex items-center gap-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Yearly
                <span className="ml-1.5 text-xs text-green-600">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 ${
                  plan.popular 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white border border-stone-200'
                }`}
              >
                {plan.popular && (
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Most Popular</span>
                )}
                <h3 className={`text-xl font-medium mt-2 mb-1 ${plan.popular ? 'text-white' : 'text-stone-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-stone-400' : 'text-stone-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-medium ${plan.popular ? 'text-white' : 'text-stone-900'}`}>
                    ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-stone-400' : 'text-stone-500'}`}>
                    /mo
                  </span>
                </div>
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-white text-stone-900 hover:bg-stone-100' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.popular ? 'text-stone-400' : 'text-stone-400'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-stone-300' : 'text-stone-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Simple */}
      <section className="py-24 px-6 bg-stone-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-medium text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-stone-400 mb-8">
            Join thousands of pastors preparing better sermons in less time.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted} 
            className="bg-white text-stone-900 hover:bg-stone-100 px-8"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-stone-900 text-white p-1.5 rounded">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold text-stone-900">Preachr</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-stone-500">
              <a href="#" className="hover:text-stone-900">Features</a>
              <a href="#" className="hover:text-stone-900">Pricing</a>
              <a href="#" className="hover:text-stone-900">Privacy</a>
              <a href="#" className="hover:text-stone-900">Terms</a>
            </div>
            <p className="text-sm text-stone-500">
              © 2024 Preachr
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
