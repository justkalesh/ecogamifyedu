export type QuizOption = {
  text: string;
  correct: boolean;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
};

export type Chapter = {
  id: string;
  title: string;
  content: string; // markdown-ish text
  quiz: QuizQuestion[]; // exactly 5
};

export type Lesson = {
  key: string;
  title: string;
  description: string;
  cover: string;
  chapters: Chapter[]; // 5-7
};

// Helper to make options
const o = (text: string, correct = false): QuizOption => ({ text, correct });

export const LESSONS: Lesson[] = [
  {
    key: "climate-change",
    title: "Climate Change",
    description:
      "Education's role in climate action: impacts on schooling, policy gaps, action‑oriented pedagogy, skills for a green transition, and effective communication.",
    cover:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      {
        id: "cc-1",
        title: "Climate–Education Nexus & Global Frameworks",
        content:
          "Education and climate action are interlinked. Global frameworks (UNFCCC, Paris Agreement, SDGs) recognize education through Action for Climate Empowerment, yet education remains underemphasized in many climate agendas. A stronger role for education helps build capacity, shift behaviors, and support just, effective transitions.",
        quiz: [
          {
            id: "cc-1-q1",
            question: "Which global agreements explicitly reference education for climate action?",
            options: [
              o("UNFCCC Article 6 and Paris Agreement Article 12", true),
              o("Kyoto Protocol only"),
              o("Montreal Protocol only"),
              o("Basel Convention only"),
            ],
          },
          {
            id: "cc-1-q2",
            question: "According to the report, SDG 4 featured in how many of 72 transnational climate initiatives?",
            options: [o("2", true), o("12"), o("36"), o("72")],
          },
          {
            id: "cc-1-q3",
            question: "ACE stands for:",
            options: [
              o("Action for Climate Empowerment", true),
              o("Agreement on Carbon Emissions"),
              o("Advanced Climate Education"),
              o("Adaptation and Carbon Exchange"),
            ],
          },
          {
            id: "cc-1-q4",
            question: "Which SDGs are especially relevant alongside SDG 4 (education) in this context?",
            options: [
              o("SDG 12 (sustainable consumption) and SDG 13 (climate action)", true),
              o("SDG 2 and SDG 3 only"),
              o("SDG 6 and SDG 7 only"),
              o("SDG 10 and SDG 16 only"),
            ],
          },
          {
            id: "cc-1-q5",
            question: "Why is education often underemphasized in climate policy?",
            options: [
              o("Its direct behavior impact is perceived as uncertain and sometimes linked to higher consumption among the educated", true),
              o("It is not mentioned in any global frameworks"),
              o("Schools cannot teach climate topics"),
              o("There is no evidence linking education and climate outcomes"),
            ],
          },
        ],
      },
      {
        id: "cc-2",
        title: "Climate Impacts on Education Systems",
        content:
          "Climate change disrupts education through damaged infrastructure, heat stress, displacement, and lost instruction time. Over the last two decades, school closures were reported in a large share of extreme events in low‑ and middle‑income countries. Impacts are uneven, with vulnerable learners disproportionately affected.",
        quiz: [
          {
            id: "cc-2-q1",
            question: "The report notes that schools were closed in at least what share of extreme weather events affecting 5M+ people in LMICs?",
            options: [o("75%", true), o("25%"), o("10%"), o("1%")],
          },
          {
            id: "cc-2-q2",
            question: "Which is NOT a typical climate‑related impact on education?",
            options: [
              o("Improved standardized test scores" , true),
              o("Infrastructure damage and closures"),
              o("Learning loss and absenteeism"),
              o("Psychosocial stress for students and staff"),
            ],
          },
          {
            id: "cc-2-q3",
            question: "Heatwaves tend to:",
            options: [
              o("Increase absenteeism and health risks, reducing learning", true),
              o("Improve concentration and attendance"),
              o("Have no effect on schooling"),
              o("Cool classrooms naturally"),
            ],
          },
          {
            id: "cc-2-q4",
            question: "Who is most affected by disruptions to education?",
            options: [
              o("Learners in vulnerable contexts (e.g., rural, low‑income, displaced)", true),
              o("Only university students in high‑income countries"),
              o("No group is disproportionately affected"),
              o("Only private school students"),
            ],
          },
          {
            id: "cc-2-q5",
            question: "A key system measure to prepare schools is:",
            options: [
              o("Risk assessments and disaster risk reduction planning", true),
              o("Banning climate topics"),
              o("Shortening the school year only"),
              o("Ignoring heat action plans"),
            ],
          },
        ],
      },
      {
        id: "cc-3",
        title: "Policy & Curriculum: Gaps and Trends",
        content:
          "Climate education policies are growing but insufficient. Analyses show national curriculum content on climate and biodiversity is uneven and often limited. Many systems emphasize cognitive knowledge over socio‑emotional and action learning, especially in early grades and non‑science subjects.",
        quiz: [
          {
            id: "cc-3-q1",
            question: "Across 76 countries, green curriculum content reached about what share of the maximum possible score?",
            options: [o("~50%", true), o("~90%"), o("~5%"), o("~70%")],
          },
          {
            id: "cc-3-q2",
            question: "The share of terms related to 'biodiversity' scored around:",
            options: [o("12%", true), o("2%"), o("62%"), o("80%")],
          },
          {
            id: "cc-3-q3",
            question: "The share for words related to 'climate change' scored around:",
            options: [o("21%", true), o("1%"), o("50%"), o("95%")],
          },
          {
            id: "cc-3-q4",
            question: "Green content is typically:",
            options: [
              o("Lower in grade 3 than grade 9 and lower in social science than science", true),
              o("Higher in grade 3 than grade 9"),
              o("Equal across all grades and subjects"),
              o("Absent from all science syllabi"),
            ],
          },
          {
            id: "cc-3-q5",
            question: "In primary education, references focus mostly on:",
            options: [
              o("Cognitive learning (~67%)", true),
              o("Social and emotional learning (~67%)"),
              o("Behavioral learning (~67%)"),
              o("No learning dimension is emphasized"),
            ],
          },
        ],
      },
      {
        id: "cc-4",
        title: "Pedagogy: From Knowledge to Action",
        content:
          "To fulfill its potential, climate education must move beyond knowledge transfer to include social‑emotional and action‑oriented learning. Contextualized, hands‑on projects, reflection, and community engagement help translate learning into mitigation and adaptation behaviors.",
        quiz: [
          { id: "cc-4-q1", question: "Which approach is emphasized as necessary?", options: [o("Action‑oriented, socio‑emotional learning", true), o("Memorization only"), o("Punitive drills"), o("Randomized guessing")] },
          { id: "cc-4-q2", question: "An example of action pedagogy is:", options: [o("Project‑based community action", true), o("Copying definitions"), o("Silent reading only"), o("Pop quizzes only")] },
          { id: "cc-4-q3", question: "Behavior change is best supported by:", options: [o("Practice, reflection, and local relevance", true), o("One lecture"), o("Unrelated homework"), o("No feedback")] },
          { id: "cc-4-q4", question: "Assessment should include:", options: [o("Competencies and actions, not recall alone", true), o("Spelling only"), o("Random facts"), o("Seat time only")] },
          { id: "cc-4-q5", question: "Educator readiness requires:", options: [o("Professional development and resources", true), o("No training"), o("Removing materials"), o("Banning collaboration")] },
        ],
      },
      {
        id: "cc-5",
        title: "Skills, Workforce & Youth Action",
        content:
          "Multiple sectors (energy, agriculture, forestry, urban planning) depend on education to build capacity for mitigation and adaptation. Businesses report skills shortages slowing climate projects. Students and youth advocate for deeper climate education and institutional change, including divestment and climate justice.",
        quiz: [
          { id: "cc-5-q1", question: "Which sectors rely on education for climate capacity?", options: [o("Energy, agriculture, forestry, urban planning", true), o("None"), o("Only tourism"), o("Only sports")] },
          { id: "cc-5-q2", question: "In an EU business survey, what share cited skills shortages hindering climate projects?", options: [o(">80%", true), o("~10%"), o("0%"), o("~30% ")] },
          { id: "cc-5-q3", question: "Since 2012, students in the US pushed how many institutions to divest from fossil fuels?", options: [o("141", true), o("14"), o("4"), o("1,041")] },
          { id: "cc-5-q4", question: "Education's underappreciated contribution includes:", options: [o("Developing professional capacities for a green economy", true), o("Raising emissions by default"), o("Eliminating jobs"), o("Blocking innovation")] },
          { id: "cc-5-q5", question: "A just transition emphasizes:", options: [o("Reskilling, inclusion, social protection", true), o("Layoffs without support"), o("Excluding communities"), o("Random siting")] },
        ],
      },
      {
        id: "cc-6",
        title: "Communication, Incentives & Monitoring",
        content:
          "Public communication can raise awareness but must be context‑sensitive. Targeted campaigns paired with incentives can shift behavior. Monitoring needs to be fit for purpose, tracking outcomes, and a new indicator on green curriculum content based on national frameworks/syllabi is proposed.",
        quiz: [
          { id: "cc-6-q1", question: "Effective communication should be:", options: [o("Sensitive to local context", true), o("One‑size‑fits‑all"), o("Purely technical"), o("Avoided")] },
          { id: "cc-6-q2", question: "Behavior change improves when:", options: [o("Campaigns are paired with incentives", true), o("Messages are random"), o("Information is hidden"), o("Costs increase unpredictably")] },
          { id: "cc-6-q3", question: "The proposed new indicator focuses on:", options: [o("Green content in curricula/syllabi", true), o("School paint color"), o("Principal salaries"), o("Desk spacing")] },
          { id: "cc-6-q4", question: "Recommendations call for:", options: [o("Moving beyond knowledge to action across systems", true), o("Eliminating climate topics"), o("Only exams"), o("Stopping teacher training")] },
          { id: "cc-6-q5", question: "Monitoring should:", options: [o("Measure outcomes and relevance, not inputs alone", true), o("Ignore results"), o("Count pages only"), o("Track stationery use")] },
        ],
      },
    ],
  },
  {
    key: "biodiversity",
    title: "Biodiversity",
    description: "Explore ecosystems, species diversity, and conservation.",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      {
        id: "bio-1",
        title: "What is Biodiversity?",
        content:
          "Biodiversity spans genetic, species, and ecosystem diversity. Healthy biodiversity underpins pollination, water purification, soil fertility, and climate regulation.",
        quiz: [
          { id: "bio-1-q1", question: "Biodiversity levels include:", options: [o("Genetic, species, ecosystem", true), o("Solar, lunar, stellar"), o("Metal, wood, water"), o("Urban, rural, polar")] },
          { id: "bio-1-q2", question: "A key ecosystem service is:", options: [o("Pollination", true), o("Asteroid mining"), o("Traffic congestion"), o("Spam filtering")] },
          { id: "bio-1-q3", question: "Genetic diversity enables:", options: [o("Resilience to stress", true), o("Uniform failure"), o("Instant speciation"), o("Zero adaptation")] },
          { id: "bio-1-q4", question: "Ecosystem diversity means:", options: [o("Variety of habitats", true), o("Only forests"), o("Only oceans"), o("Only deserts")] },
          { id: "bio-1-q5", question: "Species richness is:", options: [o("Number of species", true), o("Number of atoms"), o("Soil pH"), o("Air pressure")] },
        ],
      },
      {
        id: "bio-2",
        title: "Drivers of Loss",
        content:
          "Primary drivers: land-use change, overexploitation, invasive species, pollution, and climate change (the 'IPBES five'). Interactions amplify risks.",
        quiz: [
          { id: "bio-2-q1", question: "Top drivers include:", options: [o("Land-use change", true), o("Improved recycling"), o("Vaccines"), o("Wi‑Fi")] },
          { id: "bio-2-q2", question: "Overexploitation refers to:", options: [o("Unsustainable harvesting", true), o("Wildlife tourism"), o("Photosynthesis"), o("Seed dispersal")] },
          { id: "bio-2-q3", question: "Invasive species are:", options: [o("Non-native, harmful", true), o("Always beneficial"), o("Endemic"), o("Extinct")] },
          { id: "bio-2-q4", question: "Pollution impact:", options: [o("Degrades habitats", true), o("Creates species"), o("Increases coral growth"), o("Improves soil health by default")] },
          { id: "bio-2-q5", question: "Climate change can:", options: [o("Shift ranges and phenology", true), o("Freeze evolution"), o("Stop extinction"), o("Lower seas instantly")] },
        ],
      },
      {
        id: "bio-3",
        title: "Conservation Tools",
        content:
          "Protected areas, restoration, sustainable use, and community-led conservation safeguard biodiversity. Policy frameworks like 30x30 and the Kunming–Montreal GBF guide action.",
        quiz: [
          { id: "bio-3-q1", question: "Protected areas aim to:", options: [o("Conserve habitats/species", true), o("Expand roads"), o("Intensify mining"), o("Ban research")] },
          { id: "bio-3-q2", question: "Restoration means:", options: [o("Recover degraded ecosystems", true), o("Draining wetlands"), o("Clear-cutting"), o("Soil sealing")] },
          { id: "bio-3-q3", question: "30x30 refers to:", options: [o("30% protection by 2030", true), o("30°C temps"), o("30% tax"), o("30 oceans total")] },
          { id: "bio-3-q4", question: "Community-led efforts:", options: [o("Enhance outcomes", true), o("Always fail"), o("Harm locals"), o("Ignore knowledge")] },
          { id: "bio-3-q5", question: "Sustainable use is:", options: [o("Use within ecological limits", true), o("Unlimited extraction"), o("No monitoring"), o("Random quotas")] },
        ],
      },
      {
        id: "bio-4",
        title: "Ecosystem Services & People",
        content:
          "Ecosystem services include provisioning (food, water), regulating (climate, floods), cultural (recreation, identity), and supporting (soil formation). Valuation can inform decisions while respecting intrinsic values.",
        quiz: [
          { id: "bio-4-q1", question: "Pollination is:", options: [o("Regulating/Supporting service", true), o("Cultural"), o("Disservice always"), o("Mineral service")] },
          { id: "bio-4-q2", question: "Cultural services include:", options: [o("Recreation, identity", true), o("Coal mining"), o("Fertilizer runoff"), o("Acid rain")] },
          { id: "bio-4-q3", question: "Valuation helps to:", options: [o("Inform trade-offs", true), o("Erase values"), o("Fix prices only"), o("Eliminate choices")] },
          { id: "bio-4-q4", question: "Supporting services are:", options: [o("Foundational processes", true), o("Luxury goods"), o("Taxes"), o("TV services")] },
          { id: "bio-4-q5", question: "Flood regulation is:", options: [o("Regulating service", true), o("Provisioning"), o("Cultural"), o("None")] },
        ],
      },
      {
        id: "bio-5",
        title: "Mainstreaming Nature",
        content:
          "Integrating biodiversity into agriculture, cities, and finance reduces impacts and drives restoration. Nature-positive pathways rely on measurement, disclosure, and incentives.",
        quiz: [
          { id: "bio-5-q1", question: "Mainstreaming means:", options: [o("Embedding in decisions", true), o("Ignoring nature"), o("Isolating policies"), o("One-off pilots")] },
          { id: "bio-5-q2", question: "Urban measure:", options: [o("Green corridors", true), o("Remove parks"), o("Tile all soil"), o("Over-lighting") ] },
          { id: "bio-5-q3", question: "Finance lever:", options: [o("Disclosure & targets", true), o("Hide impacts"), o("Ban data"), o("No metrics")] },
          { id: "bio-5-q4", question: "Agriculture action:", options: [o("Agroecology", true), o("Overuse pesticides"), o("Burn crop residues indiscriminately"), o("Drain wetlands")] },
          { id: "bio-5-q5", question: "Nature-positive aims for:", options: [o("Net gain for nature", true), o("Net loss"), o("No change"), o("Only profit")] },
        ],
      },
    ],
  },
  {
    key: "waste-management",
    title: "Waste Management",
    description: "Reduce, reuse, recycle, and manage waste sustainably.",
    cover:
      "https://images.unsplash.com/photo-1604799507067-44d9897aa4d2?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      {
        id: "wm-1",
        title: "The 5Rs Hierarchy",
        content:
          "Refuse, Reduce, Reuse, Recycle, and Recover prioritize upstream prevention over downstream disposal.",
        quiz: [
          { id: "wm-1-q1", question: "First priority in 5Rs?", options: [o("Refuse", true), o("Recycle"), o("Recover"), o("Landfill")] },
          { id: "wm-1-q2", question: "Reuse means:", options: [o("Use again without reprocessing", true), o("Burning"), o("Downcycling"), o("Composting metals")] },
          { id: "wm-1-q3", question: "Recycling turns:", options: [o("Waste into materials", true), o("Food into oil"), o("CO₂ into gold"), o("None")] },
          { id: "wm-1-q4", question: "Energy recovery is:", options: [o("From residual waste", true), o("From fresh food"), o("From rain"), o("From wind only")] },
          { id: "wm-1-q5", question: "Landfill is:", options: [o("Last resort", true), o("First choice"), o("Best for organics"), o("Climate solution")] },
        ],
      },
      {
        id: "wm-2",
        title: "Segregation & Collection",
        content:
          "Source segregation improves material quality: organics, recyclables, hazardous, and residual streams require distinct handling and bins.",
        quiz: [
          { id: "wm-2-q1", question: "Segregation improves:", options: [o("Recycling quality", true), o("Litter"), o("Contamination"), o("Illegal dumping")] },
          { id: "wm-2-q2", question: "Hazardous waste needs:", options: [o("Special handling", true), o("House drains"), o("Compost pits"), o("Open burning")] },
          { id: "wm-2-q3", question: "Organics include:", options: [o("Food scraps", true), o("Metal cans"), o("Glass"), o("Batteries")] },
          { id: "wm-2-q4", question: "E-waste contains:", options: [o("Metals & toxics", true), o("Only paper"), o("Only sand"), o("Only organic matter")] },
          { id: "wm-2-q5", question: "Informal sector can:", options: [o("Boost recovery when integrated", true), o("Be ignored"), o("Always harms"), o("Eliminate sorting")] },
        ],
      },
      {
        id: "wm-3",
        title: "Treatment Options",
        content:
          "Composting, anaerobic digestion for organics; MRFs for recyclables; safe treatment for hazardous and biomedical wastes.",
        quiz: [
          { id: "wm-3-q1", question: "Composting produces:", options: [o("Soil amendment", true), o("Crude oil"), o("Steel"), o("Glass")] },
          { id: "wm-3-q2", question: "AD outputs:", options: [o("Biogas and digestate", true), o("Ash"), o("Sand"), o("Coal")] },
          { id: "wm-3-q3", question: "MRF stands for:", options: [o("Materials Recovery Facility", true), o("Metal Refinery Fund"), o("Mixed Refuse Furnace"), o("Municipal Road Fund")] },
          { id: "wm-3-q4", question: "Biomedical waste requires:", options: [o("Special treatment", true), o("Open dumping"), o("House drains"), o("Street bins")] },
          { id: "wm-3-q5", question: "Leachate is:", options: [o("Liquid from waste", true), o("Drinking water"), o("Biodiesel"), o("Rainwater only")] },
        ],
      },
      {
        id: "wm-4",
        title: "Circular Economy",
        content:
          "Design for durability, repairability, and recyclability keeps materials in use; business models like product-as-a-service reduce waste.",
        quiz: [
          { id: "wm-4-q1", question: "Circularity aims to:", options: [o("Keep materials in use", true), o("Increase waste"), o("Shorten lifespans"), o("Landfill first")] },
          { id: "wm-4-q2", question: "Design strategy:", options: [o("Repairability", true), o("Planned obsolescence"), o("Toxic materials"), o("Non-standard parts") ] },
          { id: "wm-4-q3", question: "Business model:", options: [o("Product-as-a-service", true), o("Single-use only"), o("Burn-before-use"), o("Landfill rewards")] },
          { id: "wm-4-q4", question: "Industrial symbiosis:", options: [o("Waste as input for others", true), o("Burn all waste"), o("Ship to landfills"), o("Ignore byproducts")] },
          { id: "wm-4-q5", question: "Design for recycling means:", options: [o("Simpler material mixes", true), o("Complex composites"), o("Hidden toxics"), o("No labels")] },
        ],
      },
      {
        id: "wm-5",
        title: "Behavior & Policy",
        content:
          "Pay-as-you-throw, EPR, and public awareness drive better outcomes. Behavior nudges and infrastructure must align.",
        quiz: [
          { id: "wm-5-q1", question: "EPR stands for:", options: [o("Extended Producer Responsibility", true), o("Extra Plastic Rate"), o("Exported Product Rules"), o("External Price Ratio")] },
          { id: "wm-5-q2", question: "PAYT means:", options: [o("Users pay by waste generated", true), o("Flat fee"), o("No payment"), o("Tax rebate only")] },
          { id: "wm-5-q3", question: "Awareness campaigns:", options: [o("Improve participation", true), o("Always fail"), o("Confuse only"), o("Ban recycling")] },
          { id: "wm-5-q4", question: "Infrastructure should:", options: [o("Enable desired behavior", true), o("Punish sorting"), o("Hide bins"), o("Mix streams") ] },
          { id: "wm-5-q5", question: "EPR targets:", options: [o("Producers for end-of-life", true), o("Consumers only"), o("Cities only"), o("NGOs only")] },
        ],
      },
    ],
  },
  {
    key: "renewable-energy",
    title: "Renewable Energy",
    description: "Solar, wind, hydro, and innovative clean technologies.",
    cover:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      {
        id: "re-1",
        title: "Solar Basics",
        content:
          "Solar PV converts sunlight into electricity using semiconductor cells. Performance depends on irradiance, temperature, and shading.",
        quiz: [
          { id: "re-1-q1", question: "PV converts:", options: [o("Light to electricity", true), o("Heat to light"), o("Sound to heat"), o("Wind to heat")] },
          { id: "re-1-q2", question: "Key PV factor:", options: [o("Irradiance", true), o("Latitude only"), o("Paint color"), o("Font size")] },
          { id: "re-1-q3", question: "Shading causes:", options: [o("Power loss", true), o("Cooling"), o("No change"), o("Voltage gain")] },
          { id: "re-1-q4", question: "Inverters:", options: [o("DC to AC", true), o("AC to water"), o("Heat pumps"), o("Gas to solid")] },
          { id: "re-1-q5", question: "Tilt angle affects:", options: [o("Energy yield", true), o("Taste"), o("Noise"), o("Radio waves")] },
        ],
      },
      {
        id: "re-2",
        title: "Wind Power",
        content:
          "Wind turbines convert kinetic energy of wind into electricity. Capacity factor varies with wind resource and turbine design.",
        quiz: [
          { id: "re-2-q1", question: "Turbines convert:", options: [o("Wind to electricity", true), o("Water to heat"), o("Light to mass"), o("Soil to gas")] },
          { id: "re-2-q2", question: "Capacity factor is:", options: [o("Actual/maximum output over time", true), o("Blade width"), o("Rotor color"), o("Tax rate")] },
          { id: "re-2-q3", question: "Best sites have:", options: [o("Steady strong winds", true), o("Calm air"), o("Downtown canyons"), o("Heavily forested lowlands")] },
          { id: "re-2-q4", question: "Cut-in speed is:", options: [o("Minimum wind for generation", true), o("Storm speed"), o("Rotor diameter"), o("Grid code")] },
          { id: "re-2-q5", question: "Offshore wind:", options: [o("Higher winds but higher cost", true), o("Lower winds and cost"), o("Zero maintenance"), o("Only on lakes")] },
        ],
      },
      {
        id: "re-3",
        title: "Hydro & Storage",
        content:
          "Hydropower provides low-carbon electricity and grid services; storage (batteries, pumped hydro) balances variable renewables.",
        quiz: [
          { id: "re-3-q1", question: "Storage helps by:", options: [o("Balancing supply/demand", true), o("Increasing emissions"), o("Blocking solar"), o("Breaking grids")] },
          { id: "re-3-q2", question: "Pumped hydro stores:", options: [o("Water at elevation", true), o("Heat in sand"), o("Air in balloons"), o("Coal in tanks")] },
          { id: "re-3-q3", question: "Hydro also offers:", options: [o("Grid inertia & flexibility", true), o("Only noise"), o("Only floods"), o("Only peaks")] },
          { id: "re-3-q4", question: "Batteries store:", options: [o("Electrical energy chemically", true), o("Wind as ice"), o("Sun as paint"), o("Tides as sound")] },
          { id: "re-3-q5", question: "Environmental impacts must be:", options: [o("Assessed and managed", true), o("Ignored"), o("Maximized"), o("Outsourced")] },
        ],
      },
      {
        id: "re-4",
        title: "Grid Integration",
        content:
          "Integrating renewables requires flexible demand, interconnections, forecasting, and market design. Smart inverters and storage aid stability.",
        quiz: [
          { id: "re-4-q1", question: "Forecasting improves:", options: [o("Scheduling and reliability", true), o("Cloud shapes"), o("Turbine color"), o("Website load times")] },
          { id: "re-4-q2", question: "Demand response:", options: [o("Shifts load in time", true), o("Increases peaks"), o("Breaks meters"), o("Heats wires")] },
          { id: "re-4-q3", question: "Interconnections allow:", options: [o("Sharing variability", true), o("Islanding"), o("Voltage spikes"), o("Lower frequency") ] },
          { id: "re-4-q4", question: "Smart inverters provide:", options: [o("Voltage support", true), o("Only DC"), o("Snow removal"), o("Biomass growth")] },
          { id: "re-4-q5", question: "Market design should:", options: [o("Reward flexibility", true), o("Punish accuracy"), o("Ban storage"), o("Fix prices arbitrarily")] },
        ],
      },
      {
        id: "re-5",
        title: "Emerging Tech",
        content:
          "Green hydrogen, advanced geothermal, and next-gen storage expand decarbonization options beyond power into industry and transport.",
        quiz: [
          { id: "re-5-q1", question: "Green H₂ is made by:", options: [o("Electrolysis with renewables", true), o("Steam methane reforming"), o("Coal gasification"), o("Photosynthesis")] },
          { id: "re-5-q2", question: "Geothermal accesses:", options: [o("Earth's heat", true), o("Lunar light"), o("Ocean salt"), o("Air pressure")] },
          { id: "re-5-q3", question: "Use case beyond power:", options: [o("Industrial heat", true), o("Origami"), o("Chess"), o("Astronomy only")] },
          { id: "re-5-q4", question: "Storage innovation:", options: [o("Long-duration options", true), o("No storage"), o("Only diesel"), o("VHS tapes")] },
          { id: "re-5-q5", question: "Hydrogen carriers include:", options: [o("Ammonia", true), o("Chalk"), o("Sand"), o("Granite")] },
        ],
      },
    ],
  },
  // Four more lessons
  {
    key: "water-conservation",
    title: "Water Conservation",
    description: "Smart use, reuse, and protection of freshwater resources.",
    cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      { id: "wc-1", title: "Water Cycle & Stress", content: "The hydrologic cycle circulates water via evaporation, condensation, precipitation, and runoff. Human withdrawals and climate alter timing and availability; many basins face water stress.", quiz: [
        { id: "wc-1-q1", question: "Evaporation leads to:", options: [o("Water vapor", true), o("Granite"), o("Nitrogen"), o("Iron")] },
        { id: "wc-1-q2", question: "Water stress occurs when:", options: [o("Demand nears/exceeds supply", true), o("Rains daily"), o("No users"), o("Only ice exists")] },
        { id: "wc-1-q3", question: "Runoff feeds:", options: [o("Rivers and lakes", true), o("Satellites"), o("Volcanoes"), o("Wi‑Fi")] },
        { id: "wc-1-q4", question: "Climate change can:", options: [o("Shift precipitation patterns", true), o("Stop the cycle"), o("Freeze oceans"), o("Create water from nothing")] },
        { id: "wc-1-q5", question: "Groundwater is:", options: [o("Stored in aquifers", true), o("Sky water"), o("Only seawater"), o("Steam clouds")] },
      ]},
      { id: "wc-2", title: "Demand Management", content: "Efficiency in agriculture (drip irrigation), cities (low-flow fixtures, leakage reduction), and industry (process optimization) reduces withdrawals.", quiz: [
        { id: "wc-2-q1", question: "Drip irrigation:", options: [o("Delivers water to roots", true), o("Floods fields"), o("Boils soil"), o("Paints crops")] },
        { id: "wc-2-q2", question: "Urban efficiency:", options: [o("Low-flow fixtures", true), o("Leaky pipes"), o("Open canals"), o("No metering")] },
        { id: "wc-2-q3", question: "Industry can:", options: [o("Recycle process water", true), o("Dump wastewater"), o("Use only potable water"), o("Ignore cooling") ] },
        { id: "wc-2-q4", question: "Leakage control:", options: [o("Saves water", true), o("Wastes water"), o("Increases bursts"), o("Is irrelevant")] },
        { id: "wc-2-q5", question: "Tariffs can:", options: [o("Incentivize saving", true), o("Ban meters"), o("Promote waste"), o("Hide costs")] },
      ]},
      { id: "wc-3", title: "Supply Augmentation", content: "Rainwater harvesting, aquifer recharge, desalination (where viable), and reuse expand supply.", quiz: [
        { id: "wc-3-q1", question: "Rainwater harvesting:", options: [o("Captures roof runoff", true), o("Cloud farming"), o("None"), o("Salt mining")] },
        { id: "wc-3-q2", question: "Desalination makes:", options: [o("Freshwater from seawater", true), o("Wine from grapes"), o("Fuel from sand"), o("Ice from air")] },
        { id: "wc-3-q3", question: "Managed recharge:", options: [o("Refills aquifers", true), o("Drains aquifers"), o("Heats oceans"), o("Cools air")] },
        { id: "wc-3-q4", question: "Water reuse uses:", options: [o("Treated wastewater", true), o("Raw sewage"), o("Only rain"), o("Untreated runoff")] },
        { id: "wc-3-q5", question: "Brine is:", options: [o("Concentrated salt byproduct", true), o("Sweet water"), o("Soil"), o("Air")] },
      ]},
      { id: "wc-4", title: "Quality & Pollution", content: "Protecting source waters, controlling nutrients and pathogens, and ensuring safe sanitation are core to water security and health.", quiz: [
        { id: "wc-4-q1", question: "Nutrient pollution causes:", options: [o("Eutrophication", true), o("Ozone holes"), o("Earthquakes"), o("Meteor showers")] },
        { id: "wc-4-q2", question: "Pathogens are:", options: [o("Disease-causing microbes", true), o("Nutrients"), o("Minerals"), o("Vitamins")] },
        { id: "wc-4-q3", question: "Sanitation aims to:", options: [o("Safely manage excreta", true), o("Hide waste"), o("Dump to rivers"), o("Dry lakes")] },
        { id: "wc-4-q4", question: "Source protection:", options: [o("Safeguards quality", true), o("Reduces quality"), o("Only increases quantity"), o("None")] },
        { id: "wc-4-q5", question: "Nitrates often come from:", options: [o("Fertilizers", true), o("Stars"), o("Pure rain"), o("Granite") ] },
      ]},
      { id: "wc-5", title: "Governance & Equity", content: "Integrated Water Resources Management balances uses across sectors and ensures equitable access, prioritizing human rights to water and sanitation.", quiz: [
        { id: "wc-5-q1", question: "IWRM coordinates:", options: [o("Water across sectors", true), o("Air only"), o("Soil only"), o("Noise only")] },
        { id: "wc-5-q2", question: "Human right to water:", options: [o("Safe, accessible, affordable", true), o("Luxury good"), o("Optional"), o("Only for cities")] },
        { id: "wc-5-q3", question: "Equity means:", options: [o("Fair access for all", true), o("Only wealthy"), o("Random"), o("First-come only")] },
        { id: "wc-5-q4", question: "Stakeholder participation:", options: [o("Improves legitimacy", true), o("Blocks progress"), o("Is illegal"), o("None")] },
        { id: "wc-5-q5", question: "Tariff design should:", options: [o("Protect the poor", true), o("Only reward waste"), o("Ignore costs"), o("Eliminate service")] },
      ]},
    ],
  },
  {
    key: "sustainable-agriculture",
    title: "Sustainable Agriculture",
    description: "Soils, crops, and practices for resilient food systems.",
    cover: "https://images.unsplash.com/photo-1441123694162-e54a981ceba3?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      { id: "sa-1", title: "Healthy Soils", content: "Soil organic matter supports fertility, structure, and water retention. Practices: cover crops, reduced tillage, organic amendments.", quiz: [
        { id: "sa-1-q1", question: "SOM stands for:", options: [o("Soil Organic Matter", true), o("Solar Order Mass"), o("Salt Oxide Mix"), o("Sand Organic Mix")] },
        { id: "sa-1-q2", question: "Cover crops:", options: [o("Protect and enrich soils", true), o("Strip nutrients"), o("Only add salt"), o("Increase erosion")] },
        { id: "sa-1-q3", question: "Reduced tillage:", options: [o("Preserves structure", true), o("Destroys worms"), o("Always needed"), o("Bakes soil")] },
        { id: "sa-1-q4", question: "Compost adds:", options: [o("Nutrients & carbon", true), o("Lead"), o("Plastic"), o("Noise")] },
        { id: "sa-1-q5", question: "Soil health aids:", options: [o("Yield stability", true), o("Floods"), o("Pests"), o("Droughts") ] },
      ]},
      { id: "sa-2", title: "Integrated Pest Management", content: "IPM combines cultural, biological, mechanical, and chemical control with monitoring and thresholds to minimize pesticide use.", quiz: [
        { id: "sa-2-q1", question: "IPM goal:", options: [o("Minimize pesticides via diverse tools", true), o("Spray always"), o("Ignore pests"), o("Ban monitoring")] },
        { id: "sa-2-q2", question: "Biocontrol uses:", options: [o("Natural enemies", true), o("Heavy metals"), o("Salt"), o("Light")] },
        { id: "sa-2-q3", question: "Thresholds guide:", options: [o("When to act", true), o("What to plant"), o("Farm size"), o("Tractor color")] },
        { id: "sa-2-q4", question: "Cultural control:", options: [o("Crop rotation", true), o("Noise"), o("Poison fish"), o("Salt burn")] },
        { id: "sa-2-q5", question: "Scouting means:", options: [o("Monitoring pests", true), o("Hiring scouts"), o("Satellite only"), o("Ignoring fields")] },
      ]},
      { id: "sa-3", title: "Water & Nutrients", content: "Right source, rate, time, and place (4R) improves nutrient use efficiency and reduces losses; irrigation scheduling saves water.", quiz: [
        { id: "sa-3-q1", question: "4R refers to:", options: [o("Right source, rate, time, place", true), o("Right rain, river, road, rail"), o("Right root, rock, rod, rope"), o("Right red, rose, rim, rope")] },
        { id: "sa-3-q2", question: "Over-fertilization:", options: [o("Leads to runoff and N₂O", true), o("Always good"), o("Stops pests"), o("Increases soil pH only")] },
        { id: "sa-3-q3", question: "Irrigation scheduling:", options: [o("Matches water to crop need", true), o("Floods fields"), o("Dries plants"), o("Random timing")] },
        { id: "sa-3-q4", question: "Precision ag uses:", options: [o("Data & sensors", true), o("Luck"), o("Smoke"), o("Stars only")] },
        { id: "sa-3-q5", question: "Split applications:", options: [o("Reduce losses", true), o("Increase losses"), o("No effect"), o("Ban yields")] },
      ]},
      { id: "sa-4", title: "Agrobiodiversity", content: "Diverse crops and varieties enhance resilience, nutrition, and ecosystem services.", quiz: [
        { id: "sa-4-q1", question: "Diversity improves:", options: [o("Resilience", true), o("Fragility"), o("Monoculture risk"), o("Pest outbreaks")] },
        { id: "sa-4-q2", question: "Intercropping is:", options: [o("Growing multiple crops together", true), o("Fallowing"), o("Burning"), o("Salting") ] },
        { id: "sa-4-q3", question: "Nutrition benefits via:", options: [o("Varied diets", true), o("Single staple only"), o("No vegetables"), o("Only sugar")] },
        { id: "sa-4-q4", question: "Seed systems should:", options: [o("Preserve local varieties", true), o("Eliminate landraces"), o("Ban exchange"), o("Ignore storage")] },
        { id: "sa-4-q5", question: "Pollinators support:", options: [o("Fruit set & yields", true), o("Soil salting"), o("Smog"), o("Noise")] },
      ]},
      { id: "sa-5", title: "Markets & Policy", content: "Standards, extension services, insurance, and fair markets enable sustainable transitions for farmers.", quiz: [
        { id: "sa-5-q1", question: "Extension provides:", options: [o("Training & advice", true), o("Taxes"), o("Pesticides only"), o("Marketing only")] },
        { id: "sa-5-q2", question: "Insurance helps with:", options: [o("Managing climate risk", true), o("Raising risk"), o("Breaking tools"), o("Banning loans")] },
        { id: "sa-5-q3", question: "Standards drive:", options: [o("Quality & sustainability", true), o("Confusion"), o("Smuggling"), o("Waste")] },
        { id: "sa-5-q4", question: "Fair markets should:", options: [o("Reward good practices", true), o("Punish quality"), o("Hide information"), o("Ban transparency")] },
        { id: "sa-5-q5", question: "Credit access enables:", options: [o("Investments in upgrades", true), o("Debt traps only"), o("No change"), o("Fewer options")] },
      ]},
    ],
  },
  {
    key: "sustainable-cities",
    title: "Sustainable Cities",
    description: "Urban planning for low-carbon, resilient, and livable cities.",
    cover: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      { id: "sc-1", title: "Compact, Connected, Clean", content: "Transit-oriented development, mixed-use density, and clean mobility reduce emissions and improve access.", quiz: [
        { id: "sc-1-q1", question: "TOD focuses on:", options: [o("Development around transit", true), o("Highways only"), o("Parking lots"), o("Airports only")] },
        { id: "sc-1-q2", question: "Mixed-use means:", options: [o("Homes + jobs + services", true), o("Zoning single uses"), o("Vacant land only"), o("Industrial only")] },
        { id: "sc-1-q3", question: "Active mobility:", options: [o("Walking & cycling", true), o("Jet skiing"), o("Snowmobiling"), o("Paragliding")] },
        { id: "sc-1-q4", question: "Air quality improves via:", options: [o("Clean transit", true), o("More diesel"), o("Open burning"), o("Lead petrol")] },
        { id: "sc-1-q5", question: "Parking policy can:", options: [o("Influence travel choices", true), o("Grow trees"), o("Make rain"), o("Stop walking")] },
      ]},
      { id: "sc-2", title: "Green Infrastructure", content: "Urban forests, parks, bioswales, and green roofs mitigate heat and manage stormwater while enhancing wellbeing.", quiz: [
        { id: "sc-2-q1", question: "Bioswales manage:", options: [o("Stormwater", true), o("Traffic"), o("Birds"), o("Noise")] },
        { id: "sc-2-q2", question: "Urban forests help:", options: [o("Reduce heat island", true), o("Increase smog"), o("Remove shade"), o("Block buses")] },
        { id: "sc-2-q3", question: "Green roofs provide:", options: [o("Insulation & habitat", true), o("Earthquakes"), o("Lava"), o("Highways")] },
        { id: "sc-2-q4", question: "Wellbeing improves via:", options: [o("Access to nature", true), o("More noise"), o("More fumes"), o("Less shade")] },
        { id: "sc-2-q5", question: "Stormwater storage reduces:", options: [o("Flooding", true), o("Ozone"), o("Snow"), o("Clouds")] },
      ]},
      { id: "sc-3", title: "Resilience & Risk", content: "Cities prepare for heatwaves, floods, and storms through risk assessments, early warnings, and resilient infrastructure.", quiz: [
        { id: "sc-3-q1", question: "Resilience is:", options: [o("Ability to withstand shocks", true), o("More fragility"), o("No planning"), o("Luck only")] },
        { id: "sc-3-q2", question: "Early warnings:", options: [o("Save lives", true), o("Cause storms"), o("Break grids"), o("Create droughts")] },
        { id: "sc-3-q3", question: "Flood defenses include:", options: [o("Dikes & wetlands", true), o("More asphalt"), o("Lower bridges"), o("Less drainage")] },
        { id: "sc-3-q4", question: "Heat actions:", options: [o("Cooling centers", true), o("Dark roofs"), o("Tree removal"), o("No shade")] },
        { id: "sc-3-q5", question: "Critical infrastructure must be:", options: [o("Climate-proofed", true), o("Ignored"), o("Overloaded"), o("Unmapped")] },
      ]},
      { id: "sc-4", title: "Buildings & Energy", content: "Efficient buildings, electrification, and district energy lower emissions and costs.", quiz: [
        { id: "sc-4-q1", question: "Electrification replaces:", options: [o("Fossil fuels with electricity", true), o("Solar with diesel"), o("Windows with bricks"), o("Air with water")] },
        { id: "sc-4-q2", question: "Efficiency reduces:", options: [o("Energy demand", true), o("Comfort"), o("Safety"), o("Daylight")] },
        { id: "sc-4-q3", question: "District energy:", options: [o("Shared heating/cooling", true), o("Single room fans"), o("Only solar"), o("Only gas") ] },
        { id: "sc-4-q4", question: "Retrofitting:", options: [o("Upgrading existing buildings", true), o("Demolishing all"), o("Painting only"), o("Adding posters")] },
        { id: "sc-4-q5", question: "Codes set:", options: [o("Minimum performance", true), o("Color of walls"), o("Furniture"), o("Logos")] },
      ]},
      { id: "sc-5", title: "Governance & Finance", content: "Planning, zoning reforms, public participation, and green bonds enable implementation at scale.", quiz: [
        { id: "sc-5-q1", question: "Green bonds fund:", options: [o("Environmental projects", true), o("Military"), o("Gambling"), o("Spam") ] },
        { id: "sc-5-q2", question: "Zoning reforms can:", options: [o("Enable mixed-use & density", true), o("Freeze sprawl"), o("Ban transit"), o("Remove sidewalks")] },
        { id: "sc-5-q3", question: "Participation improves:", options: [o("Legitimacy & buy-in", true), o("Corruption"), o("Confusion"), o("Exclusion")] },
        { id: "sc-5-q4", question: "PPPs are:", options: [o("Public–private partnerships", true), o("Pay-per-park"), o("Paper–pen procedures"), o("Pizza–pasta parties")] },
        { id: "sc-5-q5", question: "Scaling requires:", options: [o("Capacity & finance", true), o("Only slogans"), o("Ignoring data"), o("Randomness")] },
      ]},
    ],
  },
  {
    key: "sustainable-transport",
    title: "Sustainable Transport",
    description: "Clean, safe, and efficient mobility systems.",
    cover: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
    chapters: [
      { id: "st-1", title: "Avoid–Shift–Improve", content: "Reduce the need to travel, shift to sustainable modes, and improve vehicle technology and fuels.", quiz: [
        { id: "st-1-q1", question: "Avoid means:", options: [o("Reduce trip demand", true), o("Speed only"), o("Paint roads"), o("Ban sidewalks")] },
        { id: "st-1-q2", question: "Shift means:", options: [o("To public/active modes", true), o("To trucks"), o("To jets"), o("To rockets")] },
        { id: "st-1-q3", question: "Improve means:", options: [o("Cleaner vehicles and fuels", true), o("Bigger engines"), o("Heavier cars"), o("Louder exhausts")] },
        { id: "st-1-q4", question: "Safety improves with:", options: [o("Vision Zero, design", true), o("Higher speeds"), o("No crossings"), o("No helmets")] },
        { id: "st-1-q5", question: "Electrification cuts:", options: [o("Tailpipe emissions", true), o("Walkability"), o("Transit"), o("Bicycle use")] },
      ]},
      { id: "st-2", title: "Public Transport", content: "Buses, BRT, metros, and rail move many efficiently; reliability, frequency, and integration matter.", quiz: [
        { id: "st-2-q1", question: "BRT is:", options: [o("Bus Rapid Transit", true), o("Bike Rail Transit"), o("Boat River Travel"), o("Blue Road Traffic")] },
        { id: "st-2-q2", question: "Key to PT adoption:", options: [o("Reliability & frequency", true), o("Random schedules"), o("Long waits"), o("Confusing fares")] },
        { id: "st-2-q3", question: "Integration means:", options: [o("Seamless transfers & tickets", true), o("Separate islands"), o("Cash-only"), o("Different maps")] },
        { id: "st-2-q4", question: "Bus priority:", options: [o("Dedicated lanes", true), o("Shared with parking"), o("Blocked stops"), o("None")] },
        { id: "st-2-q5", question: "Fare capping:", options: [o("Limits daily costs", true), o("Raises price"), o("Random"), o("Illegal")] },
      ]},
      { id: "st-3", title: "Active Mobility", content: "Walking and cycling infrastructure boosts health and cuts emissions; networks, safety, and connectivity are critical.", quiz: [
        { id: "st-3-q1", question: "Protected lanes:", options: [o("Improve cycling safety", true), o("Increase crashes"), o("Slow walking"), o("Ban bikes")] },
        { id: "st-3-q2", question: "Connectivity means:", options: [o("Continuous safe routes", true), o("Random gaps"), o("Dead ends"), o("Only highways")] },
        { id: "st-3-q3", question: "Walkability improves with:", options: [o("Shade & sidewalks", true), o("Speeding"), o("Loud roads"), o("No crossings")] },
        { id: "st-3-q4", question: "Traffic calming:", options: [o("Reduces speeds", true), o("Raises speeds"), o("Removes trees"), o("Widens lanes only")] },
        { id: "st-3-q5", question: "Micromobility includes:", options: [o("E-bikes, scooters", true), o("Zeppelins"), o("Submarines"), o("Snowcats")] },
      ]},
      { id: "st-4", title: "Freight & Logistics", content: "Efficient logistics, consolidation, and clean trucks reduce freight emissions and congestion.", quiz: [
        { id: "st-4-q1", question: "Urban consolidation:", options: [o("Fewer, fuller trips", true), o("More empty trips"), o("Heavier vans"), o("Random routes")] },
        { id: "st-4-q2", question: "Route optimization:", options: [o("Cuts distance & time", true), o("Adds detours"), o("Raises fuel use"), o("Blocks deliveries")] },
        { id: "st-4-q3", question: "Clean trucks:", options: [o("Electric or low-emission", true), o("Coal"), o("Lead"), o("Wood")] },
        { id: "st-4-q4", question: "Last-mile can use:", options: [o("Cargo bikes", true), o("Jets"), o("Tanks"), o("Submarines")] },
        { id: "st-4-q5", question: "Idle reduction:", options: [o("Saves fuel", true), o("Wastes fuel"), o("No effect"), o("Breaks engines")] },
      ]},
      { id: "st-5", title: "Policy & Pricing", content: "Parking reform, congestion pricing, and fuel economy standards shape behavior and fleets.", quiz: [
        { id: "st-5-q1", question: "Congestion pricing:", options: [o("Charges for peak driving", true), o("Pays drivers"), o("Is free"), o("Bans buses")] },
        { id: "st-5-q2", question: "Fuel standards:", options: [o("Improve efficiency", true), o("Lower safety"), o("Raise emissions"), o("Ban EVs")] },
        { id: "st-5-q3", question: "Parking minimums can:", options: [o("Induce driving", true), o("Plant trees"), o("Cool cities"), o("Lower costs")] },
        { id: "st-5-q4", question: "Road pricing can:", options: [o("Manage demand", true), o("Grow traffic"), o("Ignore peaks"), o("Ban transit")] },
        { id: "st-5-q5", question: "Equity requires:", options: [o("Targeted discounts", true), o("No discounts"), o("Random"), o("Only wealthy ride")] },
      ]},
    ],
  },
];

export function getLessonByKey(key: string) {
  return LESSONS.find((l) => l.key === key);
}

export function getAllLessons() {
  return LESSONS;
}