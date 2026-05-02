export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string; // HTML
}

export const posts: BlogPost[] = [
  {
    slug: "how-to-get-your-cdl-2026",
    title: "How to Get Your CDL in 2026: Step-by-Step Guide",
    description: "A complete walkthrough of the CDL process — from CLP application to passing your skills test and getting your commercial driver's license.",
    date: "2026-04-15",
    readTime: "8 min read",
    category: "Getting Started",
    content: `
<p>Getting a Commercial Driver's License (CDL) opens the door to some of the most in-demand, well-paying jobs in transportation. Whether you're pursuing long-haul trucking, local delivery, or bus driving, the process follows a clear sequence of steps.</p>

<h2>Step 1: Meet Basic Eligibility Requirements</h2>
<p>Before you apply, make sure you meet these federal minimums:</p>
<ul>
  <li>At least 18 years old (21+ for interstate commerce)</li>
  <li>Valid regular driver's license</li>
  <li>Able to pass a FMCSA medical exam (DOT physical)</li>
  <li>No disqualifying offenses on your driving record</li>
</ul>

<h2>Step 2: Study the CDL Manual</h2>
<p>Every state publishes a free Commercial Driver License Manual covering all knowledge test topics. Download your state's version from your DMV website and study these core sections:</p>
<ul>
  <li>General Knowledge (required for all CDL classes)</li>
  <li>Air Brakes (if your vehicle has air brakes)</li>
  <li>Combination Vehicles (Class A)</li>
  <li>Any endorsements you need (HazMat, Tanker, Passenger, etc.)</li>
</ul>

<h2>Step 3: Apply for a Commercial Learner's Permit (CLP)</h2>
<p>Your first official step is passing the written knowledge tests at your DMV and receiving a CLP. You'll typically need to pass:</p>
<ul>
  <li>General Knowledge test — 50 questions, 80% to pass (40 correct)</li>
  <li>Air Brakes test — if operating air-brake vehicles</li>
  <li>Any endorsement tests relevant to your planned work</li>
</ul>
<p>Bring your regular license, proof of residency, Social Security card, and payment for the application fee.</p>

<h2>Step 4: Hold Your CLP for 14 Days</h2>
<p>Federal regulations require you to hold your CLP for a minimum of 14 days before taking the CDL skills test. Use this time to practice with a qualified CDL holder in the vehicle.</p>

<h2>Step 5: Pass the CDL Skills Test</h2>
<p>The skills test has three parts:</p>
<ol>
  <li><strong>Pre-trip inspection</strong> — demonstrate that you can identify vehicle defects</li>
  <li><strong>Basic vehicle controls</strong> — backing maneuvers, offset backing, alley dock</li>
  <li><strong>On-road driving test</strong> — evaluated on turns, lane changes, intersections, and more</li>
</ol>
<p>You must bring your own vehicle (or use a CDL school's vehicle) to the skills test. Make sure it represents the class and endorsements you're testing for.</p>

<h2>Step 6: Get Your CDL</h2>
<p>After passing the skills test, pay your state's CDL issuance fee and your license will be issued. If you needed a DOT medical certificate, make sure it's on file with your DMV.</p>

<h2>Tips for Success</h2>
<ul>
  <li>Take practice tests before your DMV appointment — our free tests mirror the real exam format</li>
  <li>Study the Air Brakes section thoroughly even if you aren't sure you'll need it — the L restriction prevents you from driving air-brake vehicles if you fail or skip this test</li>
  <li>Consider a CDL training school if you have no prior experience driving large vehicles</li>
  <li>Check your state's specific requirements — some states have additional fees or steps</li>
</ul>
    `,
  },
  {
    slug: "cdl-general-knowledge-test-study-guide",
    title: "CDL General Knowledge Test: Complete Study Guide",
    description: "Everything you need to know to pass the CDL General Knowledge exam — 50 questions, 80% threshold, and the key topics the test covers.",
    date: "2026-04-10",
    readTime: "7 min read",
    category: "Study Guides",
    content: `
<p>The CDL General Knowledge test is required for every CDL applicant regardless of the vehicle class or endorsements you're pursuing. Here's a comprehensive breakdown of what to expect and how to prepare.</p>

<h2>Test Format</h2>
<ul>
  <li><strong>Questions:</strong> 50 multiple-choice questions</li>
  <li><strong>Passing score:</strong> 80% (40 out of 50 correct)</li>
  <li><strong>Time limit:</strong> Varies by state (typically 60–90 minutes)</li>
  <li><strong>Attempts:</strong> Most states allow retakes after a waiting period</li>
</ul>

<h2>Major Topic Areas</h2>

<h3>1. Vehicle Inspection (Pre-Trip)</h3>
<p>Know the seven-step inspection method. You'll be tested on what to check under the hood, on the engine compartment, the cab interior, lights, mirrors, tires, brakes, and coupling systems.</p>

<h3>2. Basic Vehicle Control</h3>
<p>Understand how to manage a large vehicle's speed, braking distance, turning radius, and backing. Questions cover the physics of why large vehicles behave differently than cars — especially stopping distance.</p>

<h3>3. Shifting and Backing</h3>
<p>Proper shifting technique, double-clutching, when to upshift/downshift, and safe backing procedures are common test topics.</p>

<h3>4. Coupling and Uncoupling</h3>
<p>The steps for safely coupling a tractor to a trailer and uncoupling it appear frequently in the General Knowledge test, especially for Class A applicants.</p>

<h3>5. Pre-Trip Inspection</h3>
<p>Understand what constitutes a "defect" that makes a vehicle unsafe to drive, what items must be checked before every trip, and what information must be in the vehicle at all times.</p>

<h3>6. Basic Hazardous Materials Rules</h3>
<p>Even without a HazMat endorsement, you need to know basic rules — like when hazmat placards are required and what the driver's responsibilities are when transporting regulated materials.</p>

<h3>7. Transporting Cargo Safely</h3>
<p>Weight limits, load securement, preventing cargo shifts, and handling oversized loads are tested in this section.</p>

<h3>8. Driving Safely</h3>
<p>Speed management, managing space around the vehicle, night driving, driving in adverse conditions, and emergency maneuvers.</p>

<h2>Study Strategy</h2>
<ol>
  <li>Read the General Knowledge section of your state's CDL manual at least once</li>
  <li>Take practice tests to identify weak areas</li>
  <li>Focus extra time on stopping distances and pre-trip inspection — these are the most commonly missed topics</li>
  <li>Take the practice test again the day before your appointment</li>
</ol>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>Confusing stopping distance rules — always account for both perception time and braking distance</li>
  <li>Missing questions about cargo securement requirements</li>
  <li>Overlooking the basic HazMat rules included in General Knowledge</li>
</ul>
    `,
  },
  {
    slug: "cdl-air-brakes-test-guide",
    title: "CDL Air Brakes Test: What You Need to Know",
    description: "The Air Brakes knowledge test is required to drive vehicles with air brakes. Learn the key concepts, the L restriction, and how to prepare.",
    date: "2026-04-05",
    readTime: "6 min read",
    category: "Study Guides",
    content: `
<p>The CDL Air Brakes test is one of the most technically challenging CDL knowledge exams — and one of the most important. If you skip it or fail it, your license will include an "L restriction" that prohibits you from driving any vehicle equipped with air brakes.</p>

<h2>What Is the L Restriction?</h2>
<p>The L restriction (also called the Air Brakes restriction) is added to your CDL when:</p>
<ul>
  <li>You fail the Air Brakes knowledge test</li>
  <li>You take your skills test in a vehicle that does NOT have air brakes</li>
</ul>
<p>With an L restriction, you cannot legally drive tractor-trailers, most heavy dump trucks, transit buses, or any other commercial vehicle equipped with air brakes. Since the majority of Class A and heavy Class B vehicles use air brakes, this restriction severely limits your driving options.</p>

<h2>Test Format</h2>
<ul>
  <li><strong>Questions:</strong> 25 multiple-choice questions (varies by state)</li>
  <li><strong>Passing score:</strong> 80% (20 out of 25)</li>
</ul>

<h2>Key Topics on the Air Brakes Test</h2>

<h3>Air Brake System Components</h3>
<p>Know the function of each major component: the air compressor, air tanks (reservoirs), safety valve, drain valves, brake chambers, slack adjusters, brake shoes/pads, S-cam, and wedge brakes.</p>

<h3>Dual Air Brake Systems</h3>
<p>Most modern trucks use a dual air brake system — a primary system for rear axles and a secondary system for the front axle. Understand how each system operates independently for safety.</p>

<h3>Warning Systems</h3>
<p>The low air pressure warning activates at 60 psi. You must know what to do when the warning activates: pull off safely, do not drive until the system is repaired.</p>

<h3>Parking Brakes</h3>
<p>Air-actuated parking brakes (spring brakes) engage automatically when air pressure drops below a certain level. Know the pop-out warning pressure and spring brake engagement pressures.</p>

<h3>Testing Air Brakes</h3>
<p>Know the proper procedures for:</p>
<ul>
  <li>Static pressure test (pressure should not drop more than 3 psi in 1 minute for single vehicles, 4 psi for combination vehicles)</li>
  <li>Low pressure warning test</li>
  <li>Air loss rate test</li>
  <li>Spring brake test</li>
</ul>

<h3>Brake Fade and Overheating</h3>
<p>Understand what brake fade is, why it occurs on long downhill grades, and how to prevent it using proper technique (selecting the right gear, using controlled braking).</p>

<h2>Study Tips for Air Brakes</h2>
<ol>
  <li>Draw a diagram of the air brake system and label each component</li>
  <li>Memorize the key pressure values: 60 psi warning, 20–45 psi spring brake engagement, 125+ psi maximum tank pressure</li>
  <li>Practice identifying what's being described in questions — the test often asks about unusual situations or failure scenarios</li>
  <li>Take several practice tests specifically focused on Air Brakes before your exam</li>
</ol>
    `,
  },
  {
    slug: "hazmat-endorsement-cdl-guide",
    title: "CDL HazMat Endorsement (H): Requirements and Study Tips",
    description: "The HazMat endorsement lets you transport placarded hazardous materials. Learn what the H endorsement requires, including the TSA background check.",
    date: "2026-03-28",
    readTime: "6 min read",
    category: "Endorsements",
    content: `
<p>The CDL HazMat endorsement (H endorsement) allows you to transport hazardous materials that require placarding under federal regulations. It's one of the most valuable CDL endorsements — and one of the most involved to obtain.</p>

<h2>What Is a HazMat Endorsement?</h2>
<p>With an H endorsement, you can legally drive vehicles transporting hazardous materials such as flammable liquids, explosives, corrosives, radioactive materials, and compressed gases. Many trucking jobs require or pay a premium for drivers with HazMat clearance.</p>

<h2>Requirements for the H Endorsement</h2>

<h3>1. Pass the HazMat Knowledge Test</h3>
<p>The HazMat test covers approximately 30 questions on:</p>
<ul>
  <li>Hazardous materials regulations and the HazMat table</li>
  <li>Shipping papers and documentation</li>
  <li>Labeling, marking, and placarding requirements</li>
  <li>Loading, unloading, and storage rules</li>
  <li>Bulk packaging and tank rules</li>
  <li>Emergency response procedures</li>
</ul>

<h3>2. TSA Security Threat Assessment (Background Check)</h3>
<p>This is what makes the HazMat endorsement unique. You must pass a Transportation Security Administration (TSA) background check before the endorsement can be added to your license. The process involves:</p>
<ul>
  <li>Submitting fingerprints at an approved enrollment center</li>
  <li>Providing proof of U.S. citizenship or lawful permanent residence</li>
  <li>Paying a fee (approximately $86–$100 depending on the state)</li>
  <li>Waiting 30–60 days for TSA processing</li>
</ul>

<h3>Disqualifying Offenses</h3>
<p>Certain criminal convictions will disqualify you from obtaining a HazMat endorsement. These include felony convictions related to explosives, firearms offenses, terrorism, and certain other serious crimes. Review the full TSA disqualifier list before applying.</p>

<h2>Key HazMat Test Topics</h2>

<h3>The Hazardous Materials Table</h3>
<p>The HazMat Table (49 CFR 172.101) lists regulated substances and their proper shipping names, hazard classes, identification numbers, and required labels/placards. You need to know how to read and use this table.</p>

<h3>Hazard Classes</h3>
<p>Know all nine hazard classes: explosives, gases, flammable liquids, flammable solids, oxidizers, toxic materials, radioactive materials, corrosives, and miscellaneous hazardous materials.</p>

<h3>Placarding</h3>
<p>Understand when placards are required (generally 1,001 lbs or more of a hazmat material for most classes), which placard to use, and where to display them (four sides of the vehicle).</p>

<h3>Emergency Response</h3>
<p>Know what to do in an accident involving hazardous materials, including using the Emergency Response Guidebook and notifying emergency services.</p>

<h2>Study Strategy</h2>
<ol>
  <li>Study the HazMat section of the CDL manual carefully — it's the most regulation-heavy section</li>
  <li>Pay attention to the "when is a placard required" thresholds</li>
  <li>Practice with HazMat-specific practice tests</li>
  <li>Start the TSA background check process early — it takes several weeks</li>
</ol>
    `,
  },
  {
    slug: "cdl-class-a-vs-class-b",
    title: "CDL Class A vs Class B: Which One Do You Need?",
    description: "Understand the difference between CDL Class A and Class B licenses — what vehicles each covers, what tests are required, and which jobs need them.",
    date: "2026-03-20",
    readTime: "5 min read",
    category: "CDL Basics",
    content: `
<p>When starting your CDL journey, one of the first decisions you'll face is whether to pursue a Class A or Class B CDL. The right choice depends entirely on the vehicles you plan to drive and the jobs you're targeting.</p>

<h2>CDL Class A: Combination Vehicles</h2>
<p>Class A covers any combination of vehicles with a gross combination weight rating (GCWR) of 26,001 pounds or more, <em>when the towed unit exceeds 10,000 pounds</em>.</p>

<h3>Vehicles Requiring Class A</h3>
<ul>
  <li>Tractor-trailers (semis / 18-wheelers)</li>
  <li>Flatbed trucks with trailer</li>
  <li>Tanker trucks with trailer</li>
  <li>Livestock haulers</li>
  <li>Most double and triple trailer combinations</li>
</ul>

<h3>Class A Jobs and Salaries</h3>
<ul>
  <li>Long-haul OTR trucker: $55,000–$90,000+/year</li>
  <li>Flatbed driver: $60,000–$85,000/year</li>
  <li>Tanker driver: $65,000–$95,000/year</li>
  <li>Regional truck driver: $55,000–$75,000/year</li>
</ul>

<h3>Tests Required for Class A</h3>
<ul>
  <li>General Knowledge (required)</li>
  <li>Combination Vehicles (required for Class A)</li>
  <li>Air Brakes (required if vehicle has air brakes — nearly all Class A trucks do)</li>
  <li>Plus any endorsement tests for HazMat, Tanker, Doubles/Triples, etc.</li>
</ul>

<h2>CDL Class B: Straight Trucks</h2>
<p>Class B covers single vehicles with a GVWR of 26,001 pounds or more, or any such vehicle towing a vehicle with a GVWR of 10,000 pounds or less.</p>

<h3>Vehicles Requiring Class B</h3>
<ul>
  <li>City transit buses and coach buses</li>
  <li>School buses (with S endorsement)</li>
  <li>Dump trucks</li>
  <li>Concrete mixer trucks</li>
  <li>Box trucks (straight trucks) over 26,000 lbs</li>
  <li>Delivery vehicles (heavy step vans, sprinter-style trucks)</li>
</ul>

<h3>Class B Jobs and Salaries</h3>
<ul>
  <li>Bus driver (transit/coach): $45,000–$70,000/year</li>
  <li>School bus driver: $35,000–$55,000/year</li>
  <li>Dump truck driver: $45,000–$65,000/year</li>
  <li>Delivery driver (heavy): $45,000–$65,000/year</li>
</ul>

<h3>Tests Required for Class B</h3>
<ul>
  <li>General Knowledge (required)</li>
  <li>Air Brakes (if vehicle has air brakes — buses and most heavy trucks do)</li>
  <li>Plus endorsement tests for Passenger (P), School Bus (S), or HazMat as needed</li>
</ul>

<h2>Class A vs Class B: Key Differences</h2>
<table style="width:100%; border-collapse:collapse; font-size:0.9em;">
  <thead>
    <tr style="background:#f3f4f6;">
      <th style="padding:8px; text-align:left; border:1px solid #e5e7eb;">Feature</th>
      <th style="padding:8px; text-align:left; border:1px solid #e5e7eb;">Class A</th>
      <th style="padding:8px; text-align:left; border:1px solid #e5e7eb;">Class B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:8px; border:1px solid #e5e7eb;">Vehicle type</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Combo (tractor + trailer)</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Single straight truck</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #e5e7eb;">Training time</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">4–8 weeks typical</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">2–4 weeks typical</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #e5e7eb;">Extra tests</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Combination Vehicles required</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Not required</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #e5e7eb;">Can drive Class B?</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Yes</td>
      <td style="padding:8px; border:1px solid #e5e7eb;">Yes</td>
    </tr>
  </tbody>
</table>

<h2>Which Should You Get?</h2>
<p>If you're pursuing trucking or want maximum job flexibility, get a Class A. A Class A CDL also allows you to drive Class B vehicles, giving you the broadest range of opportunities.</p>
<p>If you specifically want to drive buses, dump trucks, or local delivery vehicles — and don't need to pull a trailer — a Class B is sufficient and often faster to obtain.</p>
    `,
  },
  {
    slug: "cdl-tanker-endorsement-guide",
    title: "CDL Tanker Endorsement (N): Requirements and Test Prep",
    description: "Learn what the CDL Tanker (N) endorsement covers, which vehicles require it, and the key topics on the Tank Vehicles knowledge test.",
    date: "2026-03-15",
    readTime: "5 min read",
    category: "Endorsements",
    content: `
<p>The CDL Tank Vehicles endorsement (N endorsement) is required when you drive vehicles with liquid or gaseous cargo tanks of 1,000 gallons or more. Tank driving jobs are in high demand and typically pay well above average CDL rates.</p>

<h2>When Is the N Endorsement Required?</h2>
<p>You need a Tanker endorsement when:</p>
<ul>
  <li>The tank is permanently attached to the vehicle or chassis</li>
  <li>The tank capacity is 1,000 gallons or more</li>
  <li>The tank is designed to transport liquid or gaseous material</li>
</ul>
<p>Examples: fuel tankers, milk tankers, chemical tankers, compressed gas tankers, water tankers.</p>

<h2>The X Endorsement: HazMat + Tanker</h2>
<p>If you transport hazardous liquid or gas in a tank, you need both the H (HazMat) and N (Tanker) endorsements. Many states issue an "X" endorsement as a combined H+N designation for drivers who hold both.</p>

<h2>Test Format</h2>
<ul>
  <li><strong>Questions:</strong> ~20–30 questions (varies by state)</li>
  <li><strong>Passing score:</strong> 80%</li>
</ul>

<h2>Key Test Topics</h2>

<h3>Liquid Surge</h3>
<p>Liquid surge (also called surge or slosh) is one of the biggest hazards when driving a tank. As you brake or turn, liquid in a partially filled tank shifts forward, backward, or sideways — pushing the vehicle in the direction of the surge. Key points:</p>
<ul>
  <li>Liquid surge is worse with partially filled (unbaffled) tanks</li>
  <li>Baffles reduce forward and backward surge but not side-to-side</li>
  <li>Smooth acceleration and braking reduce surge risk</li>
</ul>

<h3>High Center of Gravity</h3>
<p>Tank vehicles have a higher center of gravity than most trucks, making them more prone to rollover. Slow down before curves and on ramps — more than the posted speed limit suggests.</p>

<h3>Outage</h3>
<p>Outage refers to the space left unfilled in a liquid tank to allow for liquid expansion. Some liquids expand significantly when heated. Drivers must understand the outage requirements for the specific cargo they're carrying.</p>

<h3>Cargo Compatibility</h3>
<p>Tankers must be inspected and cleaned between loads to prevent contamination — especially when switching between different types of cargo. Some materials are incompatible and cannot share a tanker without thorough cleaning.</p>

<h3>Leaks and Emergency Procedures</h3>
<p>Know how to check for tank leaks before and during a trip, and what to do if a leak occurs (pull off safely, notify emergency services, do not attempt to plug leaks in pressurized tanks without training).</p>

<h2>Tank Driving Jobs</h2>
<ul>
  <li>Petroleum tanker driver: $65,000–$95,000/year</li>
  <li>Chemical tanker driver: $60,000–$90,000/year</li>
  <li>Milk/food-grade tanker: $55,000–$75,000/year</li>
  <li>Compressed gas tanker: $70,000–$100,000+/year</li>
</ul>

<h2>Study Tips</h2>
<ol>
  <li>Focus heavily on liquid surge — it's the most-tested topic on the Tank Vehicles exam</li>
  <li>Understand the difference between baffled and unbaffled tanks</li>
  <li>Review the outage rules — percentages vary by cargo type</li>
  <li>Practice with Tank Vehicle-specific questions before your exam</li>
</ol>
    `,
  },
  {
    slug: "cdl-passenger-endorsement-guide",
    title: "CDL Passenger Endorsement (P): Bus Driver Requirements",
    description: "The CDL Passenger endorsement is required to drive buses and other vehicles carrying 16+ passengers. Here's what the P endorsement test covers.",
    date: "2026-03-08",
    readTime: "5 min read",
    category: "Endorsements",
    content: `
<p>If you want to drive a bus, shuttle, or any commercial vehicle carrying 16 or more passengers (including the driver), you'll need the CDL Passenger endorsement — the P endorsement.</p>

<h2>Who Needs the P Endorsement?</h2>
<p>You need a Passenger endorsement to drive:</p>
<ul>
  <li>Transit buses (city buses, BRT)</li>
  <li>Coach buses (charter, tour, intercity)</li>
  <li>Shuttle buses (airport, hotel, casino)</li>
  <li>Paratransit vehicles carrying 16+ passengers</li>
</ul>
<p>Note: School buses require a separate <strong>School Bus (S) endorsement</strong> in addition to the P endorsement.</p>

<h2>Test Format</h2>
<ul>
  <li><strong>Questions:</strong> ~20–30 questions (varies by state)</li>
  <li><strong>Passing score:</strong> 80%</li>
  <li>Skills test must be taken in a passenger vehicle (bus)</li>
</ul>

<h2>Key Topics on the Passenger Test</h2>

<h3>Loading and Unloading Passengers</h3>
<p>Safe boarding and alighting procedures, managing standees, wheelchair accessibility, and proper door operation are tested topics. You must know the rules for allowing passengers to board and exit safely at stops.</p>

<h3>Prohibited Passengers and Items</h3>
<p>Some materials and persons are prohibited from buses. Know that:</p>
<ul>
  <li>Firearms (with limited exceptions), flammable or hazardous materials, and certain weapons are not allowed</li>
  <li>Intoxicated passengers create a safety issue that must be handled appropriately</li>
</ul>

<h3>Emergency Exits and Evacuation</h3>
<p>Bus drivers must know the location of all emergency exits (doors, windows, hatches) and how to conduct a safe evacuation. Questions often ask about the distance you should move passengers from a stopped bus.</p>

<h3>Railroad Crossings</h3>
<p>Buses must <em>always</em> stop at railroad crossings — there are no exceptions. You must stop between 15–50 feet from the tracks, open the door (and service window if equipped), look and listen for trains, then proceed if clear. Never shift gears while crossing.</p>

<h3>Brake and Speed Management</h3>
<p>Passenger vehicles require smooth braking and acceleration to avoid injuring standing passengers. Know the rules about speed limits near school zones and residential areas.</p>

<h3>Pre-Trip Inspection for Buses</h3>
<p>Bus-specific inspection items include emergency exits, passenger seating, floor condition, handrails, interior lighting, and communication systems.</p>

<h2>Passenger Vehicle Jobs</h2>
<ul>
  <li>Transit/city bus driver: $45,000–$65,000/year</li>
  <li>Charter bus driver: $40,000–$60,000/year</li>
  <li>Airport shuttle driver: $35,000–$50,000/year</li>
  <li>Intercity bus driver: $45,000–$70,000/year</li>
</ul>

<h2>Study Tips</h2>
<ol>
  <li>Memorize the railroad crossing procedure — it's a high-frequency test topic</li>
  <li>Know the emergency evacuation distance (100 feet upwind minimum)</li>
  <li>Review the prohibited items list carefully</li>
  <li>If you're also pursuing the School Bus endorsement, study both sections together</li>
</ol>
    `,
  },
  {
    slug: "cdl-exam-day-tips",
    title: "CDL Knowledge Test Day: 10 Tips to Pass on Your First Try",
    description: "Practical advice for the day of your CDL written knowledge test — what to bring, what to expect, and how to avoid common mistakes that cost drivers their pass.",
    date: "2026-03-01",
    readTime: "4 min read",
    category: "Test Tips",
    content: `
<p>You've studied the manual, taken practice tests, and know the material. Now it's time to make sure the actual test day goes smoothly. Here are 10 practical tips to help you pass on your first attempt.</p>

<h2>1. Bring the Right Documents</h2>
<p>Most DMVs require:</p>
<ul>
  <li>Your current valid driver's license</li>
  <li>Proof of state residency (utility bill, bank statement, etc.)</li>
  <li>Social Security card or proof of Social Security number</li>
  <li>Payment for application fees (cash, card, or check depending on the state)</li>
  <li>DOT medical certificate (if your state requires it for the CLP)</li>
</ul>
<p>Call your DMV ahead of time or check their website to confirm the exact requirements — states vary.</p>

<h2>2. Arrive Early</h2>
<p>DMV offices can have long wait times. Arriving 30–45 minutes early reduces stress and ensures you have time to complete paperwork before your test window.</p>

<h2>3. Take a Practice Test the Morning Of</h2>
<p>A quick 20–30 question run-through the morning of your test refreshes your memory without causing fatigue. Focus on the topics you're least confident in.</p>

<h2>4. Read Every Question Carefully</h2>
<p>CDL test questions often include qualifiers like "NEVER," "ALWAYS," "EXCEPT," and "MOST LIKELY." These change the correct answer. Read every word before selecting your response.</p>

<h2>5. Eliminate Wrong Answers First</h2>
<p>If you're unsure of an answer, eliminate the obviously wrong choices first. CDL questions usually have one clearly wrong option and one that's close but slightly off — eliminating those narrows your odds significantly.</p>

<h2>6. Trust Your Preparation</h2>
<p>If you've studied the manual and taken multiple practice tests, trust what you've learned. Second-guessing your first instinct often leads to changing a correct answer to an incorrect one.</p>

<h2>7. Don't Rush</h2>
<p>There's no award for finishing first. Most CDL knowledge tests allow 60–90 minutes for 50 questions. Take your time, especially on questions about stopping distances and HazMat procedures where numbers matter.</p>

<h2>8. Know the Key Numbers</h2>
<p>Several numerical values appear frequently on CDL tests. Know these cold:</p>
<ul>
  <li><strong>80%</strong> — passing score for all CDL knowledge tests</li>
  <li><strong>50 questions</strong> — General Knowledge test length</li>
  <li><strong>14 days</strong> — minimum CLP holding period before skills test</li>
  <li><strong>60 psi</strong> — low air pressure warning activation</li>
  <li><strong>15–50 feet</strong> — stop distance from railroad tracks</li>
  <li><strong>1,000 gallons</strong> — threshold requiring Tanker endorsement</li>
</ul>

<h2>9. If You Fail, Don't Panic</h2>
<p>Most states allow retakes after a waiting period (commonly 1–3 days). Review your incorrect answers, focus your studying, and schedule the retake.</p>

<h2>10. Schedule Your Skills Test Promptly After Passing</h2>
<p>Once you pass your knowledge tests and receive your CLP, wait the required 14 days and then schedule your CDL skills test. Momentum matters — the longer you wait, the more you'll need to review.</p>

<h2>Final Checklist</h2>
<ul>
  <li>✅ Documents prepared and ready</li>
  <li>✅ Reviewed key numbers and thresholds</li>
  <li>✅ Took a practice test in the last 24 hours</li>
  <li>✅ Know what tests you'll be taking (General Knowledge + which endorsements)</li>
  <li>✅ Arrived early with a calm mindset</li>
</ul>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
