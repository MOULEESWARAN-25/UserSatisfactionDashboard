// MongoDB Seeder Script
// Run: node scripts/seed.mjs

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://anonymous_user:nUlOrcI7AwOrKLDC@projects.r9kyiga.mongodb.net/satisfaction_dashboard?retryWrites=true&w=majority&appName=projects";

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

const Feedback = mongoose.models.Feedback ?? mongoose.model("Feedback", FeedbackSchema);

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n, hoursOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

const COLLEGE_ID = "college-default-001";

const SERVICES = [
  {
    id: "cafeteria",
    name: "Cafeteria",
    questions: ["food_quality", "hygiene", "staff_behavior", "waiting_time", "menu_variety"],
    comments: [
      "The food quality has improved lately, especially the South Indian section.",
      "Waiting time during lunch is way too long. Need more counters.",
      "Hygiene in the main mess could be better. Found hair in my food twice.",
      "Great variety of dishes now! Love the new pasta counter.",
      "Staff is very friendly and helpful. Kudos to the cafeteria team!",
      "The pricing is a bit high for students. Need more budget options.",
      "Breakfast options are limited. We need more healthy choices.",
      "The juice counter has amazing fresh juices but the queue is crazy.",
      "Air conditioning in the dining hall is fantastic.",
      "Would love to see more North Indian food options available.",
    ],
  },
  {
    id: "library",
    name: "Library",
    questions: ["book_availability", "quietness", "seating_space", "staff_support"],
    comments: [
      "The 5-story library is a gem. Best place to study on campus.",
      "Need more seating during exam time. It gets packed by 9 AM.",
      "Digital library resources are excellent. Great journal collection.",
      "Staff is always helpful in finding references.",
      "AC works perfectly. Very comfortable study environment.",
      "Please extend hours during exam weeks. We need midnight access.",
      "The IoT lab computers need software updates badly.",
      "Quiet zones are well maintained. Thank you!",
      "Book availability for competitive exam prep needs improvement.",
      "The group study rooms are always booked. Need more of them.",
    ],
  },
  {
    id: "online-course",
    name: "Online Course Portal",
    questions: ["content_quality", "platform_usability", "instructor_support", "video_quality"],
    comments: [
      "The placement training portal crashes during peak hours.",
      "Content quality is great but the platform is unstable.",
      "Video lectures buffer a lot on the campus WiFi.",
      "Instructor response time for queries is too slow.",
      "Love the new coding practice section for placements.",
      "Authentication keeps failing. Very frustrating during exams.",
      "The mobile app version is much better than the web version.",
      "Need more mock tests for TCS and Infosys patterns.",
      "Platform usability has improved after the recent update.",
      "Video quality is excellent on the new server.",
    ],
  },
  {
    id: "hostel",
    name: "Hostel",
    questions: ["room_cleanliness", "facilities", "security", "warden_support", "wifi_connectivity"],
    comments: [
      "WiFi keeps dropping in the evenings. Very annoying during placements.",
      "Room cleanliness is maintained well by the housekeeping staff.",
      "Security guards are very strict and professional. Feel safe.",
      "Hot water runs out by 7:30 AM every morning. Need bigger geysers.",
      "The new common room with TV and carrom board is awesome!",
      "Warden is very approachable and solves issues quickly.",
      "The laundry service timing needs to be extended.",
      "Pest control needs to happen more frequently.",
      "Gym facilities in the hostel are well maintained.",
      "Need better ventilation in the corridors.",
    ],
  },
  {
    id: "campus-event",
    name: "Campus Events",
    questions: ["organization", "content_relevance", "venue_quality", "timing"],
    comments: [
      "The hackathon was brilliantly organized. Great prizes too!",
      "Cultural fest timing clashed with semester exams. Bad planning.",
      "Vedanayagam Auditorium is world class. AC and sound perfect.",
      "More industry connect events would help in placements.",
      "The sports meet at the 400m track was well organized.",
      "Need more notice for workshops. Found out about them too late.",
      "Tech symposium had amazing speakers from top MNCs.",
      "Food arrangements during events need improvement.",
      "The 5S-certified workspaces for hackathons are amazing.",
      "Career fair had too many companies, not enough time slots.",
    ],
  },
];

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
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  // Clear existing feedback
  const deleted = await Feedback.deleteMany({ collegeId: COLLEGE_ID });
  console.log(`🗑️  Cleared ${deleted.deletedCount} existing feedback records.`);

  const records = [];

  // Generate 150+ realistic feedback records spread over 30 days
  for (let day = 0; day < 30; day++) {
    const feedbacksPerDay = randomBetween(3, 8);
    for (let j = 0; j < feedbacksPerDay; j++) {
      const service = randomItem(SERVICES);
      const studentIdx = randomBetween(0, STUDENT_NAMES.length - 1);
      const studentName = STUDENT_NAMES[studentIdx];
      const studentId = `STU2024${String(studentIdx + 1).padStart(3, "0")}`;
      const hourOffset = randomBetween(0, 23);

      // Generate ratings for each question
      const ratings = {};
      let ratingSum = 0;
      for (const q of service.questions) {
        const r = randomBetween(2, 5);
        ratings[q] = r;
        ratingSum += r;
      }
      const overallSatisfaction = Math.min(5, Math.max(1, Math.round(ratingSum / service.questions.length)));

      records.push({
        studentId,
        studentName,
        isAnonymous: Math.random() < 0.15,
        serviceId: service.id,
        serviceName: service.name,
        collegeId: COLLEGE_ID,
        ratings,
        overallSatisfaction,
        comment: Math.random() < 0.7 ? randomItem(service.comments) : undefined,
        submittedAt: daysAgo(day, hourOffset),
      });
    }
  }

  await Feedback.insertMany(records);
  console.log(`\n✅ Seeded ${records.length} feedback records across 30 days!`);
  console.log(`\n📊 Breakdown:`);
  for (const s of SERVICES) {
    const count = records.filter((r) => r.serviceId === s.id).length;
    console.log(`   ${s.name}: ${count} records`);
  }

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB.");
  console.log("✅ Seeding complete! Restart your dev server to see the data.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
