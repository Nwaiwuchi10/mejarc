"use client";

import React from "react";
import { Download, Globe } from "lucide-react";

// Service Type Enum mapping
enum ServiceType {
  LANDSCAPE_DESIGN = 'landscape-design',
  INTERIOR_DESIGN = 'interior-design',
  PRODUCT_DESIGN = 'product-design',
  RENDERING_3D = '3d-rendering',
  ARCHITECTURAL_2D = '2d-architectural',
  BIM = 'building-information-modeling',
  MEP_DRAWINGS = 'mep-drawings',
  STRUCTURAL_ENGINEERING = 'structural-engineering',
}

// Full service configurations for all 8 types
const SERVICE_CONFIGS: Record<string, any> = {
  [ServiceType.LANDSCAPE_DESIGN]: {
    contexts: [
      { title: 'Residential Garden Design', description: 'For private homes — front yards, backyards, or personal gardens.' },
      { title: 'Commercial Landscaping', description: 'For estates, office complexes, or business environments that need a clean, professional outdoor look.' },
      { title: 'Resort or Hospitality', description: 'For hotels, resorts, or guest lodges where outdoor beauty adds to guest experience.' },
      { title: 'Public Park', description: 'For open public areas meant for relaxation, recreation, or community use.' },
    ],
    projectTypes: [
      { title: 'Front / Backyard Garden', description: 'Focused on personal house surroundings — beautifying entrances or relaxation gardens.' },
      { title: 'Courtyard / Terrace Landscape', description: 'For smaller spaces like rooftop terraces, inner courtyards, or patios.' },
      { title: 'Estate Green Area', description: 'Common areas within estates — lawns, walkways, or shared greenery.' },
      { title: 'Public Park / Outdoor Space', description: 'Large-scale open areas for the public, with paths, seating, or playgrounds.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Site layout plan, softscape & hardscape concept, planting layout.' },
      { title: 'Intermediate Package', description: 'Full planting plan, paving & lighting layout, 3D visuals.' },
      { title: 'Advanced Package', description: 'Complete design, implementation plan, maintenance guide, 3D and 2D visuals.' },
    ],
    addons: [
      { title: '3D Walkthrough Animation', description: 'Interactive 3D walkthrough of your landscape design.' },
      { title: 'Furniture & Lighting Selection', description: 'Curated furniture and lighting recommendations.' },
      { title: 'Drainage Design Integration', description: 'Professional drainage planning and integration.' },
    ],
    sizes: [
      { title: 'Small (under 200 sqm)', description: 'Compact spaces — home gardens or small courtyards.' },
      { title: 'Medium (200-1000 sqm)', description: 'Moderate-sized projects — estates, resorts, or community spaces.' },
      { title: 'Large (1000 sqm and above)', description: 'Big outdoor developments like parks or resort compounds.' },
    ],
    styles: [
      { title: 'Modern', description: 'Clean lines, simple layouts, and elegant plant choices — perfect for contemporary homes.' },
      { title: 'Tropical', description: 'Lush greenery, bright colors, and relaxing vibes — great for warm climates.' },
      { title: 'Sustainable', description: 'Focuses on eco-friendly materials, native plants, and energy-efficient setups.' },
      { title: 'Local Environmental & Drainage', description: 'Ensures the design follows regional building and drainage rules for safety and compliance.' },
    ]
  },
  [ServiceType.PRODUCT_DESIGN]: {
    contexts: [
      { title: 'Residential Product Design', description: 'Product design solutions for private homes and residential spaces.' },
      { title: 'Commercial Product Design', description: 'Product design for offices, retail, and commercial environments.' },
      { title: 'Hospitality Product Design', description: 'Product design for hotels, restaurants, and hospitality venues.' },
      { title: 'Industrial Product Design', description: 'Product design for industrial and manufacturing applications.' },
    ],
    projectTypes: [
      { title: 'Furniture Design', description: 'Custom furniture design and specifications.' },
      { title: 'Fixture & Fitting Design', description: 'Design of fixtures, fittings, and built-in elements.' },
      { title: 'Modular Design', description: 'Modular and flexible product design solutions.' },
      { title: 'Ergonomic Design', description: 'Human-centered ergonomic product design.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Concept sketches, material selection, and initial design layout.' },
      { title: 'Intermediate Package', description: 'Detailed 3D models, technical drawings, and design documentation.' },
      { title: 'Advanced Package', description: 'Complete design package with prototyping specifications and manufacturing guide.' },
    ],
    addons: [
      { title: '3D Visualization', description: 'High-quality 3D renders of the product design.' },
      { title: 'Material & Finish Board', description: 'Curated material samples and finish recommendations.' },
      { title: 'Manufacturing Specification', description: 'Detailed specifications for production and manufacturing.' },
    ],
    sizes: [
      { title: 'Single Item', description: 'Design of one specific product or piece.' },
      { title: 'Product Range', description: 'Design of a collection or range of related products.' },
      { title: 'Full Interior Product Set', description: 'Complete product design for an entire space or project.' },
    ],
    styles: [
      { title: 'Modern / Minimalist', description: 'Clean, simple, and contemporary product style.' },
      { title: 'Classic / Traditional', description: 'Timeless design with elegant and detailed craftsmanship.' },
      { title: 'Industrial / Raw', description: 'Bold, raw materials with a strong industrial aesthetic.' },
      { title: 'Eco-Friendly / Sustainable', description: 'Environmentally conscious materials and design approach.' },
    ]
  },
  [ServiceType.INTERIOR_DESIGN]: {
    contexts: [
      { title: 'Residential Interiors', description: 'Interior design for homes such as apartments and private houses.' },
      { title: 'Commercial Interiors', description: 'Interior design for offices and corporate environments.' },
      { title: 'Hospitality / Restaurant Interiors:', description: 'Interior design for hotels, restaurants, and lounges focused on customer experience.' },
      { title: 'Retail / Showroom Design', description: 'Interior design for shops and display spaces to attract customers and enhance product presentation.' },
    ],
    projectTypes: [
      { title: 'Living Room / Bedroom', description: 'Design of individual residential spaces.' },
      { title: 'Office Space', description: 'Workspace planning and design for productivity and comfort.' },
      { title: 'Restaurant / Café', description: 'Layout and interior styling for dining environments.' },
      { title: 'Store / Boutique', description: 'Design of retail spaces to improve customer flow and sales.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Layout plan, color palette, and mood board.' },
      { title: 'Intermediate Package', description: '3D visuals, furniture layout, and lighting plan.' },
      { title: 'Advanced Package', description: 'Full space design, implementation plan, maintenance guide, 3D and 2D visuals.' },
    ],
    addons: [
      { title: '3D Walkthrough', description: 'Immersive 3D visualization of the interior design.' },
      { title: 'Furniture Procurement List', description: 'Detailed furniture and fitting sourcing document.' },
      { title: 'Material Samples Board', description: 'Physical or digital material and finish samples.' },
    ],
    sizes: [
      { title: 'Single Room', description: 'Design of one specific interior space.' },
      { title: 'Full Apartment', description: 'Complete interior design for an entire unit.' },
      { title: 'Multi-Floor or Complex Space', description: 'Large-scale or multi-level interior project.' },
    ],
    styles: [
      { title: 'Modern / Minimalist', description: 'Clean, simple, and contemporary interior style.' },
      { title: 'Classic / Luxury', description: 'Elegant and detailed interior with premium finishes.' },
      { title: 'Industrial / Contemporary', description: 'Raw, modern style with bold materials and textures.' },
      { title: 'Eco-Friendly / Sustainable', description: 'Environmentally conscious interior design approach.' },
    ]
  },
  [ServiceType.RENDERING_3D]: {
    contexts: [
      { title: 'Architectural Visualization', description: '3D renders of buildings, exteriors, and architectural projects.' },
      { title: 'Interior Rendering', description: 'High-quality 3D images of interior spaces and room designs.' },
      { title: 'Product Rendering', description: '3D visualization for product design, packaging, or e-commerce.' },
      { title: 'Landscape Visualization', description: '3D rendering of outdoor spaces, landscapes, and site plans.' },
    ],
    projectTypes: [
      { title: 'Exterior Rendering', description: 'High-quality exterior building and landscape visualizations.' },
      { title: 'Interior Rendering', description: 'Detailed interior space visualizations.' },
      { title: 'Aerial / Bird-Eye View', description: "Bird's eye view rendering of a site or development." },
      { title: 'Animation / Walkthrough', description: 'Animated 3D walkthrough of a space or building.' },
    ],
    scopes: [
      { title: 'Standard Rendering', description: 'Single perspective, high-quality 3D still render.' },
      { title: 'Multi-Perspective Package', description: 'Multiple angles and viewpoints with lighting variations.' },
      { title: 'Full Experience Package', description: '3D renders + animation + interactive virtual walkthrough.' },
    ],
    addons: [
      { title: 'Day/Night Lighting Variants', description: 'Separate renders showing different lighting conditions.' },
      { title: '360° Panoramic View', description: 'Interactive 360-degree panoramic image.' },
      { title: 'Branded Presentation Deck', description: 'Professionally formatted presentation with your renders.' },
    ],
    sizes: [
      { title: 'Single Image', description: '1 photorealistic still render.' },
      { title: '3-5 Images', description: 'A small set of renders from key viewpoints.' },
      { title: '6+ Images / Animation', description: 'Comprehensive render set or animated walkthrough.' },
    ],
    styles: [
      { title: 'Photorealistic', description: 'Ultra-realistic representation with life-like detail.' },
      { title: 'Architectural / Technical', description: 'Clean architectural style emphasizing design clarity.' },
      { title: 'Stylized / Artistic', description: 'Creative interpretation with an artistic or illustrative feel.' },
      { title: 'Minimalist', description: 'Clean, uncluttered rendering focusing on key design elements.' },
    ]
  },
  [ServiceType.ARCHITECTURAL_2D]: {
    contexts: [
      { title: 'New Building Design', description: 'Architectural drawings for a brand-new building project.' },
      { title: 'Renovation / Extension', description: 'Drawings for modifying or extending an existing building.' },
      { title: 'Commercial Layout', description: 'Architectural drawings for offices, retail, or commercial spaces.' },
      { title: 'Institutional Building', description: 'Drawings for schools, hospitals, or public facilities.' },
    ],
    projectTypes: [
      { title: 'Residential Building', description: 'Architectural drawings for homes or apartment buildings.' },
      { title: 'Commercial Building', description: 'Drawings for offices, retail, or business facilities.' },
      { title: 'Industrial / Warehouse', description: 'Drawings for factories, warehouses, or industrial premises.' },
      { title: 'Mixed-Use Development', description: 'Combined residential, commercial, and public-use drawings.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Floor plans and site layout drawing.' },
      { title: 'Standard Package', description: 'Plans, elevations, sections, and standard details.' },
      { title: 'Complete Package', description: 'All drawings including detailed construction specifications and schedules.' },
    ],
    addons: [
      { title: 'Building Codes Compliance Review', description: 'Verification that drawings comply with local building standards.' },
      { title: 'Construction Detail Drawings', description: 'Detailed construction and assembly specification sheets.' },
      { title: 'Furniture & Fixture Layout', description: 'Drawings showing furniture placement and fitting positions.' },
    ],
    sizes: [
      { title: 'Small (1-2 floors)', description: 'Single or double-storey residential or small commercial building.' },
      { title: 'Medium (3-5 floors)', description: 'Medium-scale building with several storeys.' },
      { title: 'Large (6+ floors or complex)', description: 'High-rise or technically complex multi-use structure.' },
    ],
    styles: [
      { title: 'Nigerian Building Standards', description: 'Drawings prepared in accordance with Nigerian building regulations and codes.' },
      { title: 'UK Building Standards', description: 'Drawings following UK regulations and standards.' },
      { title: 'International Standards (ISO)', description: 'Drawings prepared to international ISO conventions.' },
      { title: 'Customer to Specify', description: 'Client provides the applicable building code or standard for their location.' },
    ]
  },
  [ServiceType.BIM]: {
    contexts: [
      { title: 'Architectural BIM Modeling', description: 'Creation of a detailed 3D digital model of the architectural design.' },
      { title: 'Structural BIM Modeling', description: '3D modeling of beams, columns, slabs, and structural elements.' },
      { title: 'MEP (Mechanical, Electrical, Plumbing)', description: 'Integrated modeling of building services to avoid clashes during construction.' },
      { title: 'Full Project BIM Integration', description: 'Complete coordination of architecture, structure, and MEP into one intelligent model.' },
    ],
    projectTypes: [
      { title: 'Residential Building', description: 'BIM modeling for houses or apartment buildings.' },
      { title: 'Commercial Building', description: 'BIM modeling for offices, retail, or business spaces.' },
      { title: 'Institutional Project', description: 'BIM modeling for schools, hospitals, or public facilities.' },
      { title: 'Industrial / Infrastructure', description: 'BIM modeling for factories, warehouses, or large infrastructure projects.' },
    ],
    scopes: [
      { title: 'Basic Package – LOD 200', description: 'Basic 3D model showing general building elements and layout.' },
      { title: 'Intermediate Package – LOD 300', description: 'Detailed model including architectural, structural, and MEP integration.' },
      { title: 'Advanced Package – LOD 400/500', description: 'Complete model with all details ready for fabrication and construction.' },
    ],
    addons: [
      { title: 'IFC Export File', description: 'Industry Foundation Classes file for software interoperability.' },
      { title: '3D Coordination Review', description: 'Clash detection and coordination review across disciplines.' },
      { title: 'Net Zero Compliance Analysis', description: 'Environmental and energy-efficiency compliance check.' },
    ],
    sizes: [
      { title: 'Single Dwelling', description: 'One standalone building project.' },
      { title: 'Multi-Unit Building', description: 'Building with multiple units or apartments.' },
      { title: 'High-Rise / Complex Facility', description: 'Large or technically complex multi-storey project.' },
    ],
    styles: [
      { title: 'ISO 19650 BIM Standards', description: 'International standard for BIM information management.' },
      { title: 'IFC Model Standards', description: 'Global file standard for BIM collaboration.' },
      { title: 'Nigerian / UK Building Codes', description: 'Compliance with national construction regulations.' },
      { title: 'Sustainable / Net Zero Design Integration', description: 'Modeling aligned with environmental and energy-efficiency goals.' },
    ]
  },
  [ServiceType.MEP_DRAWINGS]: {
    contexts: [
      { title: 'Electrical Design Layout', description: 'Detailed drawings showing power points, lighting, switches, and electrical distribution.' },
      { title: 'Mechanical (HVAC) Design', description: 'Drawings for heating, ventilation, and air-conditioning systems.' },
      { title: 'Plumbing & Drainage Design', description: 'Layout plans for water supply, waste pipes, and drainage systems.' },
      { title: 'Fire Alarm / Safety Systems', description: 'Design of fire detection, alarm systems, and safety equipment placement.' },
    ],
    projectTypes: [
      { title: 'Residential', description: 'Mechanical and electrical drawings for homes or apartments.' },
      { title: 'Commercial', description: 'Drawings for offices, retail stores, and business buildings.' },
      { title: 'Industrial / Institutional', description: 'Drawings for factories, schools, hospitals, and large facilities.' },
      { title: 'Store / Boutique', description: 'MEP design of retail spaces to support customer flow and safety.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Single system layout (electrical or plumbing only).' },
      { title: 'Intermediate Package', description: 'Complete HVAC, lighting, and plumbing layouts.' },
      { title: 'Advanced Package', description: 'Load calculations, detailed design drawings, and system specifications.' },
    ],
    addons: [
      { title: 'Energy Efficiency Design', description: 'Recommendations for reducing energy consumption.' },
      { title: 'Smart Building Integration', description: 'Automation and smart building system design.' },
      { title: 'Coordination with Structural Drawings', description: 'Cross-referencing with structural drawings to avoid clashes.' },
    ],
    sizes: [
      { title: 'Small', description: 'Single home or single-floor project.' },
      { title: 'Medium', description: 'Multi-unit building or office space.' },
      { title: 'Large', description: 'Complex project with multiple systems and zones.' },
    ],
    styles: [
      { title: 'Customer to Specify', description: 'Standard engineering codes or regulatory standards based on project location.' },
    ]
  },
  [ServiceType.STRUCTURAL_ENGINEERING]: {
    contexts: [
      { title: 'Structural Design & Analysis', description: 'Engineering calculations and design to ensure the building is strong and stable.' },
      { title: 'Reinforced Concrete Design', description: 'Structural design focused on concrete elements like slabs, beams, and columns.' },
      { title: 'Steel / Timber Structure Design', description: 'Design of buildings or frameworks using steel or timber materials.' },
      { title: 'Structural Retrofit / Strengthening', description: 'Upgrading or reinforcing an existing building to improve safety and performance.' },
    ],
    projectTypes: [
      { title: 'Residential Building', description: 'Structural drawings for houses or apartment buildings.' },
      { title: 'Commercial Building', description: 'Structural design for offices, retail, or business facilities.' },
      { title: 'Industrial Structure', description: 'Structural plans for factories, warehouses, or heavy-duty buildings.' },
      { title: 'Infrastructure Project', description: 'Structural design for bridges, towers, or large public structures.' },
    ],
    scopes: [
      { title: 'Basic Package', description: 'Foundation layout, column layout, and simple beam plan.' },
      { title: 'Intermediate Package', description: 'Full framing plans, slab details, and reinforcement drawings.' },
      { title: 'Advanced Package', description: 'Detailed structural design, construction details, and full design drawings.' },
    ],
    addons: [
      { title: 'Seismic / Wind Load Design', description: 'Analysis and design for lateral forces including seismic and wind loads.' },
      { title: 'Coordination with BIM Model', description: 'Cross-referencing structural drawings with a BIM model.' },
      { title: 'Material Quantity Summary', description: 'Bill of materials and quantity estimate for structural elements.' },
    ],
    sizes: [
      { title: 'Small', description: '1-2 storey building.' },
      { title: 'Medium', description: '3-5 storey building.' },
      { title: 'Large', description: 'High-rise or technically complex structure.' },
    ],
    styles: [
      { title: 'Customer to Specify', description: 'Standard engineering codes or regulatory standards based on project location.' },
    ]
  }
};

export default function ProjectBrief({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-gray-500">No project data available.</div>;

  const config = SERVICE_CONFIGS[data.serviceType] || SERVICE_CONFIGS[ServiceType.LANDSCAPE_DESIGN];

  const isSelected = (field: string, value: string) => {
    if (field === "scopeDeliverables") {
      return Array.isArray(data[field]) && data[field].includes(value);
    }
    return data[field] === value;
  };

  return (
    <div className="w-full bg-white h-full p-8 max-w-4xl border border-gray-100 shadow-sm rounded-md overflow-y-auto">
      {/* Client Selections Section */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-800 mb-2">Project Description</h2>
        <p className="text-[13px] text-gray-500 italic max-w-3xl leading-relaxed">
          {data.serviceContext} - {data.additionalInformation || "No additional information provided."}
        </p>
      </section>

      {/* Service Context Section */}
      <section className="mb-10">
        <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Service Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.contexts.map((ctx: any) => (
            <div
              key={ctx.title}
              className={`border rounded-md p-5 transition-all ${isSelected("serviceContext", ctx.title)
                ? "border-blue-400 bg-[#F8FAFF]"
                : "border-gray-200 bg-white"
                }`}
            >
              <h3 className={`text-[13px] font-bold mb-2 ${isSelected("serviceContext", ctx.title) ? "text-blue-600" : "text-gray-800"}`}>
                {ctx.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{ctx.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Type Section */}
      <section className="mb-10">
        <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Project Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.projectTypes.map((pt: any) => (
            <div
              key={pt.title}
              className={`border rounded-md p-5 transition-all ${isSelected("projectType", pt.title)
                ? "border-blue-400 bg-[#F8FAFF]"
                : "border-gray-200 bg-white"
                }`}
            >
              <h3 className={`text-[13px] font-bold mb-2 ${isSelected("projectType", pt.title) ? "text-blue-600" : "text-gray-800"}`}>
                {pt.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{pt.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scope & Deliverables Section */}
      <section className="mb-10">
        <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Scope & Deliverables</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.scopes.map((s: any) => (
            <div
              key={s.title}
              className={`border rounded-md p-5 transition-all ${isSelected("scopeDeliverables", s.title)
                ? "border-blue-400 bg-[#F8FAFF]"
                : "border-gray-200 bg-white"
                }`}
            >
              <h3 className={`text-[13px] font-bold mb-2 ${isSelected("scopeDeliverables", s.title) ? "text-blue-600" : "text-gray-800"}`}>
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Optional Add-ons Section */}
      {config.addons && config.addons.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Optional Add-ons</h2>
          <div className="flex flex-wrap gap-4">
            {config.addons.map((a: any) => (
              <div
                key={a.title}
                className={`flex justify-between items-center bg-white border px-4 py-3 rounded-md w-full sm:w-[280px] transition-all ${isSelected("scopeDeliverables", a.title) ? "border-blue-400" : "border-gray-200"
                  }`}
              >
                <span className={`text-[13px] ${isSelected("scopeDeliverables", a.title) ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                  {a.title}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex justify-center items-center ${isSelected("scopeDeliverables", a.title) ? "border-blue-600" : "border-gray-300"
                  }`}>
                  {isSelected("scopeDeliverables", a.title) && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Size / Complexity Section */}
      <section className="mb-10">
        <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Size / Complexity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.sizes.map((s: any) => (
            <div
              key={s.title}
              className={`border rounded-md p-5 transition-all ${isSelected("sizeComplexity", s.title)
                ? "border-blue-400 bg-[#F8FAFF]"
                : "border-gray-200 bg-white"
                }`}
            >
              <h3 className={`text-[13px] font-bold mb-2 ${isSelected("sizeComplexity", s.title) ? "text-blue-600" : "text-gray-800"}`}>
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Style / Standards Section */}
      <section className="mb-10">
        <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Style / Standards / Regulations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.styles.map((s: any) => (
            <div
              key={s.title}
              className={`border rounded-md p-5 transition-all ${isSelected("style", s.title)
                ? "border-blue-400 bg-[#F8FAFF]"
                : "border-gray-200 bg-white"
                }`}
            >
              <h3 className={`text-[13px] font-bold mb-2 ${isSelected("style", s.title) ? "text-blue-600" : "text-gray-800"}`}>
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Timeline && Budget Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <section>
          <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Project Timeline</h2>
          <div className="flex items-center gap-2">
            <Globe className="text-blue-500" size={16} />
            <span className="text-[13px] font-bold text-gray-900">{data.timeline}</span>
          </div>
        </section>
        <section>
          <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Budget Estimate</h2>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-green-600">₦{Number(data.budget || 0).toLocaleString()}</span>
          </div>
        </section>
      </div>

      {/* Document From Client Section */}
      {data.attachedFiles && data.attachedFiles.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold text-gray-800 mb-4">Documents From Client</h2>
          <div className="flex flex-col gap-3">
            {data.attachedFiles.map((file: string, idx: number) => {
              const fileName = file.split('/').pop() || `document_${idx + 1}`;
              return (
                <div key={idx} className="flex items-center justify-between w-full sm:w-[320px] bg-[#EEF2FC] text-blue-600 p-4 rounded-md shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[13px] font-medium text-blue-700 truncate">{fileName}</span>
                  </div>
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}

