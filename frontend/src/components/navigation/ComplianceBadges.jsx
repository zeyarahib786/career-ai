import { useTranslation } from '../../hooks/useTranslation';

const GROUPS = [
  { key:'comp.g1', label:'Web & Digital Standards', badges:[
    {name:'W3C HTML5', nk:'comp.w3c', sk:'comp.s.validated', status:'validated', type:'ok'},
    {name:'WCAG 2.1 AA', nk:'comp.wcag', sk:'comp.s.implemented', status:'implemented', type:'ok'},
    {name:'WAI-ARIA 1.2', nk:'comp.aria', sk:'comp.s.implemented', status:'implemented', type:'ok'},
    {name:'SSL / TLS Encryption', nk:'comp.ssl', sk:'comp.s.ssl', status:'256-bit Active', type:'ok'},
    {name:'Bilingual EN / AR', nk:'comp.bilingual', sk:'comp.s.bilingual', status:'RTL & LTR', type:'ok'},
  ]},
  { key:'comp.g2', label:'DIFC & UAE Regulatory', badges:[
    {name:'DIFC Advertising Standards', nk:'comp.difc.adv', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'DIFC Data Protection Law 2020', nk:'comp.difc.dpl', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'UAE PDPL (Decree No. 45/2021)', nk:'comp.uae.pdpl', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'UAE Consumer Protection Law', nk:'comp.uae.consumer', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'KHDA Education Compliance', nk:'comp.khda', sk:'comp.s.review', status:'Under Review', type:'review'},
  ]},
  { key:'comp.g3', label:'GCC Regional', badges:[
    {name:'KSA National Cybersecurity Authority', nk:'comp.ksa', sk:'comp.s.review', status:'Under Review', type:'review'},
    {name:'Qatar PDPP Data Protection', nk:'comp.qatar', sk:'comp.s.review', status:'Under Review', type:'review'},
  ]},
  { key:'comp.g4', label:'Global Standards', badges:[
    {name:'ISO 9001:2015 Quality Management', nk:'comp.iso9001', sk:'comp.s.approved', status:'Approved', type:'ok'},
    {name:'EU GDPR (for EU Participants)', nk:'comp.gdpr', sk:'comp.s.review', status:'Under Review', type:'review'},
    {name:'ISO/IEC 27001 Information Security', nk:'comp.iso27001', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'Professional Body Accreditation', nk:'comp.accred', sk:'comp.s.inprogress', status:'In Progress', type:'prog'},
    {name:'Anti-Spam (CAN-SPAM / UAE)', nk:'comp.antispam', sk:'comp.s.implemented', status:'Implemented', type:'ok'},
  ]},
];

const LEGEND = [
  { dot:'comp-ok-dot', lk:'comp.leg.ok', label:'Implemented / Validated' },
  { dot:'comp-prog-dot', lk:'comp.leg.prog', label:'In Progress' },
  { dot:'comp-review-dot', lk:'comp.leg.review', label:'Under Review' },
];

const ComplianceBadges = () => {
  const { t } = useTranslation();
  return (
    <div>
      {GROUPS.map(g => (
        <div key={g.key} className="comp-group">
          <div className="comp-group-label"><span data-t={g.key}>{t(g.key) || g.label}</span></div>
          <div className="comp-badges">
            {g.badges.map(b => (
              <div key={b.nk} className={`comp-badge comp-badge-${b.type}`} role="status">
                <span className="comp-badge-dot" aria-hidden="true"/>
                <span className="comp-badge-name" data-t={b.nk}>{t(b.nk) || b.name}</span>
                <span className={`comp-badge-status comp-${b.type}`} data-t={b.sk}>
                  {t(b.sk) || b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="comp-legend" role="list" aria-label="Status key">
        {LEGEND.map(l => (
          <span key={l.lk} className="comp-legend-item" role="listitem">
            <span className={`comp-legend-dot ${l.dot}`} aria-hidden="true"/>
            <span data-t={l.lk}>{t(l.lk) || l.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ComplianceBadges;
