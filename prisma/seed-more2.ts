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
  console.log("🌱 Seeding additional CDL questions (batch 2)...");

  const sections = await prisma.section.findMany({ include: { test: true } });
  const sec = Object.fromEntries(sections.map((s) => [s.code, s]));

  // ── GENERAL KNOWLEDGE: Vehicle Inspection (GK-VI) ────────────────────────

  await seedQuestions(sec["GK-VI"].id, [
    {
      text: "What is the correct minimum tread depth for tires on the drive axles?",
      explanation: "Drive axle tires (and all tires except steering axles) require a minimum tread depth of 2/32 inch. Steering axle tires require a higher minimum of 4/32 inch because they directly control vehicle direction.",
      difficulty: "medium",
      answers: [
        { text: "2/32 inch", isCorrect: true },
        { text: "4/32 inch", isCorrect: false },
        { text: "1/32 inch", isCorrect: false },
        { text: "1/8 inch", isCorrect: false },
      ],
    },
    {
      text: "Which of the following is NOT checked during the 'in-cab' portion of a pre-trip inspection?",
      explanation: "The in-cab check covers all gauges, warning lights, mirrors, seatbelts, fire extinguisher, emergency equipment, horn, wipers, heater/defroster, and lights. Checking the trailer coupling (fifth wheel) is an exterior inspection item, not an in-cab item.",
      difficulty: "medium",
      answers: [
        { text: "The condition of the fifth wheel coupling", isCorrect: true },
        { text: "Oil pressure gauge", isCorrect: false },
        { text: "Horn operation", isCorrect: false },
        { text: "Safety equipment like fire extinguisher and reflective triangles", isCorrect: false },
      ],
    },
    {
      text: "How do you check the power steering fluid level?",
      explanation: "Power steering fluid is checked by locating the power steering fluid reservoir (usually near the engine) and checking the level against the markings on the reservoir or dipstick. The fluid should be within the acceptable range when the engine is at operating temperature.",
      difficulty: "easy",
      answers: [
        { text: "Check the reservoir level against the markings on the cap or dipstick", isCorrect: true },
        { text: "Turn the steering wheel all the way left and right and listen for grinding", isCorrect: false },
        { text: "Power steering is sealed and never needs checking", isCorrect: false },
        { text: "Check only after driving 50 miles to allow the fluid to circulate", isCorrect: false },
      ],
    },
    {
      text: "Which of these would be a reason to put a vehicle 'out of service' during inspection?",
      explanation: "Out-of-service criteria include: any brake adjustment or component defect, tires with less than minimum tread depth, broken or cracked wheel or rim, fuel leaks, broken steering components, inoperative headlights at night, and many other serious safety defects.",
      difficulty: "medium",
      answers: [
        { text: "A cracked wheel rim on any axle", isCorrect: true },
        { text: "A slightly dirty air filter that does not restrict airflow", isCorrect: false },
        { text: "An air freshener hanging from the mirror", isCorrect: false },
        { text: "A minor scratch on the exterior paint", isCorrect: false },
      ],
    },
    {
      text: "When checking the exhaust system during pre-trip, you should look for:",
      explanation: "The exhaust system must be checked for loose, broken, or missing parts, and for any signs of leaks such as carbon buildup or soot. Exhaust leaks can allow deadly carbon monoxide gas to enter the cab.",
      difficulty: "easy",
      answers: [
        { text: "Loose or broken parts, and signs of leaks such as soot or carbon buildup", isCorrect: true },
        { text: "The exhaust color only — black smoke means a bad engine", isCorrect: false },
        { text: "Whether the exhaust pipe is pointed away from traffic", isCorrect: false },
        { text: "The exhaust system does not need checking during a pre-trip inspection", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of checking the fifth wheel during a pre-trip inspection?",
      explanation: "The fifth wheel must be checked to ensure it is properly mounted and secured to the tractor frame, that the locking jaws are fully closed around the kingpin, and that there is no visible damage. A defective fifth wheel can cause trailer separation at highway speed.",
      difficulty: "medium",
      answers: [
        { text: "To ensure the fifth wheel is properly mounted, undamaged, and the locking jaws are closed", isCorrect: true },
        { text: "To measure the height of the fifth wheel above the ground", isCorrect: false },
        { text: "To check that the fifth wheel is greased only — no structural check is needed", isCorrect: false },
        { text: "To verify the trailer VIN number matches the paperwork", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Driving Safely (GK-DS) ────────────────────────────

  await seedQuestions(sec["GK-DS"].id, [
    {
      text: "What is the best way to take a curve in a large truck?",
      explanation: "You should slow down BEFORE the curve, not during it. Braking in a curve is dangerous because it can cause the vehicle to skid or tip over. Once you are in the curve at the correct speed, you can gently accelerate through it.",
      difficulty: "medium",
      answers: [
        { text: "Slow down before the curve, then gently accelerate through it", isCorrect: true },
        { text: "Maintain highway speed and brake gradually through the curve", isCorrect: false },
        { text: "Brake heavily in the middle of the curve to maintain control", isCorrect: false },
        { text: "Increase speed through the curve to maintain momentum", isCorrect: false },
      ],
    },
    {
      text: "When making a right turn with a long vehicle, you should:",
      explanation: "When making a right turn, swing wide to the left first if necessary to provide room for the rear of the trailer to clear the right curb. Watch your mirrors for the trailer wheels. Never swing left first as a signal to other drivers — they may try to pass on the right.",
      difficulty: "medium",
      answers: [
        { text: "Turn wide enough so rear wheels clear the curb, watching mirrors the entire time", isCorrect: true },
        { text: "Swing far left first to signal other drivers, then turn right", isCorrect: false },
        { text: "Make the turn as tight as possible to stay in your lane", isCorrect: false },
        { text: "Stop completely before any right turn and wait for all traffic to clear", isCorrect: false },
      ],
    },
    {
      text: "What is the effect of driving too fast for conditions — even if under the posted speed limit?",
      explanation: "Speed limits are set for ideal conditions. Driving at the posted speed limit in rain, fog, snow, ice, heavy traffic, or on sharp curves may still be too fast. 'Driving too fast for conditions' can result in loss of control even when technically legal.",
      difficulty: "easy",
      answers: [
        { text: "It can still result in loss of control and crashes even though the speed is legal", isCorrect: true },
        { text: "It is always safe if you are at or below the posted speed limit", isCorrect: false },
        { text: "You cannot be cited for driving too fast if under the speed limit", isCorrect: false },
        { text: "It only matters on highways, not on city streets", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you are being tailgated by another vehicle?",
      explanation: "If you are being tailgated, increase your following distance from the vehicle ahead. This gives you more stopping room and time, reducing the chance of a sudden stop that could cause the tailgater to rear-end you. Do not brake suddenly or speed up.",
      difficulty: "easy",
      answers: [
        { text: "Increase your following distance ahead to give yourself more room to stop gradually", isCorrect: true },
        { text: "Speed up to create distance between yourself and the tailgater", isCorrect: false },
        { text: "Tap the brakes repeatedly to warn the tailgater", isCorrect: false },
        { text: "Move to the right lane and let the tailgater pass, then stop for a break", isCorrect: false },
      ],
    },
    {
      text: "When should you use your vehicle's emergency flashers (hazard lights)?",
      explanation: "Emergency flashers should be used when your vehicle is stopped or moving very slowly and could be a hazard to other drivers — such as when pulled over on the shoulder, stopped in traffic due to breakdown, or driving very slowly. Check local laws as some states restrict use while moving.",
      difficulty: "easy",
      answers: [
        { text: "When stopped or moving very slowly and posing a hazard to other traffic", isCorrect: true },
        { text: "Whenever driving in rain or fog to increase visibility", isCorrect: false },
        { text: "Only when completely stopped — never while moving", isCorrect: false },
        { text: "Any time you feel unsafe, regardless of speed or conditions", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of placing warning devices (triangles/flares) behind a stopped truck?",
      explanation: "Warning devices alert approaching drivers that a vehicle is stopped ahead, giving them time to slow down and move over. Federal law requires placing warning devices within 10 minutes of stopping on any road with a speed limit over 35 mph.",
      difficulty: "easy",
      answers: [
        { text: "To warn approaching drivers of the stopped vehicle and give them time to react", isCorrect: true },
        { text: "To mark the boundaries of an accident scene for police", isCorrect: false },
        { text: "Only required when stopped in a construction zone", isCorrect: false },
        { text: "Required only at night — not needed during daytime stops", isCorrect: false },
      ],
    },
    {
      text: "Under normal highway conditions, you should look how far ahead while driving?",
      explanation: "You should look at least 12–15 seconds ahead on the highway (about 1/4 mile at 60 mph). This gives you time to identify and respond to hazards. Looking far ahead also helps you drive more smoothly with fewer sudden stops or lane changes.",
      difficulty: "medium",
      answers: [
        { text: "12–15 seconds ahead — about 1/4 mile at highway speeds", isCorrect: true },
        { text: "3–4 seconds ahead — the same as following distance", isCorrect: false },
        { text: "Just beyond the front of your vehicle to watch for road hazards", isCorrect: false },
        { text: "30 seconds ahead, which is about 1/2 mile at highway speed", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Transporting Cargo (GK-TC) ────────────────────────

  await seedQuestions(sec["GK-TC"].id, [
    {
      text: "Which of the following cargo does NOT need to be secured with tie-downs?",
      explanation: "Cargo that is completely contained within a sided vehicle (like a box truck with walls taller than the cargo) does not need additional tie-downs, because the walls prevent the cargo from falling off. Open flatbed trailers always require tie-downs.",
      difficulty: "medium",
      answers: [
        { text: "Cargo that fits completely within a fully enclosed sided vehicle", isCorrect: true },
        { text: "Cargo on a flatbed trailer that weighs less than 500 lbs", isCorrect: false },
        { text: "Cargo wrapped in plastic wrap only", isCorrect: false },
        { text: "Any cargo under 5 feet in length", isCorrect: false },
      ],
    },
    {
      text: "What is 'center of gravity' and why does it matter?",
      explanation: "The center of gravity is the point where the vehicle's weight is balanced. The higher the center of gravity, the more likely the vehicle is to tip over in a curve. Loading heavy cargo low keeps the center of gravity low and makes the vehicle more stable.",
      difficulty: "easy",
      answers: [
        { text: "The balance point of the vehicle's weight — higher means more rollover risk", isCorrect: true },
        { text: "The midpoint of the vehicle measured front to back", isCorrect: false },
        { text: "The point directly under the driver's seat", isCorrect: false },
        { text: "The geometric center of the trailer floor", isCorrect: false },
      ],
    },
    {
      text: "Cargo overhang at the rear of a flatbed trailer must be marked when it extends beyond:",
      explanation: "Any cargo overhang beyond 4 feet past the rear of the vehicle must be marked with a red flag (daytime) or red light/reflectors (nighttime). This warns other drivers of the extended load.",
      difficulty: "medium",
      answers: [
        { text: "4 feet past the rear of the vehicle", isCorrect: true },
        { text: "2 feet past the rear of the vehicle", isCorrect: false },
        { text: "6 feet past the rear of the vehicle", isCorrect: false },
        { text: "Any amount of overhang must always be marked", isCorrect: false },
      ],
    },
    {
      text: "What is the maximum legal width for most commercial vehicles without a special permit?",
      explanation: "Federal law limits vehicle width to 102 inches (8.5 feet) on interstate highways. Some states allow 96 inches (8 feet) on state roads. Wider loads require oversize/overweight permits and may require escort vehicles.",
      difficulty: "medium",
      answers: [
        { text: "102 inches (8.5 feet)", isCorrect: true },
        { text: "120 inches (10 feet)", isCorrect: false },
        { text: "96 inches (8 feet)", isCorrect: false },
        { text: "144 inches (12 feet)", isCorrect: false },
      ],
    },
    {
      text: "When hauling livestock, why is it important to allow for the animals' movement?",
      explanation: "Livestock shift their weight and move around during transport, which changes the vehicle's center of gravity unpredictably — similar to liquid surge in a tanker. Drivers must allow extra following distance and make slow, smooth turns to account for this shifting weight.",
      difficulty: "medium",
      answers: [
        { text: "Animals shift weight unpredictably, changing the vehicle's balance like liquid surge", isCorrect: true },
        { text: "Livestock movement is only a concern for the animals' welfare, not vehicle safety", isCorrect: false },
        { text: "Animal movement reduces vehicle weight and improves fuel efficiency", isCorrect: false },
        { text: "Only matters when transporting more than 20 animals at a time", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: HazMat Basics (GK-HM) ─────────────────────────────

  await seedQuestions(sec["GK-HM"].id, [
    {
      text: "Which class of hazardous material is most likely to cause a person to stop breathing?",
      explanation: "Class 2 Division 2.3 (Poison Gas) is the class most dangerous to breathing. These gases are toxic when inhaled and can quickly cause unconsciousness and death. Examples include chlorine, ammonia, and hydrogen cyanide.",
      difficulty: "medium",
      answers: [
        { text: "Class 2, Division 2.3 — Poison Gas", isCorrect: true },
        { text: "Class 3 — Flammable Liquid", isCorrect: false },
        { text: "Class 8 — Corrosive", isCorrect: false },
        { text: "Class 9 — Miscellaneous", isCorrect: false },
      ],
    },
    {
      text: "Where must hazardous materials labels be placed on a package?",
      explanation: "HazMat labels must be placed on the same surface of the package as the proper shipping name and identification number markings. If the package is too small, labels may be attached with a tag. Labels must be clearly visible.",
      difficulty: "medium",
      answers: [
        { text: "On the same side of the package as the proper shipping name and ID number", isCorrect: true },
        { text: "On the top of every package regardless of size", isCorrect: false },
        { text: "On the shipping document only — not required on every package", isCorrect: false },
        { text: "Labels are only required on the outer container, not individual packages inside", isCorrect: false },
      ],
    },
    {
      text: "What should you do if you are involved in a HazMat accident and people are injured?",
      explanation: "In a HazMat accident with injuries: (1) Call 911 immediately, (2) Keep bystanders away and upwind, (3) Identify the material using placards and shipping papers, (4) Do not attempt to treat victims unless trained — some HazMat requires specific antidotes or decontamination. Let emergency responders take over.",
      difficulty: "medium",
      answers: [
        { text: "Call 911, keep people upwind and away, and let trained emergency responders handle treatment", isCorrect: true },
        { text: "Administer first aid to all injured parties immediately", isCorrect: false },
        { text: "Move injured victims away from the scene before calling for help", isCorrect: false },
        { text: "Continue to your destination and report the accident from there", isCorrect: false },
      ],
    },
    {
      text: "A 'reportable quantity' (RQ) on a shipping paper means:",
      explanation: "RQ means the shipment contains a material in a quantity that, if spilled or released, must be reported to the National Response Center. The shipper is required to mark 'RQ' next to the proper shipping name on the shipping paper.",
      difficulty: "hard",
      answers: [
        { text: "The shipment contains a material that must be reported to authorities if spilled", isCorrect: true },
        { text: "The shipment exceeds the maximum legal quantity for that material", isCorrect: false },
        { text: "The receiver must sign for the quantity at delivery", isCorrect: false },
        { text: "The quantity requires a special route permit from the state", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: System (AB-SYS) ──────────────────────────────────────────

  await seedQuestions(sec["AB-SYS"].id, [
    {
      text: "What is the purpose of the air dryer in an air brake system?",
      explanation: "The air dryer removes moisture and oil from the compressed air before it enters the storage tanks. This prevents water accumulation in the tanks and lines, which could freeze in cold weather and cause brake failure. Air dryers are more efficient than manual draining but still require periodic maintenance.",
      difficulty: "medium",
      answers: [
        { text: "To remove moisture and oil from compressed air before it reaches the storage tanks", isCorrect: true },
        { text: "To cool the air after compression to reduce tank pressure", isCorrect: false },
        { text: "To filter out dust and particles from the air intake", isCorrect: false },
        { text: "To maintain a constant humidity level inside the brake chambers", isCorrect: false },
      ],
    },
    {
      text: "S-cam brakes work by:",
      explanation: "S-cam drum brakes use an S-shaped cam that rotates when the brake is applied. As the cam turns, it pushes the brake shoes outward against the drum. The 'S' shape provides a mechanical advantage that amplifies the force from the air brake chamber.",
      difficulty: "hard",
      answers: [
        { text: "Rotating an S-shaped cam that pushes brake shoes outward against the drum", isCorrect: true },
        { text: "Using hydraulic fluid pressure to squeeze brake pads against a rotor", isCorrect: false },
        { text: "Applying direct air pressure to the brake drum surface", isCorrect: false },
        { text: "Squeezing the axle to slow rotation through friction", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the tractor protection valve?",
      explanation: "The tractor protection valve protects the tractor's air supply if the trailer breaks away or develops a major air leak. It closes automatically when trailer air pressure drops below about 20–45 psi, preventing the tractor from losing all its air pressure and maintaining the tractor's brakes.",
      difficulty: "medium",
      answers: [
        { text: "To close automatically and protect the tractor's air supply if the trailer air line fails", isCorrect: true },
        { text: "To prevent the trailer brakes from locking up during normal stops", isCorrect: false },
        { text: "To regulate the air pressure delivered to the trailer brakes", isCorrect: false },
        { text: "To prevent moisture from entering the trailer air lines", isCorrect: false },
      ],
    },
    {
      text: "Which color is the emergency (supply) air line from tractor to trailer?",
      explanation: "By convention and federal regulation, the emergency (supply) air line glad hand is RED, and the service (control) air line glad hand is BLUE. The emergency line supplies air to the trailer tanks and controls the trailer emergency brakes.",
      difficulty: "easy",
      answers: [
        { text: "Red", isCorrect: true },
        { text: "Blue", isCorrect: false },
        { text: "Yellow", isCorrect: false },
        { text: "Green", isCorrect: false },
      ],
    },
    {
      text: "What happens when air pressure in the system rises above the cut-out pressure?",
      explanation: "When air pressure reaches the governor's cut-out pressure (typically around 125 psi), the governor signals the compressor to unload (stop compressing air). The compressor continues to run but pumps air back to the inlet rather than into the tanks. This protects the system from over-pressurization.",
      difficulty: "medium",
      answers: [
        { text: "The governor unloads the compressor, stopping air from being added to the tanks", isCorrect: true },
        { text: "The safety relief valve opens to release excess pressure", isCorrect: false },
        { text: "The brakes apply automatically to use up the excess pressure", isCorrect: false },
        { text: "The engine automatically reduces RPM to slow the compressor", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: Using (AB-USE) ────────────────────────────────────────────

  await seedQuestions(sec["AB-USE"].id, [
    {
      text: "What is 'controlled braking' and when should you use it?",
      explanation: "Controlled braking means applying brakes as hard as possible without locking the wheels. You maintain steering control throughout. Use it in emergencies when you need to stop quickly but also need to steer around an obstacle. If wheels lock, release slightly and reapply.",
      difficulty: "medium",
      answers: [
        { text: "Applying maximum braking force without locking wheels, keeping steering control", isCorrect: true },
        { text: "Lightly tapping the brakes repeatedly to prevent any wheel lockup", isCorrect: false },
        { text: "Using only the trailer brakes to stop without jackknifing", isCorrect: false },
        { text: "Applying a set amount of brake pressure regardless of conditions", isCorrect: false },
      ],
    },
    {
      text: "After starting the engine, about how long should you wait before driving to allow air pressure to build?",
      explanation: "Before driving, air pressure must build to the normal operating range (at least 100 psi). This typically takes several minutes with the engine at normal idle. Do not move the vehicle until air pressure is adequate — otherwise the spring brakes may not fully release or braking ability will be reduced.",
      difficulty: "medium",
      answers: [
        { text: "Until air pressure builds to at least 100 psi in the normal operating range", isCorrect: true },
        { text: "About 30 seconds is always sufficient regardless of pressure readings", isCorrect: false },
        { text: "No waiting is needed — air brakes work immediately on engine start", isCorrect: false },
        { text: "Wait exactly 5 minutes regardless of what the pressure gauge shows", isCorrect: false },
      ],
    },
    {
      text: "If the low air pressure warning activates and you cannot safely stop immediately, you should:",
      explanation: "If you cannot stop immediately when the warning activates, slow down and look for a safe place to stop right away. Do NOT continue driving normally — the spring brakes will engage automatically in about 20 seconds or less once pressure drops below 20–45 psi.",
      difficulty: "medium",
      answers: [
        { text: "Slow down immediately and find a safe place to stop as quickly as possible", isCorrect: true },
        { text: "Increase speed to reach your destination before the brakes fail", isCorrect: false },
        { text: "Continue at normal speed — the warning activates at a safe pressure level", isCorrect: false },
        { text: "Call dispatch for instructions before taking any action", isCorrect: false },
      ],
    },
    {
      text: "What does it mean when the spring brakes 'pop on' unexpectedly while driving?",
      explanation: "If the spring brakes engage unexpectedly while driving, it means air pressure has dropped below the threshold (20–45 psi) that holds them off. This is a serious brake system failure. The vehicle will come to an abrupt stop. Never try to drive with spring brakes applied — get the vehicle off the road immediately.",
      difficulty: "hard",
      answers: [
        { text: "Air pressure has dropped critically low, causing a serious brake system failure", isCorrect: true },
        { text: "A normal function that happens when the vehicle stops on a hill", isCorrect: false },
        { text: "The parking brake lever was accidentally bumped", isCorrect: false },
        { text: "The brakes need adjustment and are automatically self-correcting", isCorrect: false },
      ],
    },
  ]);

  // ── COMBINATION VEHICLES (COMB) ───────────────────────────────────────────

  await seedQuestions(sec["COMB"].id, [
    {
      text: "The service air line (blue) in a tractor-trailer does what?",
      explanation: "The service air line (blue) carries the air signal from the driver's brake application to the trailer brakes. When the driver presses the brake pedal, air pressure in the service line controls how hard the trailer brakes apply.",
      difficulty: "medium",
      answers: [
        { text: "Carries the braking signal to control how hard the trailer brakes apply", isCorrect: true },
        { text: "Supplies air to keep the trailer's spring brakes released", isCorrect: false },
        { text: "Powers the trailer's landing gear motor", isCorrect: false },
        { text: "Controls the trailer's air suspension system", isCorrect: false },
      ],
    },
    {
      text: "When checking the landing gear after coupling, it should be:",
      explanation: "After coupling and before moving, the landing gear should be fully raised. Landing gear left partially or fully down can catch on railroad crossings or uneven pavement, causing serious damage or accidents.",
      difficulty: "easy",
      answers: [
        { text: "Fully raised before moving the vehicle", isCorrect: true },
        { text: "Left at mid-height in case it is needed quickly", isCorrect: false },
        { text: "Lowered until it barely touches the ground for stability", isCorrect: false },
        { text: "Landing gear position does not matter once the trailer is coupled", isCorrect: false },
      ],
    },
    {
      text: "What is the correct sequence to connect the air lines when coupling?",
      explanation: "When connecting air lines to a trailer, connect the emergency (red) line first, then the service (blue) line. When disconnecting, reverse the order: disconnect service line (blue) first, then emergency (red) last. This ensures the trailer emergency brakes remain applied during connecting/disconnecting.",
      difficulty: "medium",
      answers: [
        { text: "Connect emergency (red) first, then service (blue)", isCorrect: true },
        { text: "Connect service (blue) first, then emergency (red)", isCorrect: false },
        { text: "Both lines can be connected in any order", isCorrect: false },
        { text: "Connect service line only — the emergency line is not required", isCorrect: false },
      ],
    },
    {
      text: "You are about to back under a trailer. The trailer height should be:",
      explanation: "The trailer should be slightly lower than the fifth wheel height when you back under it. This ensures that as the tractor backs under, the fifth wheel rises to meet the trailer, and the coupling occurs properly. If the trailer is too high, the tractor will pass under without coupling.",
      difficulty: "medium",
      answers: [
        { text: "Slightly lower than the height of the fifth wheel", isCorrect: true },
        { text: "At the same height as the fifth wheel for smooth coupling", isCorrect: false },
        { text: "As high as possible so the landing gear can be removed easily", isCorrect: false },
        { text: "Trailer height does not matter during coupling", isCorrect: false },
      ],
    },
    {
      text: "What does the term 'converter dolly' refer to?",
      explanation: "A converter dolly is a small axle assembly with a fifth wheel on top that converts a single-trailer combination into a double combination. It connects the rear of the first trailer to the front of the second trailer.",
      difficulty: "medium",
      answers: [
        { text: "An axle assembly with a fifth wheel used to connect a second trailer in a double combination", isCorrect: true },
        { text: "A piece of equipment that converts a flatbed trailer to a refrigerated trailer", isCorrect: false },
        { text: "A special type of fifth wheel for extra-heavy loads", isCorrect: false },
        { text: "A mechanical device that lowers landing gear on trailers without motors", isCorrect: false },
      ],
    },
    {
      text: "After fully coupling a tractor-trailer, which of the following should you inspect?",
      explanation: "After coupling, do a full visual check: verify the fifth wheel is locked (no gap between apron and tractor frame), both air lines are connected to the correct glad hands, electrical cord is plugged in, landing gear is raised, and all lights and brakes work on the trailer.",
      difficulty: "medium",
      answers: [
        { text: "Fifth wheel lock, air lines, electrical cord, landing gear, trailer lights and brakes", isCorrect: true },
        { text: "Only the fifth wheel — if it locked, the coupling is complete", isCorrect: false },
        { text: "Just the trailer lights — if they work, everything is connected correctly", isCorrect: false },
        { text: "Check air lines only — the fifth wheel locks automatically and does not need visual confirmation", isCorrect: false },
      ],
    },
  ]);

  // ── HAZARDOUS MATERIALS (HM) ──────────────────────────────────────────────

  await seedQuestions(sec["HM"].id, [
    {
      text: "Which type of placards are used for mixed loads of multiple hazard classes?",
      explanation: "When transporting a mixed load of hazardous materials from different classes where you could use multiple placards, a 'DANGEROUS' placard may be used instead of the specific class placards (with some exceptions — Class 1.1, 1.2, 2.3, 6.1 Packing Group I, and radioactive materials always require specific placards).",
      difficulty: "hard",
      answers: [
        { text: "A DANGEROUS placard (with exceptions for certain high-hazard classes)", isCorrect: true },
        { text: "You must display every specific class placard for each hazmat in the load", isCorrect: false },
        { text: "No placard is required for mixed loads", isCorrect: false },
        { text: "Use the HAZMAT placard which covers all classes", isCorrect: false },
      ],
    },
    {
      text: "What does the letter 'W' in the Hazardous Materials Table indicate?",
      explanation: "The letter 'W' in the special provisions column of the Hazardous Materials Table means the material reacts dangerously with water. These materials must be kept dry and away from water. The DANGEROUS WHEN WET placard is used.",
      difficulty: "hard",
      answers: [
        { text: "The material is dangerous when wet and reacts with water", isCorrect: true },
        { text: "The material must only be shipped by water (sea/barge)", isCorrect: false },
        { text: "The material requires a water-resistant packaging", isCorrect: false },
        { text: "The material is water-soluble and requires a CORROSIVE label", isCorrect: false },
      ],
    },
    {
      text: "A driver with a HazMat endorsement must be recertified by TSA background check every:",
      explanation: "Drivers with a HazMat endorsement must pass a TSA security threat assessment every 5 years when they renew their CDL. This background check includes a criminal history check, immigration status check, and a check against terrorist watchlists.",
      difficulty: "medium",
      answers: [
        { text: "5 years when the CDL is renewed", isCorrect: true },
        { text: "Every year", isCorrect: false },
        { text: "Once only — at initial endorsement", isCorrect: false },
        { text: "Every 3 years regardless of CDL renewal date", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of 'segregation' rules for hazardous materials?",
      explanation: "Segregation rules specify which hazardous materials must be kept separate from each other — either in different vehicles or in different parts of the same vehicle. This prevents dangerous chemical reactions (fire, explosion, toxic gas release) if packages leak or break.",
      difficulty: "medium",
      answers: [
        { text: "To prevent dangerous chemical reactions if incompatible materials are mixed", isCorrect: true },
        { text: "To make it easier for customs officials to inspect individual shipments", isCorrect: false },
        { text: "To ensure each hazmat class has its own dedicated truck", isCorrect: false },
        { text: "To reduce the weight of HazMat on any single axle", isCorrect: false },
      ],
    },
    {
      text: "When is a driver NOT required to have a HazMat endorsement?",
      explanation: "A HazMat endorsement is only required when transporting hazardous materials in a quantity requiring placarding. Small quantities below threshold limits, or materials not listed in the Hazardous Materials Table, may not require a HazMat endorsement.",
      difficulty: "medium",
      answers: [
        { text: "When transporting small quantities below placard thresholds", isCorrect: true },
        { text: "When only driving within the same state", isCorrect: false },
        { text: "When the trucking company has a blanket HazMat permit", isCorrect: false },
        { text: "When the shipper has certified the materials are safe", isCorrect: false },
      ],
    },
  ]);

  // ── PASSENGER TRANSPORT (PASS) ────────────────────────────────────────────

  await seedQuestions(sec["PASS"].id, [
    {
      text: "A bus driver must check the interior of the bus before and after each trip to look for:",
      explanation: "Bus drivers must check the interior before and after each trip for any items left behind by passengers, suspicious packages, damage, or safety hazards. Suspicious or unattended packages should be treated as potential threats until proven otherwise.",
      difficulty: "easy",
      answers: [
        { text: "Left items, suspicious packages, damage, and any safety hazards", isCorrect: true },
        { text: "Only obvious trash that needs to be removed", isCorrect: false },
        { text: "Only mechanical damage to seats and windows", isCorrect: false },
        { text: "The number of available seats for the next trip", isCorrect: false },
      ],
    },
    {
      text: "What is the proper way to secure the bus when leaving it unattended?",
      explanation: "When leaving a bus unattended, the driver must apply the parking brakes, turn off the engine, remove the key, and close and secure all doors. This prevents the bus from rolling and unauthorized access or use.",
      difficulty: "easy",
      answers: [
        { text: "Apply parking brakes, shut off the engine, remove the key, and close/secure all doors", isCorrect: true },
        { text: "Just apply the parking brakes — no other steps are required", isCorrect: false },
        { text: "Leave the engine running to maintain the air conditioning for waiting passengers", isCorrect: false },
        { text: "Block the wheels and leave the engine running for safety", isCorrect: false },
      ],
    },
    {
      text: "What is the 'danger zone' around a school bus?",
      explanation: "The danger zone around a school bus is within 10 feet of all sides of the bus. Children are most at risk in this area because the driver may not be able to see them. Children should stay out of the danger zone and be visible to the driver at all times.",
      difficulty: "medium",
      answers: [
        { text: "Within 10 feet of all sides of the bus where the driver may not see children", isCorrect: true },
        { text: "Only directly behind the bus", isCorrect: false },
        { text: "Within 3 feet of the bus on all sides", isCorrect: false },
        { text: "The area between the curb and the bus door only", isCorrect: false },
      ],
    },
    {
      text: "When a school bus stops to load or unload students, the alternating flashing lights should be activated:",
      explanation: "The amber (yellow) warning lights should be activated about 200 feet before the stop (in urban areas) or 400 feet (in rural areas) to warn approaching traffic. The red stop lights and extended stop arm activate when the bus actually stops.",
      difficulty: "medium",
      answers: [
        { text: "About 200–400 feet before the stop to warn approaching drivers", isCorrect: true },
        { text: "Only when the bus is completely stopped and the doors are open", isCorrect: false },
        { text: "As soon as the driver decides to make the stop", isCorrect: false },
        { text: "Only if there are vehicles approaching from both directions", isCorrect: false },
      ],
    },
    {
      text: "Which of the following is a correct statement about charter bus passengers and seatbelts?",
      explanation: "Seatbelt rules for buses vary. Many large over-the-road buses are not required to have seatbelts. However, if a bus IS equipped with seatbelts, the driver must ensure passengers are informed of the seatbelts and their use, and in some states, passengers must wear them.",
      difficulty: "hard",
      answers: [
        { text: "If the bus has seatbelts, the driver must inform passengers and encourage their use", isCorrect: true },
        { text: "Bus passengers never need seatbelts since buses are inherently safe", isCorrect: false },
        { text: "All charter buses are required by federal law to have seatbelts for every passenger", isCorrect: false },
        { text: "Seatbelts are only required for school buses, not charter buses", isCorrect: false },
      ],
    },
  ]);

  // ── TANK VEHICLES (TANK) ──────────────────────────────────────────────────

  await seedQuestions(sec["TANK"].id, [
    {
      text: "What is 'rear surge' and when does it occur?",
      explanation: "Rear surge occurs when a tank vehicle accelerates — liquid surges toward the rear of the tank. This can make the vehicle feel as if it is being pushed forward and can reduce traction on the drive axles as weight shifts to the rear.",
      difficulty: "medium",
      answers: [
        { text: "Liquid surging toward the rear during acceleration, potentially reducing drive axle traction", isCorrect: true },
        { text: "Liquid overflowing from the rear vent during a sharp stop", isCorrect: false },
        { text: "The trailer brakes applying harder than the tractor brakes", isCorrect: false },
        { text: "The tank swinging backward when the tractor brakes are applied", isCorrect: false },
      ],
    },
    {
      text: "What speed should you reduce to before entering a curve in a tank vehicle?",
      explanation: "You should reduce speed to the safe speed for the curve BEFORE entering it, not once inside. For tank vehicles, the safe speed may be significantly lower than the posted advisory speed because of the high center of gravity and liquid surge risk. Many rollovers occur when tankers enter curves too fast.",
      difficulty: "medium",
      answers: [
        { text: "Below the safe speed for the curve before entering — often below the posted advisory speed", isCorrect: true },
        { text: "The posted speed limit — tank vehicles follow normal speed rules", isCorrect: false },
        { text: "At least 10 mph over the posted curve speed to maintain momentum", isCorrect: false },
        { text: "Speed does not matter in a curve as long as you are in the correct lane", isCorrect: false },
      ],
    },
    {
      text: "What type of tank is most stable against liquid surge?",
      explanation: "Compartmentalized tanks divided into small sections by bulkheads (solid partitions) are most resistant to surge. Baffled tanks reduce forward/backward surge. Smooth bore tanks have no surge protection at all.",
      difficulty: "hard",
      answers: [
        { text: "Tanks with bulkheads (solid partitions) dividing the tank into small compartments", isCorrect: true },
        { text: "Smooth bore tanks because liquid flows evenly", isCorrect: false },
        { text: "Any round cross-section tank regardless of internal structure", isCorrect: false },
        { text: "Tanks made of stainless steel which resists liquid movement", isCorrect: false },
      ],
    },
    {
      text: "What special concern exists when a tank vehicle has an empty tank?",
      explanation: "An empty tank vehicle still has residual vapors inside, especially if it previously carried flammable or toxic liquids. These vapors can be more dangerous than a full load. An empty tank also has a high center of gravity with no liquid weight to stabilize it.",
      difficulty: "medium",
      answers: [
        { text: "Residual vapors in an empty tank can be explosive or toxic, and the center of gravity is still high", isCorrect: true },
        { text: "Empty tanks are always the safest to drive because there is no surge", isCorrect: false },
        { text: "Empty tanks require the same placard as when full", isCorrect: false },
        { text: "An empty tank has a lower center of gravity and better stability than a full tank", isCorrect: false },
      ],
    },
    {
      text: "What is the 'retest date' stamped on a tank vehicle, and why does it matter?",
      explanation: "Tank vehicles that carry hazardous materials must be periodically inspected and tested (pressure tested, lining inspected, etc.) according to DOT regulations. The retest date is stamped on the tank. Driving a tank with an expired retest date is a federal violation.",
      difficulty: "hard",
      answers: [
        { text: "The date by which the tank must be re-inspected and tested per DOT regulations", isCorrect: true },
        { text: "The date the tank was last cleaned and certified food-grade safe", isCorrect: false },
        { text: "The manufacturer's recommended replacement date for the tank", isCorrect: false },
        { text: "The last date the tank was filled — used to calculate freshness of contents", isCorrect: false },
      ],
    },
  ]);

  // Update question counts
  const allSections = await prisma.section.findMany();
  for (const section of allSections) {
    const count = await prisma.question.count({ where: { sectionId: section.id } });
    await prisma.section.update({ where: { id: section.id }, data: { questionCount: count } });
  }

  console.log("✅ Batch 2 questions added and counts updated!");
  const total = await prisma.question.count();
  console.log(`🎉 Total questions in database: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
