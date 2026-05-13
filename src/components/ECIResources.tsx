import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ECIResources = () => {
  const { t } = useLanguage();

  const resources = [
    {
      title: t('res_voter_search_title'),
      description: t('res_voter_search_desc'),
      icon: "person_search",
      link: "https://electoralsearch.eci.gov.in/",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: t('res_candidate_title'),
      description: t('res_candidate_desc'),
      icon: "manage_accounts",
      link: "https://affidavit.eci.gov.in/",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: t('res_education_title'),
      description: t('res_education_desc'),
      icon: "school",
      link: "https://ecisveep.nic.in/",
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: t('res_results_title'),
      description: t('res_results_desc'),
      icon: "analytics",
      link: "https://results.eci.gov.in/",
      color: "bg-green-50 text-green-600 border-green-100"
    }
  ];

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">{t('verified_eci_title')}</h2>
          <p className="text-on-surface-variant">{t('verified_eci_subtitle')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <span className="material-symbols-outlined text-primary text-sm">verified</span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('official_integration')}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res, index) => (
          <a 
            key={index} 
            href={res.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
          >
            <div className={`w-12 h-12 rounded-xl ${res.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-[24px]">{res.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">{res.description}</p>
            <div className="flex items-center text-xs font-bold text-primary group-hover:gap-2 transition-all">
              {t('open_portal')} <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            </div>
          </a>
        ))}
      </div>
      
      {/* Official Notice */}
      <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant flex items-start gap-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {t('eci_disclaimer')}
        </p>
      </div>
    </section>
  );
};

export default ECIResources;
