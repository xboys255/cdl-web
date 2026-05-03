import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

type QuestionSeed = {
  text: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  answers: { text: string; isCorrect: boolean }[];
};

async function seedQuestions(sectionId: string, questions: QuestionSeed[]) {
  for (const q of questions) {
    const existing = await prisma.question.findFirst({ where: { sectionId, text: q.text } });
    if (existing) continue;
    await prisma.question.create({
      data: {
        sectionId,
        text: q.text,
        explanation: q.explanation,
        difficulty: q.difficulty,
        answers: { create: q.answers },
      },
    });
  }
}

async function main() {
  console.log("🌱 Seeding additional CDL questions (batch 4)...");

  const sections = await prisma.section.findMany({ include: { test: true } });
  const sec = Object.fromEntries(sections.map((s) => [s.code, s]));

  // ── GK-VI: Vehicle Inspection (10 questions) ─────────────────────────────
  await seedQuestions(sec["GK-VI"].id, [
    {
      text: "How do you check hydraulic brakes during a pre-trip inspection?",
      explanation: "Pump the brake pedal three times, then hold firm pressure for 5 seconds. If the pedal sinks, there is a leak in the hydraulic system.",
      difficulty: "medium",
      answers: [
        { text: "Pump the pedal 3 times, hold firm — if it sinks there is a leak", isCorrect: true },
        { text: "Press the pedal once and check that the brake light comes on", isCorrect: false },
        { text: "Apply brakes at 5 mph and measure stopping distance", isCorrect: false },
        { text: "Check the brake fluid reservoir for proper level", isCorrect: false },
      ],
    },
    {
      text: "During a pre-trip inspection, what does it mean if you can rock a wheel by pushing and pulling the top and bottom?",
      explanation: "Excessive play when rocking the wheel top-to-bottom indicates worn wheel bearings or loose wheel nuts, both of which are out-of-service conditions.",
      difficulty: "medium",
      answers: [
        { text: "Worn wheel bearings or loose wheel nuts — an out-of-service condition", isCorrect: true },
        { text: "Normal play is expected and the wheel is properly adjusted", isCorrect: false },
        { text: "The brake drum is warped and needs resurfacing", isCorrect: false },
        { text: "The tire pressure is too low causing the wheel to flex", isCorrect: false },
      ],
    },
    {
      text: "What should you check when inspecting brake drums during a pre-trip?",
      explanation: "Look for cracks in the drums. Cracked brake drums are an out-of-service condition. Also check for missing or loose bolts on the drum.",
      difficulty: "medium",
      answers: [
        { text: "Check for cracks — cracked drums are an out-of-service condition", isCorrect: true },
        { text: "Check that the drum is warm from recent brake use", isCorrect: false },
        { text: "Ensure the drum has a shiny polished surface", isCorrect: false },
        { text: "Verify the drum is painted the same color as the vehicle", isCorrect: false },
      ],
    },
    {
      text: "What should you check when inspecting wiper blades during a pre-trip inspection?",
      explanation: "Wiper blades must be in good condition (not torn, streaking, or hardened) and wiper fluid level must be adequate for safe visibility in rain.",
      difficulty: "easy",
      answers: [
        { text: "Condition of blades (not torn or hardened) and adequate washer fluid", isCorrect: true },
        { text: "Only that the wipers turn on when the switch is activated", isCorrect: false },
        { text: "That the wiper motor runs at all three speed settings", isCorrect: false },
        { text: "The wiper blades are the same brand as the manufacturer installed", isCorrect: false },
      ],
    },
    {
      text: "When inspecting mirrors during a pre-trip inspection, what should you look for?",
      explanation: "Mirrors must be properly adjusted to give maximum field of view, and must be clean and free from cracks or damage that would distort the image.",
      difficulty: "easy",
      answers: [
        { text: "Proper adjustment, clean surface, no cracks or distorting damage", isCorrect: true },
        { text: "Only that you can see the rear of the trailer", isCorrect: false },
        { text: "That mirror brackets are painted the vehicle color", isCorrect: false },
        { text: "That mirrors fold inward for narrow lanes", isCorrect: false },
      ],
    },
    {
      text: "What should you look for when inspecting fuel tanks during a pre-trip?",
      explanation: "Check fuel tanks for leaks, ensure the tanks are secure (no loose mounting brackets), caps are tight, and there are no cracks or damage to the tank.",
      difficulty: "medium",
      answers: [
        { text: "Leaks, secure mounting, tight caps, and no tank damage", isCorrect: true },
        { text: "Only the fuel level to ensure enough for the trip", isCorrect: false },
        { text: "That the fuel is the correct grade for the engine", isCorrect: false },
        { text: "Ensure the fuel cap is a matching brand to the tank", isCorrect: false },
      ],
    },
    {
      text: "What must you check when inspecting mudflaps on a CMV?",
      explanation: "Mudflaps (splash guards) must be present, securely attached, and positioned to direct spray down and away from the roadway. Missing or damaged mudflaps are a defect.",
      difficulty: "easy",
      answers: [
        { text: "Present, securely attached, and correctly positioned behind tires", isCorrect: true },
        { text: "Only that they are the correct color for the vehicle type", isCorrect: false },
        { text: "That they extend at least 6 inches below the frame", isCorrect: false },
        { text: "Made of rubber (not plastic) to pass inspection", isCorrect: false },
      ],
    },
    {
      text: "What cargo securement items should you check during a pre-trip inspection?",
      explanation: "Check that all cargo is properly secured and covered if required. Inspect tie-downs for condition (no fraying, cuts, or damage) and proper attachment. Verify cargo hasn't shifted in transit.",
      difficulty: "medium",
      answers: [
        { text: "Tie-down condition and attachment, cargo hasn't shifted, covers in place if required", isCorrect: true },
        { text: "Only that cargo weight is evenly distributed left to right", isCorrect: false },
        { text: "That cargo is wrapped in plastic to prevent weather damage", isCorrect: false },
        { text: "Only inspect cargo securement at the destination, not departure", isCorrect: false },
      ],
    },
    {
      text: "When inspecting the landing gear on a trailer, what should you check?",
      explanation: "Landing gear must be fully raised and secured before driving. Check for missing or damaged parts, and ensure the crank handle is in place and secured.",
      difficulty: "medium",
      answers: [
        { text: "Fully raised, secured, no missing parts, crank handle in place", isCorrect: true },
        { text: "That the landing gear is lowered halfway for emergency stops", isCorrect: false },
        { text: "Only that the landing gear leg is not bent", isCorrect: false },
        { text: "That both landing gear legs are the same height", isCorrect: false },
      ],
    },
    {
      text: "What does it mean if you find oil puddles on the ground under the engine during a pre-trip inspection?",
      explanation: "Oil puddles under the engine indicate a leak. You must identify the source. An active oil leak must be fixed before operating the vehicle as it can lead to engine failure.",
      difficulty: "easy",
      answers: [
        { text: "There is an oil leak that must be identified and repaired before driving", isCorrect: true },
        { text: "Condensation from the air conditioning system — normal", isCorrect: false },
        { text: "The engine has been recently serviced and excess oil was spilled", isCorrect: false },
        { text: "The engine oil is overfilled and needs to be drained slightly", isCorrect: false },
      ],
    },
  ]);

  // ── GK-DS: Driving Safely (12 questions) ─────────────────────────────────
  await seedQuestions(sec["GK-DS"].id, [
    {
      text: "Which of the six sides around a truck is considered the most dangerous blind spot?",
      explanation: "The right side of a truck is the largest and most dangerous blind spot. Vehicles in this zone are completely invisible to the driver. Always signal early when merging right.",
      difficulty: "medium",
      answers: [
        { text: "The right side — largest blind spot where vehicles are completely hidden", isCorrect: true },
        { text: "Directly behind the trailer", isCorrect: false },
        { text: "The left front corner", isCorrect: false },
        { text: "Immediately in front of the cab", isCorrect: false },
      ],
    },
    {
      text: "How much should you reduce your speed when driving on a curve?",
      explanation: "Slow below the posted speed limit for curves. Large trucks have a higher center of gravity and can roll over at speeds that are safe for cars. Reduce speed before entering the curve, not while in it.",
      difficulty: "medium",
      answers: [
        { text: "Slow below the posted curve speed limit before entering the curve", isCorrect: true },
        { text: "Maintain posted speed as long as roads are dry", isCorrect: false },
        { text: "Reduce speed by exactly 10 mph from the posted limit", isCorrect: false },
        { text: "Slow down only if there is oncoming traffic", isCorrect: false },
      ],
    },
    {
      text: "What is the greatest challenge when driving at night?",
      explanation: "Reduced visibility is the main challenge at night. Your stopping distance remains the same but your ability to see hazards ahead is greatly reduced. Always drive within the range of your headlights.",
      difficulty: "easy",
      answers: [
        { text: "Reduced visibility — you must see and stop within your headlight range", isCorrect: true },
        { text: "Less traffic, which encourages speeding", isCorrect: false },
        { text: "Increased fuel consumption due to headlight use", isCorrect: false },
        { text: "Bright lights from oncoming vehicles blinding pedestrians", isCorrect: false },
      ],
    },
    {
      text: "When driving in fog, what is the safe speed rule?",
      explanation: "In fog, you must be able to stop within the distance you can see. If visibility is 100 feet, you must be able to stop in 100 feet. In dense fog, the safest action may be to pull off and wait.",
      difficulty: "medium",
      answers: [
        { text: "Drive only as fast as you can stop within the visible distance ahead", isCorrect: true },
        { text: "Drive at half the posted speed limit", isCorrect: false },
        { text: "Use high beams to maximize visibility in fog", isCorrect: false },
        { text: "Fog has no effect on braking — maintain normal speed", isCorrect: false },
      ],
    },
    {
      text: "What should you do before starting down a long steep downgrade?",
      explanation: "Before descending, check your brakes, shift to a lower gear appropriate for the grade (use the same gear you would use to climb the hill), and don't downshift on the way down after gaining speed.",
      difficulty: "medium",
      answers: [
        { text: "Check brakes and shift to a low gear before the descent, not after gaining speed", isCorrect: true },
        { text: "Increase speed before the descent to build momentum", isCorrect: false },
        { text: "Shift to neutral to save fuel going downhill", isCorrect: false },
        { text: "Apply brakes continuously from the top of the grade", isCorrect: false },
      ],
    },
    {
      text: "If your vehicle goes into a front-wheel skid, what should you do?",
      explanation: "In a front-wheel skid, stop braking (or ease off braking) to allow the front tires to regain traction. Steer in the direction you want to go. Over-braking caused the skid.",
      difficulty: "hard",
      answers: [
        { text: "Stop braking and allow the front wheels to regain traction, then steer", isCorrect: true },
        { text: "Turn the wheel sharply in the direction of the skid", isCorrect: false },
        { text: "Apply more brake pressure to the rear wheels only", isCorrect: false },
        { text: "Downshift immediately to create engine braking", isCorrect: false },
      ],
    },
    {
      text: "Why are bridges and overpasses particularly dangerous in freezing weather?",
      explanation: "Bridges and overpasses freeze before regular road surfaces because cold air flows under them from both sides, cooling the surface faster than roads that retain heat from the ground below.",
      difficulty: "medium",
      answers: [
        { text: "Cold air flows under both sides, making them freeze before road surfaces", isCorrect: true },
        { text: "Bridge surfaces are always painted with slippery paint for drainage", isCorrect: false },
        { text: "Wind speeds are higher on bridges, causing rain to freeze faster", isCorrect: false },
        { text: "Bridge surfaces absorb more water than normal roads", isCorrect: false },
      ],
    },
    {
      text: "What is an engine brake (jake brake) used for?",
      explanation: "An engine brake (compression release brake / jake brake) slows the vehicle using engine compression resistance. It is especially useful on long downgrades to reduce wear on wheel brakes.",
      difficulty: "medium",
      answers: [
        { text: "Slowing the vehicle on downgrades using engine compression to reduce brake wear", isCorrect: true },
        { text: "Starting the engine in cold weather", isCorrect: false },
        { text: "Preventing the engine from over-revving when accelerating", isCorrect: false },
        { text: "Providing emergency stopping power when air pressure is lost", isCorrect: false },
      ],
    },
    {
      text: "Why should you be extra careful when driving in construction (work) zones?",
      explanation: "Work zones have narrowed lanes, workers on or near the road, sudden stops, changing traffic patterns, and uneven surfaces. Fines for violations in work zones are typically doubled.",
      difficulty: "easy",
      answers: [
        { text: "Narrowed lanes, workers near traffic, sudden stops, and increased fines", isCorrect: true },
        { text: "Construction vehicles have the right-of-way over commercial trucks", isCorrect: false },
        { text: "CDL drivers are held to a lower standard than regular drivers in work zones", isCorrect: false },
        { text: "Concrete barriers make skids worse only in work zones", isCorrect: false },
      ],
    },
    {
      text: "What does 'covering the brake' mean and when should you do it?",
      explanation: "Covering the brake means removing your foot from the accelerator and holding it over the brake pedal without pressing it. Do this when approaching potential hazards — it reduces reaction time if you need to brake suddenly.",
      difficulty: "medium",
      answers: [
        { text: "Holding your foot over the brake without pressing — done near potential hazards to reduce reaction time", isCorrect: true },
        { text: "Pressing the brake halfway to activate brake lights without slowing", isCorrect: false },
        { text: "Covering the brake pedal with a floor mat to protect it from wear", isCorrect: false },
        { text: "Using the parking brake while moving to slow gradually", isCorrect: false },
      ],
    },
    {
      text: "What should you do if an oncoming driver fails to dim their high beams?",
      explanation: "Don't look directly into the oncoming headlights. Shift your gaze to the right edge of the road. Slowing down also helps because lower speed gives you more time to react to hazards.",
      difficulty: "easy",
      answers: [
        { text: "Look to the right edge of the road and slow down", isCorrect: true },
        { text: "Flash your high beams repeatedly to signal the other driver", isCorrect: false },
        { text: "Turn your own high beams on to compensate for the glare", isCorrect: false },
        { text: "Steer toward the center line so the lights shine past you", isCorrect: false },
      ],
    },
    {
      text: "What is the proper speed to drive through a ramp posted at 35 mph when you are driving a truck?",
      explanation: "Ramp speed limits are set for passenger cars. Trucks, with their higher center of gravity, should enter at speeds well below the posted ramp limit — often 5–10 mph slower than posted.",
      difficulty: "medium",
      answers: [
        { text: "Below the posted 35 mph — ramp limits are set for cars, not trucks", isCorrect: true },
        { text: "Exactly 35 mph — posted limits must be followed precisely", isCorrect: false },
        { text: "Up to 50 mph since trucks have better tires than passenger cars", isCorrect: false },
        { text: "At least 25 mph to maintain momentum through the curve", isCorrect: false },
      ],
    },
  ]);

  // ── GK-TC: Transporting Cargo (10 questions) ─────────────────────────────
  await seedQuestions(sec["GK-TC"].id, [
    {
      text: "What does 'blocking' mean in terms of cargo securement?",
      explanation: "Blocking refers to wood or other material placed against cargo to prevent it from sliding forward, backward, or sideways. It is used in addition to tie-downs to stabilize cargo.",
      difficulty: "medium",
      answers: [
        { text: "Material placed against cargo to prevent it from sliding in any direction", isCorrect: true },
        { text: "A covering placed over cargo to protect it from weather", isCorrect: false },
        { text: "The process of sealing the trailer doors before departure", isCorrect: false },
        { text: "A safety device that prevents the trailer doors from opening while moving", isCorrect: false },
      ],
    },
    {
      text: "If you are carrying a sealed load, what are your responsibilities regarding the cargo?",
      explanation: "If a shipper has sealed the load, you cannot inspect the cargo inside. However, you are still responsible for knowing the weight and ensuring it doesn't exceed legal limits.",
      difficulty: "hard",
      answers: [
        { text: "You cannot inspect inside, but are still responsible for knowing the weight and legal limits", isCorrect: true },
        { text: "You have no responsibility for sealed loads — the shipper is fully liable", isCorrect: false },
        { text: "You must break the seal and inspect the cargo before accepting the load", isCorrect: false },
        { text: "Sealed loads require no securement since they are already contained", isCorrect: false },
      ],
    },
    {
      text: "Why does a dry bulk tanker (carrying grain, sand, etc.) have a high center of gravity?",
      explanation: "Dry bulk cargo settles and distributes weight unevenly. The container itself is tall and tapered toward the bottom, raising the center of gravity. This makes the vehicle prone to rollover.",
      difficulty: "medium",
      answers: [
        { text: "The tall container and uneven cargo settling raises the center of gravity and rollover risk", isCorrect: true },
        { text: "Dry bulk cargo expands as it dries, pushing upward against the container top", isCorrect: false },
        { text: "Dry bulk tanks are always heavier than liquid tankers at the same volume", isCorrect: false },
        { text: "The fan-shaped discharge at the bottom concentrates weight near the axles", isCorrect: false },
      ],
    },
    {
      text: "What can cause a cargo fire in a trailer?",
      explanation: "Cargo fires can be caused by improper storage of flammable materials, spontaneous combustion of certain goods (like damp hay), or overheating of electrical equipment. Always know what you're hauling.",
      difficulty: "hard",
      answers: [
        { text: "Improper storage of flammables, spontaneous combustion, or overheating equipment", isCorrect: true },
        { text: "Cargo fires only occur in HazMat vehicles", isCorrect: false },
        { text: "Trailer fires are always caused by electrical short circuits in the lights", isCorrect: false },
        { text: "Cargo fires cannot occur if the trailer doors are sealed", isCorrect: false },
      ],
    },
    {
      text: "When is a permit required for an oversized load?",
      explanation: "A permit is required whenever cargo exceeds legal size or weight limits: typically width over 8.5 feet, height over 13.5–14 feet, or weight over 80,000 lbs on the interstate. Permit requirements vary by state.",
      difficulty: "medium",
      answers: [
        { text: "When cargo exceeds legal width (8.5 ft), height (13.5–14 ft), or weight (80,000 lbs) limits", isCorrect: true },
        { text: "Only when carrying construction equipment longer than the trailer", isCorrect: false },
        { text: "Only when traveling through a state different from where you loaded", isCorrect: false },
        { text: "Permits are never required — oversized loads just need escort vehicles", isCorrect: false },
      ],
    },
    {
      text: "How should you distribute weight on a trailer to prevent the steer axle from being overloaded?",
      explanation: "Load heavier cargo toward the center and rear of the trailer to keep the steer axle weight within legal limits (typically 12,000–13,000 lbs max). Too much forward weight overloads the steer axle and reduces steering control.",
      difficulty: "hard",
      answers: [
        { text: "Load heavier cargo toward the center or rear to keep steer axle weight within limits", isCorrect: true },
        { text: "Always load the heaviest cargo at the very front for best stability", isCorrect: false },
        { text: "Distribute all weight equally from front to back without exception", isCorrect: false },
        { text: "Steer axle weight is never affected by cargo placement in the trailer", isCorrect: false },
      ],
    },
    {
      text: "When are tarps required on a flatbed load?",
      explanation: "Tarps are required when cargo can blow off or when the load contains material that must be protected from rain or when state law requires it. Gravel, sand, and loose materials typically require tarping.",
      difficulty: "medium",
      answers: [
        { text: "When cargo can blow off, spill, or when required by law (e.g., gravel, sand)", isCorrect: true },
        { text: "Only when driving over 65 mph on the highway", isCorrect: false },
        { text: "Tarps are only required for HazMat loads on flatbeds", isCorrect: false },
        { text: "Tarps are optional — they are only a best practice, not a legal requirement", isCorrect: false },
      ],
    },
    {
      text: "When carrying refrigerated cargo, what is the driver's responsibility regarding temperature?",
      explanation: "The driver is responsible for ensuring the refrigeration unit is working and set to the correct temperature. Check the unit before loading and monitor temperature during the trip as required.",
      difficulty: "medium",
      answers: [
        { text: "Ensure the reefer unit works and is set correctly; monitor temperature during the trip", isCorrect: true },
        { text: "Temperature is entirely the shipper's responsibility, not the driver's", isCorrect: false },
        { text: "Drivers only need to record temperature at pickup and delivery", isCorrect: false },
        { text: "CDL regulations do not cover refrigerated cargo requirements", isCorrect: false },
      ],
    },
    {
      text: "What is the minimum working load limit (WLL) for tie-downs used to secure cargo?",
      explanation: "The combined WLL of all tie-downs must equal at least half the weight of the cargo being secured. Individual tie-down capacity is found on the manufacturer's label.",
      difficulty: "hard",
      answers: [
        { text: "Combined WLL must equal at least half the weight of the cargo being secured", isCorrect: true },
        { text: "Each individual tie-down must be rated for the full weight of the entire load", isCorrect: false },
        { text: "WLL requirements only apply to loads over 10,000 lbs", isCorrect: false },
        { text: "Any tie-down is acceptable regardless of rating for loads under 5,000 lbs", isCorrect: false },
      ],
    },
    {
      text: "What is the danger of a load that shifts in transit?",
      explanation: "A shifted load changes the vehicle's center of gravity and weight distribution, which can cause handling problems, axle overloading, or even rollover. It can also fall off the vehicle, creating hazards for other road users.",
      difficulty: "medium",
      answers: [
        { text: "Changes center of gravity and weight distribution, increasing rollover risk and potential cargo spill", isCorrect: true },
        { text: "Only a legal issue — shifting cargo doesn't affect vehicle handling", isCorrect: false },
        { text: "Cargo shift only causes air suspension problems", isCorrect: false },
        { text: "Shifting cargo always sets off a weight sensor alarm in the cab", isCorrect: false },
      ],
    },
  ]);

  // ── GK-HM: Hazardous Materials (10 questions) ─────────────────────────────
  await seedQuestions(sec["GK-HM"].id, [
    {
      text: "When are hazmat placards required for most hazard classes?",
      explanation: "Placards are required when you carry 1,001 lbs or more (gross weight) of a hazmat material in most classes. Some materials (like Class 7 radioactive, poison gas, or explosives) require placards in any quantity.",
      difficulty: "medium",
      answers: [
        { text: "When carrying 1,001 lbs or more of most hazmat classes (any amount for some classes)", isCorrect: true },
        { text: "Only when carrying more than one type of hazardous material", isCorrect: false },
        { text: "Placards are always required for any HazMat shipment", isCorrect: false },
        { text: "Only when the load exceeds the vehicle's rated capacity", isCorrect: false },
      ],
    },
    {
      text: "What is a UN identification number on hazardous materials?",
      explanation: "UN (United Nations) ID numbers are 4-digit codes that identify specific hazardous substances. They appear on placards, labels, and shipping papers and help emergency responders identify the material quickly.",
      difficulty: "medium",
      answers: [
        { text: "A 4-digit code identifying specific hazardous substances, used by emergency responders", isCorrect: true },
        { text: "The driver's license number required for HazMat transport", isCorrect: false },
        { text: "The total weight of the hazardous material in kilograms", isCorrect: false },
        { text: "The customs clearance number for international HazMat shipments", isCorrect: false },
      ],
    },
    {
      text: "What is a non-bulk package in HazMat regulations?",
      explanation: "A non-bulk package has a maximum capacity of 119 gallons for liquids, 882 pounds for solids, or 1,001 pounds for gases. Packages that exceed these thresholds are considered bulk.",
      difficulty: "hard",
      answers: [
        { text: "A package with max capacity of 119 gallons liquid, 882 lbs solid, or 1,001 lbs gas", isCorrect: true },
        { text: "Any package that can be carried by one person without mechanical assistance", isCorrect: false },
        { text: "Any HazMat package not manufactured by a certified container maker", isCorrect: false },
        { text: "A package containing mixed hazard classes in quantities under 500 lbs each", isCorrect: false },
      ],
    },
    {
      text: "What routes must HazMat vehicles avoid if possible?",
      explanation: "HazMat vehicles should avoid heavily populated areas, tunnels that restrict hazmat, and some bridge crossings. Many jurisdictions have designated HazMat routes. Always check local restrictions.",
      difficulty: "medium",
      answers: [
        { text: "Heavily populated areas, restricted tunnels, and certain bridges depending on the material", isCorrect: true },
        { text: "Only toll roads and private highways", isCorrect: false },
        { text: "HazMat vehicles have no special route restrictions", isCorrect: false },
        { text: "All interstate highways — HazMat must use state highways only", isCorrect: false },
      ],
    },
    {
      text: "When may a HazMat vehicle driver pass through a tunnel?",
      explanation: "Some tunnels prohibit or restrict HazMat vehicles. Always check tunnel restrictions in advance. If a tunnel is open to your cargo class, you may use it unless local regulations specifically prohibit it.",
      difficulty: "hard",
      answers: [
        { text: "Only when the tunnel does not restrict your specific hazmat class and local rules allow it", isCorrect: true },
        { text: "Never — HazMat vehicles must always find an alternate route around tunnels", isCorrect: false },
        { text: "Any time, since tunnels are built to HazMat specifications", isCorrect: false },
        { text: "Only between midnight and 5 AM when traffic is lightest", isCorrect: false },
      ],
    },
    {
      text: "What is the rule for loading Class 1 (Explosives) with other HazMat?",
      explanation: "Explosives cannot be loaded with other explosives of a different class unless specifically permitted by compatibility tables. They also cannot be loaded with flammable liquids, corrosives, or oxidizers.",
      difficulty: "hard",
      answers: [
        { text: "Explosives cannot be loaded with incompatible classes — must follow compatibility tables", isCorrect: true },
        { text: "Explosives can be loaded with any other HazMat as long as they are separated by 10 feet", isCorrect: false },
        { text: "Class 1 materials can be mixed freely with any non-toxic HazMat", isCorrect: false },
        { text: "No explosives may ever be in the same trailer as any other freight", isCorrect: false },
      ],
    },
    {
      text: "What is 'poison inhalation hazard' (PIH) material?",
      explanation: "PIH (also called TIH — toxic inhalation hazard) materials are gases or liquids that are extremely toxic when inhaled. They require special handling, routing, and emergency procedures. Examples include chlorine and ammonia.",
      difficulty: "hard",
      answers: [
        { text: "Extremely toxic gases or liquids that require special handling — examples include chlorine", isCorrect: true },
        { text: "Any material that smells bad but is not chemically toxic", isCorrect: false },
        { text: "Pesticides that are toxic if swallowed or absorbed through skin", isCorrect: false },
        { text: "Radioactive materials that emit alpha particles when inhaled", isCorrect: false },
      ],
    },
    {
      text: "What is a 'marine pollutant' in HazMat?",
      explanation: "Marine pollutants are materials that are severely harmful to the aquatic environment. They must be marked with a marine pollutant mark (a fish with an X) and must not be shipped in bulk without specific packaging.",
      difficulty: "hard",
      answers: [
        { text: "Materials severely harmful to the aquatic environment — must be marked with a marine pollutant mark", isCorrect: true },
        { text: "Materials found only in ocean shipping containers", isCorrect: false },
        { text: "Any liquid cargo transported on barges or ferries", isCorrect: false },
        { text: "Saltwater that contaminates fresh water when transported inland", isCorrect: false },
      ],
    },
    {
      text: "What is an 'overpack' in HazMat transportation?",
      explanation: "An overpack is an enclosure used to consolidate two or more packages of hazardous materials. It must be marked and labeled appropriately showing the HazMat inside. An example is a shrink-wrapped pallet of HazMat boxes.",
      difficulty: "hard",
      answers: [
        { text: "An outer enclosure consolidating multiple HazMat packages — must be marked/labeled appropriately", isCorrect: true },
        { text: "A trailer loaded beyond its rated capacity with HazMat", isCorrect: false },
        { text: "Extra protective packaging required for Class 7 radioactive materials only", isCorrect: false },
        { text: "A shipment that has exceeded the permitted quantity for the endorsement class", isCorrect: false },
      ],
    },
    {
      text: "When must a HazMat incident be reported to the National Response Center?",
      explanation: "You must report to the NRC (800-424-8802) when a HazMat incident causes death, injury, evacuation, road closure, fire, or significant property damage. Report immediately from the scene.",
      difficulty: "medium",
      answers: [
        { text: "When the incident causes death, injury, evacuation, road closure, fire, or significant property damage", isCorrect: true },
        { text: "Only when the spilled material is a Class 1 explosive", isCorrect: false },
        { text: "Only when the incident occurs in a school zone or residential area", isCorrect: false },
        { text: "Only when a state police officer orders you to make the report", isCorrect: false },
      ],
    },
  ]);

  // ── AB-SYS: Air Brakes System (10 questions) ──────────────────────────────
  await seedQuestions(sec["AB-SYS"].id, [
    {
      text: "At what air pressure does the governor cut in (start the compressor)?",
      explanation: "The governor cuts in at about 100 psi to start the air compressor and rebuild system pressure. It cuts out at about 125 psi when the tanks are full.",
      difficulty: "medium",
      answers: [
        { text: "About 100 psi — the compressor starts building pressure back up", isCorrect: true },
        { text: "60 psi — when the low-pressure warning activates", isCorrect: false },
        { text: "20 psi — when spring brakes engage", isCorrect: false },
        { text: "150 psi — when the safety relief valve opens", isCorrect: false },
      ],
    },
    {
      text: "At what air pressure does the governor cut out (stop the compressor)?",
      explanation: "The governor cuts out at about 125 psi (some systems up to 135 psi), stopping the compressor from adding more air to the system to prevent overpressure.",
      difficulty: "medium",
      answers: [
        { text: "About 125 psi — the compressor stops when tanks are full", isCorrect: true },
        { text: "100 psi — the same pressure it cuts in at", isCorrect: false },
        { text: "150 psi — just below the safety valve opening pressure", isCorrect: false },
        { text: "80 psi — the minimum operating pressure", isCorrect: false },
      ],
    },
    {
      text: "What is the normal operating pressure range for an air brake system?",
      explanation: "Normal operating pressure is between 100 and 125 psi. The governor maintains pressure within this range by cycling the compressor on and off.",
      difficulty: "easy",
      answers: [
        { text: "Between 100 and 125 psi", isCorrect: true },
        { text: "Between 60 and 80 psi", isCorrect: false },
        { text: "Between 150 and 175 psi", isCorrect: false },
        { text: "Between 40 and 60 psi", isCorrect: false },
      ],
    },
    {
      text: "What does the air compressor unloader valve do?",
      explanation: "Unloader valves allow the compressor to run unloaded (pumping air back into the intake) when system pressure is at the cut-out level. This reduces wear on the compressor when it doesn't need to build pressure.",
      difficulty: "hard",
      answers: [
        { text: "Allows the compressor to run unloaded when tanks are full, reducing wear", isCorrect: true },
        { text: "Releases all system pressure in an emergency", isCorrect: false },
        { text: "Controls the flow of air to the front and rear brake circuits", isCorrect: false },
        { text: "Prevents the compressor from starting until pressure drops below 60 psi", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the wet tank (supply reservoir) in an air brake system?",
      explanation: "The wet tank is the first tank air enters after leaving the compressor. It collects moisture and oil from the compressed air before it reaches the rest of the system. It should be drained daily.",
      difficulty: "medium",
      answers: [
        { text: "Collects moisture and oil from compressed air — should be drained daily", isCorrect: true },
        { text: "Stores extra air for emergency braking only", isCorrect: false },
        { text: "Provides a backup supply of air if the compressor fails", isCorrect: false },
        { text: "Contains glycol to prevent freezing in cold weather", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of an air dryer in an air brake system?",
      explanation: "An air dryer removes moisture from the compressed air before it reaches the tanks. Less moisture means less corrosion and less risk of freezing in cold weather.",
      difficulty: "easy",
      answers: [
        { text: "Removes moisture from compressed air to prevent corrosion and freezing", isCorrect: true },
        { text: "Dries brake pads to improve braking performance in wet weather", isCorrect: false },
        { text: "Regulates air temperature to prevent overheating of the compressor", isCorrect: false },
        { text: "Filters engine oil out of the air before it reaches the brake chambers", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of a one-way check valve in an air brake system?",
      explanation: "One-way check valves allow air to flow in only one direction. They prevent air from flowing backward from the brake tanks to other parts of the system if a line breaks or a tank loses pressure.",
      difficulty: "hard",
      answers: [
        { text: "Allows air to flow one direction only — prevents backflow if a line breaks", isCorrect: true },
        { text: "Opens and closes the air supply to the brake pedal based on foot pressure", isCorrect: false },
        { text: "Prevents moisture from flowing from wet tank to dry tanks", isCorrect: false },
        { text: "Controls the ratio of pressure between front and rear brake circuits", isCorrect: false },
      ],
    },
    {
      text: "What does an automatic slack adjuster do?",
      explanation: "Automatic slack adjusters maintain the correct distance (clearance) between the brake shoe and drum automatically as the brake linings wear. They replace manual adjustment, but still need periodic inspection.",
      difficulty: "medium",
      answers: [
        { text: "Maintains correct brake shoe-to-drum clearance automatically as linings wear", isCorrect: true },
        { text: "Adjusts brake force based on vehicle weight automatically", isCorrect: false },
        { text: "Stops the brake from applying if wheel locks up during hard braking", isCorrect: false },
        { text: "Balances brake pressure equally between all axles", isCorrect: false },
      ],
    },
    {
      text: "How do wedge brakes differ from S-cam brakes?",
      explanation: "Wedge brakes use a wedge pushed between the brake shoes by air pressure to force them apart against the drum. S-cam brakes use a rotating S-shaped cam. Wedge brakes may be self-adjusting.",
      difficulty: "hard",
      answers: [
        { text: "Wedge brakes use a wedge to push shoes apart; S-cam uses a rotating S-shaped cam", isCorrect: true },
        { text: "Wedge brakes are hydraulic; S-cam brakes are air operated", isCorrect: false },
        { text: "Wedge brakes are only used on steering axles; S-cam on drive axles", isCorrect: false },
        { text: "S-cam brakes are self-adjusting; wedge brakes always need manual adjustment", isCorrect: false },
      ],
    },
    {
      text: "What causes brake fade on a long downhill grade?",
      explanation: "Brake fade occurs when brakes overheat from continuous application. The heat reduces friction and braking effectiveness. This is why you should use a low gear and apply brakes intermittently rather than continuously.",
      difficulty: "medium",
      answers: [
        { text: "Overheating from continuous application reduces friction and braking effectiveness", isCorrect: true },
        { text: "Air pressure builds up behind the brake pads causing them to push back", isCorrect: false },
        { text: "Brake fluid vaporizes and creates air pockets in the lines", isCorrect: false },
        { text: "The governor cuts out at high temperatures reducing available air pressure", isCorrect: false },
      ],
    },
  ]);

  // ── AB-USE: Air Brakes Usage (10 questions) ───────────────────────────────
  await seedQuestions(sec["AB-USE"].id, [
    {
      text: "What is 'snub braking' and when is it used on a downgrade?",
      explanation: "Snub braking means applying brakes hard enough to slow the vehicle to about 5 mph below the target speed, then releasing and allowing it to speed up again to that speed. This technique prevents brake fade by allowing brakes to cool between applications.",
      difficulty: "hard",
      answers: [
        { text: "Applying brakes to slow 5 mph below target speed, releasing, repeating — prevents brake fade", isCorrect: true },
        { text: "Applying only the trailer brakes to test effectiveness before a descent", isCorrect: false },
        { text: "Using the parking brake briefly to help slow the vehicle", isCorrect: false },
        { text: "Using the engine brake only without applying the foot brake", isCorrect: false },
      ],
    },
    {
      text: "How do you select the right gear before descending a long steep grade?",
      explanation: "Select the same gear you would use to climb the hill. This provides enough engine braking to maintain a safe speed without relying entirely on the wheel brakes, which can overheat.",
      difficulty: "medium",
      answers: [
        { text: "Select the same gear used to climb the grade — provides engine braking on descent", isCorrect: true },
        { text: "Select the highest gear possible to maintain speed", isCorrect: false },
        { text: "Shift to neutral to allow gravity to determine your speed", isCorrect: false },
        { text: "Always use 5th gear regardless of grade severity", isCorrect: false },
      ],
    },
    {
      text: "Before starting a downgrade, what brake check should you perform?",
      explanation: "Before descending, test your brakes at low speed. If brakes don't hold properly or there is any pulling or other problem, don't continue until the issue is fixed.",
      difficulty: "medium",
      answers: [
        { text: "Test brakes at low speed before beginning the descent to verify proper operation", isCorrect: true },
        { text: "Apply maximum braking force for 3 seconds to check brake temperature", isCorrect: false },
        { text: "Drain the air tanks and refill from maximum pressure before descending", isCorrect: false },
        { text: "No special check is needed — brakes are tested during pre-trip inspection", isCorrect: false },
      ],
    },
    {
      text: "What happens to a vehicle with brakes that are out of adjustment?",
      explanation: "Out-of-adjustment brakes don't apply with full force when you press the pedal. This means longer stopping distances. Brake adjustment that's too far out is an out-of-service condition.",
      difficulty: "medium",
      answers: [
        { text: "Longer stopping distances — severely out-of-adjustment brakes are an out-of-service condition", isCorrect: true },
        { text: "Brakes lock up more easily during hard stops", isCorrect: false },
        { text: "Air pressure drops faster than normal when brakes are applied", isCorrect: false },
        { text: "The brake warning light activates in the cab", isCorrect: false },
      ],
    },
    {
      text: "How do you test spring brakes using the parking brake method?",
      explanation: "Chock the wheels, release the parking brake, move the vehicle slowly, and apply the spring brakes. The vehicle should stop within a safe distance. This confirms the spring brakes are functional.",
      difficulty: "hard",
      answers: [
        { text: "Chock wheels, release parking brake, drive slowly, apply spring brakes — should stop quickly", isCorrect: true },
        { text: "Charge air to maximum pressure and observe if brakes release automatically", isCorrect: false },
        { text: "Press the service brake and the parking brake at the same time and measure stopping distance", isCorrect: false },
        { text: "Spring brakes cannot be tested — they are checked during annual inspection only", isCorrect: false },
      ],
    },
    {
      text: "What is the correct brake application pressure when making a normal stop?",
      explanation: "Apply brakes firmly enough to slow safely, but avoid locking the wheels. Modulate brake pressure — enough to slow the vehicle without skidding. Light application is rarely enough; too much causes lockup.",
      difficulty: "medium",
      answers: [
        { text: "Firm enough to slow safely without locking wheels — modulate as needed", isCorrect: true },
        { text: "Always use maximum brake pressure for fastest stopping", isCorrect: false },
        { text: "Very light pressure to preserve brake lining life on every stop", isCorrect: false },
        { text: "Exactly 50 psi air pressure delivered to brake chambers", isCorrect: false },
      ],
    },
    {
      text: "How does an Anti-Lock Braking System (ABS) affect braking technique for trucks?",
      explanation: "With ABS, you should apply firm steady brake pressure and steer normally. ABS prevents wheel lockup automatically, but you still need to apply sufficient brake force. ABS doesn't reduce stopping distance — it maintains steering control during hard braking.",
      difficulty: "medium",
      answers: [
        { text: "Apply firm steady pressure and steer — ABS maintains control but doesn't reduce stopping distance", isCorrect: true },
        { text: "Pump the brakes rapidly to activate ABS for shorter stopping distance", isCorrect: false },
        { text: "ABS eliminates all need for braking technique — apply brakes any way you like", isCorrect: false },
        { text: "Never apply full brake force with ABS — it will damage the system", isCorrect: false },
      ],
    },
    {
      text: "What happens to a trailer if its air supply line breaks away from the tractor while moving?",
      explanation: "If the emergency (supply) air line breaks away, air pressure in the trailer drops, causing the spring brakes to apply automatically. This is a safety feature — the trailer will stop by itself.",
      difficulty: "hard",
      answers: [
        { text: "The spring brakes apply automatically — the trailer stops by itself", isCorrect: true },
        { text: "The trailer accelerates because brakes release when pressure drops", isCorrect: false },
        { text: "Only the trailer's service brakes release — spring brakes remain off", isCorrect: false },
        { text: "Nothing changes until the driver manually applies the trailer brake", isCorrect: false },
      ],
    },
    {
      text: "How do you check manual slack adjusters for proper adjustment?",
      explanation: "Park on level ground, chock wheels, release all brakes, and push the slack adjuster by hand. If it moves more than about 1 inch at the clevis pin hole, the brakes need adjustment.",
      difficulty: "hard",
      answers: [
        { text: "With brakes released, push the adjuster — more than ~1 inch of movement means adjustment needed", isCorrect: true },
        { text: "Apply full brake pressure and see if the adjuster arm is at exactly 90 degrees", isCorrect: false },
        { text: "Spin the wheel and listen for drag — if there is any, brakes are adjusted correctly", isCorrect: false },
        { text: "Check the wear indicator stripe on the brake shoe for alignment", isCorrect: false },
      ],
    },
    {
      text: "What is the difference in braking distance between wet and dry pavement?",
      explanation: "Wet pavement significantly increases stopping distance. The actual increase depends on vehicle speed and tire condition, but wet roads can require twice the normal stopping distance. Reduce speed accordingly in rain.",
      difficulty: "medium",
      answers: [
        { text: "Wet pavement can require twice the stopping distance — reduce speed in rain", isCorrect: true },
        { text: "Wet pavement improves braking by cooling the drums", isCorrect: false },
        { text: "Modern air brakes perform identically on wet and dry surfaces", isCorrect: false },
        { text: "Wet conditions only affect braking on vehicles without ABS", isCorrect: false },
      ],
    },
  ]);

  // ── COMB: Combination Vehicles (12 questions) ─────────────────────────────
  await seedQuestions(sec["COMB"].id, [
    {
      text: "What is a pintle hook and where is it used?",
      explanation: "A pintle hook is a coupling device used to tow a full trailer or a trailer with a drawbar. It is different from a fifth wheel, which couples to a semi-trailer's kingpin.",
      difficulty: "hard",
      answers: [
        { text: "A coupling device used to connect full trailers or drawbar trailers (not semi-trailers)", isCorrect: true },
        { text: "A safety latch on the fifth wheel that prevents the kingpin from releasing", isCorrect: false },
        { text: "A hook used to secure the landing gear during transport", isCorrect: false },
        { text: "A trailer tie-down point on the front frame rail", isCorrect: false },
      ],
    },
    {
      text: "What should you inspect on a converter dolly before moving?",
      explanation: "Inspect the converter dolly's tires, lights, kingpin (on the dolly's fifth wheel), safety chains, and the connection to the trailer ahead and behind it.",
      difficulty: "hard",
      answers: [
        { text: "Tires, lights, kingpin, safety chains, and connections front and rear", isCorrect: true },
        { text: "Only the glad hand connections — no other inspection needed for dollies", isCorrect: false },
        { text: "The dolly's engine oil level and fuel supply", isCorrect: false },
        { text: "Only verify the dolly is the same brand as the trailers being pulled", isCorrect: false },
      ],
    },
    {
      text: "What is 'off-tracking' and how does it affect turns in a combination vehicle?",
      explanation: "Off-tracking is when the rear wheels of a trailer follow a tighter (shorter) path than the front wheels in a turn. The longer the combination, the greater the off-tracking. Drivers must turn wider to keep the rear wheels from hitting the curb.",
      difficulty: "medium",
      answers: [
        { text: "Rear wheels cut inside the front wheel path — turn wider to avoid hitting curbs", isCorrect: true },
        { text: "The trailer swings outside the cab's path during high-speed lane changes", isCorrect: false },
        { text: "When the trailer's brakes apply before the tractor's during hard stops", isCorrect: false },
        { text: "The phenomenon where the trailer pushes the tractor sideways during braking", isCorrect: false },
      ],
    },
    {
      text: "What is rearward amplification in a double or triple trailer combination?",
      explanation: "Rearward amplification is the tendency for the rear trailer to swing more than the front during a swerve or lane change. The crack-the-whip effect can cause the rear trailer to roll over at speeds that seem safe for the tractor.",
      difficulty: "hard",
      answers: [
        { text: "The rear trailer swings farther than the tractor during swerves — can cause rollover", isCorrect: true },
        { text: "Sound from the engine becomes louder as it travels toward the rear trailer", isCorrect: false },
        { text: "Braking force becomes stronger the farther back you go in a combination", isCorrect: false },
        { text: "The rear trailer's air pressure is amplified compared to the tractor", isCorrect: false },
      ],
    },
    {
      text: "Before coupling, how do you verify trailer height is correct for coupling?",
      explanation: "The trailer should be slightly lower than the fifth wheel. When you back under it, the fifth wheel should just contact the trailer. If the trailer is too high, the tractor cannot back under it. If too low, you might damage the trailer nose.",
      difficulty: "medium",
      answers: [
        { text: "Trailer should be slightly lower than the fifth wheel so the tractor can slide under it", isCorrect: true },
        { text: "Trailer must be exactly level — use a level to confirm before backing", isCorrect: false },
        { text: "Trailer height doesn't matter — the fifth wheel adjusts automatically", isCorrect: false },
        { text: "Trailer must be higher than the fifth wheel so the weight settles during coupling", isCorrect: false },
      ],
    },
    {
      text: "What happens to the tractor's low-air warning when both tractor and trailer air systems are connected?",
      explanation: "When the trailer is connected, the tractor's air system also supplies the trailer. A serious air leak in the trailer can drain both systems quickly. The low-air warning may activate faster than expected due to the combined air demand.",
      difficulty: "hard",
      answers: [
        { text: "A trailer air leak drains both systems — warning may come sooner than expected", isCorrect: true },
        { text: "The trailer's air tanks protect the tractor from low pressure — warning will not activate", isCorrect: false },
        { text: "The trailer's check valve automatically prevents low pressure from reaching the tractor", isCorrect: false },
        { text: "Low-air warnings are disabled when a trailer is connected", isCorrect: false },
      ],
    },
    {
      text: "What colors are the glad hand couplers for emergency and service air lines?",
      explanation: "The emergency (supply) line glad hand is red. The service (control) line glad hand is blue. Cross-connecting these will cause the brakes to malfunction.",
      difficulty: "easy",
      answers: [
        { text: "Emergency = red, Service = blue", isCorrect: true },
        { text: "Emergency = blue, Service = red", isCorrect: false },
        { text: "Emergency = yellow, Service = green", isCorrect: false },
        { text: "Both are silver — they are identified only by their location on the trailer nose", isCorrect: false },
      ],
    },
    {
      text: "How do you confirm the fifth wheel jaws have properly locked around the kingpin?",
      explanation: "After coupling, pull the release handle and try to open the fifth wheel jaws. If locked correctly, the handle should not open the jaws. Also look under the trailer to visually confirm the locking jaws are closed around the kingpin.",
      difficulty: "medium",
      answers: [
        { text: "Pull the release handle — it should not open the jaws; visually confirm jaws are closed around kingpin", isCorrect: true },
        { text: "The fifth wheel audibly clicks twice when properly locked", isCorrect: false },
        { text: "Back up the tractor — if the trailer moves independently, it is locked", isCorrect: false },
        { text: "Check that the kingpin handle indicator light is green in the cab", isCorrect: false },
      ],
    },
    {
      text: "After coupling, how do you check for trailer sag?",
      explanation: "After coupling and raising the landing gear, walk around the vehicle and look for a gap between the upper fifth wheel plate and the lower trailer apron. There should be no gap — the trailer must sit flat on the fifth wheel.",
      difficulty: "medium",
      answers: [
        { text: "Look for a gap between the fifth wheel plate and trailer apron — there should be none", isCorrect: true },
        { text: "Use a measuring tape to check the trailer height at each corner", isCorrect: false },
        { text: "Sag is checked only during brake tests, not visual inspection", isCorrect: false },
        { text: "Drive forward slowly and listen for scraping sounds under the trailer", isCorrect: false },
      ],
    },
    {
      text: "Why is bobtailing (driving a tractor without a trailer) sometimes more dangerous than driving with a loaded trailer?",
      explanation: "A bobtailing tractor has less weight over its rear (drive) axles, which reduces traction on those wheels. The brakes are also designed for a loaded vehicle — they can lock up the drive wheels much more easily when empty.",
      difficulty: "hard",
      answers: [
        { text: "Less weight on drive axles reduces traction and brakes lock up more easily", isCorrect: true },
        { text: "Bobtailing is always safer because the vehicle is lighter and stops faster", isCorrect: false },
        { text: "The front axle carries too much weight when bobtailing, causing steering pull", isCorrect: false },
        { text: "Bobtailing activates different braking systems that are not as tested", isCorrect: false },
      ],
    },
    {
      text: "If the trailer starts to skid (trailer jackknife), what should you do?",
      explanation: "If the trailer skids, release the brakes immediately. Over-braking on the trailer axles caused the skid. Releasing the brakes allows the trailer wheels to roll and regain traction, straightening the combination.",
      difficulty: "hard",
      answers: [
        { text: "Release the brakes immediately to allow trailer wheels to roll and regain traction", isCorrect: true },
        { text: "Apply more braking force to the tractor brakes only to straighten out", isCorrect: false },
        { text: "Steer sharply in the direction of the skid and then counter-steer", isCorrect: false },
        { text: "Apply the trailer hand valve to lock only the trailer wheels", isCorrect: false },
      ],
    },
    {
      text: "When backing a double trailer combination, what makes it more difficult than backing a single trailer?",
      explanation: "Doubles respond to steering inputs in the opposite direction compared to a single trailer. The rear trailer also has rearward amplification — small steering movements at the tractor cause large movements at the rear trailer.",
      difficulty: "hard",
      answers: [
        { text: "The rear trailer responds in the opposite direction and amplifies movements — extremely difficult to control", isCorrect: true },
        { text: "The extra weight makes it impossible to back up without assistance", isCorrect: false },
        { text: "The converter dolly locks in a fixed position making steering impossible", isCorrect: false },
        { text: "Doubles back up exactly like a single trailer — only the length differs", isCorrect: false },
      ],
    },
  ]);

  // ── HM: HazMat (10 questions) ─────────────────────────────────────────────
  await seedQuestions(sec["HM"].id, [
    {
      text: "How far away must a driver be from a stopped HazMat vehicle to be considered 'attending' it?",
      explanation: "A driver must be within 100 feet of the vehicle and have it within clear view at all times. The driver must also be awake (not sleeping) and able to move the vehicle if needed.",
      difficulty: "medium",
      answers: [
        { text: "Within 100 feet and within clear view — and must be awake", isCorrect: true },
        { text: "Within 50 feet only in populated areas", isCorrect: false },
        { text: "Within 500 feet as long as the driver has a radio", isCorrect: false },
        { text: "A HazMat vehicle must never be left unattended under any circumstances", isCorrect: false },
      ],
    },
    {
      text: "Where may a HazMat vehicle NOT be parked?",
      explanation: "HazMat vehicles must not be parked within 5 feet of a traveled roadway except briefly for operational purposes. They must also not be parked near open fires, in tunnels, or in areas where prohibited by local rules.",
      difficulty: "medium",
      answers: [
        { text: "Within 5 feet of a traveled roadway, near open fires, in tunnels, or where locally prohibited", isCorrect: true },
        { text: "Only at truck stops — HazMat vehicles cannot park anywhere else", isCorrect: false },
        { text: "Within 1 mile of any school, hospital, or fire station", isCorrect: false },
        { text: "On any public road — HazMat vehicles must only park on private property", isCorrect: false },
      ],
    },
    {
      text: "When can cargo heaters be used in a trailer carrying explosives?",
      explanation: "Cargo heaters (including automatic cargo heater/air conditioner units) cannot be used in trailers carrying explosives. The risk of heat or spark igniting the explosives is too great.",
      difficulty: "hard",
      answers: [
        { text: "Never — cargo heaters are not permitted in trailers carrying explosives", isCorrect: true },
        { text: "Only when temperature drops below 20 degrees Fahrenheit", isCorrect: false },
        { text: "Only electric heaters are allowed — no fuel-burning heaters", isCorrect: false },
        { text: "Cargo heaters are always permitted regardless of HazMat class", isCorrect: false },
      ],
    },
    {
      text: "What does the 'No Smoking Within 25 Feet' rule apply to in HazMat transport?",
      explanation: "No smoking is allowed within 25 feet of a vehicle carrying Class 1 (Explosives), Class 3 (Flammable Liquids), Class 4 (Flammable Solids), or Class 5 (Oxidizers). The rule applies even when not driving.",
      difficulty: "medium",
      answers: [
        { text: "Explosives, flammable liquids, flammable solids, and oxidizers — smoking within 25 feet prohibited", isCorrect: true },
        { text: "Only Class 1 Explosives — other flammable materials have no smoking restriction", isCorrect: false },
        { text: "All HazMat vehicles — no smoking within 25 feet of any HazMat vehicle", isCorrect: false },
        { text: "Only when the vehicle is fueling — otherwise smoking rules do not apply", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you discover a leaking package in your HazMat load?",
      explanation: "Do not transport a leaking package. If you discover a leak after pickup, safely pull off the road and contact your dispatcher and local emergency services. Do not try to seal or contain the leak yourself unless trained.",
      difficulty: "medium",
      answers: [
        { text: "Do not transport it — pull over safely, contact dispatcher and emergency services", isCorrect: true },
        { text: "Continue to the nearest hazmat facility at maximum speed", isCorrect: false },
        { text: "Seal the leak with duct tape and continue to destination", isCorrect: false },
        { text: "Transfer the leaking cargo to another container from your truck's supply", isCorrect: false },
      ],
    },
    {
      text: "What is a 'portable tank' in HazMat transportation?",
      explanation: "A portable tank is a bulk container not permanently attached to a vehicle. It can be loaded onto different vehicles for transport and includes ISO tanks. It differs from a cargo tank, which is permanently mounted on a vehicle.",
      difficulty: "hard",
      answers: [
        { text: "A bulk container NOT permanently attached to a vehicle — can be transferred between vehicles", isCorrect: true },
        { text: "A small tank under 119 gallons used for non-bulk HazMat", isCorrect: false },
        { text: "A tank built into the cargo area of a straight truck", isCorrect: false },
        { text: "Any tank under 1,000 gallons capacity regardless of attachment", isCorrect: false },
      ],
    },
    {
      text: "What special rules apply to transporting radioactive materials?",
      explanation: "Radioactive materials (Class 7) require special placards in any quantity. Packages must be separated from people, animals, and undeveloped film based on radiation levels. Route selection must consider avoiding densely populated areas.",
      difficulty: "hard",
      answers: [
        { text: "Require placards in any quantity, must be separated from people/animals, route restrictions apply", isCorrect: true },
        { text: "Only require placards when exceeding 1,001 lbs like other HazMat classes", isCorrect: false },
        { text: "Must be transported only by government-licensed carriers", isCorrect: false },
        { text: "Radioactive materials may not be transported by road — aircraft only", isCorrect: false },
      ],
    },
    {
      text: "A driver is asked to haul a load of poison gas (Class 2.3). What special training is required?",
      explanation: "Drivers transporting Class 2.3 (Poison Gas / Inhalation Hazard) must have special training in handling emergencies involving toxic gases. This is in addition to the standard HazMat endorsement.",
      difficulty: "hard",
      answers: [
        { text: "Special emergency handling training for toxic gas incidents, beyond the standard HazMat endorsement", isCorrect: true },
        { text: "No additional training — the standard HazMat endorsement is sufficient", isCorrect: false },
        { text: "A HAZWOPER certification from OSHA is required", isCorrect: false },
        { text: "Class 2.3 materials may only be transported by military personnel", isCorrect: false },
      ],
    },
    {
      text: "What is the difference between 'Danger' and 'Warning' signal words on HazMat labels?",
      explanation: "Signal words indicate severity. 'Danger' indicates the highest hazard level. 'Warning' indicates a moderate hazard. Some labels use 'Caution' for lower hazard levels. These words help emergency responders prioritize response.",
      difficulty: "hard",
      answers: [
        { text: "'Danger' = highest hazard level; 'Warning' = moderate hazard; 'Caution' = lower hazard", isCorrect: true },
        { text: "'Danger' means the material is explosive; 'Warning' means it is flammable only", isCorrect: false },
        { text: "Both words mean the same thing and are interchangeable on HazMat labels", isCorrect: false },
        { text: "'Warning' is for radioactive materials; 'Danger' is for all other HazMat classes", isCorrect: false },
      ],
    },
    {
      text: "Why must the proper shipping name on shipping papers match the proper shipping name on the package?",
      explanation: "The proper shipping name (not the trade or brand name) identifies the regulated material according to the HazMat table. Mismatches between the papers and package can cause dangerous confusion during emergency response.",
      difficulty: "medium",
      answers: [
        { text: "Mismatch causes dangerous confusion during emergency response — must match the HazMat table name", isCorrect: true },
        { text: "It is only a paperwork requirement with no practical safety importance", isCorrect: false },
        { text: "Trade names are always acceptable substitutes for proper shipping names", isCorrect: false },
        { text: "Matching is only required for international shipments", isCorrect: false },
      ],
    },
  ]);

  // ── PASS: Passenger Vehicles (10 questions) ───────────────────────────────
  await seedQuestions(sec["PASS"].id, [
    {
      text: "On a school bus, where are blind spots around the vehicle most dangerous?",
      explanation: "The danger zone around a school bus includes a 10-foot area around all sides, but the most dangerous zone is directly in front of the bus where children may be crossing and cannot be seen by the driver.",
      difficulty: "medium",
      answers: [
        { text: "Directly in front and to the right side — children crossing cannot be seen", isCorrect: true },
        { text: "Only behind the bus — children running after the bus are not visible", isCorrect: false },
        { text: "On the driver's left side only since the driver looks right when stopping", isCorrect: false },
        { text: "School buses have no blind spots due to the 7-mirror system", isCorrect: false },
      ],
    },
    {
      text: "Where should a bus driver position the bus at a bus stop?",
      explanation: "At a bus stop, pull as close to the curb as possible so passengers don't have to step into the lane of traffic to board or exit. Check mirrors for pedestrians before opening doors and before moving.",
      difficulty: "easy",
      answers: [
        { text: "As close to the curb as possible so passengers don't step into traffic", isCorrect: true },
        { text: "Two feet from the curb to allow space for buses to pass if needed", isCorrect: false },
        { text: "At the center of the lane for maximum visibility", isCorrect: false },
        { text: "Position depends on how many passengers are boarding", isCorrect: false },
      ],
    },
    {
      text: "How should a bus driver handle an unruly or intoxicated passenger?",
      explanation: "Discharge the passenger at a safe location where they can get assistance if needed. Never discharge a passenger in an unsafe location such as on a highway, at night without shelter, or in a high-crime area.",
      difficulty: "medium",
      answers: [
        { text: "Discharge at a safe location where they can get help — never in an unsafe location", isCorrect: true },
        { text: "Immediately stop wherever you are and order the passenger off the bus", isCorrect: false },
        { text: "Continue to the next scheduled stop and call police to meet you there", isCorrect: false },
        { text: "Lock the passenger in a designated containment area until the route is complete", isCorrect: false },
      ],
    },
    {
      text: "How many emergency exits must a bus have?",
      explanation: "Buses must have at least one emergency exit. Larger buses have multiple emergency exits — rear emergency doors, emergency windows, and roof hatches. Drivers must know the location and operation of all emergency exits.",
      difficulty: "medium",
      answers: [
        { text: "At least one — larger buses have multiple emergency doors, windows, and roof hatches", isCorrect: true },
        { text: "Exactly two — one at the front and one at the rear always", isCorrect: false },
        { text: "Four — one on each side, and one front and rear", isCorrect: false },
        { text: "Emergency exits are optional on transit buses", isCorrect: false },
      ],
    },
    {
      text: "How should you apply brakes when there are standees on the bus?",
      explanation: "Apply brakes smoothly and gradually to avoid throwing standing passengers. Sudden stops can cause standees to fall and be seriously injured. Smooth braking is especially critical on transit buses.",
      difficulty: "easy",
      answers: [
        { text: "Smoothly and gradually — sudden stops can throw standees off balance and cause injury", isCorrect: true },
        { text: "Apply maximum braking force since standees are covered by the operator's insurance", isCorrect: false },
        { text: "Standees must hold the rails — braking technique is the same as with seated passengers", isCorrect: false },
        { text: "Never brake hard — always maintain minimum 30 mph on routes with standees", isCorrect: false },
      ],
    },
    {
      text: "What is the minimum overhead clearance a bus driver must check before entering a low structure?",
      explanation: "Know the height of your bus and check clearance signs. The posted clearance must exceed your vehicle height. If you are unsure, don't enter — back up and find an alternate route.",
      difficulty: "medium",
      answers: [
        { text: "Know your bus height and only enter if posted clearance exceeds it — if unsure, don't enter", isCorrect: true },
        { text: "13.5 feet is always safe for all buses — no checking needed", isCorrect: false },
        { text: "Check that clearance is at least 6 inches greater than your bus height", isCorrect: false },
        { text: "Only charter buses need to check clearance — transit buses are standardized", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you detect carbon monoxide in a bus?",
      explanation: "If you detect carbon monoxide (CO) — often by symptoms like headache or dizziness in passengers — immediately stop and evacuate all passengers. CO is odorless and can incapacitate or kill quickly.",
      difficulty: "hard",
      answers: [
        { text: "Stop immediately and evacuate all passengers — CO is odorless and deadly", isCorrect: true },
        { text: "Open windows slightly and continue to the next stop", isCorrect: false },
        { text: "Only evacuate if the CO alarm sounds — headaches may have other causes", isCorrect: false },
        { text: "Continue driving — CO is only dangerous when the bus is stationary", isCorrect: false },
      ],
    },
    {
      text: "If there is a fire in the bus engine, what should you do?",
      explanation: "If there is an engine fire, stop the bus, evacuate all passengers at least 100 feet upwind from the bus, then call for help. Do not attempt to fight a fuel or engine fire yourself unless trained.",
      difficulty: "medium",
      answers: [
        { text: "Stop, evacuate all passengers 100 feet upwind, then call for help", isCorrect: true },
        { text: "Stop only if the fire is visible — small smoke is normal in diesel engines", isCorrect: false },
        { text: "Drive to the nearest fire station before evacuating to minimize downtime", isCorrect: false },
        { text: "Passengers must remain seated during a fire to prevent panic", isCorrect: false },
      ],
    },
    {
      text: "When assisting a passenger with a disability on a bus, what is the driver's responsibility?",
      explanation: "Bus drivers must assist passengers with disabilities in boarding and alighting safely. This includes operating ramps or lifts, securing wheelchairs with tie-downs, and ensuring the passenger is safe before moving.",
      difficulty: "medium",
      answers: [
        { text: "Operate ramps/lifts, secure wheelchairs with tie-downs, and confirm safety before moving", isCorrect: true },
        { text: "Call ahead to request a disability-trained attendant to assist at the stop", isCorrect: false },
        { text: "Passengers with disabilities are responsible for their own boarding and safety", isCorrect: false },
        { text: "Open the door only — passengers must handle their own mobility devices", isCorrect: false },
      ],
    },
    {
      text: "Where must a school bus driver stop before crossing a railroad track?",
      explanation: "School buses must stop 15 to 50 feet before railroad tracks. The driver must open the service door and window, look and listen for trains, then proceed only when safe. Never shift gears while on the tracks.",
      difficulty: "easy",
      answers: [
        { text: "15 to 50 feet before the tracks — open door and window, look and listen, then proceed", isCorrect: true },
        { text: "10 to 20 feet before the tracks if no train is visible", isCorrect: false },
        { text: "Stop only if a train signal is activated — otherwise proceed at 15 mph", isCorrect: false },
        { text: "Stop 100 feet before the tracks to allow maximum reaction time", isCorrect: false },
      ],
    },
  ]);

  // ── TANK: Tank Vehicles (10 questions) ────────────────────────────────────
  await seedQuestions(sec["TANK"].id, [
    {
      text: "What percentage of the tank must typically be left unfilled as outage for liquids that expand?",
      explanation: "Outage requirements vary by product but typically range from 1–2% for most petroleum products to 10% or more for liquefied gases that expand significantly when heated. Always consult the product spec sheet.",
      difficulty: "hard",
      answers: [
        { text: "Varies by product — from ~1–2% for petroleum to 10%+ for liquefied gases — always check the spec", isCorrect: true },
        { text: "Exactly 10% for all liquid cargo regardless of type", isCorrect: false },
        { text: "No outage is required — tanks should always be completely full to prevent surge", isCorrect: false },
        { text: "25% for all hazardous liquids, 5% for non-hazardous liquids", isCorrect: false },
      ],
    },
    {
      text: "What is a 'portable tank' vs a 'cargo tank' in tank vehicle regulations?",
      explanation: "A cargo tank is permanently attached to a vehicle. A portable tank is not permanently attached — it can be loaded onto and off different vehicles. Both have different inspection and marking requirements.",
      difficulty: "hard",
      answers: [
        { text: "Cargo tank = permanently attached to vehicle; portable tank = removable, can transfer between vehicles", isCorrect: true },
        { text: "Portable tank = over 1,000 gallons; cargo tank = under 1,000 gallons", isCorrect: false },
        { text: "Both terms mean the same thing — they are interchangeable in regulations", isCorrect: false },
        { text: "A cargo tank carries dry bulk; a portable tank carries liquids only", isCorrect: false },
      ],
    },
    {
      text: "What information must be marked on the outside of a cargo tank?",
      explanation: "Cargo tanks must be marked with the name of the manufacturer, serial number, year of manufacture, design pressure, capacity (in gallons), and the retest date.",
      difficulty: "hard",
      answers: [
        { text: "Manufacturer name, serial number, year built, design pressure, capacity, and retest date", isCorrect: true },
        { text: "Only the owner's name and DOT registration number", isCorrect: false },
        { text: "The contents of the last shipment and current load weight", isCorrect: false },
        { text: "Tank markings are not required — only HazMat placards are mandatory", isCorrect: false },
      ],
    },
    {
      text: "What should you check when inspecting a cargo tank before loading?",
      explanation: "Inspect the tank for damage, leaks, and condition of valves, vents, and outlets. Make sure all valves are in the correct position (open or closed as required) and that the tank is clean if product compatibility requires it.",
      difficulty: "medium",
      answers: [
        { text: "Damage, leaks, condition of valves/vents/outlets, and cleanliness if needed", isCorrect: true },
        { text: "Only the exterior paint — chipped paint indicates structural damage", isCorrect: false },
        { text: "Verify the tank is empty before loading by checking the sight glass", isCorrect: false },
        { text: "Tank inspection is only the shipper's responsibility, not the driver's", isCorrect: false },
      ],
    },
    {
      text: "How often must a cargo tank be requalified (pressure tested)?",
      explanation: "MC306 and MC307 tanks (common petroleum and chemical tankers) must be retested every 5 years. The retest date is stamped on the tank. Driving with an expired retest date is a violation.",
      difficulty: "hard",
      answers: [
        { text: "Every 5 years for most cargo tanks — retest date is stamped on the tank", isCorrect: true },
        { text: "Every 2 years regardless of tank type", isCorrect: false },
        { text: "Every year when the tank is used for HazMat", isCorrect: false },
        { text: "Only once during the tank's lifetime at initial manufacture", isCorrect: false },
      ],
    },
    {
      text: "What is unique about cryogenic liquid tanks?",
      explanation: "Cryogenic liquid tanks (for liquid nitrogen, oxygen, argon, LNG, etc.) carry materials at extremely low temperatures (-130°F or lower). They are double-walled with vacuum insulation. Pressure builds up as liquid warms and vaporizes.",
      difficulty: "hard",
      answers: [
        { text: "Carry materials at extremely low temperatures; double-walled with vacuum insulation; pressure builds as liquid warms", isCorrect: true },
        { text: "Only used for transporting dry ice and must be kept at exactly 32°F", isCorrect: false },
        { text: "Cryogenic tanks are unpressurized — all liquids are at atmospheric pressure", isCorrect: false },
        { text: "These tanks are only used by military and government agencies", isCorrect: false },
      ],
    },
    {
      text: "What is a high-pressure tank and how does it differ from other cargo tanks?",
      explanation: "High-pressure tanks (MC331) carry compressed gases like propane and anhydrous ammonia at high pressures (up to 500 psi). They are much thicker and heavier than petroleum tanks, and have different inspection requirements.",
      difficulty: "hard",
      answers: [
        { text: "Carry compressed gases at up to 500 psi — thicker walls and different inspection requirements than petroleum tanks", isCorrect: true },
        { text: "High-pressure tanks operate at 125 psi like standard air brake systems", isCorrect: false },
        { text: "Any tank with more than 1,000 gallons capacity is classified as high-pressure", isCorrect: false },
        { text: "High-pressure tanks are identical to standard tankers but with extra brackets", isCorrect: false },
      ],
    },
    {
      text: "What must be done before a food-grade tanker is loaded with a different product?",
      explanation: "Food-grade tankers must be cleaned and sanitized between loads according to food safety regulations. The driver or carrier must have documentation showing the tank was properly cleaned and is safe for food products.",
      difficulty: "medium",
      answers: [
        { text: "Cleaned and sanitized according to food safety regs — documentation must be available", isCorrect: true },
        { text: "Only visually inspected for obvious contamination", isCorrect: false },
        { text: "Filled with water and emptied once to rinse the previous product", isCorrect: false },
        { text: "Food-grade tankers never carry non-food products, so cleaning is not needed", isCorrect: false },
      ],
    },
    {
      text: "What driving exercise helps drivers of tank vehicles practice surge control?",
      explanation: "Tank vehicle drivers practice controlled acceleration, smooth lane changes, and gradual braking to manage surge. Emergency stops and aggressive maneuvers must be avoided. Simulator training also helps before operating on public roads.",
      difficulty: "medium",
      answers: [
        { text: "Controlled acceleration, smooth lane changes, and gradual braking — avoid emergency maneuvers", isCorrect: true },
        { text: "Practice rapid braking to build confidence in the tank's braking system", isCorrect: false },
        { text: "Drive the tank empty first so the driver experiences maximum surge risk", isCorrect: false },
        { text: "Only computer simulators — no special driving exercises are needed", isCorrect: false },
      ],
    },
    {
      text: "What thermal expansion problem can occur when a tank is filled in cold weather and driven into warm weather?",
      explanation: "Liquids expand as they warm up. A tank filled completely in cold weather can develop dangerously high pressure when the liquid expands in warmer temperatures. This is why outage (unfilled space) is required.",
      difficulty: "medium",
      answers: [
        { text: "The expanding liquid can cause dangerously high pressure — outage prevents this", isCorrect: true },
        { text: "The tank shrinks in cold weather and expands in warm weather, changing the volume rating", isCorrect: false },
        { text: "Cold-filled tanks freeze when temperature drops, blocking valves and outlets", isCorrect: false },
        { text: "Temperature changes have no effect on liquid volume in sealed tanks", isCorrect: false },
      ],
    },
  ]);

  // Update section question counts
  const allSections = await prisma.section.findMany({ include: { _count: { select: { questions: true } } } });
  for (const s of allSections) {
    await prisma.section.update({ where: { id: s.id }, data: { questionCount: s._count.questions } });
  }

  const total = await prisma.question.count();
  console.log("✅ Batch 4 questions added and counts updated!");
  console.log(`🎉 Total questions in database: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
