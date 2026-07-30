export const getSealingChecklist = async (userLoginData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/`}/fetch_checklist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        login: userLoginData.email,
        password: userLoginData.password,
        "api-key": userLoginData["api-Key"],
        db: "erp-eduquity-com",
        model: "venue.closing.check.list",
      },
    });

    if (!response.ok) {
      return {
        Status: false,
        Message: "Failed to Get Sealing checklist Data",
      };
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return {
        Status: true,
        data,
      };
    } catch {
      return {
        Status: false,
        Message: "Failed to Get Sealing checklist Data",
      };
    }
  } catch {
    return {
      Status: false,
      Message: "Failed to Get Sealing checklist Data",
    };
  }
};
