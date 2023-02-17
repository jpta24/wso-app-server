// mail-content.js

// Primera función
function newUser(user) {
    const mailText = `
    <div style='width:85%; margin:auto'>
        <div>
            <div style='padding:10px'>
                <a href='https://wso-security.com/en/' style='display:flex; text-decoration: none; background-color: #000000'>
                    <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1674671880/secuApp-gallery/wso-white_djbovg.png' width="60px" height="60px" style='padding:10px'/>
                    <h2 style='margin-left:15px; color:#ffffff'>WSO Worldwide Security Options</h2>
                </a>
            </div>
            <div style='padding:10px'>
                <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                <p>Welcome to WSO Security-App. </p>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <h3>Thanks for signing up.  You can now create a Business or you can add yourself to the Business you work for. </h3>
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
  
  // Segunda función
  function newBusiness(userFound, businessName) {
    const mailText = `
    <div style='width:85%; margin:auto'>
        <div>
            <div style='padding:10px'>
              <a href='https://wso-security.com/en/' style='display:flex; text-decoration: none; background-color: #000000'>
                <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1674671880/secuApp-gallery/wso-white_djbovg.png' width="60px" height="60px" style='padding:10px'/>
                <h2 style='margin-left:15px; color:#ffffff'>WSO Worldwide Security Options</h2>
              </a>
            </div>
            <div style='padding:10px'>
                <h1 style='margin-top:3px'>Hi ${userFound.username},</h1>
                <p>Welcome to WSO Security-App. </p>
                <h3>You have created a business named: <span style='padding-left:10px'>${businessName}</span></h3>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <h3>Congratulations you have a new Business account.  You can now start setting it up, bring your teamwork and clients. </h3>
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

  //AGREGAR NUEVA FUNCION Y RECORDAR EXPORTARLA
  
  // Exportar ambas funciones
  module.exports = {
    newUser,
    newBusiness,
  };
  
  