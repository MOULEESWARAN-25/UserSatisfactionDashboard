// MongoDB Seeder Script — BIT Sathy (Bannari Amman Institute of Technology)
// Run: node scripts/seed.mjs

import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://anonymous_user:XSuswrzzudYqSOvk@projects.r9kyiga.mongodb.net/satisfaction_dashboard?retryWrites=true&w=majority&appName=projects";

const FeedbackSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  isAnonymous: { type: Boolean, default: false },
  serviceId: String,
  serviceName: String,
  collegeId: String,
  ratings: mongoose.Schema.Types.Mixed,
  overallSatisfaction: Number,
  comment: String,
  submittedAt: { type: Date, default: Date.now },
});

const Feedback =
  mongoose.models.Feedback ?? mongoose.model("Feedback", FeedbackSchema);

// ── Helpers ──────────────────────────────────────────────────────────────────
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(rnd(7, 22), rnd(0, 59), rnd(0, 59), 0);
  return d;
}
function weighted(itemsWithWeight) {
  const total = itemsWithWeight.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const item of itemsWithWeight) {
    r -= item.w;
    if (r <= 0) return item.v;
  }
  return itemsWithWeight[itemsWithWeight.length - 1].v;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const COLLEGE_ID = "college-default-001";
const TOTAL_DAYS = 90; // 3 months of data

const STUDENT_NAMES = [
  "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh", "Vikram Kumar",
  "Sneha Reddy", "Arjun Nair", "Kavya Iyer", "Rahul Menon", "Meera Joshi",
  "Aditya Rao", "Divya Krishnan", "Karthik Suresh", "Lakshmi Venkat", "Nikhil Das",
  "Pooja Hegde", "Sanjay Pillai", "Tanvi Desai", "Uday Bhatt", "Varsha Mohan",
  "Deepak Raj", "Shruti Nandan", "Ganesh Murthy", "Harini Prasad", "Ishaan Bose",
  "Janaki Raman", "Kunal Saxena", "Lavanya Iyengar", "Manoj Verma", "Nithya Srinivas",
  "Om Prakash", "Padma Lakshmi", "Rajesh Kumar", "Swathi Naidu", "Tarun Agarwal",
  "Uma Devi", "Vishal Kapoor", "Yamini Rao", "Zara Khan", "Abhinav Mishra",
  "Bhavana Gowda", "Chetan Kulkarni", "Diya Mahajan", "Eshan Tiwari", "Fatima Begum",
  "Gaurav Jain", "Hema Malini", "Jai Shankar", "Keerthi Reddy", "Lalit Mohan",
  "Murugan S", "Nandhini K", "Oviya R", "Prabu S", "Quentin Thomas",
  "Rubavathi M", "Saravanan P", "Tharani S", "Umayal N", "Vignesh A",
  "Wamika Singh", "Xavier D", "Yashika B", "Zinnia Roy", "Ashwin Kumar",
  "Balaji T", "Chandana S", "Dinesh R", "Eswari M", "Fathima N",
  "Gokul V", "Haripriya S", "Ilaya Bharathi", "Jeyapriya M", "Kalaiyarasi P",
  "Lakshmanan S", "Madhavi Latha", "Nandha Kumar", "Oviya Priya", "Prabhu Deva",
  "Ramya Sri", "Sudha R", "Thamizhan M", "Usha Rani", "Vasantha Kumar",
  "Yamuna S", "Akhil Raj", "Brinda M", "Cibi Raja", "Dharani S",
  "Elango P", "Freeda J", "Gopi Nath", "Harish Babu", "Indra Kumar",
  "Jagan Mohan", "Karthiga S", "Lekha Priya", "Muthu Kumar", "Nandhakumar R",
  "Pavithra S", "Rajeswari M", "Senthil Kumar", "Tamilnadu S", "Umasankar P",
];

const SERVICES = [
  {
    id: "cafeteria",
    name: "Cafeteria",
    questions: ["food_quality", "hygiene", "staff_behavior", "waiting_time", "menu_variety"],
    // weight: probability of getting each overall rating band
    ratingProfile: [
      { v: 5, w: 28 }, { v: 4, w: 35 }, { v: 3, w: 22 }, { v: 2, w: 10 }, { v: 1, w: 5 },
    ],
    comments: [
      "The South Indian section has improved a lot. Idli and dosa taste great now!",
      "Long queues during 12:40 PM lunch break. Need at least two more serving counters.",
      "Found a hair in my biryani today. Hygiene needs strict control near hot food stations.",
      "The fresh juice counter next to the main mess is excellent — very refreshing after lab sessions.",
      "Pricing is a bit high for college students. ₹80 for a meal is too much.",
      "The AC in the main dining hall is perfectly maintained. Comfortable even in peak summer.",
      "The breakfast menu is almost the same every day. Please add more variety — upma, poha, puttu.",
      "Staff at the cafeteria are polite and serve quickly. Highly satisfied.",
      "Biometric punching system at mess entry was down for two days. Caused confusion.",
      "The canteen closes at 8 PM which is too early for students working late on projects.",
      "Love the new chat counter added this month. The onion tomato chutney is amazing!",
      "Main mess runs out of curd rice by 1 PM daily. Very frustrating for late lunch-goers.",
      "Veg meals are good but non-veg options are limited. Would love more choices.",
      "More hygienic packaging for takeaway items from the food court would be appreciated.",
      "Great improvement since the new mess contractor took over last month. Well done!",
      "The evening snack stall near Academic Block 3 is super convenient.",
      "Token system should be digitized to reduce physical crowding at the counters.",
      "The campus ATM near the canteen is often out of cash. Very inconvenient.",
      "Please introduce weekly special menus and post the schedule on the notice board.",
      "Mess quality on weekends drops noticeably. Same effort should be maintained daily.",
    ],
  },
  {
    id: "library",
    name: "Library",
    questions: ["book_availability", "quietness", "seating_space", "staff_support"],
    ratingProfile: [
      { v: 5, w: 38 }, { v: 4, w: 36 }, { v: 3, w: 16 }, { v: 2, w: 7 }, { v: 1, w: 3 },
    ],
    comments: [
      "The 5-story AC library is the best place to study on campus. Highly recommend.",
      "Seating completely fills up by 9 AM during internal examinations. Need expansion.",
      "Digital library e-journal access is excellent. NPTEL and Elsevier work perfectly.",
      "Staff helped me locate important reference books for my mini-project. Very helpful.",
      "The group study rooms are always booked well in advance. Need to add more.",
      "Please extend library hours to midnight during semester examinations.",
      "The IoT lab computers need the latest Arduino IDE and Python updates urgently.",
      "The quiet zone on the 4th floor is perfectly maintained. Zero disturbances.",
      "Competitive exam reference books (GATE, UPSC) section needs more new titles.",
      "The 24-hour study hall during exams was a lifesaver. Please continue this facility.",
      "Good collection of Anna University syllabus textbooks. Easy to find references.",
      "WiFi inside the library is stable and fast. Works great for research.",
      "Apple Mac lab inside the library has some systems with outdated Xcode. Please update.",
      "The reprographic center is efficient and affordable.",
      "Please add more power sockets near the window seating area for laptop users.",
      "Book return process is smooth and fine-free if returned on time. Well managed.",
      "The OPAC (Online Public Access Catalog) is very user friendly and accurate.",
      "Would appreciate more bean bags or informal seating options on lower floors.",
      "Newspaper and magazine section is extensive. Great for GK preparation.",
      "The staff immediately helped resolve my borrower account issue. Excellent service.",
    ],
  },
  {
    id: "online-course",
    name: "Online Course Portal",
    questions: ["content_quality", "platform_usability", "instructor_support", "video_quality"],
    ratingProfile: [
      { v: 5, w: 18 }, { v: 4, w: 30 }, { v: 3, w: 28 }, { v: 2, w: 16 }, { v: 1, w: 8 },
    ],
    comments: [
      "The placement training portal crashes every time more than 100 students log in simultaneously.",
      "Video lecture content for Data Structures is excellent. Dr. Kumar explains very clearly.",
      "Videos buffer a lot even on the campus 500 MBPS fiber. Server-side issue clearly.",
      "Instructor response time for doubts is 3+ days. This is unacceptable during project reviews.",
      "The new coding challenges section for competitive programming is fantastic!",
      "ERP authentication keeps timing out. Lost my quiz attempt due to this twice.",
      "The mobile app is much better than the browser version. Smooth and fast.",
      "Need more TCS NQT and Infosys InfyTQ pattern mock tests on the portal.",
      "Platform UI has improved a lot after the recent redesign. Good work by IT team.",
      "Video quality in the new server-rendered format is clear even at 480p.",
      "Assignment deadlines not sending reminder notifications. Missed one submission.",
      "Certificate generation for online course completions takes too long — over 2 weeks.",
      "Would love integration with Coursera or NPTEL for credit transfer.",
      "The AI proctoring during online exams is overly strict — flagged me for looking sideways.",
      "Content is well structured and follows Anna University syllabus accurately.",
      "The discussion forum is very active. Seniors actively help juniors. Good community.",
      "PDF notes provided alongside video lectures make offline studying possible. Useful.",
      "Placement aptitude section needs more verbal reasoning practice sets.",
      "Login OTP sometimes never arrives. Had to skip a live class because of this.",
      "Overall a good platform, just needs better server infrastructure to handle load.",
    ],
  },
  {
    id: "hostel",
    name: "Hostel",
    questions: ["room_cleanliness", "facilities", "security", "warden_support", "wifi_connectivity"],
    ratingProfile: [
      { v: 5, w: 22 }, { v: 4, w: 30 }, { v: 3, w: 28 }, { v: 2, w: 13 }, { v: 1, w: 7 },
    ],
    comments: [
      "WiFi in Emerald Block drops every 10 minutes after 8 PM. Impossible to attend online sessions.",
      "Room cleanliness is maintained well by the housekeeping staff. Satisfied.",
      "Security at hostel gates is very professional. Biometric entry works reliably.",
      "Hot water in Narmadha Girls Hostel runs out by 7:30 AM without fail. Need bigger geysers.",
      "The new common room in Topaz Block with TV and carrom board is wonderful!",
      "Our warden resolves issues same day. Very responsive and helpful person.",
      "Laundry service hours need to be extended. Currently limited to 8 AM–6 PM only.",
      "Pest control is infrequent. Cockroaches spotted in Ground Floor corridor last week.",
      "The hostel gym has quality equipment. Well maintained and clean.",
      "Corridor ventilation needs improvement. Gets stuffy during summer nights.",
      "Internet bandwidth is shared across too many users. Speed drops to 1–2 Mbps peak hours.",
      "Mess timings are too rigid. A 15-minute grace period would really help.",
      "The water coolers on each floor provide clean RO water. Very convenient.",
      "Would appreciate a small reading room or study zone inside the hostel.",
      "Outdoor badminton court lights need repair. Can't play after 7 PM.",
      "The warden's complaint register system should go digital for faster resolution.",
      "Room allocations are fair and transparent. Happy with the process.",
      "Phone charging points in common areas are a great addition.",
      "Washing machine maintenance is prompt when reported. Good.",
      "Overall hostel experience has improved compared to last year. Keep it up!",
    ],
  },
  {
    id: "campus-event",
    name: "Campus Events",
    questions: ["organization", "content_relevance", "venue_quality", "timing"],
    ratingProfile: [
      { v: 5, w: 35 }, { v: 4, w: 34 }, { v: 3, w: 18 }, { v: 2, w: 9 }, { v: 1, w: 4 },
    ],
    comments: [
      "The 36-hour hackathon at the 5S-certified Innovation Hub was outstanding. Best event this year!",
      "Culturals (SATHYAM fest) schedule overlapped with internal examination dates. Poor planning.",
      "Vedanayagam Auditorium is world-class — perfect AC, sound system, and seating for 2000+.",
      "More industry-connect sessions and alumni talks would massively help placement preparation.",
      "The inter-college cricket tournament at our ground was brilliantly managed. Good sportsmanship.",
      "Workshop announcements come only 2 days in advance. Need at least a week's notice.",
      "Tech symposium IDEAZ had speakers from TCS, Infosys, and Wipro. Very motivating.",
      "Food arrangements during events is poor. Long queues, items run out fast.",
      "The robotics competition venue was perfectly organized with charging stations.",
      "Career fair had 60+ companies but each slot was only 10 minutes. Too rushed.",
      "The cultural night performances were brilliant. Huge talent on campus!",
      "Photography contest was well-organized and judged fairly. Loved it.",
      "Annual day event management was flawless. Proud of our college's standards.",
      "Blood donation camp coordination was excellent. Over 300 units collected.",
      "Environmental awareness rally was meaningful and well-attended by students.",
      "Guest lecture series on AI and ML brought in top IIT professors. Excellent content.",
      "Debate competition judging criteria should be published before the event.",
      "NSS camp logistics were smooth. Well planned accommodation and food.",
      "Sports day at the 400m synthetic athletic track was a huge success.",
      "Industry visit to Chennai automotive companies was educational and well organized.",
    ],
  },
];

// ── Seed Logic ────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  // Clear existing feedback for this college
  const deleted = await Feedback.deleteMany({ collegeId: COLLEGE_ID });
  console.log(`🗑️  Cleared ${deleted.deletedCount} existing records.\n`);

  const records = [];

  // Target: ~1200 records over 90 days
  // Distribute more records in recent days (realistic engagement curve)
  for (let day = 0; day < TOTAL_DAYS; day++) {
    // Recent days get more submissions
    const isRecent = day < 14;
    const feedbacksPerDay = isRecent ? rnd(12, 22) : rnd(4, 14);

    for (let j = 0; j < feedbacksPerDay; j++) {
      const service = pick(SERVICES);
      const studentIdx = rnd(0, STUDENT_NAMES.length - 1);
      const studentName = STUDENT_NAMES[studentIdx];
      const studentId = `STU2024${String(studentIdx + 1).padStart(3, "0")}`;

      // Generate per-question ratings coherently around the overall score
      const overallSatisfaction = weighted(service.ratingProfile);
      const ratings = {};
      for (const q of service.questions) {
        // Individual ratings fluctuate ±1 from overall
        const base = Math.max(1, Math.min(5, overallSatisfaction + rnd(-1, 1)));
        ratings[q] = base;
      }

      const isAnonymous = Math.random() < 0.18;

      records.push({
        studentId,
        studentName: isAnonymous ? "Anonymous" : studentName,
        isAnonymous,
        serviceId: service.id,
        serviceName: service.name,
        collegeId: COLLEGE_ID,
        ratings,
        overallSatisfaction,
        comment: Math.random() < 0.65 ? pick(service.comments) : undefined,
        submittedAt: daysAgo(day),
      });
    }
  }

  // Batch insert in chunks of 500
  const CHUNK = 500;
  for (let i = 0; i < records.length; i += CHUNK) {
    await Feedback.insertMany(records.slice(i, i + CHUNK));
    console.log(`  Inserted ${Math.min(i + CHUNK, records.length)} / ${records.length}...`);
  }

  console.log(`\n✅ Seeded ${records.length} feedback records over ${TOTAL_DAYS} days!`);
  console.log(`\n📊 Breakdown:`);
  for (const s of SERVICES) {
    const count = records.filter((r) => r.serviceId === s.id).length;
    const avg =
      records
        .filter((r) => r.serviceId === s.id)
        .reduce((sum, r) => sum + r.overallSatisfaction, 0) / count;
    console.log(`   ${s.name.padEnd(22)}: ${count} records  |  avg ${avg.toFixed(2)}/5`);
  }

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected.");
  console.log("✅ Done! Restart your dev server — all data is now live from MongoDB.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
