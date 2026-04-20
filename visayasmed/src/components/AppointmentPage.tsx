import React from "react";
import Footer from "./Footer";
import ScheduleAppointment from "./ScheduleAppointment";

const AppointmentPage: React.FC = () => {
  return (
    <div className="relative scroll-smooth transition-colors duration-500 overflow-x-hidden bg-[#0a0f1e]">
      <ScheduleAppointment />
      <Footer />
    </div>
  );
};

export default AppointmentPage;
