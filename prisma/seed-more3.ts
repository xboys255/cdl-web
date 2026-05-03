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
    const existing = await prisma.question.findFirst({
      where: { sectionId, text: q.text },
    });
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
  console.log("🌱 Seeding additional CDL questions (batch 3)...");

  const sections = await prisma.section.findMany({ include: { test: true } });
  const sec = Object.fromEntries(sections.map((s) => [s.code, s]));

  // GK-VI — Vehicle Inspection (4 questions)
  await seedQuestions(sec["GK-VI"].id, [
    {
      text: "During a pre-trip inspection, how should you check that the steering wheel is not too loose?",
      explanation: "You should turn the steering wheel back and forth. There should be no more than 10 degrees (about 2 inches on a 20-inch wheel) of play.",
      difficulty: "medium",
      answers: [
        { text: "Turn the wheel back and forth — play should be no more than 10 degrees", isCorrect: true },
        { text: "Turn the wheel one full rotation and check for resistance", isCorrect: false },
        { text: "Check that the wheel is centered and does not vibrate", isCorrect: false },
        { text: "Verify the wheel is locked when the truck is parked", isCorrect: false },
      ],
    },
    {
      text: "What should you check when inspecting the front axle during a pre-trip?",
      explanation: "Check beam for cracks or bends, check springs and spring mounts for damage, check shock absorbers for leaks, and check the steering components.",
      difficulty: "medium",
      answers: [
        { text: "Beam for cracks, springs/mounts for damage, shock absorbers for leaks", isCorrect: true },
        { text: "Only the tie rods and wheel nuts", isCorrect: false },
        { text: "Fuel lines and battery cables near the axle", isCorrect: false },
        { text: "Air pressure in tires only", isCorrect: false },
      ],
    },
    {
      text: "What is the minimum tread depth required for front tires on a CMV?",
      explanation: "Front (steering) tires must have at least 4/32 inch tread depth. Drive and trailer tires must have at least 2/32 inch.",
      difficulty: "easy",
      answers: [
        { text: "4/32 inch", isCorrect: true },
        { text: "2/32 inch", isCorrect: false },
        { text: "6/32 inch", isCorrect: false },
        { text: "8/32 inch", isCorrect: false },
      ],
    },
    {
      text: "During engine compartment inspection, what does a milky or foamy appearance in the coolant indicate?",
      explanation: "Coolant is usually green or orange. A milky or foamy appearance indicates oil is mixing with the coolant, which can signal a blown head gasket.",
      difficulty: "hard",
      answers: [
        { text: "Oil is mixing into the coolant — possible blown head gasket", isCorrect: true },
        { text: "The water pump is working properly", isCorrect: false },
        { text: "Coolant needs to be replaced with a fresh batch", isCorrect: false },
        { text: "It is normal when the engine is cold", isCorrect: false },
      ],
    },
  ]);

  // GK-DS — Driving Safely (5 questions)
  await seedQuestions(sec["GK-DS"].id, [
    {
      text: "What is the safest way to handle a tire blowout on a front (steering) tire?",
      explanation: "Grip the steering wheel firmly, stay off the brakes initially, let the truck slow down on its own, then brake gently and pull off the road.",
      difficulty: "hard",
      answers: [
        { text: "Grip the wheel firmly, stay off brakes, let the vehicle slow, then gently brake", isCorrect: true },
        { text: "Apply the brakes immediately and hard to stop quickly", isCorrect: false },
        { text: "Steer sharply to the shoulder and apply full brakes", isCorrect: false },
        { text: "Accelerate briefly to stabilize then brake hard", isCorrect: false },
      ],
    },
    {
      text: "When should you use your four-way flashers (hazard lights) while driving?",
      explanation: "Use hazard lights when you are moving much slower than surrounding traffic, such as when going uphill slowly, or are stopped on the side of the road.",
      difficulty: "easy",
      answers: [
        { text: "When moving much slower than traffic flow or when stopped on the roadway", isCorrect: true },
        { text: "Whenever driving at night", isCorrect: false },
        { text: "Any time you are in a construction zone", isCorrect: false },
        { text: "Only when you have a mechanical breakdown", isCorrect: false },
      ],
    },
    {
      text: "What is the correct following distance in seconds for a CMV traveling over 40 mph?",
      explanation: "You need at least one second for each 10 feet of vehicle length, plus one more second if over 40 mph. For a 60-foot vehicle at highway speed: 6+1 = 7 seconds.",
      difficulty: "medium",
      answers: [
        { text: "One second per 10 feet of vehicle length, plus one extra second over 40 mph", isCorrect: true },
        { text: "Always 3 seconds regardless of speed", isCorrect: false },
        { text: "5 seconds for all CMVs", isCorrect: false },
        { text: "One second per 10 feet only when raining", isCorrect: false },
      ],
    },
    {
      text: "What causes loss of traction known as 'black ice'?",
      explanation: "Black ice is a thin, nearly invisible coating of ice on the road surface. It often forms when temperatures are around 32°F and there is moisture, making the road look merely wet.",
      difficulty: "medium",
      answers: [
        { text: "A thin invisible layer of ice that makes the road look wet", isCorrect: true },
        { text: "Snow packed by traffic into a black surface", isCorrect: false },
        { text: "Oil leaking from vehicles ahead onto the road", isCorrect: false },
        { text: "Rain freezing on contact with warm pavement", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you become drowsy while driving?",
      explanation: "Stop and get adequate sleep. Opening windows, drinking coffee, or turning up the radio are only short-term remedies that do not eliminate the danger of drowsy driving.",
      difficulty: "easy",
      answers: [
        { text: "Stop driving and get adequate sleep", isCorrect: true },
        { text: "Open the window and drink coffee to stay awake", isCorrect: false },
        { text: "Turn up the radio and drive faster to reach your destination sooner", isCorrect: false },
        { text: "Chew gum to help you focus", isCorrect: false },
      ],
    },
  ]);

  // GK-TC — Transporting Cargo (4 questions)
  await seedQuestions(sec["GK-TC"].id, [
    {
      text: "How often must you check cargo securement after beginning a trip?",
      explanation: "You must inspect cargo and securement within the first 50 miles and then every 3 hours or 150 miles, whichever comes first, and after any break you take.",
      difficulty: "medium",
      answers: [
        { text: "Within 50 miles, then every 3 hours or 150 miles, and after each break", isCorrect: true },
        { text: "Only at the start of the trip and at delivery", isCorrect: false },
        { text: "Every 100 miles regardless of breaks", isCorrect: false },
        { text: "Once per day", isCorrect: false },
      ],
    },
    {
      text: "What is the maximum legal gross weight for a truck-tractor/semi-trailer combination on an Interstate highway?",
      explanation: "The maximum gross vehicle weight on the Interstate is 80,000 pounds. Individual axle limits also apply (20,000 lb steer, 34,000 lb tandem).",
      difficulty: "easy",
      answers: [
        { text: "80,000 pounds", isCorrect: true },
        { text: "73,280 pounds", isCorrect: false },
        { text: "100,000 pounds", isCorrect: false },
        { text: "65,000 pounds", isCorrect: false },
      ],
    },
    {
      text: "What does 'front-loading' cargo mean and why is it important?",
      explanation: "Front-loading means placing heavier cargo toward the front of the trailer. This helps keep the center of gravity low and forward, which improves handling and reduces the risk of trailer sway.",
      difficulty: "medium",
      answers: [
        { text: "Placing heavier items forward to keep weight over the drive axles and improve stability", isCorrect: true },
        { text: "Loading cargo from the front doors of the trailer for faster access", isCorrect: false },
        { text: "Distributing all weight equally from front to back", isCorrect: false },
        { text: "Keeping all load weight at the rear for better braking", isCorrect: false },
      ],
    },
    {
      text: "Which of the following cargo is most likely to shift and require special attention?",
      explanation: "Liquids, loose grains, and bulk materials can shift in transit, changing the vehicle's center of gravity. These require securement or proper containment.",
      difficulty: "medium",
      answers: [
        { text: "Bulk liquids or loose grain", isCorrect: true },
        { text: "Palletized boxes strapped with steel banding", isCorrect: false },
        { text: "Bagged cement on flat pallets", isCorrect: false },
        { text: "Assembled machinery bolted to the trailer floor", isCorrect: false },
      ],
    },
  ]);

  // GK-HM — Hazardous Materials (3 questions)
  await seedQuestions(sec["GK-HM"].id, [
    {
      text: "What is a 'forbidden' material in HazMat regulations?",
      explanation: "Forbidden materials are those so dangerous that they may never be transported by any means. Examples include certain explosives that are too unstable to move safely.",
      difficulty: "hard",
      answers: [
        { text: "A material so dangerous it may never be offered for transport", isCorrect: true },
        { text: "Any material that requires a placard", isCorrect: false },
        { text: "A material banned only on passenger aircraft", isCorrect: false },
        { text: "Any Class 7 radioactive material", isCorrect: false },
      ],
    },
    {
      text: "When must shipping papers for hazardous materials be within reach of the driver?",
      explanation: "HazMat shipping papers must be kept within reach while the driver is behind the wheel and in a pouch on the driver's door or clearly visible on the seat when the driver is out of the cab.",
      difficulty: "medium",
      answers: [
        { text: "Within reach when driving; on the seat or in door pouch when out of the cab", isCorrect: true },
        { text: "Only at pick-up and delivery", isCorrect: false },
        { text: "In the glove box at all times", isCorrect: false },
        { text: "Secured in the trailer with the load", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the Emergency Response Guidebook (ERG)?",
      explanation: "The ERG helps emergency responders identify hazardous materials involved in an accident and provides guidance on how to safely respond and protect the public.",
      difficulty: "medium",
      answers: [
        { text: "To help emergency responders identify HazMat and respond safely to accidents", isCorrect: true },
        { text: "To list the fastest routes for HazMat vehicles", isCorrect: false },
        { text: "To document driver certification for HazMat endorsements", isCorrect: false },
        { text: "To calculate proper placard sizes for loads", isCorrect: false },
      ],
    },
  ]);

  // AB-SYS — Air Brakes System (4 questions)
  await seedQuestions(sec["AB-SYS"].id, [
    {
      text: "What is the purpose of the safety relief valve in an air brake system?",
      explanation: "The safety relief valve opens at around 150 psi to protect the tanks and air lines from damage if the air compressor unloader fails to work properly.",
      difficulty: "medium",
      answers: [
        { text: "To release excess air if pressure exceeds ~150 psi and protect the system", isCorrect: true },
        { text: "To drain moisture from the air tanks automatically", isCorrect: false },
        { text: "To signal the driver when pressure is too low", isCorrect: false },
        { text: "To keep the trailer brakes applied when pressure drops", isCorrect: false },
      ],
    },
    {
      text: "What does the alcohol evaporator do in an air brake system?",
      explanation: "The alcohol evaporator puts alcohol into the air system to help prevent moisture from freezing in the valves and lines during cold weather.",
      difficulty: "medium",
      answers: [
        { text: "It adds alcohol to prevent moisture from freezing in cold weather", isCorrect: true },
        { text: "It removes alcohol contamination from the air supply", isCorrect: false },
        { text: "It lubricates the brake chambers with alcohol-based fluid", isCorrect: false },
        { text: "It evaporates water before it enters the air compressor", isCorrect: false },
      ],
    },
    {
      text: "What is the function of the brake chambers in an air brake system?",
      explanation: "Brake chambers convert air pressure into mechanical force to push the brake shoes against the drums (or pads against rotors) to slow or stop the vehicle.",
      difficulty: "easy",
      answers: [
        { text: "To convert air pressure into mechanical force that applies the brakes", isCorrect: true },
        { text: "To store compressed air for brake applications", isCorrect: false },
        { text: "To measure air pressure and display it on the dashboard gauge", isCorrect: false },
        { text: "To automatically adjust brake slack", isCorrect: false },
      ],
    },
    {
      text: "How does the dual air brake system protect you if one system fails?",
      explanation: "A dual air brake system has two separate air systems. If one side fails, the other still has enough air pressure to stop the vehicle, so you can stop safely even with a failure in one circuit.",
      difficulty: "medium",
      answers: [
        { text: "The other system still has enough pressure to stop the vehicle safely", isCorrect: true },
        { text: "The vehicle automatically switches to hydraulic backup brakes", isCorrect: false },
        { text: "Spring brakes apply immediately in all wheels simultaneously", isCorrect: false },
        { text: "An alarm sounds but the vehicle cannot be stopped until repaired", isCorrect: false },
      ],
    },
  ]);

  // AB-USE — Air Brakes Usage (3 questions)
  await seedQuestions(sec["AB-USE"].id, [
    {
      text: "What is 'fanning' the brakes and why should you avoid it on a long downgrade?",
      explanation: "Fanning means rapidly applying and releasing the brakes. This can deplete air pressure faster than it can be replenished and may leave you without brakes on a long downgrade.",
      difficulty: "hard",
      answers: [
        { text: "Rapidly tapping brakes depletes air pressure and should not be done on long downgrades", isCorrect: true },
        { text: "Fanning helps cool the brake drums — it is recommended on downgrades", isCorrect: false },
        { text: "Fanning means steering side to side to slow momentum", isCorrect: false },
        { text: "Fanning only applies to hydraulic brakes, not air brakes", isCorrect: false },
      ],
    },
    {
      text: "Before starting an air brake leak test, to what pressure should you build up the air system?",
      explanation: "Build the system to governor cut-out pressure (typically 120–125 psi), then shut the engine off and time the pressure drop. The drop should not exceed 2 psi per minute for single vehicles.",
      difficulty: "medium",
      answers: [
        { text: "Governor cut-out pressure (about 120–125 psi)", isCorrect: true },
        { text: "100 psi exactly", isCorrect: false },
        { text: "At least 60 psi", isCorrect: false },
        { text: "Any pressure above 80 psi", isCorrect: false },
      ],
    },
    {
      text: "What is the maximum pressure loss allowed during a static leak test for a combination vehicle (tractor-trailer)?",
      explanation: "For a combination vehicle, the maximum allowable pressure drop is 3 psi per minute. Anything more indicates a leak that must be repaired before driving.",
      difficulty: "medium",
      answers: [
        { text: "3 psi per minute", isCorrect: true },
        { text: "2 psi per minute", isCorrect: false },
        { text: "5 psi per minute", isCorrect: false },
        { text: "10 psi per minute", isCorrect: false },
      ],
    },
  ]);

  // COMB — Combination Vehicles (3 questions)
  await seedQuestions(sec["COMB"].id, [
    {
      text: "What happens if you turn too sharply while backing a trailer?",
      explanation: "Turning too sharply causes the trailer to 'jackknife' (fold at the hitch point) or damages the trailer's rear corner against the cab — both dangerous situations.",
      difficulty: "medium",
      answers: [
        { text: "The trailer can jackknife or damage the cab and trailer", isCorrect: true },
        { text: "The trailer will automatically straighten itself out", isCorrect: false },
        { text: "The rear trailer brakes lock up and the trailer stops", isCorrect: false },
        { text: "The fifth wheel pin will break under pressure", isCorrect: false },
      ],
    },
    {
      text: "What does it mean when the trailer brakes are applied by the hand valve (trolley valve) alone?",
      explanation: "The hand valve (trolley valve) operates only the trailer brakes. It is used to test trailer brakes, but should not be used for normal stopping — the foot pedal applies all brakes.",
      difficulty: "medium",
      answers: [
        { text: "Only the trailer brakes apply — not the tractor brakes", isCorrect: true },
        { text: "All vehicle brakes apply simultaneously", isCorrect: false },
        { text: "Only the rear trailer axle brakes apply", isCorrect: false },
        { text: "The spring brakes are released", isCorrect: false },
      ],
    },
    {
      text: "Why must the trailer emergency brakes be set before disconnecting the air lines from a trailer?",
      explanation: "If you disconnect the emergency (supply) air line first with the trailer brakes not set, the trailer could roll away since the spring brakes will not apply until air pressure is lost.",
      difficulty: "hard",
      answers: [
        { text: "To prevent the trailer from rolling away after the air lines are disconnected", isCorrect: true },
        { text: "To test that the emergency system works before uncoupling", isCorrect: false },
        { text: "To release any pressure remaining in the air lines", isCorrect: false },
        { text: "Required by law but has no safety purpose", isCorrect: false },
      ],
    },
  ]);

  // HM — HazMat (3 questions)
  await seedQuestions(sec["HM"].id, [
    {
      text: "What does 'compatibility' mean for hazardous materials?",
      explanation: "Compatibility means that different HazMat can be transported together without reacting dangerously. Certain HazMat must not be loaded together because they can cause fire, explosion, or poisonous gas when mixed.",
      difficulty: "hard",
      answers: [
        { text: "Whether two HazMat can be safely transported together without reacting dangerously", isCorrect: true },
        { text: "Whether a hazmat vehicle meets the size requirements for a load", isCorrect: false },
        { text: "Whether the driver's license class is appropriate for the shipment", isCorrect: false },
        { text: "Whether the shipping papers match the labels on the packages", isCorrect: false },
      ],
    },
    {
      text: "What is a cargo tank?",
      explanation: "A cargo tank is a bulk packaging permanently attached to a vehicle, used to transport liquids, gases, or solids. Examples include tank trucks for fuel, chemicals, and food-grade liquids.",
      difficulty: "easy",
      answers: [
        { text: "A bulk container permanently attached to a vehicle for transporting liquids or gases", isCorrect: true },
        { text: "Any trailer used to carry HazMat regardless of container type", isCorrect: false },
        { text: "A portable tank used to move materials between facilities", isCorrect: false },
        { text: "A drum or tote secured inside a flatbed trailer", isCorrect: false },
      ],
    },
    {
      text: "When is a CDL HazMat endorsement NOT required?",
      explanation: "A HazMat endorsement is not required if the material requires no placards. Small quantities that do not trigger placarding requirements do not require the endorsement.",
      difficulty: "medium",
      answers: [
        { text: "When the quantity transported does not require a placard", isCorrect: true },
        { text: "When the material is classified as non-toxic", isCorrect: false },
        { text: "When driving less than 50 miles", isCorrect: false },
        { text: "When the driver has more than 5 years of experience", isCorrect: false },
      ],
    },
  ]);

  // PASS — Passenger Vehicles (3 questions)
  await seedQuestions(sec["PASS"].id, [
    {
      text: "What is the correct procedure at a railroad crossing when driving a bus?",
      explanation: "Unless the crossing is exempt, you must stop 15 to 50 feet before the crossing, open the door and listen, then proceed only when safe. You should not change gears while crossing the tracks.",
      difficulty: "medium",
      answers: [
        { text: "Stop 15–50 feet before the tracks, open door and listen, cross without shifting gears", isCorrect: true },
        { text: "Slow to 15 mph and proceed if no signal is active", isCorrect: false },
        { text: "Stop only when lights are flashing or a gate is down", isCorrect: false },
        { text: "Cross quickly to spend minimal time on the tracks", isCorrect: false },
      ],
    },
    {
      text: "What should you do if a passenger refuses to follow the rules on your bus?",
      explanation: "If a passenger becomes unruly or refuses to follow rules, you should discharge the passenger only at a safe location — never in the middle of traffic or in an unsafe area.",
      difficulty: "medium",
      answers: [
        { text: "Discharge the passenger only at a safe location", isCorrect: true },
        { text: "Stop immediately wherever you are and order the passenger off", isCorrect: false },
        { text: "Call the police but continue driving until they meet you", isCorrect: false },
        { text: "Ignore the passenger and continue to your destination", isCorrect: false },
      ],
    },
    {
      text: "What is the maximum number of standees allowed on an intercity bus?",
      explanation: "No standees are allowed on an intercity bus. All passengers must be seated. Standing passengers are only permitted on transit buses designed and marked for standees.",
      difficulty: "easy",
      answers: [
        { text: "Zero — no standees are permitted on intercity buses", isCorrect: true },
        { text: "Up to 10% of seated capacity", isCorrect: false },
        { text: "A number equal to the number of emergency exits", isCorrect: false },
        { text: "Up to 5 standees in the aisle", isCorrect: false },
      ],
    },
  ]);

  // TANK — Tank Vehicles (3 questions)
  await seedQuestions(sec["TANK"].id, [
    {
      text: "What is 'outage' (or ullage) in tank vehicles?",
      explanation: "Outage is the space left in a tank that is not filled with liquid. Some liquids expand when heated, so tanks must not be completely filled — outage allows room for expansion.",
      difficulty: "hard",
      answers: [
        { text: "Space left unfilled to allow liquid to expand when heated", isCorrect: true },
        { text: "The total weight capacity of the tank minus the tare weight", isCorrect: false },
        { text: "The difference between the rated and actual pressure in the tank", isCorrect: false },
        { text: "The overflow system that drains excess liquid automatically", isCorrect: false },
      ],
    },
    {
      text: "Why are smooth bore tanks more dangerous than tanks with internal baffles?",
      explanation: "Smooth bore tanks have no baffles inside, so liquid can surge forward and back with full force, making it much harder to control the vehicle, especially during braking or acceleration.",
      difficulty: "hard",
      answers: [
        { text: "Liquid surges with full force fore and aft, making the vehicle harder to control", isCorrect: true },
        { text: "They are heavier and raise the center of gravity", isCorrect: false },
        { text: "They require special corrosion-resistant materials that are weaker", isCorrect: false },
        { text: "Smooth bore tanks can only carry one type of liquid safely", isCorrect: false },
      ],
    },
    {
      text: "What special concern does a partially filled tank create compared to a full tank?",
      explanation: "A partially filled (liquid) tank has free liquid movement (surge), which can push the vehicle in unexpected directions. A full tank has no surge; an empty tank has minimal weight issues.",
      difficulty: "medium",
      answers: [
        { text: "Free liquid surge that can push the vehicle in unexpected directions", isCorrect: true },
        { text: "A partial tank is always safer because it is lighter", isCorrect: false },
        { text: "Partial tanks require the driver to keep speed above 45 mph to prevent sloshing", isCorrect: false },
        { text: "Partial tanks must have extra placards applied to all four sides", isCorrect: false },
      ],
    },
  ]);

  // Update section question counts
  const allSections = await prisma.section.findMany({ include: { _count: { select: { questions: true } } } });
  for (const s of allSections) {
    await prisma.section.update({ where: { id: s.id }, data: { questionCount: s._count.questions } });
  }

  const total = await prisma.question.count();
  console.log("✅ Batch 3 questions added and counts updated!");
  console.log(`🎉 Total questions in database: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
