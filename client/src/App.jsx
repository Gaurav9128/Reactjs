import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SpeakersSection from "./components/SpeakersSection";
import SponsorsPartners from "./components/SponsorsPartners";
import VenueSection from "./components/VenueSection";
import WhatToExpect from "./components/WhatToExpect";
import Organizers from "./components/Organizers";
import CommunitySection from "./components/CommunitySection";
import Footer from "./components/Footer";
import WorkshopSchedule from "./components/WorkshopSchedule";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AdminStudents from "./pages/AdminStudents";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AdminAttendance from "./pages/AdminAttendance";
import AdminWorkshop from "./pages/AdminWorkshop";
import AdminReports from "./pages/AdminReports";
import AdminBreakReport from "./pages/AdminBreakReport";
import AdminTicketReport from "./pages/AdminTicketReport";
import MyTickets from "./pages/MyTickets";
import AdminAttendanceScanner from "./pages/AdminAttendanceScanner";

function Home() {
  return (
    <>
      <HeroSection />
      <SpeakersSection />
      <SponsorsPartners />
      <VenueSection />
      <WhatToExpect />
      <Organizers />
      <CommunitySection />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  // Admin pages par Navbar/Footer hide
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/speakers" element={<SpeakersSection />} />
        <Route path="/sponsors" element={<SponsorsPartners />} />
        <Route path="/venue" element={<VenueSection />} />
        <Route path="/organizers" element={<Organizers />} />
        <Route path="/community" element={<CommunitySection />} />
        <Route path="/what-to-expect" element={<WhatToExpect />} />
        <Route path="/workshop-schedule" element={<WorkshopSchedule />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}/>
       
        <Route
  path="/my-tickets"
  element={
    <PrivateRoute>
      <MyTickets />
    </PrivateRoute>
  }
/>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
        <Route path="/admin/attendance" element={<AdminAttendance />}/>
        <Route path="/admin/workshop" element={<AdminWorkshop />}/>
        <Route path="/admin/reports" element={<AdminReports />}/>
        <Route path="/admin/break-report" element={<AdminBreakReport />}/>
        <Route path="/admin/ticket-report" element={<AdminTicketReport />}/>
         <Route path="/admin/attendance-scanner" element={<AdminAttendanceScanner />}/>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;