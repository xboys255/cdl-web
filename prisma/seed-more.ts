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
  console.log("🌱 Seeding additional CDL questions...");

  // Fetch all sections by their codes
  const sections = await prisma.section.findMany({ include: { test: true } });
  const sec = Object.fromEntries(sections.map((s) => [s.code, s]));

  // ── GENERAL KNOWLEDGE: Vehicle Inspection (GK-VI) ────────────────────────

  await seedQuestions(sec["GK-VI"].id, [
    {
      text: "The minimum tread depth for front (steering) tires on a CMV is:",
      explanation: "Federal regulations require a minimum tread depth of 4/32 inch for steering axle tires and 2/32 inch for all other tires. Steering tires have a higher minimum because they directly affect steering control.",
      difficulty: "medium",
      answers: [
        { text: "4/32 inch", isCorrect: true },
        { text: "2/32 inch", isCorrect: false },
        { text: "1/16 inch", isCorrect: false },
        { text: "1/4 inch", isCorrect: false },
      ],
    },
    {
      text: "Which of the following brake problems should prevent you from driving?",
      explanation: "Brakes that are out of adjustment, have contaminated linings, or have cracked drums are serious defects that make the vehicle unsafe to operate. Any brake defect that could cause a brake failure must be repaired before the vehicle is driven.",
      difficulty: "medium",
      answers: [
        { text: "Brakes that are out of adjustment or have cracked drums", isCorrect: true },
        { text: "Slightly squeaky brakes that stop normally", isCorrect: false },
        { text: "Brakes that feel slightly soft in cold weather", isCorrect: false },
        { text: "Brake lights that take half a second to illuminate", isCorrect: false },
      ],
    },
    {
      text: "During a pre-trip inspection, you notice a cracked spring leaf in the suspension. You should:",
      explanation: "A cracked spring leaf is a serious defect. Spring leaves broken or shifted out of position are cause to place the vehicle out of service. The suspension system supports the vehicle's weight and any defect can lead to loss of control.",
      difficulty: "medium",
      answers: [
        { text: "Take the vehicle out of service and have it repaired before driving", isCorrect: true },
        { text: "Drive slowly to the nearest shop for repair", isCorrect: false },
        { text: "Note it on the DVIR and continue the trip", isCorrect: false },
        { text: "Monitor it and report it at your destination", isCorrect: false },
      ],
    },
    {
      text: "What is the correct way to check that the steering wheel is secure?",
      explanation: "To check the steering wheel, grasp it firmly and try to move it up and down and in and out. There should be no looseness or play. Also check the column for secure mounting and no binding or sticking.",
      difficulty: "easy",
      answers: [
        { text: "Try to move the wheel up, down, and in/out — it should not be loose", isCorrect: true },
        { text: "Turn the wheel sharply left and right at idle speed", isCorrect: false },
        { text: "Honk the horn to test the steering column electrical connection", isCorrect: false },
        { text: "Check only the steering wheel mounting screws visually", isCorrect: false },
      ],
    },
    {
      text: "How do you check the slack adjusters on a vehicle with air brakes?",
      explanation: "With the engine off and parking brakes released, push and pull the slack adjuster. If any slack adjuster moves more than about 1 inch, it is out of adjustment and the brakes need to be adjusted before driving.",
      difficulty: "hard",
      answers: [
        { text: "With parking brakes released, pull the adjuster — movement over 1 inch means brakes need adjustment", isCorrect: true },
        { text: "Apply the service brakes and check if the slack adjuster is warm", isCorrect: false },
        { text: "Slack adjusters are self-adjusting and never need checking", isCorrect: false },
        { text: "Check them only when a brake warning light appears", isCorrect: false },
      ],
    },
    {
      text: "During a pre-trip, you should check the windshield for:",
      explanation: "The windshield must be free of illegal stickers, obstructions to the driver's view, and any damage such as cracks that could impair visibility. Wipers must operate correctly and clean effectively.",
      difficulty: "easy",
      answers: [
        { text: "Cracks, obstructions, and that wipers clean the glass properly", isCorrect: true },
        { text: "Only the condition of the wiper blades", isCorrect: false },
        { text: "The VIN number etched into the glass", isCorrect: false },
        { text: "Whether it is tinted beyond legal limits", isCorrect: false },
      ],
    },
    {
      text: "What does it mean if you find oil on the inside of a tire during inspection?",
      explanation: "Oil on the inside of a tire or on the wheel or axle hub usually indicates a leaking axle seal. This can contaminate the brake linings, causing brake failure, and should be repaired before driving.",
      difficulty: "medium",
      answers: [
        { text: "A leaking axle seal that could contaminate brake linings — must be repaired", isCorrect: true },
        { text: "Normal lubrication that protects the tire from the inside", isCorrect: false },
        { text: "A sign the tire was recently mounted and needs no attention", isCorrect: false },
        { text: "Condensation that forms inside tires in cold weather", isCorrect: false },
      ],
    },
    {
      text: "Dual tires on the same axle must:",
      explanation: "Dual tires must not be touching each other (must have space between them) and must not have any objects between them. Tires that are touching can trap heat, build pressure, and cause a blowout.",
      difficulty: "medium",
      answers: [
        { text: "Not be touching each other and must have no objects between them", isCorrect: true },
        { text: "Always be the same brand and model", isCorrect: false },
        { text: "Be inflated to different pressures based on load distribution", isCorrect: false },
        { text: "Have matching tread patterns but can touch if necessary", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Driving Safely (GK-DS) ────────────────────────────

  await seedQuestions(sec["GK-DS"].id, [
    {
      text: "What should you do if a tire blows out while driving?",
      explanation: "During a blowout, hold the steering wheel firmly, stay off the brakes (braking can cause a skid), gradually ease off the throttle, and let the vehicle slow down on its own. Steer to the side of the road only after you have the vehicle under control.",
      difficulty: "medium",
      answers: [
        { text: "Hold the wheel firmly, ease off the throttle, and let the vehicle slow naturally before steering to the side", isCorrect: true },
        { text: "Apply the brakes hard immediately to stop quickly", isCorrect: false },
        { text: "Swerve to the side of the road as quickly as possible", isCorrect: false },
        { text: "Accelerate slightly to maintain control before braking", isCorrect: false },
      ],
    },
    {
      text: "What is the 'danger zone' around a large truck where other vehicles cannot be seen?",
      explanation: "Large trucks have four blind spots (No-Zones): directly in front (about 20 feet), directly behind (about 30 feet), to the left rear quarter, and to the right side (the largest blind spot, extending two lanes wide from the cab to beyond the trailer).",
      difficulty: "easy",
      answers: [
        { text: "Directly in front, directly behind, and on both sides — especially the right side", isCorrect: true },
        { text: "Only directly behind the vehicle", isCorrect: false },
        { text: "Only when backing up", isCorrect: false },
        { text: "The area immediately to the left of the cab only", isCorrect: false },
      ],
    },
    {
      text: "What should you do when you see a hazard ahead?",
      explanation: "When you see a potential hazard, cover the brake — remove your foot from the accelerator and hold your foot over the brake pedal, ready to apply pressure. This reduces your reaction time if you need to stop.",
      difficulty: "easy",
      answers: [
        { text: "Cover the brake by moving your foot over the brake pedal ready to apply", isCorrect: true },
        { text: "Flash your lights to warn other drivers", isCorrect: false },
        { text: "Immediately change lanes to avoid the hazard", isCorrect: false },
        { text: "Apply light brake pressure immediately", isCorrect: false },
      ],
    },
    {
      text: "What does 'communicating' mean in CDL driving safety?",
      explanation: "Communicating means making sure other road users are aware of your presence and intentions. This includes using turn signals, brake lights, horns, and headlights to communicate with other drivers, pedestrians, and cyclists — especially before turning, stopping, or changing lanes.",
      difficulty: "easy",
      answers: [
        { text: "Using signals, lights, and horn to make your presence and intentions known to others", isCorrect: true },
        { text: "Using a CB radio to talk to other truck drivers", isCorrect: false },
        { text: "Reporting your position to dispatch at regular intervals", isCorrect: false },
        { text: "Talking to passengers about road conditions", isCorrect: false },
      ],
    },
    {
      text: "At what speed does hydroplaning typically begin on a wet road?",
      explanation: "Hydroplaning can begin at speeds as low as 30 mph on a wet road. At 55 mph, tires may lose significant contact with the road. Worn tires and standing water increase the risk. Slowing down and maintaining good tire tread are the best preventions.",
      difficulty: "medium",
      answers: [
        { text: "As low as 30 mph on wet roads", isCorrect: true },
        { text: "Only above 70 mph on flooded roads", isCorrect: false },
        { text: "Only during heavy rain at highway speeds", isCorrect: false },
        { text: "Only on roads with standing water deeper than 2 inches", isCorrect: false },
      ],
    },
    {
      text: "When driving in heavy rain, which of the following is most important?",
      explanation: "In heavy rain, reduce speed significantly, increase following distance, use low-beam headlights (required in many states when wipers are in use), and avoid sudden braking or steering. Stopping distance increases dramatically on wet roads.",
      difficulty: "easy",
      answers: [
        { text: "Reduce speed, increase following distance, and use low-beam headlights", isCorrect: true },
        { text: "Maintain normal speed but use high-beam headlights to see better", isCorrect: false },
        { text: "Only reduce speed when visibility drops below one mile", isCorrect: false },
        { text: "Flash your hazard lights and maintain normal speed", isCorrect: false },
      ],
    },
    {
      text: "What is the most important reason to avoid driving while fatigued?",
      explanation: "Fatigue is one of the leading causes of serious truck accidents. A fatigued driver has slower reaction times, impaired judgment, and may fall asleep at the wheel. Studies show driving after 18 hours without sleep impairs driving ability similar to a blood alcohol content of 0.08%.",
      difficulty: "easy",
      answers: [
        { text: "It slows reaction time and impairs judgment, similar to being drunk", isCorrect: true },
        { text: "It violates federal Hours of Service regulations only", isCorrect: false },
        { text: "Fatigued drivers tend to speed more than normal", isCorrect: false },
        { text: "It increases fuel consumption significantly", isCorrect: false },
      ],
    },
    {
      text: "When is it safe to remove the radiator cap to check coolant?",
      explanation: "Never remove the radiator cap when the engine is hot. The cooling system is under pressure, and removing the cap can cause boiling coolant to spray out, causing serious burns. Wait until the engine has cooled down, then open the cap slowly.",
      difficulty: "easy",
      answers: [
        { text: "Only when the engine has completely cooled down", isCorrect: true },
        { text: "Anytime — the system is safe to open while the engine is running", isCorrect: false },
        { text: "Within 15 minutes of shutting off the engine", isCorrect: false },
        { text: "Only when the temperature gauge reads below halfway", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: Transporting Cargo (GK-TC) ────────────────────────

  await seedQuestions(sec["GK-TC"].id, [
    {
      text: "What is the minimum number of tie-downs required for a load 10 feet long or less?",
      explanation: "Federal cargo securement rules require at least two tie-downs for cargo that is 10 feet or shorter. Longer cargo requires additional tie-downs. The working load limit of all tie-downs combined must equal at least half the weight of the cargo.",
      difficulty: "medium",
      answers: [
        { text: "Two tie-downs", isCorrect: true },
        { text: "One tie-down is sufficient for loads under 10 feet", isCorrect: false },
        { text: "Four tie-downs regardless of load length", isCorrect: false },
        { text: "Three tie-downs minimum regardless of length", isCorrect: false },
      ],
    },
    {
      text: "Where should the heaviest cargo be placed in a vehicle?",
      explanation: "Heavy cargo should be placed as low as possible to keep the center of gravity low, reducing rollover risk. It should also be distributed evenly front to back and side to side to maintain proper axle weight distribution.",
      difficulty: "easy",
      answers: [
        { text: "As low as possible to keep the center of gravity low", isCorrect: true },
        { text: "At the rear of the trailer for better traction", isCorrect: false },
        { text: "At the front of the trailer to improve steering", isCorrect: false },
        { text: "As high as possible to allow other cargo underneath", isCorrect: false },
      ],
    },
    {
      text: "A vehicle is legal to drive when:",
      explanation: "A vehicle is legal to drive when gross vehicle weight, axle weights, and overall dimensions (width, height, length) all meet federal and state regulations. Exceeding any single limit — even if others are legal — makes the vehicle illegal.",
      difficulty: "medium",
      answers: [
        { text: "All axle weights, gross weight, and dimensions comply with federal and state regulations", isCorrect: true },
        { text: "Only the gross vehicle weight is within legal limits", isCorrect: false },
        { text: "The driver has a permit for the specific load being carried", isCorrect: false },
        { text: "The trailer is marked with an approved overweight sign", isCorrect: false },
      ],
    },
    {
      text: "What is 'load shift' and why is it dangerous?",
      explanation: "Load shift occurs when unsecured or improperly secured cargo moves during driving, especially during turns, braking, or on uneven roads. A shifted load can change the vehicle's center of gravity suddenly, causing rollover or loss of control, and can also fall off onto other vehicles.",
      difficulty: "easy",
      answers: [
        { text: "Cargo moving during travel, which can change the vehicle's balance and cause loss of control", isCorrect: true },
        { text: "A planned transfer of cargo between vehicles at a distribution center", isCorrect: false },
        { text: "The normal settling of cargo that occurs on every trip", isCorrect: false },
        { text: "Legal re-stacking of cargo to redistribute weight on axles", isCorrect: false },
      ],
    },
    {
      text: "What should you do before crossing a bridge with a heavy load?",
      explanation: "Bridges have posted weight limits. Before crossing any bridge, check the posted weight limit and ensure your gross vehicle weight does not exceed it. If unsure, find an alternate route. Overloading bridges can cause bridge collapses.",
      difficulty: "easy",
      answers: [
        { text: "Check the posted bridge weight limit and ensure your vehicle does not exceed it", isCorrect: true },
        { text: "Drive across slowly regardless of the posted limit", isCorrect: false },
        { text: "Bridge limits only apply to non-commercial vehicles", isCorrect: false },
        { text: "Posted bridge limits are advisory only and can be exceeded by commercial trucks", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of blocking and bracing cargo?",
      explanation: "Blocking and bracing prevent cargo from shifting or moving in any direction — forward, backward, or sideways. Blocks of wood or other materials are placed around the cargo, and braces hold the cargo against the walls of the trailer.",
      difficulty: "medium",
      answers: [
        { text: "To prevent cargo from shifting forward, backward, or sideways during transport", isCorrect: true },
        { text: "To increase the maximum weight that can be carried", isCorrect: false },
        { text: "To reduce aerodynamic drag on the trailer", isCorrect: false },
        { text: "To distribute weight evenly across all axles automatically", isCorrect: false },
      ],
    },
    {
      text: "A single-axle weight limit on most interstate highways is:",
      explanation: "Federal law limits single axle weights to 20,000 lbs and tandem axle weights to 34,000 lbs on interstate highways. The maximum gross vehicle weight is 80,000 lbs for a standard 5-axle combination.",
      difficulty: "medium",
      answers: [
        { text: "20,000 pounds", isCorrect: true },
        { text: "34,000 pounds", isCorrect: false },
        { text: "10,000 pounds", isCorrect: false },
        { text: "26,001 pounds", isCorrect: false },
      ],
    },
  ]);

  // ── GENERAL KNOWLEDGE: HazMat Basics (GK-HM) ─────────────────────────────

  await seedQuestions(sec["GK-HM"].id, [
    {
      text: "What is a material safety data sheet (SDS/MSDS)?",
      explanation: "A Safety Data Sheet (SDS, formerly MSDS) provides detailed information about a hazardous chemical, including its properties, health hazards, safe handling, storage, and emergency procedures. They are required for hazardous workplace chemicals and are a key reference during HazMat incidents.",
      difficulty: "medium",
      answers: [
        { text: "A document describing a hazardous material's properties, hazards, and safe handling procedures", isCorrect: true },
        { text: "A government form required only for radioactive materials", isCorrect: false },
        { text: "The shipper's invoice for hazardous cargo", isCorrect: false },
        { text: "A map of approved HazMat routes through a state", isCorrect: false },
      ],
    },
    {
      text: "What type of placard is required for a load of 500 lbs of Division 1.1 explosives?",
      explanation: "Division 1.1 and 1.2 explosives require placarding for ANY quantity — there is no minimum threshold for these highly dangerous materials. Most other HazMat classes require placards only at 1,001 lbs or more.",
      difficulty: "hard",
      answers: [
        { text: "An EXPLOSIVES 1.1 placard is required regardless of quantity", isCorrect: true },
        { text: "No placard is needed because the load is under 1,001 lbs", isCorrect: false },
        { text: "A DANGEROUS placard is used for loads under 1,001 lbs", isCorrect: false },
        { text: "Only the shipping papers are required for loads under 1,001 lbs", isCorrect: false },
      ],
    },
    {
      text: "What does the UN identification number on a placard or shipping paper tell you?",
      explanation: "The UN (United Nations) identification number is a 4-digit code that identifies a specific hazardous material or group of similar materials. Emergency responders use the UN number with the Emergency Response Guidebook to quickly identify the material and its dangers.",
      difficulty: "medium",
      answers: [
        { text: "It identifies the specific hazardous material for emergency response purposes", isCorrect: true },
        { text: "It indicates the maximum quantity allowed in one shipment", isCorrect: false },
        { text: "It shows the shipper's DOT registration number", isCorrect: false },
        { text: "It identifies the country of origin of the hazardous material", isCorrect: false },
      ],
    },
    {
      text: "You should not smoke within how many feet of a vehicle carrying Class 3 flammable liquids?",
      explanation: "No smoking or open flames are permitted within 25 feet of a vehicle carrying Class 3 flammable liquids or other flammable materials. Flammable vapors can travel significant distances and ignite from a spark or flame.",
      difficulty: "medium",
      answers: [
        { text: "25 feet", isCorrect: true },
        { text: "10 feet", isCorrect: false },
        { text: "50 feet", isCorrect: false },
        { text: "100 feet", isCorrect: false },
      ],
    },
    {
      text: "A transport index (TI) number is used for which class of hazardous materials?",
      explanation: "The Transport Index (TI) is a number assigned to packages of radioactive materials (Class 7). It indicates the maximum radiation level at one meter from the surface of the package. It determines how packages may be loaded, stored, and transported together.",
      difficulty: "hard",
      answers: [
        { text: "Class 7 — Radioactive materials", isCorrect: true },
        { text: "Class 1 — Explosives", isCorrect: false },
        { text: "Class 2 — Gases", isCorrect: false },
        { text: "Class 8 — Corrosives", isCorrect: false },
      ],
    },
    {
      text: "When loading HazMat, which materials must never be loaded together?",
      explanation: "Certain hazardous materials are incompatible and must not be loaded together because they can react dangerously. For example: explosives and detonators must generally be segregated; poisons and foodstuffs cannot be transported together; certain gases and oxidizers must be kept apart.",
      difficulty: "medium",
      answers: [
        { text: "Incompatible materials that could react dangerously — such as poisons and foodstuffs", isCorrect: true },
        { text: "Any two different hazard classes regardless of compatibility", isCorrect: false },
        { text: "Materials with different UN numbers even if they are the same hazard class", isCorrect: false },
        { text: "Materials from different shippers even if they are compatible", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: System (AB-SYS) ──────────────────────────────────────────

  await seedQuestions(sec["AB-SYS"].id, [
    {
      text: "What does the air compressor governor do?",
      explanation: "The governor controls the air compressor by cutting out (stopping compression) when tank pressure reaches about 125 psi (cut-out pressure) and cutting in (resuming compression) when pressure drops to about 100 psi (cut-in pressure). This keeps tank pressure within the proper operating range.",
      difficulty: "medium",
      answers: [
        { text: "Controls when the air compressor loads and unloads to maintain proper tank pressure", isCorrect: true },
        { text: "Adjusts brake pressure based on vehicle speed", isCorrect: false },
        { text: "Distributes air pressure evenly between front and rear brakes", isCorrect: false },
        { text: "Monitors the air pressure gauge and alerts the driver", isCorrect: false },
      ],
    },
    {
      text: "What is the normal operating pressure range for air brakes?",
      explanation: "Air brake systems normally operate between approximately 100 psi (cut-in pressure, when the compressor starts) and 125 psi (cut-out pressure, when the compressor stops). The warning signal activates below 60 psi, and spring brakes engage below approximately 20–45 psi.",
      difficulty: "medium",
      answers: [
        { text: "Between about 100 and 125 psi", isCorrect: true },
        { text: "Between 150 and 200 psi", isCorrect: false },
        { text: "Between 20 and 60 psi", isCorrect: false },
        { text: "Between 50 and 75 psi", isCorrect: false },
      ],
    },
    {
      text: "What is the function of the brake chambers in an air brake system?",
      explanation: "Brake chambers convert air pressure into mechanical force. When you press the brake pedal, air flows into the brake chamber, pushing against a diaphragm that moves a pushrod, which rotates the slack adjuster, which turns the brake cam to force the brake shoes against the drum.",
      difficulty: "medium",
      answers: [
        { text: "Convert air pressure into mechanical force to apply the brakes", isCorrect: true },
        { text: "Store compressed air for use when the compressor is not running", isCorrect: false },
        { text: "Regulate air pressure throughout the system", isCorrect: false },
        { text: "Remove moisture and oil from the compressed air", isCorrect: false },
      ],
    },
    {
      text: "Why is it important to drain the air tanks daily?",
      explanation: "Water and oil accumulate in air tanks during normal compressor operation. Water can freeze in cold weather, blocking brake valves and causing brake failure. Oil can damage rubber components. Manual draining (or checking automatic drain valves) must be done daily.",
      difficulty: "easy",
      answers: [
        { text: "Water and oil can accumulate and cause brake failure, especially in cold weather", isCorrect: true },
        { text: "To reduce the weight of the vehicle by removing excess air", isCorrect: false },
        { text: "Federal law requires it every 24 hours regardless of conditions", isCorrect: false },
        { text: "Draining extends the life of the compressor motor", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the alcohol evaporator in an air brake system?",
      explanation: "The alcohol evaporator injects alcohol into the air system to help prevent ice from forming in the brake valves and lines in cold weather. Some vehicles use this system instead of or in addition to air dryers.",
      difficulty: "hard",
      answers: [
        { text: "To prevent ice from forming in the brake valves and lines in cold weather", isCorrect: true },
        { text: "To lubricate the brake linings for smoother operation", isCorrect: false },
        { text: "To clean the air lines of oil contamination", isCorrect: false },
        { text: "To reduce air pressure for driving in slippery conditions", isCorrect: false },
      ],
    },
    {
      text: "How long does it typically take to build air pressure from 50 to 90 psi when the engine is at operating RPM?",
      explanation: "Air pressure should build from 50 to 90 psi in about 3 minutes or less at engine operating RPM. If it takes longer, the air compressor or system may have a problem that needs to be repaired.",
      difficulty: "hard",
      answers: [
        { text: "About 3 minutes or less at operating RPM", isCorrect: true },
        { text: "At least 10 minutes is normal", isCorrect: false },
        { text: "Pressure should build instantly when the engine starts", isCorrect: false },
        { text: "Up to 20 minutes is acceptable for older vehicles", isCorrect: false },
      ],
    },
  ]);

  // ── AIR BRAKES: Using (AB-USE) ────────────────────────────────────────────

  await seedQuestions(sec["AB-USE"].id, [
    {
      text: "What is the first thing you should do if you lose air pressure while driving?",
      explanation: "If air pressure drops rapidly, bring the vehicle to a controlled stop as quickly as safely possible. The spring brakes will apply automatically when air pressure falls too low, but you want to stop before this happens while moving at speed.",
      difficulty: "medium",
      answers: [
        { text: "Bring the vehicle to a controlled stop as quickly and safely as possible", isCorrect: true },
        { text: "Shift to a lower gear and use engine braking only", isCorrect: false },
        { text: "Increase speed to reach an exit before the brakes engage", isCorrect: false },
        { text: "Pull over only if the low pressure warning remains on for more than 1 minute", isCorrect: false },
      ],
    },
    {
      text: "Before driving a vehicle with air brakes, air pressure should be at least:",
      explanation: "Before driving, air pressure should be at least 100 psi (in most vehicles, the normal operating range begins at about 100 psi when the governor cuts in). Driving with low air pressure risks spring brake engagement and inadequate braking ability.",
      difficulty: "medium",
      answers: [
        { text: "At least 100 psi (within the normal operating range)", isCorrect: true },
        { text: "At least 40 psi", isCorrect: false },
        { text: "At least 60 psi — just above the warning level", isCorrect: false },
        { text: "At least 150 psi for full braking power", isCorrect: false },
      ],
    },
    {
      text: "When doing a pre-trip inspection of air brakes, how do you test for air leaks?",
      explanation: "To test for air leaks: (1) Build pressure to normal operating range, (2) Turn off the engine, (3) Release parking brakes, (4) Note pressure gauge, (5) Wait one minute. Pressure should not drop more than 2 psi per minute for single vehicles or 3 psi per minute with trailer(s) attached.",
      difficulty: "hard",
      answers: [
        { text: "With engine off and parking brakes released, pressure should not drop more than 2–3 psi per minute", isCorrect: true },
        { text: "Listen for hissing sounds with the engine running and brakes applied", isCorrect: false },
        { text: "Apply brakes fully for 30 seconds and check for a complete pressure loss", isCorrect: false },
        { text: "Air leaks are normal and do not need testing during a pre-trip inspection", isCorrect: false },
      ],
    },
    {
      text: "What happens if you press the brake pedal while the spring brakes are applied?",
      explanation: "You should never apply the service (foot) brakes while the spring brakes are applied. Doing so can cause the spring brakes to 'combine' with the service brakes, applying far more force than the brakes were designed for — potentially damaging the brake system (called compounding).",
      difficulty: "hard",
      answers: [
        { text: "It can damage the brake system by combining forces — called compounding", isCorrect: true },
        { text: "The service brakes override the spring brakes automatically", isCorrect: false },
        { text: "Nothing — the service brakes will not apply when spring brakes are on", isCorrect: false },
        { text: "It releases the spring brakes", isCorrect: false },
      ],
    },
    {
      text: "What is the purpose of the two-way check valve in a dual air brake system?",
      explanation: "The two-way check valve allows the higher pressure from either the primary or secondary air system to apply the brakes. This ensures you still have braking from whichever system has more pressure, even if one system has failed.",
      difficulty: "hard",
      answers: [
        { text: "To allow the higher-pressure system to apply brakes if one system fails", isCorrect: true },
        { text: "To equalize pressure between the primary and secondary systems at all times", isCorrect: false },
        { text: "To prevent air from flowing backward into the compressor", isCorrect: false },
        { text: "To automatically drain moisture from both air tanks simultaneously", isCorrect: false },
      ],
    },
  ]);

  // ── COMBINATION VEHICLES (COMB) ───────────────────────────────────────────

  await seedQuestions(sec["COMB"].id, [
    {
      text: "What is the 'crack-the-whip' effect in multi-trailer combinations?",
      explanation: "The crack-the-whip effect occurs when sharp steering causes the rear trailers in a multi-trailer combination to swing out more violently than the lead trailer. The effect amplifies with each additional trailer, making doubles and triples much harder to control during sharp maneuvers.",
      difficulty: "medium",
      answers: [
        { text: "Rear trailers swinging out more violently than the tractor during sharp maneuvers", isCorrect: true },
        { text: "The trailer tongue making a whipping sound when brakes are applied hard", isCorrect: false },
        { text: "The fifth wheel coupling unlocking during sharp turns", isCorrect: false },
        { text: "The drive axles losing traction and spinning on slippery roads", isCorrect: false },
      ],
    },
    {
      text: "When backing a tractor-trailer, turning the steering wheel to the left will make the trailer go:",
      explanation: "When backing a tractor-trailer, the trailer goes in the opposite direction from where you turn the steering wheel. Turning the steering wheel left causes the tractor to go right, which pushes the trailer left. This is opposite to backing a car with a trailer.",
      difficulty: "medium",
      answers: [
        { text: "Left — the trailer moves opposite to the tractor's direction", isCorrect: true },
        { text: "Right — the trailer follows the tractor direction when reversing", isCorrect: false },
        { text: "Straight back, since trailers do not turn when backing", isCorrect: false },
        { text: "Left only if you turn the wheel far enough — otherwise it goes straight", isCorrect: false },
      ],
    },
    {
      text: "What should you do if your trailer starts to jackknife?",
      explanation: "If jackknifing begins, immediately release the brakes to allow the wheels to roll again. Braked drive wheels cause the tractor's rear to swing outward. Once wheels roll, steering may allow correction. Prevention — controlled braking, proper speed for conditions — is far better than correction.",
      difficulty: "hard",
      answers: [
        { text: "Release the brakes immediately to let the wheels roll and attempt to steer out", isCorrect: true },
        { text: "Apply maximum brakes to bring the vehicle to a quick stop", isCorrect: false },
        { text: "Steer sharply in the direction of the jackknife to correct it", isCorrect: false },
        { text: "Increase speed to straighten the combination before braking", isCorrect: false },
      ],
    },
    {
      text: "Which of these is the most important step in the coupling process?",
      explanation: "After coupling, the most critical step is to test the connection. Pull forward gently against the locked trailer brakes to confirm the fifth wheel is fully locked. A fifth wheel that has not fully locked can separate at highway speed, causing a catastrophic accident.",
      difficulty: "medium",
      answers: [
        { text: "Pulling forward against the locked trailer brakes to test the fifth wheel connection", isCorrect: true },
        { text: "Checking the trailer lights before hooking up the air lines", isCorrect: false },
        { text: "Connecting the emergency air line before the service line", isCorrect: false },
        { text: "Lowering the landing gear before backing under the trailer", isCorrect: false },
      ],
    },
    {
      text: "In a double combination, how should the heaviest trailer be positioned?",
      explanation: "In double combinations, the heavier trailer should always be directly behind the tractor (in the lead position), and the lighter trailer should be in the rear (pup) position. This reduces the potential for the rear trailer to swing out and cause a jackknife or instability.",
      difficulty: "medium",
      answers: [
        { text: "The heaviest trailer should be directly behind the tractor", isCorrect: true },
        { text: "The lightest trailer should be behind the tractor for better visibility", isCorrect: false },
        { text: "Trailer order doesn't matter as long as total weight is legal", isCorrect: false },
        { text: "Both trailers must be equal weight for doubles to be legal", isCorrect: false },
      ],
    },
    {
      text: "What is the 'pintle hook' used for?",
      explanation: "A pintle hook is a type of trailer coupling used for full trailers and converter dollies. It works like a latch that catches the trailer's lunette ring (eye). Unlike a fifth wheel, a pintle hook allows the trailer to pivot both horizontally and vertically.",
      difficulty: "hard",
      answers: [
        { text: "A type of coupling for full trailers and converter dollies", isCorrect: true },
        { text: "A hook used to attach safety chains on a semi-trailer", isCorrect: false },
        { text: "The release handle on a fifth wheel plate", isCorrect: false },
        { text: "A device used to secure the landing gear", isCorrect: false },
      ],
    },
  ]);

  // ── HAZARDOUS MATERIALS (HM) ──────────────────────────────────────────────

  await seedQuestions(sec["HM"].id, [
    {
      text: "How many sides of a vehicle must have placards when transporting placardable HazMat?",
      explanation: "Placards must be placed on all four sides of the vehicle: the front, back, and both sides. This ensures that regardless of the angle from which emergency responders approach, they can see the hazard class.",
      difficulty: "medium",
      answers: [
        { text: "All four sides — front, back, and both sides", isCorrect: true },
        { text: "Only the back and sides — never the front", isCorrect: false },
        { text: "Only the front and back", isCorrect: false },
        { text: "Only on the side of the vehicle closest to the road", isCorrect: false },
      ],
    },
    {
      text: "What does 'packing group' indicate on HazMat shipping papers?",
      explanation: "Packing group (PG) indicates the degree of danger of the hazardous material: PG I = great danger, PG II = medium danger, PG III = minor danger. Not all HazMat have packing groups (e.g., gases and explosives do not).",
      difficulty: "hard",
      answers: [
        { text: "The degree of danger: PG I = great, PG II = medium, PG III = minor", isCorrect: true },
        { text: "The specific type of container required for the shipment", isCorrect: false },
        { text: "The number of packages allowed in a single shipment", isCorrect: false },
        { text: "The shipper's priority level for delivery", isCorrect: false },
      ],
    },
    {
      text: "When transporting chlorine (a hazardous gas), you must have which document readily available?",
      explanation: "When transporting chlorine or certain other hazardous gases, the driver must have a written emergency response procedure — in addition to shipping papers — within immediate reach. The driver must also have a gas mask and must know how to use it.",
      difficulty: "hard",
      answers: [
        { text: "Written emergency response procedures and, in some cases, a gas mask", isCorrect: true },
        { text: "Only the shipping papers — no additional documents are required", isCorrect: false },
        { text: "A copy of the driver's hazmat endorsement certificate", isCorrect: false },
        { text: "A route plan approved by the FMCSA", isCorrect: false },
      ],
    },
    {
      text: "What is the 'Hazardous Materials Table' used for?",
      explanation: "The Hazardous Materials Table (49 CFR 172.101) lists regulated hazardous materials by proper shipping name. It provides the hazard class, ID number, packing group, and labeling requirements for each material. Shippers and carriers use it to correctly classify and document shipments.",
      difficulty: "medium",
      answers: [
        { text: "To classify hazardous materials and determine labeling and documentation requirements", isCorrect: true },
        { text: "To calculate fees for transporting hazardous materials interstate", isCorrect: false },
        { text: "A list of roads approved for HazMat transport in each state", isCorrect: false },
        { text: "A reference for emergency responders only", isCorrect: false },
      ],
    },
    {
      text: "If you discover a HazMat leak while driving, you should:",
      explanation: "If you discover a HazMat leak, park safely away from people, buildings, and ignition sources. Do not touch or inhale the material. Notify emergency services, keep people away from the area, and use the Emergency Response Guidebook to identify appropriate precautions.",
      difficulty: "medium",
      answers: [
        { text: "Park away from people and ignition sources, notify emergency services, and keep others away", isCorrect: true },
        { text: "Try to stop the leak yourself then continue to your destination", isCorrect: false },
        { text: "Drive to the nearest fire station for assistance", isCorrect: false },
        { text: "Contact your dispatcher and wait for instructions before stopping", isCorrect: false },
      ],
    },
  ]);

  // ── PASSENGER TRANSPORT (PASS) ────────────────────────────────────────────

  await seedQuestions(sec["PASS"].id, [
    {
      text: "When may a bus driver leave the bus unattended while passengers are on board?",
      explanation: "A bus driver must not leave the bus unattended with passengers aboard unless the parking brakes are set and the bus is secured. Even then, leaving passengers unattended is generally not permitted except in specific emergency situations with safety considerations.",
      difficulty: "medium",
      answers: [
        { text: "Only in genuine emergencies with the brakes set and bus secured", isCorrect: true },
        { text: "Whenever making a brief rest stop of under 5 minutes", isCorrect: false },
        { text: "Any time as long as passengers are told to stay seated", isCorrect: false },
        { text: "Never — a driver must always remain on the bus when passengers are aboard", isCorrect: false },
      ],
    },
    {
      text: "A school bus must stop before which of the following railroad crossings?",
      explanation: "School buses must stop at ALL railroad crossings — there are no exceptions, even at crossings with advance warning signs indicating no trains. The driver must open the door, look, and listen before proceeding.",
      difficulty: "easy",
      answers: [
        { text: "All railroad crossings, including those with advance warning signs", isCorrect: true },
        { text: "Only crossings with active signals or gates", isCorrect: false },
        { text: "Only at crossings marked 'School Bus Stop' on the road", isCorrect: false },
        { text: "Only crossings that are not controlled by traffic signals", isCorrect: false },
      ],
    },
    {
      text: "What should you do before allowing passengers to board a bus?",
      explanation: "Before allowing passengers to board, ensure the bus is safely stopped and secured with parking brakes set, the door is opened by the driver (not from outside), and the boarding area is safe. Never allow passengers to board while the bus is moving.",
      difficulty: "easy",
      answers: [
        { text: "Ensure the bus is stopped, secured, and the boarding area is safe", isCorrect: true },
        { text: "Allow passengers to open the door themselves and board freely", isCorrect: false },
        { text: "Only check that the bus is stopped — additional checks are unnecessary", isCorrect: false },
        { text: "Open all emergency exits to speed up the boarding process", isCorrect: false },
      ],
    },
    {
      text: "On a charter bus, what must the driver do with passenger baggage?",
      explanation: "Baggage stored in the aisle or blocking emergency exits is not allowed. Baggage must be stored in overhead compartments, under seats, or in luggage compartments. Aisles and emergency exits must be kept clear at all times.",
      difficulty: "medium",
      answers: [
        { text: "Ensure baggage does not block aisles or emergency exits", isCorrect: true },
        { text: "Store all baggage in the luggage compartment — no bags are allowed inside", isCorrect: false },
        { text: "Baggage storage is the passenger's responsibility and requires no driver oversight", isCorrect: false },
        { text: "Limit each passenger to one bag stored under their seat", isCorrect: false },
      ],
    },
    {
      text: "What is the procedure for a bus driver when approaching a drawbridge?",
      explanation: "A bus must not cross a drawbridge unless there is a traffic control device (signal or gate) controlling traffic, and the signal is green. If there is no control signal, the bus must stop and make sure the bridge is down and safe before crossing.",
      difficulty: "medium",
      answers: [
        { text: "Stop if there is no traffic signal; proceed only when the bridge is fully down and safe", isCorrect: true },
        { text: "Buses are exempt from drawbridge stop requirements", isCorrect: false },
        { text: "Stop only if the bridge is visibly raised", isCorrect: false },
        { text: "Cross at normal speed if no gate or signal is present", isCorrect: false },
      ],
    },
  ]);

  // ── TANK VEHICLES (TANK) ──────────────────────────────────────────────────

  await seedQuestions(sec["TANK"].id, [
    {
      text: "What does 'smooth bore' tank mean?",
      explanation: "A smooth bore tank has no baffles or internal divisions. This means liquid can surge freely in all directions. Smooth bore tanks require very careful driving — slow, smooth starts and stops, and wide, gentle turns — to prevent sudden liquid surge and loss of control.",
      difficulty: "medium",
      answers: [
        { text: "A tank with no internal baffles, allowing liquid to surge freely in all directions", isCorrect: true },
        { text: "A tank with an especially smooth exterior surface to reduce air resistance", isCorrect: false },
        { text: "A tank that has been recently cleaned and polished inside", isCorrect: false },
        { text: "A tank with a polished stainless steel interior used for food-grade products", isCorrect: false },
      ],
    },
    {
      text: "When is a tank vehicle most likely to roll over?",
      explanation: "Tank vehicles are most likely to roll over when turning at excessive speed, especially on freeway ramps and curves. The high center of gravity of a liquid load dramatically increases rollover risk compared to a typical dry freight trailer. Partial loads can be even more unstable due to surge.",
      difficulty: "medium",
      answers: [
        { text: "When turning too fast, especially on ramps and curves", isCorrect: true },
        { text: "When braking on a straight road", isCorrect: false },
        { text: "When the tank is completely full", isCorrect: false },
        { text: "When driving over railroad crossings", isCorrect: false },
      ],
    },
    {
      text: "What is 'front surge' and when does it occur?",
      explanation: "Front surge is the forward movement of liquid when braking. As the vehicle slows, the liquid continues moving forward, which pushes against the front head of the tank and adds to the braking force, potentially causing the vehicle to stop more abruptly than expected.",
      difficulty: "medium",
      answers: [
        { text: "Liquid moving forward when braking, potentially causing the vehicle to stop more abruptly", isCorrect: true },
        { text: "Extra pressure that builds at the front of the tank when accelerating", isCorrect: false },
        { text: "A surge that occurs only in the front axle air brake chambers", isCorrect: false },
        { text: "The tipping of the tank forward when the front axle hits a bump", isCorrect: false },
      ],
    },
    {
      text: "A tank vehicle transporting flammable liquids must be bonded and grounded before pumping. Why?",
      explanation: "Bonding (connecting a wire between the tank truck and the receiving container) and grounding (connecting a wire from the tank truck to the ground) prevent static electricity buildup during liquid transfer. Static sparks can ignite flammable vapors, causing a fire or explosion.",
      difficulty: "hard",
      answers: [
        { text: "To prevent static electricity buildup that could ignite flammable vapors", isCorrect: true },
        { text: "To ensure accurate measurement of the liquid being transferred", isCorrect: false },
        { text: "To comply with EPA regulations for spill prevention", isCorrect: false },
        { text: "To prevent the tank from tipping during the pumping process", isCorrect: false },
      ],
    },
    {
      text: "When turning a tank vehicle, you should turn:",
      explanation: "Tank vehicles should be turned slowly and smoothly. Their high center of gravity makes them very susceptible to rollover. Sharp, fast turns can cause the liquid to surge to the outside, dramatically shifting the center of gravity and causing a rollover.",
      difficulty: "easy",
      answers: [
        { text: "Slowly and smoothly to prevent liquid surge and rollover", isCorrect: true },
        { text: "At the same speed as a standard dry freight trailer", isCorrect: false },
        { text: "Sharply to prevent liquid from surging to the outside", isCorrect: false },
        { text: "Quickly to get through the turn before the liquid can shift", isCorrect: false },
      ],
    },
  ]);

  // Update question counts
  const allSections = await prisma.section.findMany();
  for (const section of allSections) {
    const count = await prisma.question.count({ where: { sectionId: section.id } });
    await prisma.section.update({ where: { id: section.id }, data: { questionCount: count } });
  }

  console.log("✅ Additional questions added and counts updated!");
  const total = await prisma.question.count();
  console.log(`🎉 Total questions in database: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
