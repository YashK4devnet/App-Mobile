const onSubmit = async (data) => {
try {
setIsSubmitting(true);

      const selectedTicketType = filteredTicketTypes.find(
        (type) => type.name === data.ticketType
      );

      if (!selectedTicketType) {
        throw new Error("Please select a valid ticket type");
      }

      const apiDomain = localStorage.getItem("apiDomain");
      const dbName = localStorage.getItem("dbName");

      const ticketData = {
        fields: ["category_id", "ticket_type_id", "description", "user_id"],
        values: {
          category_id: selectedTicketType.category_id[0],
          ticket_type_id: selectedTicketType.id,
          description: data.description,
          user_id: userLoginData.Id,
        },
      };

      const response = await fetch(
        `http://${apiDomain}/send_request?model=helpdesk.ticket&db=${dbName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            login: userLoginData.email,
            password: userLoginData.password,
            ["api-key"]: userLoginData["api-Key"],
          },
          body: JSON.stringify(ticketData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create ticket");
      }

      await response.json();

      // If we were editing a draft, remove it from drafts
      if (editingTicket) {
        const updatedDrafts = draftTickets.filter(
          (d) => d.id !== editingTicket.id
        );
        setDraftTickets(updatedDrafts);
        localStorage.setItem("draftTickets", JSON.stringify(updatedDrafts));
      }

      // Reset states
      setShowForm(false);
      setApiData(null);
      setCategories([]);
      setFilteredTicketTypes([]);
      setEditingTicket(null);
      reset();

      // Refresh tickets list
      await fetchTickets();

      // Show success message
      setSuccessMessage(
        editingTicket
          ? "Draft updated and submitted successfully"
          : "Ticket created successfully"
      );
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating/updating ticket:", error);
      setApiError(
        error.message || "Failed to create/update ticket. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }

};
