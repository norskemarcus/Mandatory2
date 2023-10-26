import axios from 'axios';


async function handleSubmit(name, email, message) { 

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
    email: email,   // { name, email, message };
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