

export default {
  
  nav: {
    services: "Services",          
    about: "About",                
    contact: "Contact",            
    home: "Home",                  
    dashboard: "Dashboard",        
    signIn: "Sign In",            
    getStarted: "Get Started",    
    signOut: "Sign Out",          
    toggleLang: "عربي",           
  },

  auth: {
    
    welcomeBack: "Welcome Back",                                    
    signInSubtitle: "Sign in to access your security dashboard",    
    email: "Email Address",                                         
    emailPlaceholder: "you@example.com",                            
    password: "Password",                                           
    passwordPlaceholder: "Enter your password",                     
    rememberMe: "Remember me",                                     
    forgotPassword: "Forgot password?",                             
    signIn: "Sign In",                                              
    signingIn: "Signing in…",                                       
    noAccount: "Don't have an account?",                            
    signUp: "Sign Up",                                              
    encrypted: "Your connection is encrypted and secure",           

    createAccount: "Create Account",                                
    createSubtitle: "Get started with SecOps security platform",    
    fullName: "Full Name",                                          
    fullNamePlaceholder: "Full Name",                               
    phone: "Mobile Phone",                                          
    phonePlaceholder: "+213 XXX XXX XXX",                           
    role: "Account Role",                                           
    serviceType: "Service Type",                                    

    serviceTypes: {
      starter:    "Starter",       
      growth:     "Growth",        
      enterprise: "Enterprise",    
    },

    serviceDescriptions: {
      starter:    "One-time basic security scan — perfect for early-stage validation.",          
      growth:     "Full web application pentest with manual expert review.",                     
      enterprise: "Full infrastructure pentest with advanced red team operations.",              
    },

    confirmPassword: "Confirm Password",                            
    confirmPlaceholder: "Confirm your password",                    
    passwordPlaceholder2: "Create a strong password",               

    termsAgree: "I agree to the",     
    termsService: "Terms of Service", 
    and: "and",                       
    privacy: "Privacy Policy",        
    creating: "Creating account…",    
    haveAccount: "Already have an account?", 
    dataSecure: "Your data is encrypted and secure", 

    roles: { client: "Client", pentester: "Pentester", admin: "Admin" },

    errors: {
      invalidCredentials: "Invalid email or password.",                      
      tooManyRequests: "Too many failed attempts. Please try again later.",  
      userDisabled: "This account has been disabled.",                       
      signInFailed: "Sign-in failed. Please try again.",                    
      emailInUse: "An account with this email already exists.",             
      invalidEmail: "Invalid email address.",                               
      weakPassword: "Password must be at least 6 characters.",              
      registrationFailed: "Registration failed. Please try again.",         
      passwordMismatch: "Passwords do not match.",                          
      passwordShort: "Password must be at least 6 characters.",             
    },
  },

  home: {
    badge: "Your Gateway to Professional Pentesting",                       
    heroTitle1: "Professional Security Audits for",                         
    heroTitle2: "Start-Ups and Small Enterprises",                          
    heroSubtitle: "A dedicated digital gateway designed to provide startups with accessible, professional security assessments. We simplify the path to securing your digital assets through expert-led penetration testing.", 
    launchAudit: "Launch Your First Audit",   
    viewServices: "View Services",            
    servicesTitle: "Security That Scales With You",                         
    servicesSubtitle: "Modern security tooling designed for the pace of startup innovation", 
    viewAllServices: "View All Services",     

    pricingTitle: "The Trust Tiers",                                        
    pricingSubtitle: "Transparent pricing for Algerian startups. No hidden fees.", 
    mostPopular: "Most Popular",              

    services: {
      pentest: {
        title: "Continuous Pentesting",       
        desc: "Managed security audits that move at the speed of your code. Stay protected as you ship features.", 
      },
      vulnDash: {
        title: "Vulnerability Dashboard",     
        desc: "Real-time visibility into your security posture. Track, prioritize, and remediate threats efficiently.", 
      },
      compliance: {
        title: "Compliance Readiness",        
        desc: "Helping Algerian startups achieve global security standards. ISO 27001, SOC 2, and beyond.", 
      },
    },

    pricing: {
      
      starter: {
        name: "Starter",                                   
        desc: "Perfect for early-stage validation",        
        cta: "Start Scan",                                 
        f1: "One-time basic security scan",                
        f2: "Automated vulnerability detection",           
        f3: "Comprehensive PDF report",                    
        f4: "Email support",                               
      },
      
      growth: {
        name: "Growth",                                    
        desc: "For startups serious about security",       
        cta: "Launch Audit",                               
        f1: "Full web application pentesting",             
        f2: "Manual expert security review",               
        f3: "OWASP Top 10 compliance",                     
        f4: "Slack/Teams integration",                     
        f5: "Quarterly re-testing included",               
        f6: "Security roadmap consultation",               
      },
      
      enterprise: {
        name: "Enterprise",                                            
        desc: "Large-scale infrastructures requiring advanced adversary simulation", 
        cta: "Contact Sales",                                          
        f1: "Full infrastructure pentesting",                          
        f2: "Advanced Adversary Simulation (Red Teaming)",             
        f3: "Comprehensive Incident Response Planning",                
        f4: "Remediation support included",                            
        f5: "Incident response planning",                              
        f6: "Unlimited pentesting credits",                            
      },
    },
  },

  services: {
    badge: "What We Offer",                        
    heroTitle: "Comprehensive Security Services",  
    heroSubtitle: "Enterprise-grade penetration testing and security assessment services tailored for Algerian startups and SMEs.", 

    webTitle: "Web Application Pentesting",        
    webDesc: "Full-spectrum web application security testing covering OWASP Top 10, business logic flaws, and advanced attack vectors.", 
    networkTitle: "Network Security Audits",       
    networkDesc: "Comprehensive network infrastructure assessment including firewall analysis, service enumeration, and exploitation testing.", 
    redTeamTitle: "Red Team Operations",           
    redTeamDesc: "Advanced adversary simulation mimicking real-world threat actors to test your organization's detection and response capabilities.", 

    processTitle: "Our Testing Process",           
    processSubtitle: "A structured, methodical approach to every engagement", 
    step1: "Scope Definition",                     
    step1Desc: "Define targets, rules of engagement, and success criteria",
    step2: "Reconnaissance & Scanning",            
    step2Desc: "Passive and active information gathering and service enumeration",
    step3: "Exploitation",                         
    step3Desc: "Controlled exploitation of identified vulnerabilities",
    step4: "Reporting",                            
    step4Desc: "Detailed findings report with remediation recommendations",

    ctaTitle: "Ready to Secure Your Application?",
    ctaSubtitle: "Get a free security assessment consultation for your startup.",
    ctaBtn: "Get Free Assessment",                 
  },

  about: {
    badge: "Our Mission",                          
    heroTitle: "Securing Algeria's Digital Future", 
    heroSubtitle: "We believe every startup deserves enterprise-grade security, regardless of size or budget.", 

    stat1Value: "100%",  stat1Label: "Client Satisfaction",    
    stat2Value: "24/7",  stat2Label: "Monitoring",             
    stat3Value: "20+",   stat3Label: "Projects Completed",     
    stat4Value: "2+",    stat4Label: "Years Experience",       

    valuesTitle: "Our Values",
    val1Title: "Startup-First Mindset",            
    val1Desc: "We understand the constraints of early-stage companies and design our services accordingly.",
    val2Title: "Practical Security",               
    val2Desc: "No jargon, no fluff. We deliver actionable insights that your team can implement immediately.",
    val3Title: "Continuous Partnership",            
    val3Desc: "Security is a journey, not a destination. We're with you every step of the way.",

    teamTitle: "Meet Our Team",
    founderTitle: "Founder & Lead Pentester",       
    founderDesc: "Certified ethical hacker with expertise in web application security and red team operations. Passionate about making enterprise security accessible to Algerian startups.",

    whyTitle: "Why SMEs Choose Us",
    whySubtitle: "We understand the unique challenges facing small and medium enterprises in Algeria.",
    why1Title: "Cost-Effective",                   
    why1Desc: "Enterprise-grade security at startup-friendly prices in DZD.",
    why2Title: "Local Expertise",                  
    why2Desc: "Deep understanding of the Algerian regulatory and business environment.",
    why3Title: "Fast Turnaround",                  
    why3Desc: "Rapid assessment and reporting without compromising quality.",

    ctaTitle: "Join the SecOps Family",
    ctaSubtitle: "Protect your startup with professional security services.",
    ctaBtn: "Get Started Today",
  },

  contact: {
    badge: "Get In Touch",                         
    heroTitle: "Let's Secure Your Digital Future",  
    heroSubtitle: "Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you as soon as possible.", 

    nameLabel: "Full Name",                        
    namePlaceholder: "Your full name",             
    emailLabel: "Email Address",                   
    emailPlaceholder: "you@company.com",           
    companyLabel: "Company Name",                  
    companyPlaceholder: "Your company",            
    phoneLabel: "Phone Number",                    
    phonePlaceholder: "+213 XXX XXX XXX",          
    serviceLabel: "Service Interest",              
    servicePlaceholder: "Select a service",        

    serviceWeb: "Web Application Pentesting",      
    serviceNetwork: "Network Security Audit",      
    serviceRedTeam: "Red Team Operations",         
    serviceCompliance: "Compliance Consulting",    
    serviceOther: "Other",                         

    messageLabel: "Message",                       
    messagePlaceholder: "Tell us about your project and security needs…", 
    sendBtn: "Send Message",                       
    sending: "Sending…",                           

    successMsg: "Message sent successfully! We'll be in touch soon.", 
    errorMsg: "Failed to send message. Please try again.",           

    officeTitle: "Our Office",                     
    officeLocation: "Djelfa, Algeria",             
    emailTitle: "Email Us",                        
    phoneTitle: "Call Us",                         

    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Check our FAQ for quick answers, or contact us directly.",
  },

  dash: {
    
    overview: "Overview",              
    allAudits: "All Audits",          
    pentesters: "Pentesters",         
    users: "Manage Users",            
    reports: "Reports",               
    scanResults: "Scan Results",      
    myAudits: "My Audits",           
    requestAudit: "Request Pentest",  

    adminDashboard: "Admin Dashboard",         
    pentesterDashboard: "Pentester Dashboard", 
    clientDashboard: "Client Dashboard",       
    adminPanel: "Admin Panel",                 
    pentesterPanel: "Pentester Panel",         
    clientPortal: "Client Portal",             

    totalAudits: "Total Audits",       
    pending: "Pending",                
    inProgress: "In Progress",         
    completed: "Completed",            
    assignedAudits: "Assigned Audits", 
    vulnerabilities: "Vulnerabilities",
    totalRequests: "Total Requests",   
    totalUsers: "Total Users",         

    auditStatusChart: "Audit Status Distribution",  
    auditsPerPentester: "Audits per Pentester",     

    auditAssignment: "Audit Assignment",   
    auditTitle: "Audit Title",             
    client: "Client",                      
    status: "Status",                      
    assignTo: "Assign To",                 
    selectPentester: "Select pentester…",  
    assign: "Assign",                      
    assigning: "Assigning…",              
    noAudits: "No audits yet.",           
    noAuditRequests: "No pentest requests yet. Click 'Request Pentest' to get started.", 
    refresh: "Refresh",                    

    submitVulnerability: "Submit Finding",              
    newVulnerability: "New Vulnerability",              
    severityBreakdown: "Severity Breakdown",            
    vulnsFound: "Vulnerabilities Found",                
    noVulns: "No vulnerabilities submitted yet.",       
    selectAuditPrompt: "Select an audit from the sidebar to begin working.", 
    total: "total",                                     

    requestNewAudit: "Request a New Pentest",           
    titleField: "Title",                                
    descField: "Description",                           
    severityField: "Severity",                          
    cvssField: "CVSS Score (0–10)",                     
    scopeField: "Scope / Targets",                      
    submitRequest: "Submit Request",                    
    submitting: "Submitting…",                          
    cancel: "Cancel",                                   
    successRequest: "Pentest request submitted successfully!", 

    auditRequestsChart: "Pentest Requests Over Time",   
    myAuditRequests: "My Pentest Requests",             
    assignedTo: "Assigned to",                          
    scope: "Scope",                                     
    welcomeAdmin: "Welcome back,",                      

    pentesterList: "Pentester Directory",                
    noPentesters: "No pentesters registered yet.",      

    auditTitlePlaceholder: "e.g. E-commerce Platform Pentest",                      
    descPlaceholder: "Describe what you need tested and any relevant context…",     
    scopePlaceholder: "e.g. https://app.example.com, 192.168.1.0/24",              
    vulnTitlePlaceholder: "e.g. SQL Injection in login form",                       
    vulnDescPlaceholder: "Describe the vulnerability, steps to reproduce, impact…", 
    cvssPlaceholder: "e.g. 9.8",                                                    

    recentAudits: "Recent Pending Audits",              
    navigation: "Navigation",                           
    allUsers: "All Users",                              
    noUsers: "No users registered yet.",                

    userName: "Name",                                   
    userEmail: "Email",                                 
    userRole: "Role",                                   
    userSince: "Member Since",                          

    downloadReport: "Download Report",                  
    generateReport: "Generate Report",                  
    reportReady: "Report ready for download",           
    noReports: "No completed audits with reports yet.", 

    trackStatus: "Track Status",                        
    projectDetails: "Project Details",                  
    requestedOn: "Requested on",                        
    updateStatus: "Update Status",                      
    markFixed: "Mark as Fixed",                         
    markVerified: "Mark as Verified",                   
    vulnStatus: "Vulnerability Status",                 
    affectedAssets: "Affected Assets",                  

    markCompleted: "Mark as Completed",                 
    submitScanResult: "Add Scan Result",                
    scanType: "Scan Type",                              
    findings: "Findings",                               
    scanTypePlaceholder: "e.g. Nmap, Burp Suite, OWASP ZAP",         
    findingsPlaceholder: "Describe what was found during this scan…", 
    noScanResults: "No scan results yet.",              
    myScanResults: "Scan Results",                      

    evidence: "Evidence",                               
    evidencePlaceholder: "Add evidence URL or description…", 
    addEvidence: "Add Evidence",                        
  },

  status: {
    pending: "Pending",         
    assigned: "Assigned",       
    in_progress: "In Progress", 
    completed: "Completed",     
    open: "Open",               
    verified: "Verified",       
    fixed: "Fixed",             
  },

  severity: {
    critical: "Critical",  
    high: "High",          
    medium: "Medium",      
    low: "Low",            
    info: "Info",          
  },

  common: {
    loading: "Loading…",       
    signOut: "Sign Out",       
    cancel: "Cancel",          
    all: "All",                
    delete: "Delete",          
    confirmDelete: "Sure?",    
  },
};
