

import { Link } from 'react-router-dom';

import {
  Shield,
  Target,
  Users,
  Award,
  TrendingUp,
  Heart,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import { motion } from 'framer-motion';

import { useLang } from '../contexts/LanguageContext';

const AboutPage = () => {

  const { t } = useLang();

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-blue-400" />,
      title: t("about.val1Title"),
      description: t("about.val1Desc"),
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: t("about.val2Title"),
      description: t("about.val2Desc"),
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: t("about.val3Title"),
      description: t("about.val3Desc"),
    }
  ];

  const certifications = [
    { name: "CPTS", description: "Certified Penetration Testing Specialist (In Training)" },
    { name: "OSCP", description: "Offensive Security Certified Professional (In Training)" },
    { name: "eWPTX", description: "Web Application Penetration Tester eXtreme (In Training)" },
    { name: "eJPTv2", description: "Junior Penetration Tester v2 (In Training)" }
  ];

  const stats = [
    { number: t("about.stat1Value"), label: t("about.stat1Label") },
    { number: t("about.stat2Value"), label: t("about.stat2Label") },
    { number: t("about.stat3Value"), label: t("about.stat3Label") },
    { number: t("about.stat4Value"), label: t("about.stat4Label") },
  ];

  const whySMEs = [
    {
      title: t("about.why1Title"),
      description: t("about.why1Desc"),
    },
    {
      title: t("about.why2Title"),
      description: t("about.why2Desc"),
    },
    {
      title: t("about.why3Title"),
      description: t("about.why3Desc"),
    }
  ];

  return (
    
    <div className="min-h-screen">

      {}
      {}
      {}
      {}
      {}
      {}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {}
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{t("about.badge")}</span>
            </motion.div>

            {}
            {}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-zinc-100"
            >
              {t("about.heroTitle")}
            </motion.h1>

            {}
            {}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              {t("about.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {}
      {}
      {}
      {}
      {}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {}
            {}
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                {}
                <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                {}
                <div className="text-zinc-400 text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      {}
      {}
      {}
      {}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-100">
              {t("about.valuesTitle")}
            </h2>
          </div>

          {}
          <div className="grid md:grid-cols-3 gap-8">
            {}
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                
                className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all"
              >
                {}
                <div className="mb-4 inline-block p-3 rounded-xl bg-blue-500/10">
                  {value.icon}
                </div>
                {}
                <h3 className="text-2xl font-bold mb-3 text-zinc-100">{value.title}</h3>
                {}
                <p className="text-zinc-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      {}
      {}
      {}
      {}
      {}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {}
            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">{t("about.teamTitle")}</span>
              </div>

              {}
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-zinc-100">
                {t("about.founderTitle")}
              </h2>
              {}
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                {t("about.founderDesc")}
              </p>

              {}
              {}
              {}
              {}
              {}
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    {}
                    <Award className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                      {}
                      <div className="font-semibold text-zinc-100">{cert.name}</div>
                      {}
                      <div className="text-xs text-zinc-400">{cert.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {}
            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-8 flex items-center justify-center">
                <div className="text-center">
                  {}
                  <Shield className="w-32 h-32 text-blue-400 mx-auto mb-6" />
                  {}
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                    Technical Excellence
                  </h3>
                  {}
                  <p className="text-zinc-300">
                    Every team member brings 2+ years of hands-on pentesting experience
                  </p>
                </div>
              </div>
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      {}
      {}
      {}
      {}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {}
          <div className="text-center mb-16">
            {}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            {}
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-zinc-100">
              {t("about.whyTitle")}
            </h2>
            {}
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              {t("about.whySubtitle")}
            </p>
          </div>

          {}
          <div className="space-y-8">
            {}
            {whySMEs.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all"
              >
                {}
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    {}
                    <h3 className="text-2xl font-bold mb-3 text-zinc-100">{reason.title}</h3>
                    {}
                    <p className="text-zinc-300 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      {}
      {}
      {}
      {}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="relative p-12 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 overflow-hidden">
            {}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

            {}
            <div className="relative text-center">
              {}
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-100">
                {t("about.ctaTitle")}
              </h2>
              {}
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                {t("about.ctaSubtitle")}
              </p>
              {}
              {}
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 text-zinc-100"
              >
                <span>{t("about.ctaBtn")}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
