export const uploadImage = async (userLoginData, payload, Id) => {
  try {
    const response = await fetch(`https://erp.eduquity.com/upload_image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        login: userLoginData.email,
        password: userLoginData.password,
        db: "erp-eduquity-com",
        ["api-key"]: userLoginData["api-Key"],
        model: "venue.opening.check.list",
        checklist: Id,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        Status: false,
        Message:
          "❌ Checklist created but Failed to upload image please contact support",
      };
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return {
        Status: true,
        Message:
          "Exam day readiness checklist created successfully with image upload",
        data,
      };
    } catch {
      return {
        Status: false,
        Message:
          "❌ Checklist created but Failed to upload image please contact support",
      };
    }
  } catch {
    return {
      Status: false,
      Message:
        "❌ Checklist created but Failed to upload image please contact support",
    };
  }
};
