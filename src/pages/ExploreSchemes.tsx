import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, FileText, Banknote, Calendar, UserCheck, FileCheck, Gift } from "lucide-react";

interface Scheme {
  slug: string;
  name: string;
  type: string;
  what_it_covers: string;
  subsidy_or_grant: string;
  interest_subvention_or_rate: string;
  loan_amount_range: string;
  tenure_repayment: string;
  eligibility: string;
  where_to_apply: string;
  notes: string;
  sources: string[];
}

const schemes: Scheme[] = [
  {
    "slug": "kisan_credit_card_kcc",
    "name": "Kisan Credit Card (KCC) + Interest Subvention",
    "type": "Credit (Crop working capital)",
    "what_it_covers": "Short-term crop loans up to ₹3 lakh; working capital for inputs.",
    "subsidy_or_grant": "Interest subvention to banks 2% on ST crop loans.",
    "interest_subvention_or_rate": "Farmer effective ~7% → 4% with 3% Prompt Repayment Incentive (up to ₹3 lakh).",
    "loan_amount_range": "₹10,000 – ₹3,00,000 (typical); can be higher for allied activities per bank norms.",
    "tenure_repayment": "12 months; revolving/renewable annually.",
    "eligibility": "Cultivators/tenant farmers/sharecroppers; KYC + land records/lease; bank appraisal.",
    "where_to_apply": "Any scheduled bank/RRB/Co-op bank; via KCC/Jan Suraksha camps.",
    "notes": "3% additional subvention only for on-time repayment; separate KCC variants for fisheries & dairy.",
    "sources": [""]
  },
  {
    "slug": "agriculture_infrastructure_fund_aif",
    "name": "Agriculture Infrastructure Fund (AIF)",
    "type": "Capex + Working Capital",
    "what_it_covers": "Post-harvest & community infrastructure: warehouses, pack-houses, cold chain, primary processing, FPO infra etc.",
    "subsidy_or_grant": "3% interest subvention; Credit Guarantee coverage.",
    "interest_subvention_or_rate": "3% interest subvention up to ₹2 crore of the sanctioned credit.",
    "loan_amount_range": "₹10 lakh – ₹2 crore (subvention cap); larger projects allowed without extra subvention.",
    "tenure_repayment": "Up to 7 years (bank specific); moratorium as per bank.",
    "eligibility": "FPOs, PACS, APMCs, start-ups, agri-entrepreneurs, co-ops.",
    "where_to_apply": "AIF portal + participating banks/NBFCs.",
    "notes": "Credit guarantee coverage available (CGTMSE like facility for eligible borrowers).",
    "sources": [""]
  },
  {
    "slug": "pm_kusum",
    "name": "PM-KUSUM (Solar Pumps & Decentralised RE)",
    "type": "Capital subsidy + Bank loan",
    "what_it_covers": "Solar pumps (stand-alone & grid-connected), solarisation of existing grid pumps, decentralised RE plants.",
    "subsidy_or_grant": "Central Financial Assistance (CFA) for components; State share + beneficiary contribution model.",
    "interest_subvention_or_rate": "Bank loan for beneficiary share per bank's rate (no separate central subvention).",
    "loan_amount_range": "Varies by component (e.g., 2–10 HP pumps).",
    "tenure_repayment": "Typically 5–7 years for pump loans.",
    "eligibility": "Individual farmers, groups, panchayats, WUAs; as per MNRE guidelines.",
    "where_to_apply": "State renewable energy nodal agencies/MNRE empanelled portals.",
    "notes": "Exact CFA % differs by component and notifications.",
    "sources": [""]
  },
  {
    "slug": "pmfby_crop_insurance",
    "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    "type": "Crop insurance",
    "what_it_covers": "Yield-based & localised calamity risks for notified crops/areas.",
    "subsidy_or_grant": "Government bears premium balance above farmer share.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "Seasonal (Kharif/Rabi policy terms).",
    "eligibility": "Loanee & non-loanee farmers in notified areas/crops.",
    "where_to_apply": "Banks/CSC/e-PMFBY portal/empanelled insurers.",
    "notes": "Farmer premium share: 2% (Kharif), 1.5% (Rabi), 5% (commercial/horticulture).",
    "sources": [""]
  },
  {
    "slug": "smam_mechanization",
    "name": "SMAM – Sub-Mission on Agricultural Mechanization",
    "type": "Capital subsidy",
    "what_it_covers": "Farm machinery & equipment (individual, CHCs, HI-Tech hubs).",
    "subsidy_or_grant": "Back-ended subsidy (patterns vary by category & group).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Bank finance as per project machine cost.",
    "tenure_repayment": "3–7 years typical.",
    "eligibility": "Individual farmers, FPOs, co-ops, entrepreneurs for CHCs/Hubs.",
    "where_to_apply": "State agri dept portals/Direct Benefit Transfer (DBT) mechanization portal.",
    "notes": "Operational guidelines define % assistance & caps per component.",
    "sources": [""]
  },
  {
    "slug": "midh_horticulture",
    "name": "MIDH – Mission for Integrated Development of Horticulture",
    "type": "Capital subsidy",
    "what_it_covers": "Nurseries, orchard establishment, protected cultivation, PHM/pack-houses, cold storages (selected components).",
    "subsidy_or_grant": "Pattern per component; protected cultivation & PHM typically 35–50% with cost caps.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "As per project with bank tie-up.",
    "tenure_repayment": "5–9 years typical (orchards longer).",
    "eligibility": "Farmers, FPOs, SHGs, co-ops, agri-entrepreneurs.",
    "where_to_apply": "State horticulture missions/DBT-Hort portals.",
    "notes": "Exact % and ceilings notified by MIDH/States.",
    "sources": [""]
  },
  {
    "slug": "pmksy_per_drop_more_crop",
    "name": "PMKSY – Per Drop More Crop (Micro-Irrigation under NMSA)",
    "type": "Capital subsidy",
    "what_it_covers": "Drip/sprinkler systems, fertigation kits, MI ancillaries.",
    "subsidy_or_grant": "Assistance pattern notified under PDMC (small/marginal vs other farmers).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "— (bank loan optional to meet beneficiary contribution).",
    "tenure_repayment": "—",
    "eligibility": "All farmers; priority to small/marginal, SC/ST, NE/Himalayan.",
    "where_to_apply": "State MI portals via PDMC.",
    "notes": "Centre/State/beneficiary share matrix; check latest PDMC circulars.",
    "sources": [""]
  },
  {
    "slug": "pmfme_micro_food_processing",
    "name": "PM-FME (Micro Food Processing Enterprises)",
    "type": "Credit-linked grant",
    "what_it_covers": "Up-gradation/setting up micro food units; FPO/SHG common infra; branding/marketing.",
    "subsidy_or_grant": "35% credit-linked grant up to ₹10 lakh per unit (individual); higher for groups/common infra per guidelines.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Bank/TFCI appraisal; grant limited to 35% of eligible project cost.",
    "tenure_repayment": "Per bank/project.",
    "eligibility": "Existing & new micro food processors; SHGs/FPOs/co-ops.",
    "where_to_apply": "State PM-FME portals & banks; MoFPI support system.",
    "notes": "ODOP alignment preferred; also supports branding/marketing.",
    "sources": [""]
  },
  {
    "slug": "pmmsy_fisheries",
    "name": "PMMSY – Fisheries",
    "type": "Capital subsidy + Support",
    "what_it_covers": "Ponds, RAS, hatcheries, boats, cold chain, processing, marketing.",
    "subsidy_or_grant": "Subsidy typically 40% (General) / 60% (SC/ST/Women) with unit cost caps (component-wise).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "As per component & bank sanction.",
    "tenure_repayment": "5–8 years typical.",
    "eligibility": "Fishers, farmers, FPOs/FFPOs, entrepreneurs, co-ops.",
    "where_to_apply": "State Fisheries Dept through PMMSY implementation units.",
    "notes": "Exact unit costs & caps in State/DoF guidelines.",
    "sources": [""]
  },
  {
    "slug": "ahidf_dairy_meat_feed",
    "name": "AHIDF – Animal Husbandry Infrastructure Development Fund",
    "type": "Interest subvention + Credit guarantee",
    "what_it_covers": "Dairy/meat processing, value-addition, animal feed plants, cold chain.",
    "subsidy_or_grant": "3% interest subvention to borrower; credit guarantee up to 25% through NCSS.",
    "interest_subvention_or_rate": "3% subvention; bank base rate otherwise.",
    "loan_amount_range": "Up to ~90% of project cost (Bank finance); margin 10%+.",
    "tenure_repayment": "Up to 8 years incl. up to 2 years moratorium (interest subvention available for this period).",
    "eligibility": "FPOs, MSMEs, co-ops, SHGs, individual entrepreneurs, exporters.",
    "where_to_apply": "Any scheduled bank/NBFC; AHIDF portal.",
    "notes": "Credit guarantee fee partly supported.",
    "sources": [""]
  },
  {
    "slug": "didf_dairy_processing",
    "name": "DIDF – Dairy Processing & Infra Development Fund",
    "type": "Long-term project loan (via NABARD to co-ops)",
    "what_it_covers": "Modernisation/expansion of milk processing, chilling, quality testing, value-added products.",
    "subsidy_or_grant": "Interest subvention/grant support structured via GoI; end-beneficiary is cooperative ecosystem.",
    "interest_subvention_or_rate": "Concessional; routed via NABARD.",
    "loan_amount_range": "Large projects (co-op level).",
    "tenure_repayment": "Long tenor with moratorium (entity-level).",
    "eligibility": "State Dairy Federations/Unions/NDDB-linked entities.",
    "where_to_apply": "Through NDDB/NABARD channels.",
    "notes": "For cooperative dairy infra; not an individual farmer loan.",
    "sources": [""]
  },
  {
    "slug": "nfsm",
    "name": "NFSM – National Food Security Mission",
    "type": "Input assistance + demonstrations",
    "what_it_covers": "Seed minikits, cluster demos, machinery assistance for pulses, rice, wheat, nutri-cereals, oilseeds (via OFPO).",
    "subsidy_or_grant": "Component-wise fixed assistance (seed, demos, tools).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Farmers in NFSM districts; priority to small/marginal.",
    "where_to_apply": "District Agriculture Office.",
    "notes": "Grant amounts vary every year per approved AAP.",
    "sources": [""]
  },
  {
    "slug": "10k_fpos",
    "name": "Formation & Promotion of 10,000 FPOs",
    "type": "Equity grant + Credit guarantee",
    "what_it_covers": "FPO formation, handholding, equity grant & credit guarantee.",
    "subsidy_or_grant": "Equity Grant up to ₹15 lakh per FPO.",
    "interest_subvention_or_rate": "— (separate bank loans to FPOs).",
    "loan_amount_range": "Credit Guarantee cover up to ₹2 crore per FPO loan.",
    "tenure_repayment": "As per bank.",
    "eligibility": "New/existing FPOs through CBBOs.",
    "where_to_apply": "Through CBBOs/DAC&FW implementing agencies; banks.",
    "notes": "Credit guarantee fee support available.",
    "sources": [""]
  },
  {
    "slug": "ami_isam_marketing_infra",
    "name": "AMI under ISAM – Agri Marketing Infrastructure",
    "type": "Back-ended capital subsidy",
    "what_it_covers": "Scientific storage/marketing infra: godowns, silos, markets.",
    "subsidy_or_grant": "33.33% (max ₹60 lakh) general; 50% (max ₹75 lakh) for special category/NE/Himalayas (as per category).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Project based; bank finance eligible.",
    "tenure_repayment": "Per bank.",
    "eligibility": "Individuals, farmers, groups, FPOs, co-ops, APMCs etc.",
    "where_to_apply": "State/District Nodal Units and banks.",
    "notes": "Revalidated and continued with revised guidelines.",
    "sources": [""]
  },
  {
    "slug": "acabc",
    "name": "Agri-Clinics & Agri-Business Centres (ACABC)",
    "type": "Credit-linked subsidy (Entrepreneurship)",
    "what_it_covers": "Setting up input dealerships, custom hiring, advisory & service ventures by agri graduates.",
    "subsidy_or_grant": "Back-ended subsidy (prev. 36% general / 44% SC/ST/Women); check latest circular.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Bank appraisal; margin money reduced via subsidy.",
    "tenure_repayment": "Up to ~7 years typical.",
    "eligibility": "Agri-graduates/diploma holders; training by MANAGE-Nodal Training Institutes.",
    "where_to_apply": "Through NTIs to banks/NABARD route.",
    "notes": "NABARD circulars carry current subsidy % and conditions.",
    "sources": [""]
  },
  {
    "slug": "nbm_bamboo",
    "name": "National Bamboo Mission (NBM)",
    "type": "Capital subsidy + plantation support",
    "what_it_covers": "Nurseries, plantations, processing, product dev., marketing.",
    "subsidy_or_grant": "Component-wise fixed assistance with cost norms.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Farmers, SHGs, FPOs, MSMEs, State agencies.",
    "where_to_apply": "State Bamboo Mission/Dept. of Agriculture/Horticulture.",
    "notes": "Assistance norms notified under NBM guidelines.",
    "sources": [""]
  },
  {
    "slug": "nlm_livestock",
    "name": "National Livestock Mission (NLM)",
    "type": "Capital subsidy + support",
    "what_it_covers": "Breed development, feed & fodder infra, innovation/entrepreneurship in livestock.",
    "subsidy_or_grant": "Component-wise support; many items at 50–80% for priority categories.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Bank-linked where applicable.",
    "tenure_repayment": "Per bank.",
    "eligibility": "Individuals, FPOs, SHGs, companies, co-ops.",
    "where_to_apply": "DAHD/State AH Dept portals.",
    "notes": "Check current ESEFS & breed components in DAHD guidelines.",
    "sources": [""]
  },
  {
    "slug": "pmegp",
    "name": "PM-EGP – Prime Minister's Employment Generation Programme",
    "type": "Credit-linked margin money subsidy",
    "what_it_covers": "New micro-enterprises including food processing & agri-allied.",
    "subsidy_or_grant": "15–25% (urban), 25–35% (rural) margin money subsidy depending on category; ceilings as per KVIC.",
    "interest_subvention_or_rate": "Bank's MCLR-linked; no central subvention.",
    "loan_amount_range": "Up to ₹50 lakh (manufacturing); up to ₹20 lakh (services) – as per latest PMEGP norms.",
    "tenure_repayment": "3–7 years with moratorium.",
    "eligibility": "18+ new units; SHGs/FPOs/co-ops/charitable trusts etc.",
    "where_to_apply": "pmegp e-portal (KVIC) + bank.",
    "notes": "Own contribution 5–10% depending on category.",
    "sources": [""]
  },
  {
    "slug": "mudra",
    "name": "PM-MUDRA Yojana",
    "type": "Collateral-free MSME credit",
    "what_it_covers": "Working capital/term loan for non-farm micro units (agri-allied trading, services, processing).",
    "subsidy_or_grant": "— (CGFMU guarantee).",
    "interest_subvention_or_rate": "Market-linked (bank/NBFC specific).",
    "loan_amount_range": "Shishu: ≤₹50,000; Kishore: ₹50,001–₹5 lakh; Tarun: ₹5–10 lakh.",
    "tenure_repayment": "Up to 5 years typical.",
    "eligibility": "Non-farm micro units; KYC & viability.",
    "where_to_apply": "Banks/NBFCs/MFIs; mudra.org.in info.",
    "notes": "Collateral-free with CGFMU guarantee cover.",
    "sources": [""]
  },
  {
    "slug": "stand_up_india",
    "name": "Stand-Up India",
    "type": "Enterprise term loan",
    "what_it_covers": "Greenfield enterprises by SC/ST/Women including agri-processing/trading.",
    "subsidy_or_grant": "— (handholding support).",
    "interest_subvention_or_rate": "Bank MCLR + up to 3% (guideline); negotiated.",
    "loan_amount_range": "₹10 lakh – ₹1 crore.",
    "tenure_repayment": "Up to 7 years with moratorium up to 18 months.",
    "eligibility": "At least one SC/ST or one Women borrower per bank branch.",
    "where_to_apply": "standupmitra portal & banks.",
    "notes": "Margin money up to 15% allowed; converges with CGTMSE for guarantee.",
    "sources": [""]
  },
  {
    "slug": "pm_kisan_income_support",
    "name": "PM-KISAN (Income Support)",
    "type": "DBT income support",
    "what_it_covers": "₹6,000/year in 3 instalments to eligible farmer families.",
    "subsidy_or_grant": "₹6,000/year per family (DBT).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Landholding farmer families as per scheme guidelines.",
    "where_to_apply": "pmkisan portal / CSC / State agriculture offices.",
    "notes": "Not a loan/subsidy for assets; unconditional income support.",
    "sources": [""]
  },
  {
    "slug": "pmksy_hkkp",
    "name": "PMKSY – Har Khet Ko Pani (Irrigation)",
    "type": "Grant to States + beneficiary support",
    "what_it_covers": "AIBP, Watershed & minor irrigation; farmer-level benefits via state DPRs.",
    "subsidy_or_grant": "Grant to State projects; farmer capex often under PDMC (see above).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Project & beneficiary per State DPRs.",
    "where_to_apply": "State Water Resources/Agri Depts.",
    "notes": "Pairs with PDMC micro-irrigation for on-farm.",
    "sources": [""]
  },
  {
    "slug": "silk_samagra",
    "name": "Silk Samagra (Central Silk Board)",
    "type": "Component grants",
    "what_it_covers": "Sericulture: plantation, rearing houses, reeling, processing, incubation etc.",
    "subsidy_or_grant": "Component-wise fixed assistance; higher for NE/Hills/women/SC/ST.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "— (bank loan optional).",
    "tenure_repayment": "—",
    "eligibility": "Sericulture farmers, SHGs, FPOs, units.",
    "where_to_apply": "State Sericulture Dept/CSB.",
    "notes": "Latest 'Silk Samagra 2' continues support with revised norms.",
    "sources": [""]
  },
  {
    "slug": "midh_cold_chain_overlap",
    "name": "Cold Chain & PHM (via MIDH/DA&FW components)",
    "type": "Capital subsidy",
    "what_it_covers": "Pack-houses, pre-coolers, cold rooms, reefer vans (component wise).",
    "subsidy_or_grant": "Typical 35–50% with unit caps (state variation).",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "Bank finance per project.",
    "tenure_repayment": "5–8 years typical.",
    "eligibility": "Farmers, FPOs, co-ops, companies.",
    "where_to_apply": "State Horticulture/MIDH.",
    "notes": "Check current MIDH AAP for caps.",
    "sources": [""]
  },
  {
    "slug": "oilseeds_mission_ofpo",
    "name": "National Mission on Edible Oils – OFPO (Oilseeds)",
    "type": "Input & machinery assistance",
    "what_it_covers": "Seed minikits, demos, PHT/machinery for oilseeds; cluster support.",
    "subsidy_or_grant": "Fixed assistance per component.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Farmers in approved districts.",
    "where_to_apply": "District Agri Office.",
    "notes": "Separate palm oil mission exists with different pattern.",
    "sources": [""]
  },
  {
    "slug": "amif_pacs_dairy_fpo_overlap",
    "name": "PACS / FPO Conversion to Multi-Service (AIF-linked)",
    "type": "Credit + subvention (via AIF)",
    "what_it_covers": "PACS as grain storage/processing/CSC etc using AIF.",
    "subsidy_or_grant": "3% interest subvention (AIF) + guarantee.",
    "interest_subvention_or_rate": "3% subvention on up to ₹2 crore.",
    "loan_amount_range": "Up to ₹2 crore for subvention cap.",
    "tenure_repayment": "Up to 7 years typical.",
    "eligibility": "PACS registered entities.",
    "where_to_apply": "AIF portal/banks.",
    "notes": "Uses same AIF window for PACS infra build-out.",
    "sources": [""]
  },
  {
    "slug": "fisheries_credit_kcc",
    "name": "KCC for Fisheries & Animal Husbandry",
    "type": "Working capital credit",
    "what_it_covers": "Short-term working capital for fishers/dairy (feed, meds, diesel, ice).",
    "subsidy_or_grant": "Interest subvention scheme applicable (as notified).",
    "interest_subvention_or_rate": "Similar 2% + 3% prompt repayment incentive (per circulars).",
    "loan_amount_range": "Bank-assessed; often up to ₹2–3 lakh+.",
    "tenure_repayment": "12 months (renewable) or season-linked.",
    "eligibility": "Registered fishers/units; dairy farmers with herd records.",
    "where_to_apply": "Banks/RRBs/Co-ops.",
    "notes": "Operationalised under KCC saturation drive.",
    "sources": [""]
  },
  {
    "slug": "apmc_reforms_markets_enam",
    "name": "e-NAM + Market Reforms (supportive, not finance)",
    "type": "Market access platform",
    "what_it_covers": "Online trading & assaying in 1000+ mandis; logistics linkages.",
    "subsidy_or_grant": "—",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Registered farmers/traders/FPOs.",
    "where_to_apply": "enam.gov.in; via APMC.",
    "notes": "Often paired with AIF/AMI for infra.",
    "sources": [""]
  },
  {
    "slug": "seed_hub_minikits",
    "name": "Seed Hubs/Minikits (DA&FW components)",
    "type": "Grant (non-recurring)",
    "what_it_covers": "Foundation/certified seed production & distribution (pulses/oilseeds).",
    "subsidy_or_grant": "Fixed grant per minikit/acre under annual AAP.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "Registered farmers through SAUs/KVKs/Agri Dept.",
    "where_to_apply": "District Agri Office.",
    "notes": "Scheme heads move across NFSM/OFPO annually.",
    "sources": [""]
  },
  {
    "slug": "horticulture_value_chain_branding",
    "name": "Branding/Marketing Support (PM-FME/MIDH/FPO)",
    "type": "Grant (branding/market access)",
    "what_it_covers": "Branding, packaging, marketing for ODOP/cluster products.",
    "subsidy_or_grant": "Under PM-FME: 50% for branding/marketing (group) with caps; MIDH/FPO has separate heads.",
    "interest_subvention_or_rate": "—",
    "loan_amount_range": "—",
    "tenure_repayment": "—",
    "eligibility": "FPOs/SHGs/co-ops/micro units.",
    "where_to_apply": "State PM-FME/MIDH cells.",
    "notes": "Combine with AIF for processing infra + PM-FME for branding.",
    "sources": [""]
  }
];

const ExploreSchemes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'subsidy' | 'insurance'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.what_it_covers.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'credit') return matchesSearch && scheme.type.toLowerCase().includes('credit');
    if (activeTab === 'subsidy') return matchesSearch && scheme.subsidy_or_grant.toLowerCase().includes('subsidy');
    if (activeTab === 'insurance') return matchesSearch && scheme.name.toLowerCase().includes('insurance');
    return matchesSearch;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'credit' | 'subsidy' | 'insurance');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <Button
          variant="outline"
          onClick={() => navigate("/")} // Navigate back to home
          className="mb-4"
        >
          Back
        </Button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6">
            <Banknote className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            💰 Explore Government Schemes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive repository of government schemes, subsidies, and loan programs for farmers and rural communities
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes by name, type, or coverage..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schemes</SelectItem>
                  <SelectItem value="credit">Credit/Loans</SelectItem>
                  <SelectItem value="subsidy">Subsidies</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.slug} className="hover-card group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                    <Banknote className="h-6 w-6 text-primary" />
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {scheme.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {scheme.type}
                </p>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {scheme.what_it_covers}
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Subsidy:</strong> {scheme.subsidy_or_grant}</p>
                  <p><strong>Interest:</strong> {scheme.interest_subvention_or_rate}</p>
                  <p><strong>Loan Range:</strong> {scheme.loan_amount_range}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No schemes found</h3>
            <p className="text-muted-foreground">Try adjusting your search to find more schemes.</p>
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ExploreSchemes;
