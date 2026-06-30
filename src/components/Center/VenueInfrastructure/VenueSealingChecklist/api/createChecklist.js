export const createChecklist = async (userLoginData, payload) => {
  try {
    const response = await fetch(
      `https://erp.eduquity.com/send_request?model=venue.closing.check.list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          login: userLoginData.email,
          password: userLoginData.password,
          db: "erp-eduquity-com",
          ["api-key"]: userLoginData["api-Key"],
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return {
        Status: false,
        Message: "Failed to create sealing checklist",
      };
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return {
        Status: true,
        Message: "✅ Sealing checklist created successfully",
        data,
        Id: data["New resource"][0].id,
      };
    } catch {
      return {
        Status: false,
        Message: "Failed to create sealing checklist",
      };
    }
  } catch {
    return {
      Status: false,
      Message: "Failed to create sealing checklist",
    };
  }
};
