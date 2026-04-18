import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LanguageContext';

const ContactPage = () => {
  const { t } = useLang();

  useEffect(() => {
    emailjs.init('xKK4nFGaKxxvvs2rr');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    t("contact.serviceWeb"),
    t("contact.serviceNetwork"),
    t("contact.serviceRedTeam"),
    t("contact.serviceCompliance"),
    t("contact.serviceOther"),
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company || 'N/A',
      phone: formData.phone,
      service_type: formData.serviceType,
      message: formData.message,
      to_email: 'gabiselt777@gmail.com'
    };

    const autoReplyParams = {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company || 'N/A',
      phone: formData.phone,
      service_type: formData.serviceType,
      message: formData.message
    };

    try {
      await emailjs.send(
        'service_0l812po',
        'template_v5ke184',
        templateParams,
        'xKK4nFGaKxxvvs2rr'
      );

      try {
        await emailjs.send(
          'service_0l812po',
          'template_wtlowji',
          autoReplyParams,
          'xKK4nFGaKxxvvs2rr'
        );
      } catch (autoReplyError) {
        console.error('Auto-reply failed. Please contact support.');
      }

      setFormStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', phone: '', serviceType: '', message: '' });
        setFormStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to send message. Please try again.');
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-400" />,
      title: t("contact.officeTitle"),
      details: [t("contact.officeLocation"), "Available for remote consultations"]
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-400" />,
      title: t("contact.emailTitle"),
      details: ["gabiselt777@gmail.com", "Response within 24 hours"]
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: t("contact.phoneTitle"),
      details: ["+213 665 869 346", "24/7 support for Enterprise clients"]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Send className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{t("contact.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight text-zinc-100"
            >
              {t("contact.heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              {t("contact.heroSubtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                <h2 className="text-3xl font-bold mb-6 text-zinc-100">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.nameLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                      placeholder={t("contact.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.emailLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.companyLabel")}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                      placeholder={t("contact.companyPlaceholder")}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.phoneLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                        placeholder={t("contact.phonePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.serviceLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
                    >
                      <option value="" className="bg-[#020617]">{t("contact.servicePlaceholder")}</option>
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service} className="bg-[#020617]">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                      {t("contact.messageLabel")} <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors resize-none disabled:opacity-50"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2 text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Sending...' : t("contact.sendBtn")}</span>
                    {!isSubmitting && <Send className="w-5 h-5" />}
                  </button>

                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">{t("contact.successMsg")}</span>
                    </motion.div>
                  )}

                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">{t("contact.errorMsg")}</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 text-zinc-100">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (  
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-100 mb-1">{info.title}</h4>
                        {info.details.map((detail, dIndex) => (
                          <p key={dIndex} className="text-zinc-400 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-zinc-100">
            {t("contact.faqTitle")}
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            {t("contact.faqSubtitle")}
          </p>
          <a
            href="#"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            <span>View FAQ</span>
            <CheckCircle className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
