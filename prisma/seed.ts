import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding CDL database...");

  // ─── TESTS ────────────────────────────────────────────────────────────────

  const generalTest = await prisma.test.upsert({
    where: { slug: "cdl-general" },
    update: {},
    create: {
      slug: "cdl-general",
      name: "CDL General Knowledge",
      description: "Required for ALL CDL applicants. Covers vehicle inspection, cargo, driving safely, hazardous materials basics, and more. 50 questions, 80% to pass.",
      type: "GENERAL_KNOWLEDGE",
      timeLimit: 60,
      passScore: 80,
    },
  });

  const airBrakesTest = await prisma.test.upsert({
    where: { slug: "cdl-air-brakes" },
    update: {},
    create: {
      slug: "cdl-air-brakes",
      name: "Air Brakes",
      description: "Required to remove the L (Air Brakes) restriction. Covers air brake system components, inspection, and safe operation. 25 questions, 80% to pass.",
      type: "AIR_BRAKES",
      timeLimit: 45,
      passScore: 80,
    },
  });

  const combinationTest = await prisma.test.upsert({
    where: { slug: "cdl-combination" },
    update: {},
    create: {
      slug: "cdl-combination",
      name: "Combination Vehicles",
      description: "Required for Class A CDL. Covers coupling/uncoupling, tractor-trailer handling, and safety of combination vehicles. 20 questions, 80% to pass.",
      type: "COMBINATION",
      timeLimit: 40,
      passScore: 80,
    },
  });

  const hazmatTest = await prisma.test.upsert({
    where: { slug: "cdl-hazmat" },
    update: {},
    create: {
      slug: "cdl-hazmat",
      name: "Hazardous Materials (HazMat)",
      description: "Required for HazMat (H) endorsement. Covers the HazMat table, placarding, labeling, and emergency procedures. 30 questions, 80% to pass.",
      type: "HAZMAT",
      timeLimit: 45,
      passScore: 80,
    },
  });

  const passengerTest = await prisma.test.upsert({
    where: { slug: "cdl-passenger" },
    update: {},
    create: {
      slug: "cdl-passenger",
      name: "Passenger Transport",
      description: "Required for Passenger (P) endorsement. Covers loading/unloading, safety rules, and emergency procedures for bus drivers. 20 questions, 80% to pass.",
      type: "PASSENGER",
      timeLimit: 40,
      passScore: 80,
    },
  });

  const tankerTest = await prisma.test.upsert({
    where: { slug: "cdl-tanker" },
    update: {},
    create: {
      slug: "cdl-tanker",
      name: "Tank Vehicles",
      description: "Required for Tanker (N) endorsement. Covers liquid surge, high center of gravity, outage, and safe operation of tank vehicles. 20 questions, 80% to pass.",
      type: "TANKER",
      timeLimit: 40,
      passScore: 80,
    },
  });

  console.log("✅ Tests created");

  // ─── SECTIONS ─────────────────────────────────────────────────────────────

  const gkVehicleInspection = await prisma.section.upsert({
    where: { testId_code: { testId: generalTest.id, code: "GK-VI" } },
    update: {},
    create: { testId: generalTest.id, code: "GK-VI", name: "Vehicle Inspection", questionCount: 0 },
  });

  const gkDrivingSafely = await prisma.section.upsert({
    where: { testId_code: { testId: generalTest.id, code: "GK-DS" } },
    update: {},
    create: { testId: generalTest.id, code: "GK-DS", name: "Driving Safely", questionCount: 0 },
  });

  const gkTransportingCargo = await prisma.section.upsert({
    where: { testId_code: { testId: generalTest.id, code: "GK-TC" } },
    update: {},
    create: { testId: generalTest.id, code: "GK-TC", name: "Transporting Cargo", questionCount: 0 },
  });

  const gkHazmat = await prisma.section.upsert({
    where: { testId_code: { testId: generalTest.id, code: "GK-HM" } },
    update: {},
    create: { testId: generalTest.id, code: "GK-HM", name: "HazMat Basics", questionCount: 0 },
  });

  const abSystem = await prisma.section.upsert({
    where: { testId_code: { testId: airBrakesTest.id, code: "AB-SYS" } },
    update: {},
    create: { testId: airBrakesTest.id, code: "AB-SYS", name: "Air Brake System", questionCount: 0 },
  });

  const abUsing = await prisma.section.upsert({
    where: { testId_code: { testId: airBrakesTest.id, code: "AB-USE" } },
    update: {},
    create: { testId: airBrakesTest.id, code: "AB-USE", name: "Using Air Brakes", questionCount: 0 },
  });

  const combSection = await prisma.section.upsert({
    where: { testId_code: { testId: combinationTest.id, code: "COMB" } },
    update: {},
    create: { testId: combinationTest.id, code: "COMB", name: "Combination Vehicles", questionCount: 0 },
  });

  const hmSection = await prisma.section.upsert({
    where: { testId_code: { testId: hazmatTest.id, code: "HM" } },
    update: {},
    create: { testId: hazmatTest.id, code: "HM", name: "Hazardous Materials", questionCount: 0 },
  });

  const passSection = await prisma.section.upsert({
    where: { testId_code: { testId: passengerTest.id, code: "PASS" } },
    update: {},
    create: { testId: passengerTest.id, code: "PASS", name: "Passenger Transport", questionCount: 0 },
  });

  const tankSection = await prisma.section.upsert({
    where: { testId_code: { testId: tankerTest.id, code: "TANK" } },
    update: {},
    create: { testId: tankerTest.id, code: "TANK", name: "Tank Vehicles", questionCount: 0 },
  });

  console.log("✅ Sections created");

  // ─── QUESTIONS ────────────────────────────────────────────────────────────

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

  // ── GENERAL KNOWLEDGE: Vehicle Inspection ────────────────────────────────

  await seedQuestions(gkVehicleInspection.id, [
    {
      text: "During a pre-trip inspection, you are checking the engine compartment. Which of the following should you check?",
      explanation: "During an engine compartment inspection you check fluid levels (oil, coolant, power steering, windshield washer), hoses for cracks or leaks, belts for tightness and wear, and the battery for secure mounting.",
      difficulty: "easy",
      answers: [
        { text: "Engine oil level, coolant level, and belt condition", isCorrect: true },
        { text: "Tire pressure and lug nuts", isCorrect: false },
        { text: "Wiper blade condition only", isCorrect: false },
        { text: "Cab interior lighting", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the seven-step inspection method?",
      explanation: "The seven-step inspection method provides a systematic way to check the entire vehicle for defects that could make it unsafe to drive. Following the same steps in order each time ensures nothing is missed.",
      difficulty: "easy",
      answers: [
        { text: "To ensure the vehicle is checked systematically and completely before each trip", isCorrect: true },
        { text: "To complete paperwork for the trucking company", isCorrect: false },
        { text: "To check only the engine and brakes", isCorrect: false },
        { text: "To satisfy DOT regulations for annual inspections", isCorrect: false },
      ],
    },
    {
      text: "When checking tires during a pre-trip inspection, you should look for which of the following?",
      explanation: "Tire inspection includes checking tread depth (minimum 4/32 inch on steering axles, 2/32 inch on other axles), inflation (no flat or nearly flat tires), and visible damage such as cuts, bulges, or objects in the tire.",
      difficulty: "medium",
      answers: [
        { text: "Tread depth, inflation, and damage such as cuts or bulges", isCorrect: true },
        { text: "The tire brand and manufacture date only", isCorrect: false },
        { text: "Whether the tires are a matching color", isCorrect: false },
        { text: "Only the front tires since the rear tires are less important", isCorrect: false },
      ],
    },
    {
      text: "You find a defect during your pre-trip inspection that could affect safe operation. What should you do?",
      explanation: "If you discover a defect that could affect safe operation, you must report it to your motor carrier and get it repaired before driving. You are not allowed to drive a vehicle with a known safety defect.",
      difficulty: "easy",
      answers: [
        { text: "Report it and have it repaired before driving", isCorrect: true },
        { text: "Drive carefully and report it at your destination", isCorrect: false },
        { text: "Only report it if it's on a steering component", isCorrect: false },
        { text: "Fix it yourself if it seems minor", isCorrect: false },
      ],
    },
    {
      text: "During a pre-trip inspection, how do you check the oil level?",
      explanation: "Oil level is checked by removing the dipstick, wiping it clean, reinserting it fully, then removing and reading it. The oil level must be within the acceptable range on the dipstick.",
      difficulty: "easy",
      answers: [
        { text: "Remove the dipstick, wipe it, reinsert fully, then remove and read the level", isCorrect: true },
        { text: "Open the oil cap and look inside the engine", isCorrect: false },
        { text: "Check the oil pressure gauge on the dashboard", isCorrect: false },
        { text: "Drain a small amount and check its color", isCorrect: false },
      ],
    },
    {
      text: "Which of these lights must be checked during an exterior pre-trip inspection?",
      explanation: "All lights that are required by law must be checked during the pre-trip inspection: headlights (high and low beam), clearance lights, identification lights, marker lights, brake lights, turn signals, hazard flashers, and reverse lights.",
      difficulty: "medium",
      answers: [
        { text: "Headlights, clearance lights, marker lights, turn signals, and brake lights", isCorrect: true },
        { text: "Headlights only since they are the most important", isCorrect: false },
        { text: "Interior dome lights and instrument panel lights only", isCorrect: false },
        { text: "Brake lights and reverse lights only", isCorrect: false },
      ],
    },
    {
      text: "What is a 'driver vehicle inspection report' (DVIR)?",
      explanation: "A DVIR (Driver Vehicle Inspection Report) is a written record completed by the driver that documents any defects or deficiencies found during a pre-trip or post-trip inspection. Federal regulations require that DVIRs be completed after each trip.",
      difficulty: "medium",
      answers: [
        { text: "A written record of vehicle defects found during inspection, required by federal regulations", isCorrect: true },
        { text: "An optional log kept by the trucking company", isCorrect: false },
        { text: "A DOT form required only when transporting HazMat", isCorrect: false },
        { text: "A maintenance schedule for the vehicle", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Driving Safely ────────────────────────────────────

  await seedQuestions(gkDrivingSafely.id, [
    {
      text: "Which of these factors most affects your stopping distance?",
      explanation: "Stopping distance is affected by perception distance (how far you travel while noticing a hazard), reaction distance (how far you travel while applying the brakes), and braking distance (the distance to actually stop). Vehicle speed is the greatest single factor because doubling your speed more than doubles your stopping distance.",
      difficulty: "medium",
      answers: [
        { text: "Your speed — doubling speed more than doubles stopping distance", isCorrect: true },
        { text: "The road surface only", isCorrect: false },
        { text: "The weight of your cargo", isCorrect: false },
        { text: "The age of your tires", isCorrect: false },
      ],
    },
    {
      text: "How much space should you leave in front of your vehicle when driving in normal conditions?",
      explanation: "As a general rule, you need at least one second of following distance for every 10 feet of vehicle length, plus an extra second if traveling over 40 mph. For a 60-foot truck at 55 mph, that's at least 7 seconds of following distance.",
      difficulty: "medium",
      answers: [
        { text: "One second for every 10 feet of vehicle length, plus extra seconds at high speeds", isCorrect: true },
        { text: "At least two car lengths regardless of speed or vehicle size", isCorrect: false },
        { text: "The same distance as a regular car — 2–3 seconds", isCorrect: false },
        { text: "One second total following distance at any speed", isCorrect: false },
      ],
    },
    {
      text: "When should you downshift while going down a long, steep grade?",
      explanation: "You should select the proper gear BEFORE starting down the grade — not halfway down. Once your brakes are overheated from overuse, you cannot cool them while still moving. Adjust speed before the descent.",
      difficulty: "medium",
      answers: [
        { text: "Before starting down the grade", isCorrect: true },
        { text: "Halfway down the grade when you feel the brakes fading", isCorrect: false },
        { text: "At the bottom of the grade only", isCorrect: false },
        { text: "Only when your speed exceeds the posted limit by 10 mph", isCorrect: false },
      ],
    },
    {
      text: "What is 'black ice'?",
      explanation: "Black ice is a thin, nearly transparent layer of ice that forms on road surfaces. It appears to look like a wet road surface and is very difficult to see. It typically forms on bridges, overpasses, and shaded areas when temperatures are near freezing.",
      difficulty: "easy",
      answers: [
        { text: "A thin, nearly transparent layer of ice that looks like a wet road surface", isCorrect: true },
        { text: "Heavy ice that forms only on mountain roads", isCorrect: false },
        { text: "Ice that forms only at night", isCorrect: false },
        { text: "Ice visible from a distance that appears black in color", isCorrect: false },
      ],
    },
    {
      text: "You are driving at night. When should you use your low-beam headlights instead of high beams?",
      explanation: "High beams should be dimmed (switched to low beams) when within 500 feet of an oncoming vehicle or when following another vehicle within 500 feet. High beams can blind oncoming drivers and the driver ahead.",
      difficulty: "easy",
      answers: [
        { text: "Within 500 feet of an oncoming vehicle or when following within 500 feet", isCorrect: true },
        { text: "Only in cities with street lighting", isCorrect: false },
        { text: "When driving over 50 mph on a highway", isCorrect: false },
        { text: "Whenever other drivers flash their lights at you", isCorrect: false },
      ],
    },
    {
      text: "What should you do if your vehicle starts to hydroplane?",
      explanation: "During hydroplaning, your tires lose contact with the road surface due to water. You should ease off the accelerator, avoid braking if possible, and wait for your tires to regain contact. Hard braking during hydroplaning can cause a skid.",
      difficulty: "medium",
      answers: [
        { text: "Release the accelerator gradually and avoid applying the brakes", isCorrect: true },
        { text: "Apply the brakes firmly to regain traction", isCorrect: false },
        { text: "Accelerate to power through the water", isCorrect: false },
        { text: "Steer sharply to the shoulder of the road", isCorrect: false },
      ],
    },
    {
      text: "What is the minimum following distance for a 60-foot truck traveling at 55 mph in good conditions?",
      explanation: "At 55 mph (over 40 mph), you need one second per 10 feet of vehicle length plus one additional second. For a 60-foot truck: 6 seconds + 1 extra = 7 seconds minimum following distance.",
      difficulty: "hard",
      answers: [
        { text: "7 seconds", isCorrect: true },
        { text: "4 seconds", isCorrect: false },
        { text: "6 seconds", isCorrect: false },
        { text: "10 seconds", isCorrect: false },
      ],
    },
    {
      text: "Which of the following is true about driving in fog?",
      explanation: "In fog, use low-beam headlights (not high beams — they reflect off the fog and reduce visibility), slow down, and increase following distance. If visibility is near zero, pull off the road completely and wait for the fog to clear.",
      difficulty: "easy",
      answers: [
        { text: "Use low-beam headlights and reduce speed", isCorrect: true },
        { text: "Use high-beam headlights to see farther", isCorrect: false },
        { text: "Maintain your normal speed with low beams", isCorrect: false },
        { text: "Use hazard flashers and maintain normal speed", isCorrect: false },
      ],
    },
    {
      text: "When driving, your mirrors should be checked:",
      explanation: "Mirrors should be checked regularly — about every 8–10 seconds — to monitor traffic conditions around your vehicle, check for vehicle conditions (tires, cargo, etc.), and be aware of vehicles in your blind spots.",
      difficulty: "easy",
      answers: [
        { text: "Every 8–10 seconds to stay aware of traffic conditions", isCorrect: true },
        { text: "Only when changing lanes or turning", isCorrect: false },
        { text: "Once every few minutes on highways", isCorrect: false },
        { text: "Only when backing up", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Transporting Cargo ────────────────────────────────

  await seedQuestions(gkTransportingCargo.id, [
    {
      text: "How often must you check cargo during a trip?",
      explanation: "Drivers must check cargo securement within the first 50 miles of a trip, and then every 3 hours or 150 miles (whichever comes first) after that, as well as after any change in duty status or any time the vehicle is stopped to perform other duties.",
      difficulty: "medium",
      answers: [
        { text: "Within the first 50 miles, then every 3 hours or 150 miles", isCorrect: true },
        { text: "Only at the start of the trip", isCorrect: false },
        { text: "Every hour regardless of distance traveled", isCorrect: false },
        { text: "Only when you stop to refuel", isCorrect: false },
      ],
    },
    {
      text: "What is the maximum legal weight for a typical 5-axle tractor-trailer on interstate highways?",
      explanation: "The maximum gross vehicle weight on interstate highways is 80,000 pounds for a standard 5-axle combination vehicle. Individual axle limits also apply: 20,000 lbs for a single axle, 34,000 lbs for a tandem axle group.",
      difficulty: "medium",
      answers: [
        { text: "80,000 pounds", isCorrect: true },
        { text: "64,000 pounds", isCorrect: false },
        { text: "100,000 pounds", isCorrect: false },
        { text: "72,000 pounds", isCorrect: false },
      ],
    },
    {
      text: "If cargo is loaded too high, it can:",
      explanation: "Cargo loaded too high raises the vehicle's center of gravity, making it much more likely to tip over (rollover) when turning or when one side of the road is uneven. This is especially dangerous for liquid tanks and flatbed loads.",
      difficulty: "easy",
      answers: [
        { text: "Make the vehicle more likely to rollover in curves or turns", isCorrect: true },
        { text: "Make the vehicle faster due to reduced wind resistance", isCorrect: false },
        { text: "Improve braking performance", isCorrect: false },
        { text: "Have no effect on driving if the cargo is secured", isCorrect: false },
      ],
    },
    {
      text: "Which statement about overloaded vehicles is TRUE?",
      explanation: "Overloaded vehicles have longer stopping distances because the extra weight requires more braking force. They are also more likely to cause tire blowouts, brake failures, and damage to roads and bridges.",
      difficulty: "medium",
      answers: [
        { text: "They have longer stopping distances and are more likely to have brake or tire failures", isCorrect: true },
        { text: "They handle better because of the added stability from weight", isCorrect: false },
        { text: "They are only unsafe on hills, not on flat roads", isCorrect: false },
        { text: "The main risk is fuel economy, not safety", isCorrect: false },
      ],
    },
    {
      text: "When securing cargo, which of the following is NOT an acceptable tie-down material?",
      explanation: "Acceptable tie-down materials include chains, wire rope, synthetic webbing, and manila rope of sufficient working load limit. Bungee cords are not acceptable for securing cargo because they stretch and do not provide adequate restraint.",
      difficulty: "medium",
      answers: [
        { text: "Bungee cords", isCorrect: true },
        { text: "Chains with appropriate working load limit", isCorrect: false },
        { text: "Synthetic webbing straps", isCorrect: false },
        { text: "Wire rope", isCorrect: false },
      ],
    },
    {
      text: "What does it mean if your vehicle 'fishtails'?",
      explanation: "Fishtailing occurs when the rear of the vehicle swings to one side, usually due to sudden acceleration on a slippery surface or a blown rear tire. Ease off the throttle and steer gently to correct.",
      difficulty: "medium",
      answers: [
        { text: "The rear of the vehicle swings sideways", isCorrect: true },
        { text: "The front wheels lose traction and the vehicle goes straight", isCorrect: false },
        { text: "The vehicle's engine misfires under load", isCorrect: false },
        { text: "The trailer pushes the tractor during hard braking", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: HazMat Basics ─────────────────────────────────────

  await seedQuestions(gkHazmat.id, [
    {
      text: "When must a vehicle display hazardous materials placards?",
      explanation: "Placards are required when transporting 1,001 lbs or more of a placardable-quantity HazMat material (for most classes), or when transporting any amount of certain particularly dangerous materials like explosives Class 1.1 or 1.2, poison gas (Class 2.3), or radioactive materials (Highway Route Controlled Quantities).",
      difficulty: "medium",
      answers: [
        { text: "When transporting 1,001 lbs or more of most hazardous materials requiring a placard", isCorrect: true },
        { text: "Only when crossing state lines with hazardous materials", isCorrect: false },
        { text: "Only if the material is flammable", isCorrect: false },
        { text: "Whenever any hazardous material is on board, regardless of quantity", isCorrect: false },
      ],
    },
    {
      text: "Who is responsible for providing proper shipping papers for hazardous materials?",
      explanation: "The shipper (the company or person sending the cargo) is responsible for preparing and providing the proper hazardous materials shipping papers (bills of lading) with accurate descriptions, identification numbers, and hazard class information. The driver is responsible for having the papers accessible.",
      difficulty: "medium",
      answers: [
        { text: "The shipper who sends the cargo", isCorrect: true },
        { text: "The driver", isCorrect: false },
        { text: "The trucking company (carrier)", isCorrect: false },
        { text: "The FMCSA", isCorrect: false },
      ],
    },
    {
      text: "Where must shipping papers for hazardous materials be kept while driving?",
      explanation: "Shipping papers for HazMat must be within immediate reach of the driver while the driver is seated and restrained by the seatbelt. When out of the vehicle, papers must be in a holder on the driver's door or on the driver's seat.",
      difficulty: "medium",
      answers: [
        { text: "Within immediate reach of the driver, or on the driver's seat when out of the vehicle", isCorrect: true },
        { text: "In the glove compartment", isCorrect: false },
        { text: "On the cargo itself", isCorrect: false },
        { text: "Faxed ahead to the delivery location", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you have an accident involving hazardous materials?",
      explanation: "In an accident involving HazMat, the driver should notify emergency services immediately, keep people away from the area, stay upwind and uphill if possible, and use the Emergency Response Guidebook (ERG) to identify appropriate response actions for the specific material.",
      difficulty: "easy",
      answers: [
        { text: "Notify emergency services, keep people away, and use the Emergency Response Guidebook", isCorrect: true },
        { text: "Try to clean up the spill yourself before calling authorities", isCorrect: false },
        { text: "Continue to the destination and report the accident there", isCorrect: false },
        { text: "Call your dispatcher only — they will decide who to notify", isCorrect: false },
      ],
    },
    {
      text: "The nine hazard classes for hazardous materials include explosives, gases, flammable liquids, and which others?",
      explanation: "The nine DOT hazard classes are: Class 1 (Explosives), Class 2 (Gases), Class 3 (Flammable Liquids), Class 4 (Flammable Solids/Spontaneously Combustible/Dangerous When Wet), Class 5 (Oxidizers/Organic Peroxides), Class 6 (Toxic/Infectious Substances), Class 7 (Radioactive), Class 8 (Corrosives), and Class 9 (Miscellaneous).",
      difficulty: "hard",
      answers: [
        { text: "Flammable solids, oxidizers, toxic materials, radioactive, corrosives, and miscellaneous", isCorrect: true },
        { text: "Poisons, explosives, flammable liquids, and gases only", isCorrect: false },
        { text: "Radioactive and biohazard materials only", isCorrect: false },
        { text: "Corrosives, combustibles, and infectious agents only", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: System ────────────────────────────────────────────────────

  await seedQuestions(abSystem.id, [
    {
      text: "What does the air compressor do in an air brake system?",
      explanation: "The air compressor pumps air into the storage tanks (reservoirs). It is driven by the engine through gears or a V-belt. The compressed air is stored in the tanks and used to apply the brakes.",
      difficulty: "easy",
      answers: [
        { text: "Pumps air into the storage tanks to supply the braking system", isCorrect: true },
        { text: "Regulates the pressure of air in the brake chambers", isCorrect: false },
        { text: "Controls the application of the parking brakes", isCorrect: false },
        { text: "Removes moisture from the air supply", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the safety relief valve in an air brake system?",
      explanation: "The safety relief valve protects the tank and the rest of the system from excessive pressure. It is normally set to open at 150 psi. If the air compressor governor fails and pressure builds beyond a safe level, the safety valve releases the excess air.",
      difficulty: "medium",
      answers: [
        { text: "To release excess pressure if the governor fails, typically set at 150 psi", isCorrect: true },
        { text: "To drain water from the air tanks", isCorrect: false },
        { text: "To apply the emergency brakes automatically", isCorrect: false },
        { text: "To warn the driver of low air pressure", isCorrect: false },
      ],
    },
    {
      text: "At what pressure does the low air pressure warning signal typically activate?",
      explanation: "The low air pressure warning signal (usually a red light and/or buzzer) is required to activate before air pressure drops below 60 psi. Some vehicles may trigger the warning as high as 70–75 psi.",
      difficulty: "medium",
      answers: [
        { text: "Before pressure drops below 60 psi", isCorrect: true },
        { text: "At 100 psi", isCorrect: false },
        { text: "At 30 psi", isCorrect: false },
        { text: "At 20 psi", isCorrect: false },
      ],
    },
    {
      text: "What are spring brakes?",
      explanation: "Spring brakes (also called emergency/parking brakes in air brake systems) use powerful coil springs to apply the brakes. They are held back by air pressure during normal operation. When air pressure drops below 20–45 psi, the springs release and engage the brakes automatically.",
      difficulty: "medium",
      answers: [
        { text: "Brakes held off by air pressure that engage automatically when air pressure gets too low", isCorrect: true },
        { text: "A type of brake that uses spring force to slow the vehicle during normal driving", isCorrect: false },
        { text: "Brakes used only for parking that require no air pressure", isCorrect: false },
        { text: "An older style of drum brake found only on older vehicles", isCorrect: false },
      ],
    },
    {
      text: "How should you drain water from the air tanks?",
      explanation: "Air tanks must be drained manually each day (or automatically if equipped with automatic drain valves) to remove accumulated water and oil. Water in the system can cause brake fade and can freeze in cold weather, causing brake failures.",
      difficulty: "easy",
      answers: [
        { text: "Open the drain valve at the bottom of each tank at the end of each day", isCorrect: true },
        { text: "Water drains automatically and never needs manual draining", isCorrect: false },
        { text: "Turn the vehicle upside down to empty the tanks", isCorrect: false },
        { text: "Drain the tanks only when a mechanic performs a service", isCorrect: false },
      ],
    },
    {
      text: "What is 'brake fade'?",
      explanation: "Brake fade occurs when drum brakes overheat from extended use, typically on long downgrades when brakes are applied repeatedly. The heat causes the brake lining material to become less effective, reducing stopping ability. Using the proper gear and controlled braking technique prevents brake fade.",
      difficulty: "medium",
      answers: [
        { text: "Loss of braking effectiveness due to overheating from repeated use on a long downgrade", isCorrect: true },
        { text: "Brakes wearing out after extended highway use", isCorrect: false },
        { text: "An air pressure drop that reduces braking force", isCorrect: false },
        { text: "Brakes that do not release fully after being applied", isCorrect: false },
      ],
    },
    {
      text: "In a dual air brake system, what happens if one system fails?",
      explanation: "A dual air brake system has two separate air systems — the primary system serves the rear brakes, the secondary system serves the front brakes. If one system fails, you still have partial braking from the other system, giving you time to bring the vehicle safely to a stop.",
      difficulty: "medium",
      answers: [
        { text: "The other system still provides partial braking, allowing the driver to stop safely", isCorrect: true },
        { text: "All braking is lost immediately", isCorrect: false },
        { text: "The spring brakes automatically engage at full force", isCorrect: false },
        { text: "The system switches to hydraulic braking as a backup", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: Using ─────────────────────────────────────────────────────

  await seedQuestions(abUsing.id, [
    {
      text: "When testing air brakes, after releasing the service brake, the pressure drop should be:",
      explanation: "When the engine is off and parking brakes are released, the service brake application should not cause a pressure drop of more than 3 psi per minute on a single vehicle, or 4 psi per minute on a combination vehicle.",
      difficulty: "hard",
      answers: [
        { text: "No more than 3 psi in one minute for a single vehicle", isCorrect: true },
        { text: "No more than 10 psi in one minute", isCorrect: false },
        { text: "No more than 1 psi in one minute", isCorrect: false },
        { text: "There should be zero pressure drop at any time", isCorrect: false },
      ],
    },
    {
      text: "What is the proper braking technique to use on a long downgrade?",
      explanation: "On long downgrades, use the 'snub braking' technique: apply the brakes firmly until your speed drops about 5 mph below your target speed, release them and let them cool, then reapply when your speed climbs 5 mph over your target. Never ride the brakes continuously — this causes brake fade.",
      difficulty: "medium",
      answers: [
        { text: "Apply brakes firmly to reduce speed, then release to let them cool, then repeat as needed", isCorrect: true },
        { text: "Ride the brakes lightly and continuously to maintain speed", isCorrect: false },
        { text: "Shift to neutral to reduce engine braking and rely on wheel brakes only", isCorrect: false },
        { text: "Apply maximum brake force once and hold until reaching the bottom", isCorrect: false },
      ],
    },
    {
      text: "What is the parking brake test used to verify?",
      explanation: "The parking brake test checks that the parking brake (spring brakes) will hold the vehicle. With the vehicle moving slowly, gently apply the parking brake control. The vehicle should be pulled to a stop, confirming the parking brake works.",
      difficulty: "medium",
      answers: [
        { text: "That the parking brake will hold the vehicle by applying it while moving slowly", isCorrect: true },
        { text: "That the parking brake light on the dashboard illuminates", isCorrect: false },
        { text: "The maximum air pressure in the system", isCorrect: false },
        { text: "That the service brakes do not engage while parking brakes are applied", isCorrect: false },
      ],
    },
    {
      text: "If your air pressure warning comes on while driving, what should you do?",
      explanation: "If the low air pressure warning activates while driving, stop the vehicle as quickly and safely as possible. The spring brakes will engage automatically when pressure falls below 20–45 psi. If you wait until that happens while moving fast, you could lose control.",
      difficulty: "easy",
      answers: [
        { text: "Stop safely as quickly as possible before pressure drops and spring brakes engage", isCorrect: true },
        { text: "Drive normally to the nearest truck stop for repairs", isCorrect: false },
        { text: "Pump the brakes to build pressure back up", isCorrect: false },
        { text: "Switch to the emergency brake immediately", isCorrect: false },
      ],
    },
    {
      text: "What does 'stab braking' mean?",
      explanation: "Stab braking is an emergency braking technique for non-ABS vehicles. You apply maximum brake force until the wheels are about to lock, then release the brakes until the wheels start rolling again, then reapply. This prevents wheel lockup while still applying maximum braking force.",
      difficulty: "hard",
      answers: [
        { text: "Applying full brake force until wheels almost lock, releasing, then reapplying repeatedly", isCorrect: true },
        { text: "Applying light braking pressure continuously to prevent wheel lockup", isCorrect: false },
        { text: "A technique for parking in tight spaces using the service brake only", isCorrect: false },
        { text: "Using the trailer brakes only during emergency stops", isCorrect: false },
      ],
    },
  ]);

  // ── COMBINATION VEHICLES ──────────────────────────────────────────────────

  await seedQuestions(combSection.id, [
    {
      text: "What is the most important thing to do before backing under a trailer?",
      explanation: "Before backing under a trailer, the kingpin/fifth wheel must be properly aligned with the trailer's kingpin. Also check that the landing gear is down, the trailer brakes are applied, and the vehicle is lined up straight. A misaligned coupling can cause the fifth wheel to close on the side of the kingpin, which is an unsafe connection.",
      difficulty: "medium",
      answers: [
        { text: "Make sure the fifth wheel is properly aligned with the trailer kingpin", isCorrect: true },
        { text: "Check all tires for proper inflation", isCorrect: false },
        { text: "Release the landing gear completely", isCorrect: false },
        { text: "Apply the tractor's service brakes before backing", isCorrect: false },
      ],
    },
    {
      text: "After coupling, how do you test that the trailer is properly connected?",
      explanation: "After coupling, test the connection by pulling forward gently with the trailer brakes applied. The trailer should not move — if you feel a jerk or the trailer moves, the fifth wheel latch may not have fully engaged. Also visually inspect the fifth wheel to confirm it is fully locked.",
      difficulty: "medium",
      answers: [
        { text: "Pull forward gently with the trailer brakes applied — the trailer should not move", isCorrect: true },
        { text: "Accelerate to highway speed and check for unusual vibrations", isCorrect: false },
        { text: "Check that the trailer lights are working", isCorrect: false },
        { text: "Use a hammer to tap the fifth wheel and listen for a ringing sound", isCorrect: false },
      ],
    },
    {
      text: "What is 'trailer sway' and how is it corrected?",
      explanation: "Trailer sway (also called trailer fishtail or jackknife precursor) occurs when the trailer swings from side to side. It is usually caused by driving too fast, a sudden steering maneuver, or wind. The correction is to release the accelerator (do not brake) and let the vehicle slow down naturally.",
      difficulty: "medium",
      answers: [
        { text: "The trailer swinging side to side — release the accelerator and let the vehicle slow naturally", isCorrect: true },
        { text: "The trailer pulling to one side — steer in the opposite direction", isCorrect: false },
        { text: "A vibration in the trailer — apply trailer brakes firmly", isCorrect: false },
        { text: "The trailer unhitching — apply full service brakes immediately", isCorrect: false },
      ],
    },
    {
      text: "What causes a jackknife?",
      explanation: "A jackknife occurs when the drive axles of the tractor lock up (usually from over-braking on a slippery surface), causing the rear of the tractor to swing out. The trailer continues moving forward in a straight line, folding the tractor-trailer into a 'V' shape. The key prevention is avoiding sudden, hard braking.",
      difficulty: "hard",
      answers: [
        { text: "Locking up the tractor's drive axles, usually from hard braking on a slippery road", isCorrect: true },
        { text: "Coupling the trailer at an angle instead of straight", isCorrect: false },
        { text: "Driving too slowly for road conditions", isCorrect: false },
        { text: "Having improperly loaded cargo that shifts to the front", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the trailer hand valve (trolley valve)?",
      explanation: "The trailer hand valve (also called the trolley valve or Johnson bar) is used to test trailer brakes, usually during a pre-trip inspection. It should NOT be used for normal braking because it applies only the trailer brakes, which can cause the trailer to jackknife.",
      difficulty: "medium",
      answers: [
        { text: "To test trailer brakes during inspection — not for normal driving braking", isCorrect: true },
        { text: "To apply the trailer brakes during emergency stops only", isCorrect: false },
        { text: "To hold the trailer steady while coupling and uncoupling", isCorrect: false },
        { text: "To control the trailer's landing gear", isCorrect: false },
      ],
    },
    {
      text: "When uncoupling, after shutting off the trailer air supply and applying the trailer parking brakes, what should you do?",
      explanation: "When uncoupling, the sequence is: (1) Park in a safe location, (2) Apply tractor parking brakes, (3) Block trailer wheels, (4) Lower the landing gear until it contacts the ground, (5) Disconnect air and electrical lines and secure them, (6) Pull the fifth wheel release handle, (7) Pull forward slowly.",
      difficulty: "hard",
      answers: [
        { text: "Lower the landing gear until it supports the trailer, then disconnect air and electrical lines", isCorrect: true },
        { text: "Immediately pull forward to clear the fifth wheel area", isCorrect: false },
        { text: "Raise the landing gear completely before disconnecting the air lines", isCorrect: false },
        { text: "Release the fifth wheel before lowering the landing gear", isCorrect: false },
      ],
    },
    {
      text: "What does 'off-tracking' mean for large combination vehicles?",
      explanation: "Off-tracking refers to the tendency of the rear wheels to follow a different (shorter, inside) path than the front wheels during a turn. The longer the vehicle, the greater the off-tracking. Drivers must swing wide on turns to allow the rear wheels to clear curbs and obstacles.",
      difficulty: "medium",
      answers: [
        { text: "Rear wheels follow a shorter path than front wheels during a turn", isCorrect: true },
        { text: "The trailer drifting to the outside of the turn while the cab goes straight", isCorrect: false },
        { text: "The drive axles losing traction and sliding sideways", isCorrect: false },
        { text: "The fifth wheel coming uncoupled during a sharp turn", isCorrect: false },
      ],
    },
  ]);

  // ── HAZARDOUS MATERIALS ───────────────────────────────────────────────────

  await seedQuestions(hmSection.id, [
    {
      text: "What is the 'proper shipping name' for a hazardous material?",
      explanation: "The proper shipping name is the official name for a hazardous material as listed in the Hazardous Materials Table (49 CFR 172.101). It must appear on shipping papers and packages. Using a proper shipping name ensures emergency responders can identify the material.",
      difficulty: "medium",
      answers: [
        { text: "The official name for the material as listed in the Hazardous Materials Table", isCorrect: true },
        { text: "The brand name printed on the container", isCorrect: false },
        { text: "A description the shipper creates for their internal records", isCorrect: false },
        { text: "The chemical formula for the substance", isCorrect: false },
      ],
    },
    {
      text: "What information must appear on a shipping paper for hazardous materials?",
      explanation: "Hazardous materials shipping papers must include: (1) proper shipping name, (2) hazard class or division, (3) identification number (UN/NA), (4) packing group, (5) total quantity, and (6) emergency response phone number.",
      difficulty: "hard",
      answers: [
        { text: "Proper shipping name, hazard class, ID number, packing group, quantity, and emergency phone number", isCorrect: true },
        { text: "Just the trade name and weight of the shipment", isCorrect: false },
        { text: "The shipper's address and a description of the material", isCorrect: false },
        { text: "The driver's CDL number and the route to be taken", isCorrect: false },
      ],
    },
    {
      text: "What does a 'placard' indicate on a truck?",
      explanation: "A placard is a 10.75-inch diamond-shaped sign required on the outside of vehicles transporting hazardous materials. Placards identify the hazard class of the material, allowing emergency responders and other drivers to identify the hazard in case of an accident.",
      difficulty: "easy",
      answers: [
        { text: "The type of hazard class of the material being transported", isCorrect: true },
        { text: "The destination city of the shipment", isCorrect: false },
        { text: "The driver's license class", isCorrect: false },
        { text: "The weight of the hazardous material", isCorrect: false },
      ],
    },
    {
      text: "You are hauling hazardous materials and your route takes you through a tunnel. What should you do?",
      explanation: "Many tunnels restrict or prohibit hazardous materials transport. Before the trip, check your route for any tunnel restrictions related to the hazmat you're carrying. Never assume a tunnel allows HazMat — check applicable regulations and posted signs.",
      difficulty: "medium",
      answers: [
        { text: "Check for tunnel restrictions on your route before starting the trip", isCorrect: true },
        { text: "Proceed normally since all public tunnels allow HazMat by law", isCorrect: false },
        { text: "Contact the tunnel authority only if carrying radioactive materials", isCorrect: false },
        { text: "Avoid all tunnels regardless of HazMat class", isCorrect: false },
      ],
    },
    {
      text: "Class 1 hazardous materials are:",
      explanation: "Class 1 hazardous materials are explosives. They are divided into six divisions based on their sensitivity and potential blast hazard. Division 1.1 (mass explosion hazard) and 1.2 (projection hazard) require special handling and placarding.",
      difficulty: "easy",
      answers: [
        { text: "Explosives", isCorrect: true },
        { text: "Flammable gases", isCorrect: false },
        { text: "Flammable liquids", isCorrect: false },
        { text: "Corrosives", isCorrect: false },
      ],
    },
    {
      text: "How close to a fire may you park a vehicle carrying hazardous materials?",
      explanation: "A vehicle transporting hazardous materials must not be parked within 300 feet of an open fire. This distance provides a safety buffer in case of fire spread or heat-induced ignition of the HazMat cargo.",
      difficulty: "medium",
      answers: [
        { text: "300 feet", isCorrect: true },
        { text: "50 feet", isCorrect: false },
        { text: "100 feet", isCorrect: false },
        { text: "500 feet", isCorrect: false },
      ],
    },
    {
      text: "Which hazardous material class covers flammable liquids?",
      explanation: "Class 3 covers flammable liquids — materials with a flash point below 141°F (60.5°C). Common examples include gasoline, diesel fuel (technically a combustible), acetone, and paint thinners.",
      difficulty: "easy",
      answers: [
        { text: "Class 3", isCorrect: true },
        { text: "Class 2", isCorrect: false },
        { text: "Class 4", isCorrect: false },
        { text: "Class 8", isCorrect: false },
      ],
    },
    {
      text: "What is the Emergency Response Guidebook (ERG) used for?",
      explanation: "The Emergency Response Guidebook (ERG) is published by DOT and provides guidance for first responders and drivers during hazardous materials incidents. It identifies the material by UN number or name and gives initial protective action distances and emergency response steps.",
      difficulty: "easy",
      answers: [
        { text: "To identify hazardous materials and guide emergency response actions at accident scenes", isCorrect: true },
        { text: "To determine which route to take when carrying HazMat", isCorrect: false },
        { text: "To calculate the weight and volume of HazMat shipments", isCorrect: false },
        { text: "To record all HazMat deliveries for DOT reporting purposes", isCorrect: false },
      ],
    },
  ]);

  // ── PASSENGER TRANSPORT ───────────────────────────────────────────────────

  await seedQuestions(passSection.id, [
    {
      text: "When must a bus driver stop at a railroad crossing?",
      explanation: "Buses must ALWAYS stop at railroad crossings — there are no exceptions based on traffic conditions or time of day. You must stop between 15 and 50 feet from the nearest rail, open the door to listen, and proceed only when safe.",
      difficulty: "easy",
      answers: [
        { text: "Always — buses must stop at all railroad crossings", isCorrect: true },
        { text: "Only when the crossing lights are flashing", isCorrect: false },
        { text: "Only when carrying more than 24 passengers", isCorrect: false },
        { text: "Only on roads posted with 'Bus Must Stop' signs", isCorrect: false },
      ],
    },
    {
      text: "How far from railroad tracks must a bus stop?",
      explanation: "A bus must stop no closer than 15 feet and no farther than 50 feet from the nearest rail. This provides enough clearance to stop safely while keeping the driver close enough to look both ways down the tracks.",
      difficulty: "medium",
      answers: [
        { text: "Between 15 and 50 feet from the nearest rail", isCorrect: true },
        { text: "Within 5 feet of the crossing gate", isCorrect: false },
        { text: "At least 100 feet from the tracks", isCorrect: false },
        { text: "Within 10 feet of the crossing signal", isCorrect: false },
      ],
    },
    {
      text: "Which of the following may NOT be transported in a bus compartment with passengers?",
      explanation: "Passengers and their belongings are generally allowed on buses, but hazardous materials (flammables, explosives, poisons, etc.), large firearms, and certain other dangerous items are prohibited in the passenger compartment. Small arms ammunition for personal use may be permitted under certain rules.",
      difficulty: "medium",
      answers: [
        { text: "Flammable liquids, explosives, and hazardous materials", isCorrect: true },
        { text: "Luggage and personal bags", isCorrect: false },
        { text: "Bicycles in properly secured bike racks", isCorrect: false },
        { text: "Oxygen for medical use by a passenger", isCorrect: false },
      ],
    },
    {
      text: "After an accident requiring evacuation, where should you lead passengers?",
      explanation: "After evacuating a bus, passengers should be led at least 100 feet away from the bus, off the road, and upwind if there is any danger of fire or hazardous materials. Do not allow passengers to stand in traffic lanes.",
      difficulty: "medium",
      answers: [
        { text: "At least 100 feet away from the bus, off the road, and upwind of any fire or spill", isCorrect: true },
        { text: "Behind the bus on the shoulder of the road", isCorrect: false },
        { text: "To the next rest area or building", isCorrect: false },
        { text: "Keep passengers on the bus until emergency services arrive", isCorrect: false },
      ],
    },
    {
      text: "What should you do if a passenger becomes disruptive or threatening on your bus?",
      explanation: "If a passenger becomes disruptive or threatening, do not argue or engage. If possible, stop at a safe location and contact authorities. Never put yourself or other passengers at risk. Document the incident and report it to your dispatcher and supervisor.",
      difficulty: "medium",
      answers: [
        { text: "Stop safely, contact authorities, and do not argue with the passenger", isCorrect: true },
        { text: "Physically remove the passenger from the bus yourself", isCorrect: false },
        { text: "Continue driving and ignore the disruption", isCorrect: false },
        { text: "Allow other passengers to handle the situation", isCorrect: false },
      ],
    },
    {
      text: "When fueling a bus with passengers on board, you must:",
      explanation: "Passengers must not be on a bus while it is being fueled unless it cannot be avoided (for medical reasons). The engine must be shut off during fueling. If fueling with passengers aboard is unavoidable, the driver must warn passengers not to smoke and keep all windows open.",
      difficulty: "hard",
      answers: [
        { text: "Ensure the engine is off, warn passengers not to smoke, and keep windows open", isCorrect: true },
        { text: "Never fuel with passengers on board under any circumstances", isCorrect: false },
        { text: "Allow fueling normally — it is not a regulated activity", isCorrect: false },
        { text: "Only fuel with passengers aboard if there are fewer than 10 passengers", isCorrect: false },
      ],
    },
  ]);

  // ── TANK VEHICLES ─────────────────────────────────────────────────────────

  await seedQuestions(tankSection.id, [
    {
      text: "What is 'liquid surge' and why is it dangerous?",
      explanation: "Liquid surge occurs when liquid in a tank shifts during braking, acceleration, or turning. This surge pushes the vehicle in the direction the liquid is moving — forward during braking, backward during acceleration, and sideways during turns. It can cause loss of control, especially in partially filled tanks.",
      difficulty: "easy",
      answers: [
        { text: "The shifting of liquid that can push the vehicle in the direction of the surge, causing instability", isCorrect: true },
        { text: "Liquid overflowing from the tank through the vent", isCorrect: false },
        { text: "A pressure buildup inside the tank that can cause it to rupture", isCorrect: false },
        { text: "Condensation forming on the inside of the tank walls", isCorrect: false },
      ],
    },
    {
      text: "A tank vehicle with baffles will have less side-to-side surge than one without baffles.",
      explanation: "Baffles reduce forward and backward surge by dividing the tank into compartments with openings. However, baffles do NOT significantly reduce side-to-side (lateral) surge. Round tanks without baffles are especially prone to surge in all directions.",
      difficulty: "medium",
      answers: [
        { text: "False — baffles reduce front-to-back surge, but not side-to-side surge", isCorrect: true },
        { text: "True — baffles reduce surge in all directions equally", isCorrect: false },
        { text: "True — baffles are specifically designed to prevent side-to-side surge", isCorrect: false },
        { text: "False — baffles have no effect on surge in any direction", isCorrect: false },
      ],
    },
    {
      text: "Why do tank vehicles have a high rollover risk?",
      explanation: "Tank vehicles have a higher center of gravity than most trucks because the cargo (liquid or gas) is carried high. A high center of gravity means that during sharp turns or on uneven surfaces, the vehicle is much more likely to tip over (rollover). This risk increases when the tank is partially filled.",
      difficulty: "easy",
      answers: [
        { text: "Their high center of gravity makes them more prone to rolling over in turns", isCorrect: true },
        { text: "Their long wheelbase reduces cornering ability", isCorrect: false },
        { text: "The extra weight from the tank increases braking distance only", isCorrect: false },
        { text: "They have specially designed suspensions that cause oversteering", isCorrect: false },
      ],
    },
    {
      text: "What is 'outage' in tank vehicle terminology?",
      explanation: "Outage is the space left unfilled in a tank to allow for the expansion of liquid. Some liquids expand significantly when heated — if the tank is overfilled, pressure can build to dangerous levels. The amount of outage required varies by the type of liquid and its expansion characteristics.",
      difficulty: "medium",
      answers: [
        { text: "Space left unfilled in a tank to allow for liquid expansion due to temperature changes", isCorrect: true },
        { text: "The amount of liquid that evaporates from the tank during transit", isCorrect: false },
        { text: "A type of tank vent used to prevent pressure buildup", isCorrect: false },
        { text: "The weight difference between a full and empty tank", isCorrect: false },
      ],
    },
    {
      text: "When is a Tanker (N) endorsement required?",
      explanation: "A Tanker endorsement is required when driving a vehicle with a permanently mounted cargo tank of 1,000 gallons or more designed to transport liquid or gaseous materials. It does not apply to portable tanks.",
      difficulty: "medium",
      answers: [
        { text: "When driving a vehicle with a permanently mounted cargo tank of 1,000 gallons or more", isCorrect: true },
        { text: "Whenever transporting any liquid cargo in a truck", isCorrect: false },
        { text: "Only when transporting flammable liquids in excess of 5,000 gallons", isCorrect: false },
        { text: "Any time a tank of any size is attached to a vehicle", isCorrect: false },
      ],
    },
    {
      text: "Before loading a tank with a new product, what must you check?",
      explanation: "Before loading a new product, you must verify that the tank is compatible with the new material and has been properly cleaned if the previous load was different. Residual amounts of incompatible materials can cause dangerous chemical reactions.",
      difficulty: "medium",
      answers: [
        { text: "That the tank is compatible with the new material and has been cleaned if necessary", isCorrect: true },
        { text: "Only check the tire pressure before loading", isCorrect: false },
        { text: "No check is needed if the tank appears visually clean", isCorrect: false },
        { text: "Verify the tank was last inspected within the past year", isCorrect: false },
      ],
    },
    {
      text: "How does a partially filled liquid tank affect vehicle handling compared to a full tank?",
      explanation: "A partially filled tank is actually more dangerous than a full tank for handling purposes. Partial loads have more room for liquid to surge and slosh around. A full tank's liquid cannot surge because there's no room to move.",
      difficulty: "hard",
      answers: [
        { text: "Partially filled tanks are more dangerous due to greater liquid surge", isCorrect: true },
        { text: "Partially filled tanks are safer because the vehicle weighs less", isCorrect: false },
        { text: "There is no difference in handling between full and partial loads", isCorrect: false },
        { text: "Partially filled tanks are safer because the liquid has room to expand", isCorrect: false },
      ],
    },
  ]);

  console.log("✅ Questions created");

  // ─── CDL ENDORSEMENTS ─────────────────────────────────────────────────────

  const endorsements = [
    {
      code: "H",
      name: "Hazardous Materials",
      description: "Required to transport hazardous materials requiring placarding. Requires a TSA security threat assessment (background check) in addition to passing the HazMat knowledge test.",
      cdlClass: "all",
      testSlug: "cdl-hazmat",
    },
    {
      code: "N",
      name: "Tank Vehicles",
      description: "Required to drive vehicles with permanently mounted cargo tanks of 1,000 gallons or more, designed to transport liquid or gaseous materials.",
      cdlClass: "all",
      testSlug: "cdl-tanker",
    },
    {
      code: "P",
      name: "Passenger Transport",
      description: "Required to drive vehicles designed to carry 16 or more passengers (including the driver), such as buses, charter coaches, and large shuttles.",
      cdlClass: "B",
      testSlug: "cdl-passenger",
    },
    {
      code: "T",
      name: "Doubles/Triples",
      description: "Required to pull double or triple trailers. The knowledge test covers the safe operation and coupling/uncoupling of multiple-trailer combinations.",
      cdlClass: "A",
      testSlug: null,
    },
    {
      code: "S",
      name: "School Bus",
      description: "Required to drive a school bus. Must be obtained in addition to the Passenger (P) endorsement. Covers school bus-specific safety rules and procedures.",
      cdlClass: "B",
      testSlug: null,
    },
    {
      code: "X",
      name: "HazMat + Tanker (Combo)",
      description: "A combined endorsement for drivers who hold both the H (HazMat) and N (Tanker) endorsements. Required when transporting hazardous liquids or gases in a tanker.",
      cdlClass: "all",
      testSlug: null,
    },
  ];

  for (const e of endorsements) {
    await prisma.cDLEndorsement.upsert({
      where: { code: e.code },
      update: e,
      create: e,
    });
  }

  console.log("✅ Endorsements created");

  // Update question counts
  const sections = await prisma.section.findMany();
  for (const section of sections) {
    const count = await prisma.question.count({ where: { sectionId: section.id } });
    await prisma.section.update({ where: { id: section.id }, data: { questionCount: count } });
  }

  console.log("✅ Question counts updated");
  console.log("🎉 CDL database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
