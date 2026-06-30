const originalFetch = window.fetch;

// A helper to detect if we have test credentials active.
const isTestUserActive = () => {
  const loginData = localStorage.getItem("loginData");
  if (loginData) {
    try {
      const parsed = JSON.parse(loginData);
      return parsed.email === "test" || parsed.email === "test@test.com";
    } catch {
      return false;
    }
  }
  return false;
};

window.fetch = async function (url, options) {
  const urlStr = typeof url === "string" ? url : (url instanceof Request ? url.url : String(url));
  const headers = options?.headers || {};

  // Resolve header values case-insensitively
  const getHeader = (name) => {
    if (!headers) return undefined;
    if (typeof headers.get === "function") {
      return headers.get(name);
    }
    const lowerName = name.toLowerCase();
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === lowerName) {
        return headers[key];
      }
    }
    return undefined;
  };

  const action = getHeader("action");
  const login = getHeader("login") || "";
  const password = getHeader("password") || "";

  // 1. Intercept Login Call
  if (urlStr.includes("/odoo_connect") && action === "login") {
    const trimmedLogin = login.trim();
    if ((trimmedLogin === "test" || trimmedLogin === "test@test.com") && password === "test") {
      const responseData = {
        Status: "auth successful",
        User: "Test User",
        "api-key": "dummy-key-123",
        UserID: "12345",
        employee_id: "E001",
        work_email: trimmedLogin,
        work_phone: "9999999999",
        employee_latitude: "12.9716",
        employee_longitude: "77.5946",
        department_id: "Dept01",
        job_id: "Job01",
        active_project: "Mock Project",
        active_venue: "Mock Venue",
        employee_code: "EMP-TEST",
        project_id: 1,
        venue_id: 1,
        city_id: 1,
        state_id: 1,
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 2. Intercept other Odoo API calls if test user is active
  const isTest = isTestUserActive() || (login.trim() === "test" || login.trim() === "test@test.com");
  if (isTest && urlStr.includes("erp.eduquity.com")) {
    console.log(`[MockFetch] Intercepting request to: ${urlStr}`);

    if (urlStr.includes("/active_data")) {
      const responseData = {
        employee_latitude: "12.9716",
        employee_longitude: "77.5946",
        active_project: "Mock Project",
        active_venue: "Mock Venue",
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/send_request")) {
      const method = options?.method || "GET";
      if (method.toUpperCase() === "POST") {
        // Check-in record creation
        const responseData = {
          "New resource": [
            {
              id: 99999,
            },
          ],
        };
        // Save to localStorage to mock success state
        localStorage.setItem("checkInId", "99999");
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else if (method.toUpperCase() === "PUT") {
        // Check-out record update
        const responseData = {
          "Updated resource": [
            {
              check_out: new Date().toISOString().slice(0, 19).replace("T", " "),
            },
          ],
        };
        localStorage.removeItem("checkInId");
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (urlStr.includes("/fetch_last_activity")) {
      const checkInId = localStorage.getItem("checkInId");
      let records = [];
      if (checkInId) {
        records = [
          {
            activity: "Check-In",
            att_id: 99999,
            check_in: new Date().toISOString().slice(0, 19).replace("T", " "),
          },
        ];
      } else {
        records = [
          {
            activity: "Check-Out",
            att_id: 99999,
            check_in: new Date().toISOString().slice(0, 19).replace("T", " "),
          },
        ];
      }
      const responseData = {
        status: "success",
        records: records,
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/get_user_tickets")) {
      const responseData = {
        records: [
          {
            number: 1,
            name: "Mock Ticket: Printer not working",
            ticket_type_id: [1, "Hardware Issue"],
            category_id: [1, "IT Support"],
            project_id: [1, "Mock Project"],
            venue_id: [1, "Mock Venue"],
            user_id: [12345, "Test User"],
            stage_id: [1, "Sent"],
            create_date: new Date().toISOString(),
            status: "new",
          },
          {
            number: 2,
            name: "Mock Ticket: Geolocation check failing",
            ticket_type_id: [2, "Software Issue"],
            category_id: [1, "IT Support"],
            project_id: [1, "Mock Project"],
            venue_id: [1, "Mock Venue"],
            user_id: [12345, "Test User"],
            stage_id: [2, "In Progress"],
            create_date: new Date().toISOString(),
            status: "in_progress",
          },
        ],
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/get_ticket_types")) {
      const responseData = [
        {
          id: 1,
          name: "Hardware Issue",
          category_id: [1, "IT Support"],
          risk_level_id: [1, "Low"],
          priority_id: [1, "Medium"],
          department_id: [1, "IT Dept"],
          expected_resolution_time: "24 Hours",
          no_of_system_affected: "1",
        },
        {
          id: 2,
          name: "Software Issue",
          category_id: [1, "IT Support"],
          risk_level_id: [2, "High"],
          priority_id: [2, "High"],
          department_id: [1, "IT Dept"],
          expected_resolution_time: "4 Hours",
          no_of_system_affected: "All",
        },
      ];
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/fetch_categories")) {
      const responseData = [
        {
          id: 1,
          category_id: [1, "IT Support"],
        },
      ];
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/upload_image")) {
      const responseData = {
        Status: "success",
        image_url: "https://via.placeholder.com/150",
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (urlStr.includes("/fetch_checklist")) {
      const responseData = [];
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default mock response
    return new Response(
      JSON.stringify({ Status: "success", Message: "Mocked response" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return originalFetch.apply(this, arguments);
};
