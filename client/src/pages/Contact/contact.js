import axios from 'axios';


/**
 * @param {string} name
 * @param {string} email
 * @param {string} subject
 * @param {string} message
 */
async function handleSubmit(name, email, subject, message) { 

    // let name = '';
    // let email = '';
    // let message = '';

    //$: event.preventDefault(); // Use $event to access the event object

    // Create a JavaScript object with the form data
  //   const formData =  {     
  //   name: 'John Doe',
  //   email: 'example@gmail.com',   // { name, email, message };
  //   message: 'My name is John Doe...',
  // };
 
  const formData =  {     
    name: name,
    email: email, 
    subject: subject,  
    message: message,
  };

    try {
      const response = await axios.post('/api/submit', formData);

      if (response.status === 200) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error:', error);  // network or request errors
    }
  }



  export { handleSubmit };