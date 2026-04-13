

import { Link } from 'react-router-dom';  
import { Shield, Lock, Activity, FileCheck, ChevronRight, Check } from 'lucide-react'; 
import { motion } from 'framer-motion';   
import { useLang } from '../contexts/LanguageContext';   
import { useTheme } from '../contexts/ThemeContext';     

const HomePage = () => {
  const { t } = useLang();      
  const { isDark } = useTheme(); 

  const text  = isDark ? 'text-zinc-100' : 'text-slate-900';      
  const muted = isDark ? 'text-zinc-300' : 'text-slate-600';      
  const dim   = isDark ? 'text-zinc-400' : 'text-slate-500';      
  
  const cardBg = isDark
    ? 'bg-white/5 border-white/10 hover:border-blue-400/50'
    : 'bg-white border-slate-200 hover:border-blue-400/50 shadow-sm hover:shadow-md';
  
  const pricingCard = isDark ? 'bg-white/5 border-white/10 hover:border-blue-400/30' : 'bg-white border-slate-200 hover:border-blue-400/30 shadow-sm';
  
  const pricingHighlight = isDark
    ? 'bg-gradient-to-b from-blue-500/20 to-purple-500/20 border-2 border-blue-400 shadow-2xl shadow-blue-500/20 scale-105'
    : 'bg-gradient-to-b from-blue-50 to-purple-50 border-2 border-blue-400 shadow-xl shadow-blue-500/10 scale-105';
  
  const outlineBtn = isDark
    ? 'border-2 border-zinc-700 hover:border-blue-400 hover:bg-blue-500/5 text-zinc-100'
    : 'border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-900';

  const services = [
    { icon: <Activity className="w-8 h-8 text-blue-400" />, title: t('home.services.pentest.title'), description: t('home.services.pentest.desc'), gradient: 'from-blue-500/10 to-purple-500/10' },
    { icon: <Lock className="w-8 h-8 text-blue-400" />,     title: t('home.services.vulnDash.title'), description: t('home.services.vulnDash.desc'), gradient: 'from-purple-500/10 to-pink-500/10' },
    { icon: <FileCheck className="w-8 h-8 text-blue-400" />, title: t('home.services.compliance.title'), description: t('home.services.compliance.desc'), gradient: 'from-pink-500/10 to-blue-500/10' },
  ];

  const pricingTiers = [
    {
      key: 'starter', highlighted: false, price: '45,000', currency: 'DZD',
      features: ['f1', 'f2', 'f3', 'f4'], 
    },
    {
      key: 'growth', highlighted: true, price: '120,000', currency: 'DZD', 
      features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    },
    {
      key: 'enterprise', highlighted: false, price: '400,000', currency: 'DZD',
      features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    },
  ];

  return (
    <div className="min-h-screen">

      {}
      {}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">

            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-400">{t('home.badge')}</span>
            </motion.div>

            {}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${text}`}>
              {t('home.heroTitle1')}{' '}
              {}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {t('home.heroTitle2')}
              </span>
            </motion.h1>

            {}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={`text-xl ${muted} mb-10 leading-relaxed max-w-3xl mx-auto`}>
              {t('home.heroSubtitle')}
            </motion.p>

            {}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {}
              <Link to="/signup"
                className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/30 flex items-center space-x-2 text-white">
                <span>{t('home.launchAudit')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {}
              <Link to="/services" className={`px-8 py-4 rounded-xl font-semibold transition-all ${outlineBtn}`}>
                {t('home.viewServices')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      {}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${text}`}>{t('home.servicesTitle')}</h2>
            <p className={`text-xl ${muted} max-w-2xl mx-auto`}>{t('home.servicesSubtitle')}</p>
          </div>
          {}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}
                className={`group relative p-8 rounded-2xl backdrop-blur-sm border transition-all hover:shadow-2xl hover:shadow-blue-500/10 ${cardBg}`}>
                {}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  {}
                  <div className="mb-4 inline-block p-3 rounded-xl bg-blue-500/10">{service.icon}</div>
                  {}
                  <h3 className={`text-2xl font-bold mb-3 ${text}`}>{service.title}</h3>
                  <p className={muted}>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {}
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              <span>{t('home.viewAllServices')}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {}
      {}
      <section id="pricing" className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-to-b from-transparent to-blue-950/10' : 'bg-gradient-to-b from-transparent to-blue-50/50'}`}>
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${text}`}>{t('home.pricingTitle')}</h2>
            <p className={`text-xl ${muted} max-w-2xl mx-auto`}>{t('home.pricingSubtitle')}</p>
          </div>
          {}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}
                className={`relative p-8 rounded-2xl backdrop-blur-sm transition-all border ${tier.highlighted ? pricingHighlight : pricingCard}`}>
                {}
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-sm font-semibold text-white">
                    {t('home.mostPopular')}
                  </div>
                )}
                {}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${text}`}>{t(`home.pricing.${tier.key}.name`)}</h3>
                  <p className={`text-sm ${dim}`}>{t(`home.pricing.${tier.key}.desc`)}</p>
                </div>
                {}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className={`text-5xl font-bold ${text}`}>{tier.price}</span>
                    <span className={`${dim} ms-2`}>{tier.currency}</span>
                  </div>
                </div>
                {}
                <Link to="/signup"
                  className={`block w-full py-3 rounded-xl font-semibold mb-8 transition-all text-center ${tier.highlighted ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 text-white' : isDark ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-zinc-100' : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900'}`}>
                  {t(`home.pricing.${tier.key}.cta`)}
                </Link>
                {}
                <ul className="space-y-4">
                  {tier.features.map((fKey) => (
                    <li key={fKey} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${muted}`}>{t(`home.pricing.${tier.key}.${fKey}`)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
