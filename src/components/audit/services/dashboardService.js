export function getUserProfile() {
  return {
    name: "John Doe",
    greeting: "Good morning,"
  };
}



export function getRecentReports() {
  return [
    {
      id: "report-1",
      title: "Power System Audit",
      reportNo: "2153123",
      date: "12 Jun 2025",
      icon: "document"
    },
    {
      id: "report-2",
      title: "Network System Audit",
      reportNo: "2153109",
      date: "10 Jun 2025",
      icon: "document"
    },
    {
      id: "report-3",
      title: "Venue Audit",
      reportNo: "2153088",
      date: "08 Jun 2025",
      icon: "building"
    }
  ];
}
