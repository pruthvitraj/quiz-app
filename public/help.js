// Attach the submit event to the form
document.getElementById("queryForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Initialize EmailJS (replace YOUR_USER_ID with your actual EmailJS User ID)
    emailjs.init("2W4xItTvS2GV9GRc3");
  
    // EmailJS service and template IDs
    const serviceID = "service_ykrn81s";
    const templateID = "template_mm7mkdl";
  
    // Get input values from the form
    const username = document.getElementById("username").value.trim();
    const place = document.getElementById("place").value.trim();
    const query = document.getElementById("query").value.trim();
  
    // Validate input values before sending
    if (!username || !place || !query) {
      alert("All fields are required. Please fill them out before submitting.");
      return;
    }
  
    // Parameters to send via EmailJS
    const templateParams = {
      username: username,
      place: place,
      query: query,
      to_email: "patil21082004@gmail.com", // Target email
    };
    // Send email using EmailJS
    emailjs
    .send(serviceID, templateID, templateParams)
    .then((response) => {
        // Show success message and reset form
        alert("Your query has been submitted successfully!");
        document.getElementById("queryForm").reset(); // Clear the form inputs
        console.log("Email sent successfully:", response);
        console.log(templateParams)
      })
      .catch((error) => {
        // Handle errors
        alert("Failed to send your query. Please try again later.");
        console.error("EmailJS Error:", error);
      });
  });
  