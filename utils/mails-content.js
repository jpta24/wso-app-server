// mail-content.js

const header = `<div style='padding:10px'>
                    <a href='https://wso-security.com/en/' style='display:flex; text-decoration: none; background-color: #000000'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1674671880/secuApp-gallery/wso-white_djbovg.png' width="60px" height="60px" style='padding:10px'/>
                        <h2 style='margin-left:15px; color:#ffffff'>WSO Worldwide Security Options</h2>
                    </a>
                </div>`

// Primera función
function newUser(user) {
    const mailText = `
    <div style='width:85%; margin:auto'>
        <div>
            ${header}
            <div style='padding:10px'>
                <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                <p>Welcome to WSO Security-App. </p>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <h3>Thank you for signing up for WSO Security-App. We're thrilled to have you on board!</h3>
                            <p>As a new user, you have full access to all of our app's features. We invite you to explore our task management tools and see how they can help you stay organized.</p>
    
                            <p>If you have a business or work for one, you can easily upgrade to a business account to take advantage of our team management features.</p>
                            <br/>
                            <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                            
                            <p>Thank you again for joining us.</p>
                            <h3>WSO Worldwide Security Options</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return mailText;
  }
  
  // Segunda función
  function newBusiness(userFound, businessName) {
    const mailText = `
    <div style='width:85%; margin:auto'>
        <div>
            ${header}
            <div style='padding:10px'>
                <h1 style='margin-top:3px'>Hi ${userFound.username},</h1>
                <p>Welcome to WSO Security-App. </p>
                <h3> Congratulations on creating a new Business account named: <span style='padding-left:10px'>${businessName}</span></h3>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <h3>As a business user, you have access to all of the great features in our app, including the ability to create and manage tasks for your entire team, assign tasks to specific team members, set deadlines and reminders for important tasks, and access advanced reporting and analytics. </h3>
                            <p>We are committed to providing the best possible experience for our business users, so please don't hesitate to contact us if you have any questions or feedback about our app.</p>
                            <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                            
                            <p>Thanks for using our service.</p>
                            <h3>WSO Worldwide Security Options</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return mailText;
  }
  
  const newMember =(businessName,member)=>{
    return `<div style='width:85%; margin:auto'>
    <div>
        ${header}
        <div style='padding:10px'>
            <h3 style='margin-top:3px'>Greeting form WSO Security-App,</h3>

            <p>We hope this email finds you well. We wanted to let you know that a new user has registered for ${businessName} and is awaiting approval.</p>
            <p>The new user's information is as follows:</p>
            <ul>
            <li>Name: ${member.fullName}</li>
            <li>Username: ${member.username}</li>
            <li>Email: ${member.email}</li>
            </ul>
            
            <div style="display: flex; margin-left: 55px;">
                <a href="security-app://ViewProfileScreen?param=${member._id}"" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Review Member</a> 
            </div>


            <p>Please log in to your account and go to the user management section to review and approve or reject this new user. If you have any questions or concerns, please don't hesitate to contact us.</p>
            <p>Thank you for your attention to this matter and for being a valuable member of our ${businessName} community.</p>
            <p>Best regards,</p>
            
            <h3>WSO Worldwide Security Options</h3>
        </div>
    </div>
</div>`
  }

  const changeRol=(user)=>{
    return `
    <div style='width:85%; margin:auto'>
        <div>
            ${header}
            <div style='padding:10px'>
                <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                <h3> We are writing to inform you that your role status in the app has been changed to: <span style='padding-left:10px'>${user.rol}</span> effective immediately. </h3>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <p>We want to assure you that we value your contributions to our community and appreciate your participation. </p>
                            <p>If you have any questions or concerns about this change, please do not hesitate to reach out to someone at ${user.businessID.businessName}.</p>
                            
                            <p>Thank you for your continued use of our app.</p>
                            <h3>WSO Worldwide Security Options</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
  }

  //AGREGAR NUEVA FUNCION Y RECORDAR EXPORTARLA
  
  // Exportar ambas funciones
  module.exports = {
    newUser,
    newBusiness,
    newMember,
    changeRol
  };
  
  