export const getShiftWiseChecklist = async (userLoginData) => {
  try {
    const response = await fetch(`https://erp.eduquity.com/fetch_checklist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        login: userLoginData.email,
        password: userLoginData.password,
        "api-key": userLoginData["api-Key"],
        db: "erp-eduquity-com",
        model: "vm.shift.wise.checklist",
      },
    });

    if (!response.ok) {
      return {
        Status: false,
        Message: "Failed to Get Shift-Wise checklist Data",
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
        Message: "Failed to Get Shift-Wise checklist Data",
      };
    }
  } catch {
    return {
      Status: false,
      Message: "Failed to Get Shift-Wise checklist Data",
    };
  }
};
